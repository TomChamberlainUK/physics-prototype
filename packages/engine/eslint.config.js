import { defineConfig } from 'eslint/config';
import { browser } from 'eslint-config-custom';

export default defineConfig([
  ...browser,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            '*.js',
            'vitest.config.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
