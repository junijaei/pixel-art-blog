import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock shiki for testing
vi.mock('@/lib/notion', () => ({
  highlightCode: vi.fn(async (code: string) => {
    return `<pre><code>${code}</code></pre>`;
  }),
  getShikiHighlighter: vi.fn(),
}));
