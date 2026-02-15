import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
// These are public values safe to expose
const firebaseConfig = {
  apiKey: 'AIzaSyC2ESw3tNfL9TjGEdmiZI6j9ebl0fpysEY',
  authDomain: 'qamar-61f58.firebaseapp.com',
  projectId: 'qamar-61f58',
  storageBucket: 'qamar-61f58.firebasestorage.app',
  messagingSenderId: '1078619795448',
  appId: '1:1078619795448:web:dfa0b22932b4325d0c700d',
  measurementId: 'G-G8WZ1G4VFJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environments
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore
export const db: Firestore = getFirestore(app, 'qamar');

// Use emulator in development (optional)
const isDev = import.meta.env.DEV;
const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (isDev && useEmulators && !auth.emulatorConfig) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', {
      disableWarnings: true,
    });
  } catch (e) {
    // Emulator already connected or not running
  }
}

if (isDev && useEmulators && !db._firestoreClient) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (e) {
    // Emulator already connected or not running
  }
}

export { analytics };
export default app;
