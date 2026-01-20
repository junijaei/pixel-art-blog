import { useEffect, useState } from 'react';

type StorageType = 'local' | 'session';

interface UseStorageOptions<T> {
  storage?: StorageType;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

function getStorage(type: StorageType) {
  if (typeof window === 'undefined') return null;
  return type === 'local' ? window.localStorage : window.sessionStorage;
}

export function useStorage<T>(
  key: string,
  initialValue: T,
  options: UseStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const { storage = 'local', serializer = JSON.stringify, deserializer = JSON.parse } = options;

  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const store = getStorage(storage);
    if (!store) return;

    const raw = store.getItem(key);
    if (raw === null) return;

    try {
      setState(deserializer(raw));
    } catch {
      setState(initialValue);
    }
  }, [key, storage]);

  // 다른 탭 sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return;

      try {
        if (e.newValue === null) {
          setState(initialValue);
        } else {
          setState(deserializer(e.newValue));
        }
      } catch {
        setState(initialValue);
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;

      const store = getStorage(storage);
      if (store) {
        store.setItem(key, serializer(next));
      }

      return next;
    });
  };

  return [state, setValue];
}
