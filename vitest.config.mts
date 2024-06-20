import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['html'],
    coverage: {
      exclude: ['html/assets/**', 'src/models/**', '**/*.seed.ts'],
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
