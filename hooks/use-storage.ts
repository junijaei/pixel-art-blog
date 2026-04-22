import { useEffect, useRef, useState } from 'react';

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
  const initialValueRef = useRef(initialValue);
  const deserializerRef = useRef(deserializer);

  useEffect(() => {
    initialValueRef.current = initialValue;
    deserializerRef.current = deserializer;
  });

  useEffect(() => {
    const store = getStorage(storage);
    if (!store) return;

    const raw = store.getItem(key);
    if (raw === null) return;

    try {
      setState(deserializerRef.current(raw));
    } catch {
      setState(initialValueRef.current);
    }
  }, [key, storage]);

  // Keep multiple tabs/windows in sync.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return;

      try {
        if (e.newValue === null) {
          setState(initialValueRef.current);
        } else {
          setState(deserializerRef.current(e.newValue));
        }
      } catch {
        setState(initialValueRef.current);
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
