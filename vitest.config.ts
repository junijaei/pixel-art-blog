import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    // Notion 속도 제한은 단위 테스트의 대상이 아니다. 끄지 않으면 호출 하나마다 실제로 대기한다.
    // throttle.test.ts는 자기 테스트 안에서 이 값을 직접 덮어쓴다.
    env: {
      NOTION_RATE_LIMIT_PER_SECOND: '10000',
      NOTION_MAX_CONCURRENT: '10000',
    },
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
