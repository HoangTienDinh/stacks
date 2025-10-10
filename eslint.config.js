// eslint.config.js — ESLint v9 flat config (no type-aware linting)

import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  // Ignore built output and config files
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '.yarn/**',
      '.pnpm-store/**',
      // common config files that shouldn't be linted
      'eslint.config.js',
      'vite.config.*',
      'tailwind.config.*',
      'postcss.config.*',
    ],
  },

  // Base JS recommended
  js.configs.recommended,

  // TypeScript (non-type-checked for speed/simplicity)
  ...tseslint.configs.recommended,

  // Project-wide settings and shared rules
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    settings: {
      // respect TS path aliases + node resolution
      'import/resolver': {
        typescript: true,
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
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type', // keep type imports grouped
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroupsExcludedImportTypes: ['type'],
        },
      ],
      // Sort named members within each import
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true, // let import/order handle statement order
          allowSeparatedGroups: true,
        },
      ],

      /* --- React Hooks --- */
      ...reactHooks.configs.recommended.rules,

      /* --- TypeScript rules that DO NOT require type info --- */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],

      // Turn OFF rules that require type info (will re-enable in typed config below)
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  // TS-only file targeting (add TS-only tweaks here if needed)
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // keep space for TS-only non-typed rules if you add any later
    },
  },
]
