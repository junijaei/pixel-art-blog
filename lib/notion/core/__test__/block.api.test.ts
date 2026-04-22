import { fetchBlocksChildren } from '@/lib/notion/core/block.api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Notion client
vi.mock('@/lib/notion/core/client', () => ({
  notionClient: {
    blocks: {
      children: {
        list: vi.fn(),
      },
      retrieve: vi.fn(),
    },
  },
}));

import { createMockBlock } from '@/__test__/fixture';
import { notionClient } from '@/lib/notion/core/client';
import type { Block } from '@/types/notion';

type BlockChildrenListResponse = Awaited<ReturnType<typeof notionClient.blocks.children.list>>;

function createBlockChildrenResponse(
  results: Block[],
  hasMore = false,
  nextCursor: string | null = null
): BlockChildrenListResponse {
  return {
    results,
    has_more: hasMore,
    next_cursor: nextCursor,
    object: 'list',
    type: 'block',
    block: {},
  } as BlockChildrenListResponse;
}

describe('fetchBlocksChildren', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has_children이 false인 블록은 그대로 반환한다', async () => {
    const blocks = [createMockBlock('block-1', false), createMockBlock('block-2', false)];

    const result = await fetchBlocksChildren(blocks);

    expect(result).toEqual(blocks);
    expect(notionClient.blocks.children.list).not.toHaveBeenCalled();
  });

  it('has_children이 true인 블록의 children을 가져와 주입한다', async () => {
    const parentBlock = createMockBlock('parent-1', true);
    const childBlocks = [createMockBlock('child-1', false), createMockBlock('child-2', false)];

    vi.mocked(notionClient.blocks.children.list).mockResolvedValueOnce(createBlockChildrenResponse(childBlocks));

    const result = await fetchBlocksChildren([parentBlock]);

    expect(result[0].children).toEqual(childBlocks);
    expect(notionClient.blocks.children.list).toHaveBeenCalledWith({
      block_id: 'parent-1',
      page_size: expect.any(Number),
      start_cursor: undefined,
    });
  });

  it('중첩된 children을 재귀적으로 가져온다', async () => {
    const parentBlock = createMockBlock('parent-1', true);
    const childWithChildren = createMockBlock('child-1', true);
    const grandchildBlock = createMockBlock('grandchild-1', false);

    // 첫 번째 호출: parent의 children
    vi.mocked(notionClient.blocks.children.list).mockResolvedValueOnce(
      createBlockChildrenResponse([childWithChildren])
    );

    // 두 번째 호출: child의 children
    vi.mocked(notionClient.blocks.children.list).mockResolvedValueOnce(createBlockChildrenResponse([grandchildBlock]));

    const result = await fetchBlocksChildren([parentBlock]);

    expect(result[0].children).toHaveLength(1);
    expect(result[0].children![0].children).toEqual([grandchildBlock]);
    expect(notionClient.blocks.children.list).toHaveBeenCalledTimes(2);
  });

  it('maxDepth에 도달하면 더 이상 children을 가져오지 않는다', async () => {
    const block = createMockBlock('deep-block', true);

    vi.mocked(notionClient.blocks.children.list).mockResolvedValue(
      createBlockChildrenResponse([createMockBlock('child', true)])
    );

    // maxDepth를 2로 설정
    await fetchBlocksChildren([block], 2);

    // depth 0 -> depth 1 -> depth 2 (stop)
    // 즉, 2번만 호출되어야 함
    expect(notionClient.blocks.children.list).toHaveBeenCalledTimes(2);
  });

  it('API 호출 실패 시 원본 블록을 반환한다', async () => {
    const parentBlock = createMockBlock('parent-1', true);

    vi.mocked(notionClient.blocks.children.list).mockRejectedValueOnce(new Error('API Error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await fetchBlocksChildren([parentBlock]);

    expect(result[0]).toEqual(parentBlock);
    expect(result[0].children).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('페이지네이션을 처리한다', async () => {
    const parentBlock = createMockBlock('parent-1', true);
    const childBlocks1 = [createMockBlock('child-1', false)];
    const childBlocks2 = [createMockBlock('child-2', false)];

    // 첫 번째 페이지
    vi.mocked(notionClient.blocks.children.list).mockResolvedValueOnce(
      createBlockChildrenResponse(childBlocks1, true, 'cursor-1')
    );

    // 두 번째 페이지
    vi.mocked(notionClient.blocks.children.list).mockResolvedValueOnce(createBlockChildrenResponse(childBlocks2));

    const result = await fetchBlocksChildren([parentBlock]);

    expect(result[0].children).toHaveLength(2);
    expect(result[0].children![0].id).toBe('child-1');
    expect(result[0].children![1].id).toBe('child-2');
    expect(notionClient.blocks.children.list).toHaveBeenCalledTimes(2);
  });

  it('빈 배열을 처리한다', async () => {
    const result = await fetchBlocksChildren([]);

    expect(result).toEqual([]);
    expect(notionClient.blocks.children.list).not.toHaveBeenCalled();
  });

  it('여러 블록을 병렬로 처리한다', async () => {
    const blocks = [
      createMockBlock('parent-1', true),
      createMockBlock('parent-2', true),
      createMockBlock('parent-3', false),
    ];

    vi.mocked(notionClient.blocks.children.list)
      .mockResolvedValueOnce(createBlockChildrenResponse([createMockBlock('child-1-1', false)]))
      .mockResolvedValueOnce(createBlockChildrenResponse([createMockBlock('child-2-1', false)]));

    const result = await fetchBlocksChildren(blocks);

    expect(result[0].children).toBeDefined();
    expect(result[1].children).toBeDefined();
    expect(result[2].children).toBeUndefined();
    expect(notionClient.blocks.children.list).toHaveBeenCalledTimes(2);
  });
});
