import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

export const socialService = {
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
    const conversationKey = [currentUserId, otherUserId].sort();
    const q = query(
      collection(db, 'directMessages'),
      where('participants', '==', conversationKey),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<DirectMessage, 'id'>),
        }))
      );
    });
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
    const q = query(
      collection(db, 'friendNotifications'),
      where('toUserId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(30)
    );

    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<FriendNotification, 'id'>),
        }))
      );
    });
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
    const ids = visibleUserIds.slice(0, 10);
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

    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ActivityItem, 'id'>),
        }))
      );
    });
  },
};

export default socialService;
