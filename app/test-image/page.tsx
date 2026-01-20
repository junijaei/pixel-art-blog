/**
 * Image Block 테스트 페이지
 *
 * 개발 환경에서 ImageBlock 컴포넌트를 테스트하기 위한 페이지
 * localhost:3000/test-image 에서 확인 가능
 */

import { BlockRenderer } from '@/components/notion-blocks';
import type { Block, ImageBlock } from '@/types/notion';

export default function TestImagePage() {
  // 테스트용 ImageBlock 생성
  const testBlocks: Block[] = [
    {
      object: 'block',
      id: 'test-image-1',
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: '/placeholder-image.png',
        },
        name: 'Example image without caption',
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    } as ImageBlock,
    {
      object: 'block',
      id: 'test-paragraph-1',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: 'This is a paragraph between images.', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a paragraph between images.',
            href: null,
          },
        ],
        color: 'default',
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    },
    {
      object: 'block',
      id: 'test-image-2',
      type: 'image',
      image: {
        type: 'external',
        external: {
          url: '/placeholder-image.png',
        },
        name: 'Example image with caption',
        caption: [
          {
            type: 'text',
            text: { content: 'This is a caption with ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'This is a caption with ',
            href: null,
          },
          {
            type: 'text',
            text: { content: 'bold text', link: null },
            annotations: {
              bold: true,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'bold text',
            href: null,
          },
          {
            type: 'text',
            text: { content: ' and a ', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: ' and a ',
            href: null,
          },
          {
            type: 'text',
            text: { content: 'link', link: { url: 'https://example.com' } },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'link',
            href: 'https://example.com',
          },
        ],
      },
      parent: {
        type: 'page_id',
        page_id: 'test-page',
      },
      created_time: '2024-01-01T00:00:00.000Z',
      last_edited_time: '2024-01-01T00:00:00.000Z',
      has_children: false,
      archived: false,
    } as ImageBlock,
  ];

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">Image Block Test Page</h1>

      <div className="mb-8 rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          This page demonstrates the ImageBlock component rendering.
          <br />
          In development mode, all images use the placeholder.
        </p>
      </div>

      <div className="space-y-4">
        <BlockRenderer blocks={testBlocks} />
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
        <h2 className="mb-2 font-bold">Features tested:</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Image without caption</li>
          <li>Paragraph between images</li>
          <li>Image with styled caption (bold + link)</li>
          <li>Lazy loading</li>
          <li>Responsive sizing</li>
        </ul>
      </div>
    </main>
  );
}
