# Security Guide

Best practices for securing the Qamar app.

## 🔐 Authentication Security

### Environment Variables
✅ **DO:**
- Store Firebase config in `.env.local`
- Keep `.env.local` out of version control
- Rotate credentials regularly
- Use different keys for dev/prod

❌ **DON'T:**
- Commit `.env.local` to git
- Hardcode credentials in code
- Share secrets in chat/email
- Use same key for multiple environments

### Password Security
✅ **Enforce:**
- Minimum 8 characters
- Mix of letters/numbers/symbols (optional UI validation)
- Firebase handles hashing automatically

❌ **Avoid:**
- Storing plain-text passwords
- Password hints
- Security questions

---

## 🔒 Firestore Security

### Test Mode (Development Only)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **ONLY FOR TESTING!**

### Production Rules

**User Reflections:**
```javascript
match /reflections/{doc=**} {
  allow read, write: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

**User Profiles:**
```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null 
    && request.auth.uid == userId;
}
```

**Comments (Public):**
```javascript
match /comments/{doc=**} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update, delete: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

### Data Validation

```javascript
match /reflections/{doc=**} {
  allow create: if request.data.mood in ['peaceful', 'sad', 'happy', 'tired', 'confused']
    && request.data.difficulty in [1, 2, 3, 4, 5]
    && request.data.reflection.size() <= 200
    && request.auth.uid == request.data.userId;
}
```

---

## 🚨 Input Validation

### Client-Side (TypeScript)
```tsx
import type { Reflection } from './types';

const validateReflection = (data: any): data is Reflection => {
  return (
    typeof data.mood === 'string' &&
    ['peaceful', 'sad', 'happy', 'tired', 'confused'].includes(data.mood) &&
    typeof data.reflection === 'string' &&
    data.reflection.length > 0 &&
    data.reflection.length <= 200 &&
    typeof data.difficulty === 'number' &&
    data.difficulty >= 1 &&
    data.difficulty <= 5
  );
};
```

### Sanitization
```tsx
// Remove HTML/scripts
const sanitize = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};
```

---

## 🔑 API Keys Security

### Firebase API Key
- ✅ Public (safe to expose)
- Scoped through Firebase Security Rules
- Not the same as service account key

### Environment Setup
```env
# .env.local (NEVER COMMIT)
VITE_FIREBASE_API_KEY=AIzaSy...
```

### Service Account Key
- ❌ KEEP SECRET (never commit)
- Use only on server
- Regenerate if exposed

---

## 🛡️ XSS Prevention

### React Auto-Escapes
```tsx
// Safe - React escapes content
<div>{userInput}</div>

// ❌ Unsafe - uses HTML
<div dangerouslySetInTheHTML={{__html: userInput}} />
```

### Safe Patterns
✅ DO:
```tsx
const comment = await getComment();
return <p>{comment.text}</p>; // Escaped!
```

❌ DON'T:
```tsx
// Never use user input in dangerouslySetInnerHTML
return <p dangerouslySetInnerHTML={{__html: userComment}} />;
```

---

## 🔐 CSRF Protection

Firebase handles CSRF automatically through:
- Tokens
- Secure cookies
- Same-origin policy

No additional config needed.

---

## 📱 Secure Communication

### HTTPS Required
- ✅ Always use HTTPS in production
- ✅ Service Worker requires HTTPS
- ✅ Notifications require HTTPS

### Local Development
- ✅ localhost is exception
- ✅ Use `npm run dev` for secure localhost

---

## 👤 User Data Protection

### PII (Personal Identifiable Information)
- Store minimally
- Don't log to console in production
- Encrypt sensitive fields if needed

### User Privacy
```tsx
// Hide users' email addresses
const displayName = userProfile.displayName || 'Anonymous';

// Don't expose internal IDs publicly
const sanitizedData = {
  displayName: user.displayName,
  streak: user.streak,
  // Don't expose: userId, email, etc
};
```

---

## 🔄 Session Management

### Automatic Firebase Logout
```tsx
// After inactivity (implement if needed)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 min

let inactivityTimer: NodeJS.Timeout;

const resetTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    authService.logout();
  }, INACTIVITY_TIMEOUT);
};

document.addEventListener('click', resetTimer);
document.addEventListener('keypress', resetTimer);
```

### Secure Token Storage
- Firebase stores in secure cookies
- Manual localStorage is less secure
- Don't store tokens in localStorage

---

## 🚀 Production Checklist

- [ ] Update Firestore security rules
- [ ] Enable HTTPS only
- [ ] Remove debug logging
- [ ] Update Firebase rules (not test mode)
- [ ] Enable reCAPTCHA if needed
- [ ] Set up logging/monitoring
- [ ] Enable revision history in Firestore
- [ ] Regular backups configured

---

## 📝 Logging Best Practices

### Development
```tsx
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

### Production
```tsx
// Never log sensitive data
console.error('Auth failed'); // ✅
console.log('Password:', password); // ❌ NEVER

// Use error reporting
// logErrorToService(error);
```

---

## 🔍 Security Headers

### Content Security Policy (Optional)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
```

---

## 🐛 Vulnerability Scanning

```bash
# Check dependencies for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# Check types
npx tsc --noEmit

# Lint code
npm run lint
```

---

## 📧 Handling User Emails

✅ **Safe:**
- Send via Firebase authentication
- Firebase verifies ownership
- Automatic opt-out mechanism

❌ **Unsafe:**
- Collecting without consent
- Sharing with third parties
- Storing unencrypted

---

## 🔐 Two-Factor Authentication (Future)

```tsx
// Placeholder for future feature
// const setupTwoFactor = async (user) => {
//   // Enable MFA
// };
```

---

## 💾 Data Backup & Recovery

### Firebase Backups
- Firestore auto-backs up
- Retention: 35 days by default
- Can export data manually

```bash
# Export Firestore data
firebase firestore:export ./backup
```

---

## 🚨 Incident Response

If security issue discovered:

1. **Assess**: Determine scope
2. **Contain**: Stop ongoing access
3. **Eradicate**: Remove threat
4. **Recover**: Restore systems
5. **Document**: Log incident

---

## 📞 Security Contact

For security issues:
- ❌ Don't post in public issues
- ✅ Email: security@qamarapp.com
- ✅ Submit responsibly
- ✅ Allow time to fix before disclosure

---

## 🎓 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security](https://firebase.google.com/docs/database/security)
- [Web Security Academy](https://portswigger.net/web-security)
- [CWE List](https://cwe.mitre.org/)

---

Made with ❤️ for secure Ramadan reflections 🌙
