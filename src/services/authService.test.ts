import { authService } from '../services/authService';
import * as firebaseAuth from 'firebase/auth';

jest.mock('../services/firebase', () => ({
  auth: { currentUser: null },
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendEmailVerification: jest.fn(),
  updateProfile: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('register creates user with email and password', async () => {
    const mockCredential = {
      user: {
        uid: 'test-uid',
        email: 'test@example.com',
      },
    };

    (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(
      mockCredential
    );

    const result = await authService.register('test@example.com', 'password123', 'Test User');

    expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
    expect(firebaseAuth.updateProfile).toHaveBeenCalledWith(result.user, {
      displayName: 'Test User',
    });
  });

  test('login signs in user with email and password', async () => {
    const mockCredential = {
      user: {
        uid: 'test-uid',
        email: 'test@example.com',
      },
    };

    (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(
      mockCredential
    );

    const result = await authService.login('test@example.com', 'password123');

    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
    expect(result.user.email).toBe('test@example.com');
  });

  test('logout calls signOut', async () => {
    (firebaseAuth.signOut as jest.Mock).mockResolvedValueOnce(undefined);

    await authService.logout();

    expect(firebaseAuth.signOut).toHaveBeenCalledWith(expect.anything());
  });

  test('onAuthStateChanged subscribes to auth changes', () => {
    const mockCallback = jest.fn();
    const mockUnsubscribe = jest.fn();

    (firebaseAuth.onAuthStateChanged as jest.Mock).mockReturnValueOnce(mockUnsubscribe);

    const unsubscribe = authService.onAuthStateChanged(mockCallback);

    expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalledWith(
      expect.anything(),
      mockCallback
    );
    expect(unsubscribe).toBe(mockUnsubscribe);
  });
});
