import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';

export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not';
  country: string;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  getProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Load profile when user logs in
        const userProfile = await firestoreService.getUserProfile(currentUser.uid);
        if (userProfile) {
          setProfile(userProfile as UserProfile);
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
      } else {
        setProfile(null);
        localStorage.removeItem('userProfile');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const credential = await authService.login(email, password);
    setUser(credential.user);
    
    // Load profile
    if (credential.user) {
      const userProfile = await firestoreService.getUserProfile(credential.user.uid);
      if (userProfile) {
        setProfile(userProfile as UserProfile);
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
    }
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const credential = await authService.register(email, password, displayName);
    setUser(credential.user);
    await firestoreService.createUserProfile(
      displayName || credential.user.displayName || 'User'
    );
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    localStorage.removeItem('userProfile');
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    const updatedProfile = {
      ...profile,
      ...profileData,
      updatedAt: new Date().toISOString(),
    } as UserProfile;
    
    await firestoreService.updateUserProfile(user.uid, updatedProfile);
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const getProfile = async () => {
    if (!user) return null;
    const userProfile = await firestoreService.getUserProfile(user.uid);
    if (userProfile) {
      setProfile(userProfile as UserProfile);
    }
    return userProfile as UserProfile | null;
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthProvider;
