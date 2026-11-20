/** @type {import('stylelint').Config} */
export default {
  plugins: ['@stylistic/stylelint-plugin'],
  // 1. 通常の CSS ファイル用の設定
  rules: {
    '@stylistic/string-quotes': 'double',
    '@stylistic/declaration-block-trailing-semicolon': 'always',
    '@stylistic/declaration-block-semicolon-newline-after': 'always',
    '@stylistic/no-missing-end-of-source-newline': true,
    '@stylistic/no-eol-whitespace': true,
  },
  // 2. SCSS ファイル用の設定（すべて @stylistic/scss/ を付ける）
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      rules: {
        '@stylistic/scss/string-quotes': 'double',
        '@stylistic/scss/declaration-block-trailing-semicolon': 'always',
        '@stylistic/scss/declaration-block-semicolon-newline-after': 'always',
        '@stylistic/scss/no-missing-end-of-source-newline': true,
        '@stylistic/scss/no-eol-whitespace': true,
      },
    },
  ],
};
