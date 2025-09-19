import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing localStorage with React state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Update state
        setStoredValue(valueToStore);
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Dispatch a custom event to notify other components/tabs
          window.dispatchEvent(
            new CustomEvent('localStorage-change', {
              detail: { key, value: valueToStore }
            })
          );
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        // Dispatch a custom event
        window.dispatchEvent(
          new CustomEvent('localStorage-change', {
            detail: { key, value: null }
          })
        );
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value ?? initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage-change', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomStorageChange as EventListener);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing user email preference
 */
export function useUserEmail() {
  return useLocalStorage<string>('feedback_user_email', '');
}

/**
 * Hook for managing last rating for a specific client
 */
export function useLastRating(clientId: string) {
  return useLocalStorage<number | null>(`feedback_last_rating_${clientId}`, null);
}

/**
 * Hook for managing dismissed prompts/notifications
 */
export function useDismissedPrompts() {
  return useLocalStorage<string[]>('feedback_dismissed_prompts', []);
}

/**
 * Hook for checking if localStorage is available
 */
export function useLocalStorageSupport(): boolean {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Test if we can actually use localStorage
        const testKey = '__localStorage_test__';
        window.localStorage.setItem(testKey, 'test');
        window.localStorage.removeItem(testKey);
        setIsSupported(true);
      }
    } catch {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
}

/**
 * Hook for managing localStorage with expiration
 */
export function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T,
  expirationMs: number
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage(
    key,
    { data: initialValue, timestamp: Date.now() }
  );

  // Check if value has expired
  const isExpired = Date.now() - value.timestamp > expirationMs;
  const currentValue = isExpired ? initialValue : value.data;

  // Wrapper function to set value with timestamp
  const setValueWithExpiry = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      const valueToStore = newValue instanceof Function ? newValue(currentValue) : newValue;
      setValue({ data: valueToStore, timestamp: Date.now() });
    },
    [setValue, currentValue]
  );

  // Auto-cleanup expired values
  useEffect(() => {
    if (isExpired) {
      removeValue();
    }
  }, [isExpired, removeValue]);

  return [currentValue, setValueWithExpiry, removeValue];
}

/**
 * Hook for syncing localStorage across multiple tabs/windows
 */
export function useLocalStorageSync<T>(
  key: string,
  initialValue: T,
  syncAcrossTabs: boolean = true
) {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  const [lastSync, setLastSync] = useState(Date.now());

  // Force sync from localStorage
  const syncFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedValue = JSON.parse(item);
        setValue(parsedValue);
        setLastSync(Date.now());
      }
    } catch (error) {
      console.warn(`Error syncing localStorage key "${key}":`, error);
    }
  }, [key, setValue]);

  // Listen for visibility changes to sync when tab becomes visible
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Sync from localStorage when tab becomes visible
        syncFromStorage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncAcrossTabs, syncFromStorage]);

  return { value, setValue, removeValue, syncFromStorage, lastSync };
}