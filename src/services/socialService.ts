import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';

export interface DirectMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  participants: string[];
  text: string;
  createdAt?: any;
}

export interface FriendNotification {
  id: string;
  toUserId: string;
  fromUserId: string;
  type: 'friend_request' | 'friend_accept' | 'message';
  message: string;
  metadata?: Record<string, unknown>;
  read?: boolean;
  createdAt?: any;
}

export interface ActivityItem {
  id: string;
  userId: string;
  type: string;
  text: string;
  metadata?: Record<string, unknown>;
  createdAt?: any;
}

export interface Friendship {
  id: string;
  users: string[];
  requesterId: string;
  recipientId: string;
  requesterName?: string;
  recipientName?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt?: any;
  updatedAt?: any;
}

const makeFriendshipId = (a: string, b: string): string => [a, b].sort().join('__');

export const socialService = {
  sendFriendRequest: async (
    fromUserId: string,
    toUserId: string,
    requesterName?: string,
    recipientName?: string
  ): Promise<void> => {
    if (!fromUserId || !toUserId || fromUserId === toUserId) {
      throw new Error('Invalid friend request');
    }

    const friendshipId = makeFriendshipId(fromUserId, toUserId);
    const friendshipRef = doc(db, 'friendships', friendshipId);
    const existing = await getDoc(friendshipRef);
    const recipientProfile = await getDoc(doc(db, 'users', toUserId));

    if (!recipientProfile.exists()) {
      throw new Error('User ID not found');
    }

    if (existing.exists()) {
      const data = existing.data() as Friendship;
      if (data.status === 'accepted') return;
      if (data.status === 'pending') throw new Error('Friend request already pending');
    }

    await setDoc(friendshipRef, {
      users: [fromUserId, toUserId].sort(),
      requesterId: fromUserId,
      recipientId: toUserId,
      requesterName: requesterName || 'Friend',
      recipientName: recipientName || '',
      status: 'pending',
      createdAt: existing.exists() ? (existing.data() as any)?.createdAt || serverTimestamp() : serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  acceptFriendRequest: async (currentUserId: string, otherUserId: string): Promise<void> => {
    const friendshipId = makeFriendshipId(currentUserId, otherUserId);
    await updateDoc(doc(db, 'friendships', friendshipId), {
      status: 'accepted',
      updatedAt: serverTimestamp(),
    });
  },

  declineFriendRequest: async (currentUserId: string, otherUserId: string): Promise<void> => {
    const friendshipId = makeFriendshipId(currentUserId, otherUserId);
    await updateDoc(doc(db, 'friendships', friendshipId), {
      status: 'declined',
      updatedAt: serverTimestamp(),
    });
  },

  subscribeToFriendships: (userId: string, callback: (friendships: Friendship[]) => void): (() => void) => {
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(collection(db, 'friendships'), where('users', 'array-contains', userId), limit(200));
    return onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Friendship, 'id'>),
        }));
        callback(rows);
      },
      (error) => {
        console.error('Friendships listener failed', error);
        callback([]);
      }
    );
  },

  sendDirectMessage: async (fromUserId: string, toUserId: string, text: string): Promise<void> => {
    await addDoc(collection(db, 'directMessages'), {
      fromUserId,
      toUserId,
      participants: [fromUserId, toUserId].sort(),
      text,
      createdAt: serverTimestamp(),
    });
  },

  subscribeToConversation: (
    currentUserId: string,
    otherUserId: string,
    callback: (messages: DirectMessage[]) => void
  ): (() => void) => {
    if (!currentUserId || !otherUserId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'directMessages'),
      where('participants', 'array-contains', currentUserId),
      orderBy('createdAt', 'asc'),
      limit(300)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<DirectMessage, 'id'>),
          }))
          .filter((item) => Array.isArray(item.participants) && item.participants.includes(otherUserId))
          .slice(-100);

        callback(
          rows
        );
      },
      (error) => {
        console.error('Conversation listener failed', error);
        callback([]);
      }
    );
  },

  sendFriendNotification: async (
    toUserId: string,
    fromUserId: string,
    type: FriendNotification['type'],
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> => {
    await addDoc(collection(db, 'friendNotifications'), {
      toUserId,
      fromUserId,
      type,
      message,
      metadata: metadata || {},
      read: false,
      createdAt: serverTimestamp(),
    });
  },

  subscribeToFriendNotifications: (
    userId: string,
    callback: (notifications: FriendNotification[]) => void
  ): (() => void) => {
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'friendNotifications'),
      where('toUserId', '==', userId),
      limit(50)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<FriendNotification, 'id'>),
          }))
          .sort((a: any, b: any) => {
            const aTime = typeof a.createdAt?.toMillis === 'function' ? a.createdAt.toMillis() : 0;
            const bTime = typeof b.createdAt?.toMillis === 'function' ? b.createdAt.toMillis() : 0;
            return bTime - aTime;
          })
          .slice(0, 30);
        callback(rows);
      },
      (error) => {
        console.error('Friend notifications listener failed', error);
        callback([]);
      }
    );
  },

  recordActivity: async (
    userId: string,
    type: string,
    text: string,
    metadata?: Record<string, unknown>
  ): Promise<void> => {
    await addDoc(collection(db, 'activityFeed'), {
      userId,
      type,
      text,
      metadata: metadata || {},
      createdAt: serverTimestamp(),
    });
  },

  subscribeToActivityFeed: (
    visibleUserIds: string[],
    callback: (activities: ActivityItem[]) => void
  ): (() => void) => {
    const ids = visibleUserIds.filter(Boolean).slice(0, 10);
    if (ids.length === 0) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'activityFeed'),
      where('userId', 'in', ids),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        callback(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ActivityItem, 'id'>),
          }))
        );
      },
      (error) => {
        console.error('Activity feed listener failed', error);
        callback([]);
      }
    );
  },
};

export default socialService;
