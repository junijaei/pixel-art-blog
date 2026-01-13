import nextPlugin from 'eslint-config-next';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'dist/**', '.storybook/**'],
  },
  ...nextPlugin,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@next/next/no-html-link-for-pages': 'off',
      'react/no-unescaped-entities': 'warn',
      'import/no-anonymous-default-export': 'warn',
    },
  },
];
