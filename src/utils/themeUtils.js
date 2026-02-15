// Dark mode theme utilities

export const getThemePreference = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  
  // Apply to document element for Tailwind dark mode
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const toggleTheme = () => {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};
