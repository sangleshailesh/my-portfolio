import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { motionStore, setReducedMotion } from '../lib/preferences';

/**
 * A user-facing motion override that defaults to the OS setting.
 *
 * Worth shipping for two reasons: some people want calmer motion without
 * changing a system preference, and — on a portfolio with no public repos — a
 * working reduced-motion control is a concrete accessibility affordance a
 * reviewer can actually exercise.
 *
 * Writes `data-motion="reduced"` on <html>; base.css does the rest.
 */
export function useMotionPreference() {
  const reduced = useSyncExternalStore(motionStore.subscribe, motionStore.get, motionStore.get);

  useEffect(() => {
    const root = document.documentElement;
    if (reduced) {
      root.dataset.motion = 'reduced';
    } else {
      delete root.dataset.motion;
    }
  }, [reduced]);

  const toggleMotion = useCallback(() => {
    setReducedMotion(!motionStore.get());
  }, []);

  return { reduced, toggleMotion };
}
