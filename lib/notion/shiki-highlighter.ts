import type { BundledLanguage } from 'shiki';
import { createHighlighter } from 'shiki';

let highlighterInstance: Awaited<ReturnType<typeof createHighlighter>> | null = null;

/**
 * Shiki highlighter 싱글톤 인스턴스 가져오기
 * 모노크롬 디자인에 맞는 테마 설정
 */
export async function getShikiHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['vitesse-dark', 'vitesse-light'],
      langs: [
        'javascript',
        'typescript',
        'python',
        'java',
        'go',
        'rust',
        'cpp',
        'c',
        'csharp',
        'php',
        'ruby',
        'swift',
        'kotlin',
        'html',
        'css',
        'scss',
        'json',
        'yaml',
        'markdown',
        'bash',
        'shell',
        'sql',
        'graphql',
        'vue',
        'jsx',
        'tsx',
      ],
    });
  }
  return highlighterInstance;
}

/**
 * 코드를 Shiki로 하이라이팅
 * @param code - 하이라이팅할 코드
 * @param language - 언어 (Notion API 형식)
 * @param isDark - 다크모드 여부
 * @returns HTML 문자열
 */
export async function highlightCode(code: string, language: string, isDark = false): Promise<string> {
  const highlighter = await getShikiHighlighter();

  // Notion 언어명을 Shiki 언어명으로 매핑
  const langMap: Record<string, BundledLanguage> = {
    'plain text': 'text' as BundledLanguage,
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    go: 'go',
    rust: 'rust',
    'c++': 'cpp',
    c: 'c',
    'c#': 'csharp',
    php: 'php',
    ruby: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    yaml: 'yaml',
    markdown: 'markdown',
    bash: 'bash',
    shell: 'shell',
    sql: 'sql',
    graphql: 'graphql',
    vue: 'vue',
    jsx: 'jsx',
    tsx: 'tsx',
  };

  const shikiLang = langMap[language.toLowerCase()] || 'text';
  const theme = isDark ? 'vitesse-dark' : 'vitesse-light';

  try {
    const html = highlighter.codeToHtml(code, {
      lang: shikiLang,
      theme,
    });
    return html;
  } catch (error) {
    console.error('Shiki highlighting error:', error);
    // Fallback to plain text
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
