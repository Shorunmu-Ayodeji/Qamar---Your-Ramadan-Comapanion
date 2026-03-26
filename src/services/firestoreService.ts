import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

export interface Reflection {
  id: string;
  userId: string;
  mood: string;
  reflection: string;
  difficulty: number;
  date: string;
  createdAt: any;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  name?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not';
  country?: string;
  streak: number;
  totalReflections: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PublicLeaderboardProfile {
  userId: string;
  name?: string;
  displayName?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not';
  country?: string;
  streak: number;
  totalReflections: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface SocialComment {
  id: string;
  reflectionId: string;
  userId: string;
  displayName: string;
  text: string;
  createdAt: Timestamp;
}

export interface SocialReaction {
  id: string;
  reflectionId: string;
  userId: string;
  emoji: string;
  createdAt: Timestamp;
}

export const firestoreService = {
  syncPublicLeaderboardProfile: async (data: Partial<PublicLeaderboardProfile>): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await setDoc(doc(db, 'publicLeaderboard', user.uid), {
      userId: user.uid,
      name: data.name || data.displayName || user.displayName || 'User',
      displayName: data.displayName || data.name || user.displayName || 'User',
      gender: data.gender || '',
      country: data.country || '',
      streak: data.streak ?? 0,
      totalReflections: data.totalReflections ?? 0,
      updatedAt: serverTimestamp(),
      createdAt: data.createdAt || serverTimestamp(),
    }, { merge: true });
  },

  // User Profile Methods
  createUserProfile: async (displayName: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      email: user.email,
      displayName,
      name: displayName,
      streak: 0,
      totalReflections: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    await firestoreService.syncPublicLeaderboardProfile({
      displayName,
      name: displayName,
      streak: 0,
      totalReflections: 0,
    });
  },

  saveUserProfile: async (data: Partial<UserProfile>): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName || data.displayName || data.name || 'User',
      ...data,
      updatedAt: serverTimestamp(),
      createdAt: data.createdAt || serverTimestamp(),
    }, { merge: true });

    await firestoreService.syncPublicLeaderboardProfile({
      name: data.name,
      displayName: data.displayName,
      gender: data.gender,
      country: data.country,
      streak: data.streak ?? 0,
      totalReflections: data.totalReflections ?? 0,
      createdAt: data.createdAt as any,
    });
  },

  getUserProfile: async (userId?: string): Promise<UserProfile | null> => {
    const id = userId || auth.currentUser?.uid;
    if (!id) throw new Error('User not authenticated');

    const docSnap = await getDoc(doc(db, 'users', id));
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  },

  updateUserProfile: async (userId: string, data: Partial<UserProfile>): Promise<void> => {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    await firestoreService.syncPublicLeaderboardProfile({
      name: data.name,
      displayName: data.displayName,
      gender: data.gender,
      country: data.country,
      streak: data.streak,
      totalReflections: data.totalReflections,
      createdAt: data.createdAt as any,
    });
  },

  // Reflection Methods
  saveReflection: async (reflection: Omit<Reflection, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(collection(db, 'reflections'));
    await setDoc(docRef, {
      ...reflection,
      date: reflection.date || new Date().toISOString(),
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  },

  getUserReflections: async (userId?: string): Promise<Reflection[]> => {
    const id = userId || auth.currentUser?.uid;
    if (!id) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'reflections'),
      where('userId', '==', id)
    );
    const querySnapshot = await getDocs(q);
    const normalizeDate = (value: any): string => {
      if (!value) return new Date().toISOString();
      if (typeof value === 'string') return value;
      if (typeof value?.toDate === 'function') return value.toDate().toISOString();
      return new Date(value).toISOString();
    };

    return querySnapshot.docs
      .map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Reflection))
      .sort((a: any, b: any) => {
        const aTime = typeof a.createdAt?.toMillis === 'function'
          ? a.createdAt.toMillis()
          : new Date(a.date || 0).getTime();
        const bTime = typeof b.createdAt?.toMillis === 'function'
          ? b.createdAt.toMillis()
          : new Date(b.date || 0).getTime();
        return bTime - aTime;
      })
      .map((item: any) => ({
        ...item,
        date: normalizeDate(item.date),
      }));
  },

  deleteReflection: async (reflectionId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await deleteDoc(doc(db, 'reflections', reflectionId));
  },

  // Social Features - Comments
  addComment: async (reflectionId: string, text: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(collection(db, 'comments'));
    await setDoc(docRef, {
      reflectionId,
      userId: user.uid,
      displayName: user.displayName || 'Anonymous',
      text,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  },

  getReflectionComments: async (reflectionId: string): Promise<SocialComment[]> => {
    const q = query(
      collection(db, 'comments'),
      where('reflectionId', '==', reflectionId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as SocialComment));
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await deleteDoc(doc(db, 'comments', commentId));
  },

  // Social Features - Reactions
  addReaction: async (reflectionId: string, emoji: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(collection(db, 'reactions'));
    await setDoc(docRef, {
      reflectionId,
      userId: user.uid,
      emoji,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  },

  getReflectionReactions: async (reflectionId: string): Promise<SocialReaction[]> => {
    const q = query(
      collection(db, 'reactions'),
      where('reflectionId', '==', reflectionId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as SocialReaction));
  },

  removeReaction: async (reactionId: string): Promise<void> => {
    await deleteDoc(doc(db, 'reactions', reactionId));
  },

  getGlobalLeaderboard: async (maxEntries = 100): Promise<PublicLeaderboardProfile[]> => {
    const normalizeRows = (docs: any[]) =>
      docs
        .map((item) => ({ ...item.data(), id: item.id } as any))
        .sort((a, b) => {
          if ((b.streak || 0) !== (a.streak || 0)) return (b.streak || 0) - (a.streak || 0);
          return (b.totalReflections || 0) - (a.totalReflections || 0);
        })
        .slice(0, maxEntries)
        .map((item) => ({
          userId: item.userId || item.id,
          name: item.name,
          displayName: item.displayName,
          gender: item.gender,
          country: item.country,
          streak: item.streak || 0,
          totalReflections: item.totalReflections || 0,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

    try {
      const q = query(
        collection(db, 'publicLeaderboard'),
        orderBy('streak', 'desc'),
        limit(maxEntries)
      );
      const querySnapshot = await getDocs(q);
      return normalizeRows(querySnapshot.docs as any[]);
    } catch (error: any) {
      // Fallback to unordered fetch + client-side sort if ordered query fails.
      console.warn('Ordered global leaderboard query failed, using fallback', error?.code || error?.message || error);
      const fallbackSnapshot = await getDocs(collection(db, 'publicLeaderboard'));
      return normalizeRows(fallbackSnapshot.docs as any[]);
    }
  },
};

export default firestoreService;
