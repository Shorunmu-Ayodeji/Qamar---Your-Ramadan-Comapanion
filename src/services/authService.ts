import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser extends User {
  displayName: string | null;
}

export const authService = {
  // Register new user
  register: async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set display name if provided
    if (displayName && credential.user) {
      try {
        await updateProfile(credential.user, { displayName });
      } catch (error) {
        console.error('Error setting display name:', error);
      }
    }
    
    return credential;
  },

  // Login user
  login: async (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return signOut(auth);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Subscribe to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get ID token
  getIdToken: async (): Promise<string> => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    return auth.currentUser.getIdToken();
  },

  // Send password reset email
  resetPassword: async (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  },

  // Send email verification
  sendVerificationEmail: async (): Promise<void> => {
    if (!auth.currentUser) throw new Error('User not authenticated');
    return sendEmailVerification(auth.currentUser);
  },

  // Check if email is verified
  isEmailVerified: (): boolean => {
    return auth.currentUser?.emailVerified || false;
  },

  // Google sign-in
  signInWithGoogle: async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  },
};

export default authService;
