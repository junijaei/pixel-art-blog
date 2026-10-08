#!/usr/bin/env node

/**
 * 블록별 Notion 댓글을 훑어 Redis 인덱스에 적재합니다.
 *
 * 렌더 경로에서 댓글을 조회하지 않기 위한 선행 작업이다. 블록당 1회라 글 하나에
 * 약 95회가 나가고, features/post/api/throttle.ts가 이를 초당 3회로 묶는다.
 * 빌드 밖에서 도는 작업이라 오래 걸려도 무방하다.
 *
 *   pnpm sync:comments              전체
 *   pnpm sync:comments -- --post 28 slug가 28인 글만
 *   pnpm sync:comments -- --dry-run 조회만 하고 쓰지 않음
 */

import { fetchBlocks, fetchBlocksChildren } from '@/features/post/api/block';
import { fetchCommentsForBlocks } from '@/features/post/api/comment';
import { replaceCommentIndex } from '@/features/post/api/comment-index';
import { fetchPostPages } from '@/features/post/api/post';
import { NOTION_DATASOURCE_POST_ID } from '@/features/post/constants';
import { toPosts } from '@/features/post/transform/posts';
import { processBlockTree } from '@/features/post/transform/block';
import { requireRedis } from '@/shared/lib/redis';

interface Options {
  post: string | null;
  dryRun: boolean;
}

function parseArgs(argv: string[]): Options {
  const postIndex = argv.indexOf('--post');
  return {
    post: postIndex >= 0 ? (argv[postIndex + 1] ?? null) : null,
    dryRun: argv.includes('--dry-run'),
  };
}

async function syncPost(pageId: string, slug: string, dryRun: boolean): Promise<number> {
  const rawBlocks = await fetchBlocks(pageId);
  const enrichedBlocks = await fetchBlocksChildren(rawBlocks);
  const { blocks } = processBlockTree(enrichedBlocks);
  const blockIds = blocks.map((block) => block.id);

  const commentMap = await fetchCommentsForBlocks(blockIds);
  const commentedBlocks = Object.keys(commentMap).length;

  console.info(
    `  ${slug}: 블록 ${blockIds.length}개 조회 → 댓글 있는 블록 ${commentedBlocks}개` +
      (dryRun ? ' (dry-run, 쓰지 않음)' : '')
  );

  if (!dryRun) await replaceCommentIndex(pageId, commentMap);
  return commentedBlocks;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!NOTION_DATASOURCE_POST_ID) {
    throw new Error('NOTION_DATASOURCE_POST_ID가 설정되지 않았습니다.');
  }
  // 전부 훑고 나서 쓰기에서 실패하면 조회 비용이 통째로 날아간다. 먼저 확인한다.
  if (!options.dryRun) requireRedis();

  console.info('=== 댓글 인덱스 동기화 ===');

  const posts = toPosts(await fetchPostPages(NOTION_DATASOURCE_POST_ID));
  const targets = options.post ? posts.filter((post) => post.slug === options.post) : posts;

  if (targets.length === 0) {
    console.warn(options.post ? `slug "${options.post}"인 글이 없습니다.` : '대상 글이 없습니다.');
    return;
  }

  console.info(`대상 ${targets.length}편\n`);

  const startedAt = Date.now();
  let totalCommented = 0;
  let failed = 0;

  for (const [index, post] of targets.entries()) {
    process.stdout.write(`[${index + 1}/${targets.length}]`);
    try {
      totalCommented += await syncPost(post.id, post.slug, options.dryRun);
    } catch (error) {
      failed++;
      console.error(`  ${post.slug}: 실패 —`, error instanceof Error ? error.message : error);
    }
  }

  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  console.info(
    `\n완료: ${targets.length - failed}/${targets.length}편, 댓글 있는 블록 ${totalCommented}개, ${elapsed}초`
  );
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
