import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue,
    },
    rules: {
      quotes: ['error', 'single'],
      indent: ['error', 2, { SwitchCase: 1 }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'arrow-parens': ['error', 'always'],

      // 標準ESLintで有効なキーワードのみを使用
      'padding-line-between-statements': [
        'error',
        // 1. 関数（function）の前後には必ず1行空ける
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },

        // 2. 複数行のブロック（if / for / switch / try など）の前後には1行空ける
        // { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
        { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
      ],
    },
  },
];
