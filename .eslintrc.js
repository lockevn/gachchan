module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  // extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  // browserslist: ["> 1%", "last 2 versions", "not dead"],

  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-undef': 'warn',
    'no-unexpected-multiline': 'warn',

    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-inner-declarations': 'off',
    'no-control-regex': 'warn',
    'no-prototype-builtins': 'warn',
    // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
