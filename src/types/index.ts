// User & Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface UserProfile {
  userId?: string;
  email?: string;
  displayName?: string;
  name: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not';
  country: string;
  streak: number;
  totalReflections?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProfileSetupData {
  name: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not';
  country: string;
}

// Reflection Types
export interface Reflection {
  id: string;
  userId: string;
  mood: 'peaceful' | 'sad' | 'happy' | 'tired' | 'confused';
  reflection: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  date: Date;
  createdAt: Date;
  updatedAt?: Date;
}

// Social Types
export interface Comment {
  id: string;
  reflectionId: string;
  userId: string;
  displayName: string;
  text: string;
  createdAt: Date;
}

export interface Reaction {
  id: string;
  reflectionId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

// Du'a Types
export interface Dua {
  id: string;
  category: 'wealth' | 'family' | 'peace' | 'discipline' | 'career' | 'marriage';
  arabic: string;
  transliteration: string;
  english: string;
  source?: string;
}

// Friendship/Together Types
export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  displayName: string;
  name?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not';
  country?: string;
  emoji?: string;
  addedDate: Date;
  streak: number;
  reflectionCount?: number;
  lastActive?: Date;
}

export interface SharedStreak {
  userId: string;
  displayName: string;
  name?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not';
  country?: string;
  streak: number;
  emoji?: string;
  isYou: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  name?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not';
  country?: string;
  genderEmoji?: string;
  countryFlag?: string;
  streak: number;
  reflections: number;
  lastActive: Date;
  emoji?: string;
}

// Notification Types
export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  badge?: string;
  data?: Record<string, string>;
}

export interface NotificationSchedule {
  enabled: boolean;
  time: string; // HH:MM format
  frequency: 'daily' | 'weekly' | 'custom';
  days?: number[]; // 0-6 for weekly
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  agreeToTerms: boolean;
}

export interface ReflectionFormData {
  mood: string;
  reflection: string;
  difficulty: number;
}

// Component Props Types
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Error Types
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Utility Types
export type MoodEmoji = '😌' | '😔' | '😃' | '😴' | '😕';

export type DuaCategory = 'wealth' | 'family' | 'peace' | 'discipline' | 'career' | 'marriage';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type AuthMode = 'login' | 'register';

export type NotificationPermission = 'granted' | 'denied' | 'default';
