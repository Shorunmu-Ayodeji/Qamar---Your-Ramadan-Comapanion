export interface NotificationData {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  badge?: string;
}

export const notificationService = {
  // Check if notifications are supported
  isSupported: (): boolean => {
    return 'serviceWorker' in navigator && 'Notification' in window;
  },

  // Request notification permission
  requestPermission: async (): Promise<NotificationPermission> => {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission !== 'granted') {
      return Notification.requestPermission();
    }

    return Notification.permission;
  },

  // Register service worker
  registerServiceWorker: async (): Promise<ServiceWorkerRegistration | undefined> => {
    if (!this.isSupported()) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  },

  // Send push notification
  showNotification: async (data: NotificationData): Promise<void> => {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return;
    }

    // Check if allowed
    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/qamar-icon.png',
      badge: data.badge || '/qamar-badge.png',
      tag: data.tag || 'qamar-notification',
      requireInteraction: true,
    });
  },

  // Schedule daily reflection reminder
  scheduleDailyReminder: async (time: string = '09:00'): Promise<void> => {
    if (!this.isSupported()) return;

    // Register for background sync
    const registration = await navigator.serviceWorker.ready;
    
    try {
      await (registration as any).periodicSync.register('daily-reminder', {
        minInterval: 24 * 60 * 60 * 1000, // 24 hours
      });
      console.log('Daily reminder registered');
    } catch (error) {
      console.error('Failed to register periodic sync:', error);
      // Fallback to local scheduling
      this.scheduleLocalReminder(time);
    }
  },

  // Local reminder scheduling (fallback)
  scheduleLocalReminder: (time: string = '09:00'): void => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    
    reminderTime.setHours(hours, minutes, 0, 0);
    
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      this.showNotification({
        title: '🌙 Reflection Time',
        body: 'Take a moment to reflect on your day and your journey',
        tag: 'daily-reminder',
      });

      // Schedule next day
      setInterval(() => {
        this.showNotification({
          title: '🌙 Reflection Time',
          body: 'Take a moment to reflect on your day and your journey',
          tag: 'daily-reminder',
        });
      }, 24 * 60 * 60 * 1000);
    }, timeUntilReminder);
  },

  // Send motivational notification
  sendMotivation: async (): Promise<void> => {
    const messages = [
      {
        title: '🔥 Keep the Streak',
        body: 'You\'re doing amazing! Log your reflection today',
      },
      {
        title: '💪 You Got This',
        body: 'Every reflection brings you closer to your goals',
      },
      {
        title: '✨ Spiritual Journey',
        body: 'Your commitment to reflection is beautiful',
      },
      {
        title: '🌟 Consistency Matters',
        body: 'Build your streak one day at a time',
      },
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];
    await this.showNotification(message);
  },

  // Unsubscribe from notifications
  unsubscribeNotifications: async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
  },
};

export default notificationService;
