import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      quotes: ['error', 'single'],
      'no-console': 'error',
      'func-names': 'off',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'no-undef': ['error'],
      'padding-line-between-statements': ['error', { blankLine: 'never', prev: 'export', next: 'export' }],
    },
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  { files: ['index.js'], rules: { 'no-console': 'off' } },
];
