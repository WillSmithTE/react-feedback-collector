import { useState, useCallback } from 'react';

/**
 * Simple localStorage hook for email storage
 */
function useLocalStorage(key: string, initialValue: string): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item || initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: string) => {
    setStoredValue(value);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, value);
      } catch {}
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook for managing user email preference
 */
export function useUserEmail() {
  return useLocalStorage('feedback_user_email', '');
}