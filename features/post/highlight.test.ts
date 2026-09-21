import { codeHighlighter, highlightCode, resolveLanguage } from '@/features/post/highlight';
import { describe, expect, it } from 'vitest';

describe('resolveLanguage', () => {
  it("Notion의 'plain text'를 plaintext로 바꾼다", () => {
    expect(resolveLanguage('plain text')).toBe('plaintext');
  });

  it('대소문자와 공백을 정규화한다', () => {
    expect(resolveLanguage('  TypeScript ')).toBe('typescript');
  });

  it('근사 매핑을 적용한다', () => {
    expect(resolveLanguage('c')).toBe('cpp');
    expect(resolveLanguage('scss')).toBe('css');
  });

  it('내장 alias는 그대로 통과시킨다', () => {
    expect(codeHighlighter.normalizeLanguage(resolveLanguage('bash'))).toBe('shell');
    expect(codeHighlighter.normalizeLanguage(resolveLanguage('javascript'))).toBe('js');
    expect(codeHighlighter.normalizeLanguage(resolveLanguage('yml'))).toBe('yaml');
  });
});

describe('highlightCode', () => {
  it('언어를 data-language로 노출한다', () => {
    expect(highlightCode('const x = 1;', 'typescript')).toContain('data-language="ts"');
  });

  it('미지원 언어는 plaintext로 폴백한다', () => {
    expect(highlightCode('fn main() {}', 'rust')).toContain('data-language="plaintext"');
  });

  it('기본적으로 줄 번호용 data-line을 붙인다', () => {
    expect(highlightCode('a\nb', 'plain text')).toContain('data-line="2"');
  });

  it('lineNumbers: false면 줄 래퍼를 만들지 않는다', () => {
    const html = highlightCode('a\nb', 'plain text', { lineNumbers: false });

    expect(html).not.toContain('th-line');
  });

  it('인라인 style을 쓰지 않는다 (색상은 CSS 변수)', () => {
    expect(highlightCode('const x = 1;', 'typescript')).not.toContain('style=');
  });

  it('원본 코드를 손실 없이 복원할 수 있다', () => {
    const code = 'const s = "a < b && c > d";\n// 한글 주석\n';
    const { tokens } = codeHighlighter.tokenize(code, { lang: 'ts' });

    expect(tokens.map((token) => token.value).join('')).toBe(code);
  });
});
