import { defineConfig } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';
import browser from './browser.js';

export default defineConfig([
  ...browser,
  svelte.configs.recommended,
  {
    files: ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: tseslint.parser,
      },
    },
  },
  {
    ignores: ['dist'],
  },
]);
