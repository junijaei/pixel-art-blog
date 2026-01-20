import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock shiki highlighter for testing (나머지는 실제 모듈 사용)
vi.mock('@/lib/notion/util/shiki-highlighter', () => ({
  highlightCode: vi.fn(async (code: string) => {
    return `<pre><code>${code}</code></pre>`;
  }),
  getShikiHighlighter: vi.fn(),
}));
