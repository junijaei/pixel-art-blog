import { describe, it, expect } from 'vitest';
import { getColorClass } from './color-utils';

describe('getColorClass', () => {
  describe('text variant', () => {
    it('default color는 빈 문자열을 반환한다', () => {
      expect(getColorClass('default', 'text')).toBe('');
      expect(getColorClass(undefined, 'text')).toBe('');
    });

    it('gray 색상을 올바르게 변환한다', () => {
      expect(getColorClass('gray', 'text')).toBe('text-neutral-700 dark:text-neutral-400');
    });

    it('brown 색상을 올바르게 변환한다', () => {
      expect(getColorClass('brown', 'text')).toBe('text-amber-800 dark:text-amber-400');
    });

    it('orange 색상을 올바르게 변환한다', () => {
      expect(getColorClass('orange', 'text')).toBe('text-orange-700 dark:text-orange-400');
    });

    it('모든 표준 색상을 지원한다', () => {
      const colors = ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'];
      colors.forEach((color) => {
        const result = getColorClass(color, 'text');
        expect(result).toBeTruthy();
        expect(result).toContain('text-');
        expect(result).toContain('dark:text-');
      });
    });

    it('알 수 없는 색상은 빈 문자열을 반환한다', () => {
      expect(getColorClass('unknown-color', 'text')).toBe('');
    });
  });

  describe('background variant', () => {
    it('default color는 빈 문자열을 반환한다', () => {
      expect(getColorClass('default', 'background')).toBe('');
      expect(getColorClass(undefined, 'background')).toBe('');
    });

    it('gray 배경 색상을 올바르게 변환한다', () => {
      expect(getColorClass('gray', 'background')).toBe(
        'bg-muted/50 border-muted-foreground/20 dark:bg-muted/30 dark:border-muted-foreground/10'
      );
    });

    it('blue 배경 색상을 올바르게 변환한다', () => {
      expect(getColorClass('blue', 'background')).toBe(
        'bg-blue-50/60 border-blue-300/40 dark:bg-blue-950/20 dark:border-blue-800/30'
      );
    });

    it('orange 배경 색상을 올바르게 변환한다', () => {
      expect(getColorClass('orange', 'background')).toBe(
        'bg-orange-50/60 border-orange-300/40 dark:bg-orange-950/20 dark:border-orange-800/30'
      );
    });

    it('_background 접미사를 처리한다', () => {
      expect(getColorClass('gray_background', 'background')).toBe(
        'bg-muted/50 border-muted-foreground/20 dark:bg-muted/30 dark:border-muted-foreground/10'
      );
      expect(getColorClass('blue_background', 'background')).toBe(
        'bg-blue-50/60 border-blue-300/40 dark:bg-blue-950/20 dark:border-blue-800/30'
      );
    });

    it('알 수 없는 색상은 기본 gray를 반환한다', () => {
      expect(getColorClass('unknown-color', 'background')).toBe(
        'bg-muted/50 border-muted-foreground/20 dark:bg-muted/30 dark:border-muted-foreground/10'
      );
    });
  });

  describe('variant 기본값', () => {
    it('variant를 지정하지 않으면 text를 사용한다', () => {
      expect(getColorClass('gray')).toBe('text-neutral-700 dark:text-neutral-400');
    });
  });
});
