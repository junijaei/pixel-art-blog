import nextPlugin from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'dist/**', '.storybook/**'],
  },
  ...nextPlugin,
  ...tseslint.configs.recommended,
  ...prettierConfig,
  ...reactHooks.configs['recommended-latest'],
  ...reactRefresh.configs.vite,
  {
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      prettierConfig,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@next/next/no-html-link-for-pages': 'off',
      'react/no-unescaped-entities': 'warn',
      'import/no-anonymous-default-export': 'warn',
      'prettier/prettier': 'error',
    },
  },
];
