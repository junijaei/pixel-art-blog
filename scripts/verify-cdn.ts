#!/usr/bin/env node

import { checkImageExists, getCdnUrl } from '../lib/cdn/api';
import { getCacheStats, loadCache } from '../lib/cdn/cache';
import { CDN_BASE_URL } from '../types/cdn';

async function main() {
  console.log('=== CDN Images Verification ===\n');
  console.log(`CDN Base URL: ${CDN_BASE_URL}\n`);

  console.log('[1] Checking CDN connectivity...');
  try {
    const response = await fetch(CDN_BASE_URL, { method: 'HEAD' });
    console.log(`    CDN Status: ${response.status} ${response.statusText}\n`);
  } catch (error) {
    console.error('    CDN unreachable:', error);
  }

  console.log('[2] Checking local cache...');
  try {
    const stats = await getCacheStats();
    console.log(`    Cache version: ${stats.cacheVersion}`);
    console.log(`    Entries: ${stats.totalEntries}`);
    console.log(`    Last updated: ${stats.lastUpdated}\n`);

    const cache = await loadCache();
    const entries = Object.values(cache.entries);
    if (entries.length > 0) {
      console.log('    Recent 5 cache entries:');
      entries.slice(0, 5).forEach((entry, i) => {
        console.log(`    ${i + 1}. ${entry.blockId.slice(0, 8)}... -> ${entry.cdnUrl}`);
      });
      console.log('');

      console.log('[3] Verifying cached images exist on CDN...');
      for (const entry of entries.slice(0, 3)) {
        const fileName = entry.cdnUrl.replace(`${CDN_BASE_URL}/`, '');
        const exists = await checkImageExists(fileName);
        console.log(`    ${fileName}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
      }
    }
  } catch (error) {
    console.error('    Failed to read cache:', error);
  }

  console.log('\n=== Verification Complete ===');
}

main().catch(console.error);
