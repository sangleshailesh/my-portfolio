import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { applyThemeColor, setTheme, themeIsAutomatic, themeStore } from '../lib/preferences';

/**
 * Theme, read from a shared store so every copy of the control agrees.
 *
 * `useSyncExternalStore` is the right primitive here: the value lives outside
 * React, several components read it, and it can change from outside React (the
 * OS preference changing while the page is open).
 */
export function useTheme() {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.get, themeStore.get);

  // Apply to the document. Runs in whichever component mounts first; the rest
  // are writing the same values, so it is idempotent.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    applyThemeColor(theme);
  }, [theme]);

  // Follow the OS only while the user has not made an explicit choice.
  useEffect(() => {
    if (!themeIsAutomatic()) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event) => setTheme(event.matches ? 'light' : 'dark', { persist: false });
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(themeStore.get() === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
}
