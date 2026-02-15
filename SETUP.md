# Setup Guide - Enhanced Qamar App

Complete setup instructions for the enhanced Qamar Ramadan app with all new features.

## Spark Plan Mode

This app is currently configured for Firebase Spark:
- Built-in Firebase Auth emails for password reset and verification.
- Daily digest via browser notifications/reminders only.
- No Secret Manager setup required.

## ✅ Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Code editor (VS Code recommended)

**Firebase is already configured** with project `qamar-61f58`. Ready to start immediately!

---

## 📦 Step 1: Install Dependencies

```bash
cd "c:\Users\USER\Desktop\Qamar App"
npm install
```

This installs:
- React 18
- TypeScript
- Jest & testing libraries
- Firebase SDK (pre-configured with qamar-61f58)
- Tailwind CSS

---

## 🔥 Step 2: Firebase is Already Configured ✅

Your Firebase project `qamar-61f58` is already set up with:
- ✅ Email/Password Authentication enabled
- ✅ Firestore Database created (test mode)
- ✅ Cloud configuration in `src/services/firebase.ts`
- ✅ Analytics initialized

**No Firebase setup needed!** Skip to Step 3.

If you want to override with your own Firebase config:
1. Copy your Firebase config from [Firebase Console](https://console.firebase.google.com)
2. Update the `firebaseConfig` object in `src/services/firebase.ts`

---

## 🚀 Step 3: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

The app will automatically:
- Sync user data to Firestore
- Handle authentication
- Enable push notifications
- Work offline with service worker

---

## 🧪 Step 4: Run Tests

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm test:watch

# Coverage report
npm test:coverage
```

Expected output:
```
PASS  src/components/MoodSelector.test.tsx
PASS  src/components/ErrorBoundary.test.tsx
PASS  src/services/authService.test.ts
```

---

## 🚀 Step 5: Start Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

Features to test:
- ✅ Mood selector
- ✅ Reflections logging
- ✅ Du'a generator
- ✅ Community features
- ✅ (Optional) Authentication - create account

---

## 🔧 Step 6: Notification Setup (Optional)

### Manual Notification Test

```tsx
// In browser console
const ns = window.notificationService;
await ns.requestPermission();
await ns.showNotification({
  title: 'Test Notification',
  body: 'This is a test'
});
```

### Schedule Daily Reminders

In your reflection component, add:

```tsx
import { notificationService } from './services/notificationService';

useEffect(() => {
  const setupNotifications = async () => {
    const permission = await notificationService.requestPermission();
    if (permission === 'granted') {
      await notificationService.registerServiceWorker();
      await notificationService.scheduleDailyReminder('09:00');
    }
  };
  
  setupNotifications();
}, []);
```

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.tsx        # Error catching
│   ├── AuthForm.tsx              # Login/Register form
│   ├── SocialComments.tsx       # Comments feature
│   ├── SocialReactions.tsx      # Reactions feature
│   ├── [other components]
│   ├── *.test.tsx              # Component tests
│   └── *.test.ts               # Service tests
├── services/
│   ├── firebase.ts             # Firebase config
│   ├── authService.ts          # Authentication
│   ├── firestoreService.ts     # Cloud sync
│   ├── notificationService.ts  # Notifications
│   └── *.test.ts              # Service tests
├── contexts/
│   └── AuthContext.tsx         # Auth state management
├── types/
│   └── index.ts               # TypeScript definitions
├── App.tsx                     # Main component
├── main.tsx                    # Entry point
├── index.css                   # Styles
└── vite-env.d.ts              # Vite types
public/
├── sw.js                       # Service Worker
└── [images]
config files:
├── tsconfig.json              # TypeScript config
├── jest.config.js             # Jest config
├── tailwind.config.js         # Tailwind config
├── vite.config.js             # Vite config
├── .env.example               # Env template
└── .env.local                 # Your secrets (DO NOT COMMIT)
```

---

## 🎯 Testing All Features

### 1. Test Authentication

```bash
# Open http://localhost:5173
1. Click navbar (should show login if not authenticated)
2. Sign up with email/password
3. Create profile
4. Verify email in Firebase Console
```

### 2. Test Reflections

```
1. Log mood, write reflection, rate difficulty
2. Click "Log Reflection"
3. Check localStorage and Firestore
4. Verify data syncs across tabs
```

### 3. Test Social Features

```
1. Log in with different account
2. Add comment on a reflection
3. Add reaction emoji
4. Verify real-time updates
```

### 4. Test Notifications

```
1. Grant notification permission
2. Trigger test notification (see console)
3. Click notification to focus app
```

### 5. Test Du'as

```
1. Go to Du'as section
2. Select category
3. Generate du'a
4. Click export/share
5. Save as image
```

---

## 📊 Build for Production

```bash
# Create optimized build
npm run build

# Output goes to dist/ folder
# Preview: npm run preview
```

Deploy using:
- **Firebase Hosting** (recommended)
- **Vercel**
- **Netlify**
- **GitHub Pages**

### Firebase Hosting Deployment

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'firebase'"
```bash
npm install firebase
```

### Issue: "TypeScript errors in console"
```bash
# Check types
npx tsc --noEmit

# Update types
npm install --save-dev @types/node @types/react
```

### Issue: "Service Worker errors"
- App must run on HTTPS or localhost
- Check browser console for errors
- Clear service worker in DevTools > Application

### Issue: "Firebase connection failed"
- Verify `.env.local` variables
- Check Firebase project is active
- Verify authentication is enabled
- Check Firestore security rules (test mode allows all reads/writes)

### Issue: "Tests won't run"
```bash
npm install
npm test -- --clearCache
npm test
```

---

## 📚 Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React 18 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Testing](https://jestjs.io)
- [Tailwind CSS](https://tailwindcss.com)

---

## ✨ Features Summary

### Core
- ✅ Reflection logging with mood/difficulty
- ✅ Du'a generator with 6 categories
- ✅ Streak tracking & achievements
- ✅ Community features (leaderboard)
- ✅ Responsive mobile design

### New Enhancements
- ✅ Error boundaries for safety
- ✅ Comprehensive test suite
- ✅ Full TypeScript support
- ✅ Social comments & reactions
- ✅ Push notifications & reminders
- ✅ Firebase authentication
- ✅ Cloud sync via Firestore
- ✅ Service Worker for offline

---

## 🎓 Learn More

Check `ENHANCEMENTS.md` for detailed feature documentation.

---

## 🆘 Need Help?

1. Check console for error messages
2. Review test files for implementation examples
3. Check Firebase console for data
4. Review TypeScript types for API docs
5. Ask in React/Firebase communities

---

Made with ❤️ for meaningful Ramadan reflection 🌙
