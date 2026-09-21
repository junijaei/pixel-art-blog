/*
 * 출력 마크업에는 색상이 없다. 토큰은 `--th-*` CSS 변수를 참조하는 클래스만 달고
 * 나오므로, 실제 팔레트는 app/globals.css의 `.code-block`에 있다.
 */

import type { LanguageDefinition } from '@tanstack/highlight/core';
import { createHighlighter, escapeHtml } from '@tanstack/highlight/core';
import { cpp } from '@tanstack/highlight/languages/cpp';
import { css } from '@tanstack/highlight/languages/css';
import { diff } from '@tanstack/highlight/languages/diff';
import { dockerfile } from '@tanstack/highlight/languages/dockerfile';
import { go } from '@tanstack/highlight/languages/go';
import { html } from '@tanstack/highlight/languages/html';
import { http } from '@tanstack/highlight/languages/http';
import { js } from '@tanstack/highlight/languages/js';
import { json } from '@tanstack/highlight/languages/json';
import { jsx } from '@tanstack/highlight/languages/jsx';
import { markdown } from '@tanstack/highlight/languages/markdown';
import { php } from '@tanstack/highlight/languages/php';
import { plaintext } from '@tanstack/highlight/languages/plaintext';
import { python } from '@tanstack/highlight/languages/python';
import { scheme } from '@tanstack/highlight/languages/scheme';
import { shell } from '@tanstack/highlight/languages/shell';
import { sql } from '@tanstack/highlight/languages/sql';
import { toml } from '@tanstack/highlight/languages/toml';
import { ts } from '@tanstack/highlight/languages/ts';
import { tsx } from '@tanstack/highlight/languages/tsx';
import { vue } from '@tanstack/highlight/languages/vue';
import { yaml } from '@tanstack/highlight/languages/yaml';

// 각 정의가 자기 alias까지 등록한다. `javascript`/`bash`/`py`/`yml`/`md` 등이
// LANGUAGE_ALIASES에 없는 이유.
const LANGUAGES: ReadonlyArray<LanguageDefinition> = [
  cpp,
  css,
  diff,
  dockerfile,
  go,
  html,
  http,
  js,
  json,
  jsx,
  markdown,
  php,
  plaintext,
  python,
  scheme,
  shell,
  sql,
  toml,
  ts,
  tsx,
  vue,
  yaml,
];

export const codeHighlighter = createHighlighter({
  fallbackLanguage: 'plaintext',
  languages: LANGUAGES,
});

// 내장 alias로 해결되지 않는 Notion 언어 이름만 보정한다.
const LANGUAGE_ALIASES: Record<string, string> = {
  'plain text': 'plaintext',
  c: 'cpp', // 근사 매핑: 전용 정의가 없어 유사 언어로 대체
  less: 'css', // 근사 매핑
  sass: 'css', // 근사 매핑
  scss: 'css', // 근사 매핑
};

export function resolveLanguage(language: string): string {
  const key = language.trim().toLowerCase();
  return LANGUAGE_ALIASES[key] ?? key;
}

export type HighlightCodeOptions = {
  /** 줄 번호 CSS가 읽는 `data-line` 속성을 생성한다. 끄면 줄 번호가 사라진다. */
  lineNumbers?: boolean;
};

export function highlightCode(code: string, language: string, options: HighlightCodeOptions = {}): string {
  const { lineNumbers = true } = options;

  try {
    return codeHighlighter.highlightToHtml(code, {
      lang: resolveLanguage(language),
      lineNumbers,
    });
  } catch (error) {
    console.error('Code highlighting error:', error);
    return `<pre class="th-code"><code>${escapeHtml(code)}</code></pre>`;
  }
}
