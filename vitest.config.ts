import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'components/**/*.test.tsx'],
    // lib/env.ts treats a "dummy" DATABASE_URL as build-time and fills placeholder values.
    env: { DATABASE_URL: 'postgresql://user:pass@localhost:5432/dummy' },
  },
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: { '@': path.resolve(__dirname) },
  },
});
