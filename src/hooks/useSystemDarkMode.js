import { useEffect } from 'react';

/**
 * Syncs the app's dark mode styling with the user's system preference.
 * Uses matchMedia on `prefers-color-scheme` and toggles the `dark` class
 * on <html> (Tailwind's class-based dark mode).
 */
export default function useSystemDarkMode() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.classList.toggle('dark', mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
}