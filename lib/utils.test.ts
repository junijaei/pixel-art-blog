import { calculateReadingTime, cn, extractHeadings, formatRelativeTime, slugify } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle conditional classes', () => {
    // eslint-disable-next-line no-constant-binary-expression
    expect(cn('text-base', false && 'text-lg', 'font-bold')).toBe('text-base font-bold');
  });
});

describe('formatRelativeTime', () => {
  it('should return "오늘" for today', () => {
    const today = new Date();
    expect(formatRelativeTime(today)).toBe('오늘');
  });

  it('should return "어제" for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatRelativeTime(yesterday)).toBe('어제');
  });

  it('should return "N일 전" for days within a week', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    expect(formatRelativeTime(threeDaysAgo)).toBe('3일 전');
  });

  it('should return "N주 전" for weeks within a month', () => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    expect(formatRelativeTime(twoWeeksAgo)).toBe('2주 전');
  });

  it('should return "N개월 전" for months within a year', () => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
    expect(formatRelativeTime(twoMonthsAgo)).toBe('2개월 전');
  });

  it('should return "N년 전" for years', () => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    expect(formatRelativeTime(twoYearsAgo)).toBe('2년 전');
  });

  it('should handle string dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatRelativeTime(yesterday.toISOString())).toBe('어제');
  });
});

describe('slugify', () => {
  it('should convert to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('React Query 캐싱 전략')).toBe('react-query-캐싱-전략');
  });

  it('should remove special characters except Korean', () => {
    expect(slugify('Hello! @World# 안녕?')).toBe('hello-world-안녕');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('foo    bar')).toBe('foo-bar');
  });

  it('should trim leading/trailing hyphens', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('should handle Korean text', () => {
    expect(slugify('타입스크립트 제네릭')).toBe('타입스크립트-제네릭');
  });
});

describe('calculateReadingTime', () => {
  it('should calculate reading time for short text', () => {
    const text = 'word '.repeat(50); // 50 words
    expect(calculateReadingTime(text)).toBe('1 min');
  });

  it('should calculate reading time for longer text', () => {
    const text = 'word '.repeat(500); // 500 words
    expect(calculateReadingTime(text)).toBe('3 min');
  });

  it('should round up to nearest minute', () => {
    const text = 'word '.repeat(201); // 201 words
    expect(calculateReadingTime(text)).toBe('2 min');
  });

  it('should handle custom words per minute', () => {
    const text = 'word '.repeat(400); // 400 words
    expect(calculateReadingTime(text, 100)).toBe('4 min');
  });

  it('should handle empty content', () => {
    expect(calculateReadingTime('')).toBe('0 min');
  });
});

describe('extractHeadings', () => {
  it('should extract h2 headings', () => {
    const content = '## Introduction\nSome text\n## Conclusion';
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(2);
    expect(headings[0]).toEqual({
      id: 'introduction',
      text: 'Introduction',
      level: 2,
    });
  });

  it('should extract h3 headings', () => {
    const content = '### Subsection\nSome text';
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
    expect(headings[0]).toEqual({
      id: 'subsection',
      text: 'Subsection',
      level: 3,
    });
  });

  it('should extract mixed h2 and h3 headings', () => {
    const content = `
## Main Topic
### Subtopic 1
### Subtopic 2
## Another Topic
`;
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(4);
    expect(headings[0].level).toBe(2);
    expect(headings[1].level).toBe(3);
  });

  it('should ignore h1 headings', () => {
    const content = '# Title\n## Section\n### Subsection';
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(2);
    expect(headings.every((h) => h.level >= 2)).toBe(true);
  });

  it('should handle Korean headings', () => {
    const content = '## 소개\n### 서브섹션';
    const headings = extractHeadings(content);
    expect(headings[0]).toEqual({
      id: '소개',
      text: '소개',
      level: 2,
    });
  });

  it('should return empty array for no headings', () => {
    const content = 'Just some text without headings';
    const headings = extractHeadings(content);
    expect(headings).toEqual([]);
  });
});
