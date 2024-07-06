import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000,
    mockReset: true,
    clearMocks: true,
    globals: true,
    coverage: {
      exclude: ['html/assets/**', 'src/index.ts', 'src/models/**', '**/*.seed.ts'],
      enabled: true,
      thresholds: {
        branches: 75,
        functions: 75,
        lines: 75,
        statements: 75,
      },
    },
  },
});
