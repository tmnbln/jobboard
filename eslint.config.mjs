import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    },
    rules: {
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'no-tabs': 'error',
      'linebreak-style': ['error', 'unix'],
      'no-trailing-spaces': 'error',
      'semi': ['error', 'always'],
      'one-var': ['error', 'never'],
      'camelcase': ['error', { 'properties': 'always' }],
      'func-style': ['error', 'declaration'],
      'space-before-function-paren': ['error', 'always'],
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      'space-before-blocks': 'error',
      'quotes': ['error', 'single'],
      'eol-last': ['error', 'always']
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
