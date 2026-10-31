import { useSyncExternalStore } from 'react';
import type { SearchResult } from './accommodation-types';
import { readFavorites } from './accommodation-view';
const storageKey = 'ludigo-favorites-v1';
const eventName = 'ludigo-favorites-changed';
const empty: SearchResult[] = [];
let snapshot: SearchResult[] = empty, previousRaw: string | null | undefined;
let sessionOnly = false;
function getSnapshot(): SearchResult[] {
  if (sessionOnly) return snapshot;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw !== previousRaw) { previousRaw = raw; snapshot = readFavorites(raw); }
  } catch { sessionOnly = true; }
  return snapshot;
}
function subscribe(notify: () => void): () => void {
  const onStorage = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) notify(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(eventName, notify);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(eventName, notify); };
}
export function useFavorites(): SearchResult[] { return useSyncExternalStore(subscribe, getSnapshot, () => empty); }
export function writeFavorites(next: SearchResult[]): boolean {
  snapshot = next;
  let stored = false;
  try { const raw = JSON.stringify(next); localStorage.setItem(storageKey, raw); previousRaw = raw; sessionOnly = false; stored = true; }
  catch { sessionOnly = true; }
  window.dispatchEvent(new Event(eventName));
  return stored;
}
