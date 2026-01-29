/**
 * Shiki Code Highlighter - Server only
 */

import type { BundledLanguage } from 'shiki';
import { createHighlighter } from 'shiki';

let highlighterInstance: Awaited<ReturnType<typeof createHighlighter>> | null = null;

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

export async function highlightCode(code: string, language: string, isDark = false): Promise<string> {
  const highlighter = await getShikiHighlighter();

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
    return highlighter.codeToHtml(code, { lang: shikiLang, theme });
  } catch (error) {
    console.error('Shiki highlighting error:', error);
    return `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  }
}
