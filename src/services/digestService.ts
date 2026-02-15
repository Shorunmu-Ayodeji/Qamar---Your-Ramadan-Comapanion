export interface DigestSettings {
  enabled: boolean;
  time: string;
  frequency: 'daily' | 'weekly';
  email?: string;
}

const buildLocalStorageKey = (userId: string) => `digest_${userId}`;
const reminderTimers: Record<string, number> = {};

const canNotify = () => typeof window !== 'undefined' && 'Notification' in window;

const clearExistingReminder = (userId: string) => {
  if (reminderTimers[userId]) {
    window.clearTimeout(reminderTimers[userId]);
    delete reminderTimers[userId];
  }
};

const nextReminderDelayMs = (time: string, frequency: DigestSettings['frequency']) => {
  const [hours, minutes] = (time || '08:00').split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours || 8, minutes || 0, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  if (frequency === 'weekly') {
    target.setDate(target.getDate() + 6);
  }

  return target.getTime() - now.getTime();
};

const showDigestReminder = (frequency: DigestSettings['frequency']) => {
  if (!canNotify() || Notification.permission !== 'granted') return;
  const label = frequency === 'weekly' ? 'weekly' : 'daily';
  new Notification('Qamar Digest Reminder', {
    body: `Time for your ${label} reflection check-in.`,
    tag: 'qamar-digest-reminder',
  });
};

const scheduleReminder = async (userId: string, settings: DigestSettings) => {
  if (!settings.enabled || !canNotify()) return;
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  if (Notification.permission !== 'granted') return;

  clearExistingReminder(userId);
  const delay = nextReminderDelayMs(settings.time, settings.frequency);
  reminderTimers[userId] = window.setTimeout(() => {
    showDigestReminder(settings.frequency);
    scheduleReminder(userId, settings).catch(() => {});
  }, delay);
};

export const digestService = {
  getDigestSettings: async (userId: string): Promise<DigestSettings | null> => {
    const local = localStorage.getItem(buildLocalStorageKey(userId));
    const settings = local ? (JSON.parse(local) as DigestSettings) : null;
    if (settings?.enabled) {
      await scheduleReminder(userId, settings);
    }
    return settings;
  },

  scheduleDigestEmail: async (
    userId: string,
    email: string,
    preferredTime: string = '08:00',
    frequency: 'daily' | 'weekly' = 'daily'
  ): Promise<void> => {
    const payload: DigestSettings = {
      enabled: true,
      email,
      time: preferredTime,
      frequency,
    };
    localStorage.setItem(buildLocalStorageKey(userId), JSON.stringify(payload));
    await scheduleReminder(userId, payload);
  },

  disableDigest: async (userId: string): Promise<void> => {
    clearExistingReminder(userId);
    localStorage.removeItem(buildLocalStorageKey(userId));
  },
};

export default digestService;
