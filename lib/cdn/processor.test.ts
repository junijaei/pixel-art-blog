import type { ImageBlock } from '@/types/notion';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/cdn/dev-mock', () => ({
  isDevelopment: vi.fn(() => false),
  mockProcessBlocks: vi.fn(),
}));

vi.mock('@/lib/cdn/cache', () => ({
  getCachedImage: vi.fn(),
  setCachedImage: vi.fn(),
}));

vi.mock('@/lib/cdn/api', () => ({
  uploadImage: vi.fn(),
}));

vi.mock('../notion', () => ({
  extractImageUrl: vi.fn((image) => image?.external?.url ?? image?.file?.url ?? null),
}));

import { getCachedImage, setCachedImage } from '@/lib/cdn/cache';
import { uploadImage } from '@/lib/cdn/api';
import { processImageBlocks } from '@/lib/cdn/processor';

const mockCaption = [
  {
    type: 'text' as const,
    text: { content: 'A test caption', link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default' as const,
    },
    plain_text: 'A test caption',
    href: null,
  },
];

function createImageBlock(id: string, url: string): ImageBlock {
  return {
    object: 'block',
    id,
    type: 'image',
    created_time: '2024-01-01T00:00:00.000Z',
    last_edited_time: '2024-01-01T00:00:00.000Z',
    has_children: false,
    archived: false,
    parent: { type: 'page_id', page_id: 'page-1' },
    image: {
      type: 'external',
      external: { url },
      name: 'test-image',
      caption: mockCaption,
    },
  };
}

describe('processImageBlocks — caption preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(setCachedImage).mockResolvedValue(undefined);
  });

  it('preserves caption when image is served from cache', async () => {
    const block = createImageBlock('block-1', 'https://notion.so/original.png');

    vi.mocked(getCachedImage).mockResolvedValue({
      blockId: 'block-1',
      lastEditedTime: '2024-01-01T00:00:00.000Z',
      cdnUrl: 'https://cdn.example.com/cached.webp',
      uploadedAt: '2024-01-01T00:00:00.000Z',
    });

    await processImageBlocks([block]);

    expect(block.image.caption).toEqual(mockCaption);
    expect(block.image.type).toBe('external');
    expect(block.image.external?.url).toBe('https://cdn.example.com/cached.webp');
  });

  it('preserves caption after a successful upload to CDN', async () => {
    const block = createImageBlock('block-2', 'https://notion.so/original.png');

    vi.mocked(getCachedImage).mockResolvedValue(null);
    vi.mocked(uploadImage).mockResolvedValue({
      success: true,
      cdnUrl: 'https://cdn.example.com/uploaded.webp',
      fromCache: false,
    });

    await processImageBlocks([block]);

    expect(block.image.caption).toEqual(mockCaption);
    expect(block.image.type).toBe('external');
    expect(block.image.external?.url).toBe('https://cdn.example.com/uploaded.webp');
  });

  it('preserves name alongside caption in both paths', async () => {
    const block = createImageBlock('block-3', 'https://notion.so/original.png');

    vi.mocked(getCachedImage).mockResolvedValue({
      blockId: 'block-3',
      lastEditedTime: '2024-01-01T00:00:00.000Z',
      cdnUrl: 'https://cdn.example.com/cached.webp',
      uploadedAt: '2024-01-01T00:00:00.000Z',
    });

    await processImageBlocks([block]);

    expect(block.image.name).toBe('test-image');
    expect(block.image.caption).toEqual(mockCaption);
  });
});
