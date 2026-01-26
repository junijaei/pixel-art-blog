import {
  extractBaseColor,
  getBlockBackgroundClass,
  getNotionColorClass,
  isBackgroundColor,
} from '@/lib/notion/util/color-utils';
import { describe, expect, it } from 'vitest';

describe('isBackgroundColor', () => {
  it('_background 접미사가 있으면 true를 반환한다', () => {
    expect(isBackgroundColor('blue_background')).toBe(true);
    expect(isBackgroundColor('gray_background')).toBe(true);
  });

  it('_background 접미사가 없으면 false를 반환한다', () => {
    expect(isBackgroundColor('blue')).toBe(false);
    expect(isBackgroundColor('default')).toBe(false);
  });
});

describe('extractBaseColor', () => {
  it('_background 접미사를 제거한다', () => {
    expect(extractBaseColor('blue_background')).toBe('blue');
    expect(extractBaseColor('gray_background')).toBe('gray');
  });

  it('접미사가 없으면 그대로 반환한다', () => {
    expect(extractBaseColor('blue')).toBe('blue');
    expect(extractBaseColor('gray')).toBe('gray');
  });
});

describe('getNotionColorClass', () => {
  describe('텍스트 색상', () => {
    it('default와 undefined는 빈 문자열을 반환한다', () => {
      expect(getNotionColorClass('default')).toBe('');
      expect(getNotionColorClass(undefined)).toBe('');
    });

    it('텍스트 색상은 text-notion-* 클래스를 반환한다', () => {
      expect(getNotionColorClass('blue')).toBe('text-notion-blue');
      expect(getNotionColorClass('gray')).toBe('text-notion-gray');
      expect(getNotionColorClass('red')).toBe('text-notion-red');
    });

    it('모든 표준 텍스트 색상을 지원한다', () => {
      const colors = ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'];
      colors.forEach((color) => {
        expect(getNotionColorClass(color)).toBe(`text-notion-${color}`);
      });
    });

    it('알 수 없는 색상은 빈 문자열을 반환한다', () => {
      expect(getNotionColorClass('unknown-color')).toBe('');
    });
  });

  describe('배경 색상', () => {
    it('_background 색상은 bg 클래스와 패딩을 반환한다', () => {
      expect(getNotionColorClass('blue_background')).toBe('bg-notion-blue-bg rounded px-1 py-0.5');
      expect(getNotionColorClass('gray_background')).toBe('bg-notion-gray-bg rounded px-1 py-0.5');
    });

    it('모든 표준 배경 색상을 지원한다', () => {
      const colors = ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'];
      colors.forEach((color) => {
        const result = getNotionColorClass(`${color}_background`);
        expect(result).toContain(`bg-notion-${color}-bg`);
        expect(result).toContain('rounded px-1 py-0.5');
      });
    });
  });
});

describe('getBlockBackgroundClass', () => {
  it('default와 undefined는 빈 문자열을 반환한다', () => {
    expect(getBlockBackgroundClass('default')).toBe('');
    expect(getBlockBackgroundClass(undefined)).toBe('');
  });

  it('블록 배경 클래스는 bg와 border를 포함한다', () => {
    expect(getBlockBackgroundClass('blue')).toBe('bg-notion-blue-bg border-notion-blue/20');
    expect(getBlockBackgroundClass('gray')).toBe('bg-notion-gray-bg border-notion-gray/20');
  });

  it('_background 접미사도 처리한다', () => {
    expect(getBlockBackgroundClass('blue_background')).toBe('bg-notion-blue-bg border-notion-blue/20');
  });

  it('알 수 없는 색상은 기본 gray를 반환한다', () => {
    expect(getBlockBackgroundClass('unknown-color')).toBe('bg-notion-gray-bg border-notion-gray/20');
  });
});
