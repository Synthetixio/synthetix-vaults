import { useState, useEffect } from 'react';

export const set = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('storage')); // Manually dispatch a storage event
  }
};

export function get<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(key);
    try {
      if (item != null) {
        return JSON.parse(item);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = get<T>(key);
    return item != null ? item : initialValue;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newValue = get<T>(key);
      if (newValue !== null) {
        setStoredValue(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setValue = (value: T) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    set(key, valueToStore);
  };

  return [storedValue, setValue] as const;
}
