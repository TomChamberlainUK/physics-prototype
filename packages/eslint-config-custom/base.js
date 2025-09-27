import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  js.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    semi: true,
    quotes: 'single',
    jsx: false,
  }),
  tseslint.configs.recommended,
]);
