import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

export default defineConfig(
  js.configs.recommended,
  {
    ignores: ['src/*'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/*'],
    languageOptions: { globals: globals.browser },
  },
  stylistic.configs.customize({
    indent: 2,
    semi: true,
    quotes: 'single',
    jsx: false,
  }),
  tseslint.configs.recommended,
  svelte.configs.recommended,
  {
    files: ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: tseslint.parser,
        svelteConfig,
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['dist'],
  },
);
