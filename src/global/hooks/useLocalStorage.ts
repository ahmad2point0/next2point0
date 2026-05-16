"use client";

import { useCallback, useSyncExternalStore } from "react";

function readValue<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const handler = (event: StorageEvent) => {
        if (event.key === key) notify();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    [key],
  );
  const getSnapshot = useCallback(() => readValue(key, initialValue), [key, initialValue]);
  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      try {
        const prev = readValue(key, initialValue);
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        window.localStorage.setItem(key, JSON.stringify(resolved));
        window.dispatchEvent(new StorageEvent("storage", { key }));
      } catch {
        // storage may be full or disabled — silently ignore
      }
    },
    [key, initialValue],
  );

  return [value, setValue] as const;
}
