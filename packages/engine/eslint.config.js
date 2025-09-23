import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

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
);
