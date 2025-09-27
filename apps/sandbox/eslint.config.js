import { defineConfig } from 'eslint/config';
import { svelte } from 'eslint-config-custom';
import svelteConfig from './svelte.config.js';

export default defineConfig(
  ...svelte,
  {
    files: ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        svelteConfig,
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            '*.js',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
