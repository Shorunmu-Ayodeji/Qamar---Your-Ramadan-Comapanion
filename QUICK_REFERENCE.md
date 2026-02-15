# Quick Reference Guide

Fast lookup for using the enhanced Qamar app features.

## 🔥 Most Used Commands

```bash
npm run dev              # Start dev server
npm test                 # Run tests
npm run build            # Production build
npm test:watch          # Watch tests
npm test:coverage       # Test coverage
```

---

## 💾 Git Ignore Updates

Add to `.gitignore`:
```
.env.local
.env.*.local
```

These contain your Firebase secrets!

---

## 🔐 Firebase Quick Setup

1. **Create project**: https://console.firebase.google.com
2. **Enable Auth**: Firebase > Authentication > Email/Password
3. **Create Firestore**: Firebase > Firestore Database (test mode)
4. **Copy config**: Firebase > Project Settings
5. **Create `.env.local`**: Paste credentials
6. **Done!** ✨

---

## 📝 Component Usage

### Error Boundary
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Auth Provider
```tsx
<AuthProvider>
  <App />
</AuthProvider>
```

### Auth Hook
```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### Social Comments
```tsx
<SocialComments reflectionId={id} isAuthenticated={true} />
```

### Social Reactions
```tsx
<SocialReactions reflectionId={id} isAuthenticated={true} />
```

---

## 📊 Services API

### Auth Service
```tsx
// Register
await authService.register(email, pass, name);

// Login
await authService.login(email, password);

// Logout
await authService.logout();

// Subscribe to changes
authService.onAuthStateChanged(user => {});
```

### Firestore Service
```tsx
// Save reflection
await firestoreService.saveReflection({...});

// Get reflections
await firestoreService.getUserReflections();

// Add comment
await firestoreService.addComment(reflectionId, text);

// Add reaction
await firestoreService.addReaction(reflectionId, emoji);
```

### Notification Service
```tsx
// Request permission
await notificationService.requestPermission();

// Show notification
await notificationService.showNotification({...});

// Schedule daily
await notificationService.scheduleDailyReminder('09:00');

// Send motivation
await notificationService.sendMotivation();
```

---

## 🧪 Testing Patterns

### Component Test
```tsx
test('renders correctly', () => {
  render(<Component prop={value} />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Service Test
```tsx
jest.mock('./firebase');

test('calls Firebase', async () => {
  await authService.login('test@test.com', 'pass');
  expect(signInWithEmailAndPassword).toHaveBeenCalled();
});
```

---

## 📘 Type Safety

### Import Types
```tsx
import type { 
  Reflection, 
  User, 
  Comment 
} from './types';
```

### Define Props
```tsx
interface Props {
  reflectionId: string;
  isAuthenticated: boolean;
  onSave?: (reflection: Reflection) => void;
}
```

---

## 🚨 Error Handling

### Try-Catch
```tsx
try {
  await authService.login(email, password);
} catch (error: any) {
  console.error(error.message);
}
```

### Error Boundary
```tsx
// Automatically catches child errors
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

---

## 🔔 Notification Quick Setup

```tsx
useEffect(() => {
  const setup = async () => {
    const perm = await notificationService.requestPermission();
    if (perm === 'granted') {
      await notificationService.registerServiceWorker();
      await notificationService.scheduleDailyReminder('09:00');
    }
  };
  setup();
}, []);
```

---

## ☁️ Cloud Sync Pattern

```tsx
// On component mount
useEffect(() => {
  const loadData = async () => {
    const data = await firestoreService.getUserReflections();
    setReflections(data);
  };
  loadData();
}, []);

// On save
const handleSave = async (reflection: Reflection) => {
  const id = await firestoreService.saveReflection(reflection);
  // Refresh local state
};
```

---

## 🔍 Debugging

### Enable Debug Logging
```tsx
// In firebase.ts
if (import.meta.env.DEV) {
  console.log('Firebase initialized');
}
```

### Browser DevTools
- **Console**: Check for errors
- **Network**: Firebase API calls
- **Application**: localStorage, Service Worker
- **React DevTools**: Component tree

### Firebase Console
- Monitor real-time data
- Check authentication logs
- Review Firestore data

---

## 📋 Firestore Rules (Test Mode)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads/writes (test)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**For production**, restrict appropriately:
```javascript
match /reflections/{doc=**} {
  allow read, write: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

---

## 🚀 Deployment Checklist

- [ ] Update Firebase rules (production)
- [ ] Set environment variables
- [ ] Run `npm test` passing
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Commit all changes
- [ ] Fire `firebase deploy`

---

## 📞 Common Issues

| Issue | Solution |
|-------|----------|
| Firebase not loaded | Check `.env.local` variables |
| Service Worker not registered | App must be HTTPS or localhost |
| Tests fail | `npm install && npm test -- --clearCache` |
| TypeScript errors | `npx tsc --noEmit` for full check |
| Notifications not showing | Grant permission + HTTPS required |

---

## 🎓 Learning Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🆘 Quick Help

**Need to...?**

- **Add new component**: Create in `src/components/`, add `.test.tsx`
- **Add new service**: Create in `src/services/`, add `.test.ts`
- **Add new type**: Add to `src/types/index.ts`
- **Change styles**: Update `src/index.css` or component classes
- **Fix auth**: Check `.env.local` and Firebase Console
- **Clear cache**: `npm test -- --clearCache`
- **Update deps**: `npm update` then test

---

Made with ❤️ for developers building with Qamar 🌙
