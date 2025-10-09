/* eslint-disable no-undef */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'unused-imports', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    // Keep this last to turn off rules Prettier covers:
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: true, // respects tsconfig paths
      node: true,
    },
  },
  rules: {
    /* --- general hygiene --- */
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
    'eol-last': ['error', 'always'],
    eqeqeq: ['error', 'smart'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    /* --- imports: order & de-dupe --- */
    'import/no-duplicates': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/order': [
      'error',
      {
        // Order by location, keep type imports in their own group:
        groups: [
          'builtin', // fs, path, etc.
          'external', // react, zustand, etc.
          'internal', // your aliases like @/...
          'parent', // ../*
          'sibling', // ./*
          'index', // ./
          'type', // <-- all `import type` here
        ],
        'newlines-between': 'always', // blank line between groups
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroupsExcludedImportTypes: ['type'],
      },
    ],
    // Sort the *members* (named imports) alphabetically
    // while letting import/order control the statements themselves.
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true, // let import/order handle declaration order
        allowSeparatedGroups: true,
      },
    ],

    /* --- TypeScript niceties --- */
    // Enforce `import type { Foo } from '...'` for types
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    '@typescript-eslint/consistent-type-exports': 'error',

    // Prefer this plugin over the base no-unused-vars for TS
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',

    // Catches forgotten awaits etc.
    '@typescript-eslint/no-floating-promises': 'error',
  },
}
