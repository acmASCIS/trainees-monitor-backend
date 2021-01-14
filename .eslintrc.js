module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: 'tsconfig.json',
    sourceType: 'module',
    createDefaultProgram: true,
  },
  plugins: [
    'eslint-plugin-no-null',
    'eslint-plugin-jsdoc',
    'eslint-plugin-import',
    'eslint-plugin-prefer-arrow',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/ban-types': 'off',
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['node_modules/**', 'dist/**/*.js'],
};
