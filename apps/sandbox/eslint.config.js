import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import svelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

export default tseslint.config(
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
);
