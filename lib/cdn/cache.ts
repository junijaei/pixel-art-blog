import fs from 'fs/promises';
import path from 'path';
import type { ImageCacheStore, ImageCacheEntry } from '@/types/cdn';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'cdn-images.json');
const CACHE_VERSION = '2.0.0';

function createEmptyStore(): ImageCacheStore {
  return {
    version: CACHE_VERSION,
    lastUpdated: new Date().toISOString(),
    entries: {},
  };
}

async function ensureCacheDir(): Promise<void> {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

export async function loadCache(): Promise<ImageCacheStore> {
  try {
    await ensureCacheDir();
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    const store: ImageCacheStore = JSON.parse(data);

    if (store.version !== CACHE_VERSION) {
      console.warn('[Cache] Version mismatch, creating new cache');
      return createEmptyStore();
    }

    console.log(`[Cache] Loaded ${Object.keys(store.entries).length} entries`);
    return store;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('[Cache] No cache file found, creating new');
      return createEmptyStore();
    }
    console.error('[Cache] Error loading:', error);
    return createEmptyStore();
  }
}

export async function saveCache(store: ImageCacheStore): Promise<void> {
  try {
    await ensureCacheDir();
    store.lastUpdated = new Date().toISOString();
    await fs.writeFile(CACHE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    console.log(`[Cache] Saved ${Object.keys(store.entries).length} entries`);
  } catch (error) {
    console.error('[Cache] Error saving:', error);
    throw error;
  }
}

export async function getCachedImage(blockId: string, lastEditedTime: string): Promise<ImageCacheEntry | null> {
  const store = await loadCache();
  const entry = store.entries[blockId];

  if (!entry) {
    return null;
  }

  if (entry.lastEditedTime !== lastEditedTime) {
    console.log(`[Cache] Invalidated: ${blockId} (content changed)`);
    return null;
  }

  console.log(`[Cache] Hit: ${blockId}`);
  return entry;
}

export async function setCachedImage(
  blockId: string,
  lastEditedTime: string,
  cdnUrl: string,
  originalFilename?: string
): Promise<void> {
  const store = await loadCache();

  store.entries[blockId] = {
    blockId,
    lastEditedTime,
    cdnUrl,
    uploadedAt: new Date().toISOString(),
    originalFilename,
  };

  await saveCache(store);
  console.log(`[Cache] Set: ${blockId} -> ${cdnUrl}`);
}

export async function deleteCachedImage(blockId: string): Promise<void> {
  const store = await loadCache();

  if (store.entries[blockId]) {
    delete store.entries[blockId];
    await saveCache(store);
    console.log(`[Cache] Deleted: ${blockId}`);
  }
}

export async function clearCache(): Promise<void> {
  const store = createEmptyStore();
  await saveCache(store);
  console.log('[Cache] Cleared');
}

export async function getCacheStats(): Promise<{
  totalEntries: number;
  cacheVersion: string;
  lastUpdated: string;
}> {
  const store = await loadCache();

  return {
    totalEntries: Object.keys(store.entries).length,
    cacheVersion: store.version,
    lastUpdated: store.lastUpdated,
  };
}
