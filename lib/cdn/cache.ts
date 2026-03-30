import type { ImageCacheEntry, ImageCacheStore } from '@/types/cdn';
import fs from 'fs/promises';
import path from 'path';

// Vercel 서버리스(ISR) 환경에서는 .next 디렉토리가 읽기 전용이므로
// 빌드 타임에만 파일 쓰기를 수행한다.
const IS_BUILD_PHASE = process.env.NEXT_PHASE === 'phase-production-build';

const CACHE_DIR = path.join(process.cwd(), '.next', 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'cdn-images.json');
const CACHE_VERSION = '2.0.0';

// 메모리 캐시: 파일 I/O를 최소화합니다
let memoryCache: ImageCacheStore | null = null;
let memoryCacheLoaded = false;

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
  // 메모리 캐시가 있으면 재사용
  if (memoryCacheLoaded && memoryCache) {
    return memoryCache;
  }

  try {
    await ensureCacheDir();
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    const store: ImageCacheStore = JSON.parse(data);

    if (store.version !== CACHE_VERSION) {
      console.warn('[Cache] Version mismatch, creating new cache');
      memoryCache = createEmptyStore();
      memoryCacheLoaded = true;
      return memoryCache;
    }

    console.debug(`[Cache] Loaded ${Object.keys(store.entries).length} entries from disk`);
    memoryCache = store;
    memoryCacheLoaded = true;
    return store;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.debug('[Cache] No cache file found, creating new');
      memoryCache = createEmptyStore();
      memoryCacheLoaded = true;
      return memoryCache;
    }
    console.error('[Cache] Error loading:', error);
    memoryCache = createEmptyStore();
    memoryCacheLoaded = true;
    return memoryCache;
  }
}

export async function saveCache(store: ImageCacheStore): Promise<void> {
  // 메모리 캐시는 항상 갱신 (현재 invocation 내 중복 업로드 방지)
  store.lastUpdated = new Date().toISOString();
  memoryCache = store;
  memoryCacheLoaded = true;

  // 파일 쓰기는 빌드 타임에만 수행
  // ISR 서버리스 환경에서는 .next 디렉토리가 읽기 전용이므로 건너뜀
  if (!IS_BUILD_PHASE) return;

  try {
    await ensureCacheDir();
    await fs.writeFile(CACHE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    console.debug(`[Cache] Saved ${Object.keys(store.entries).length} entries to disk`);
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
    console.debug(`[Cache] Invalidated: ${blockId} (content changed)`);
    return null;
  }

  console.debug(`[Cache] Hit: ${blockId}`);
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
  console.debug(`[Cache] Set: ${blockId} -> ${cdnUrl}`);
}

export async function batchSetCachedImages(
  entries: Array<{
    blockId: string;
    lastEditedTime: string;
    cdnUrl: string;
    originalFilename?: string;
  }>
): Promise<void> {
  if (entries.length === 0) return;

  const store = await loadCache();
  const now = new Date().toISOString();

  for (const { blockId, lastEditedTime, cdnUrl, originalFilename } of entries) {
    store.entries[blockId] = { blockId, lastEditedTime, cdnUrl, uploadedAt: now, originalFilename };
  }

  await saveCache(store);
  console.debug(`[Cache] Batch set ${entries.length} entries`);
}

export async function deleteCachedImage(blockId: string): Promise<void> {
  const store = await loadCache();

  if (store.entries[blockId]) {
    delete store.entries[blockId];
    await saveCache(store);
    console.debug(`[Cache] Deleted: ${blockId}`);
  }
}

export async function clearCache(): Promise<void> {
  const store = createEmptyStore();
  memoryCache = store;
  memoryCacheLoaded = true;
  await saveCache(store);
  console.debug('[Cache] Cleared');
}

/**
 * 메모리 캐시를 초기화합니다.
 * 테스트 또는 새 빌드 시작 시 사용합니다.
 */
export function resetMemoryCache(): void {
  memoryCache = null;
  memoryCacheLoaded = false;
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
