import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['**/package-lock.json', 'dist', 'coverage']),

  // 1. JavaScript / React Config
  {
    files: ['**/*.{js,jsx}'],
    // Apply recommended rules by spreading only the rules objects to avoid key collisions
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.flat['recommended-latest'].rules,
      ...reactRefreshPlugin.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...unicornPlugin.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      ...security.configs.recommended.rules,

      // Custom Overrides
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',

      // --- Perfectionist: Sorting ---
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          newlinesBetween: 0,
        },
      ],

      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      unicorn: unicornPlugin,
      sonarjs: sonarjs,
      'jsx-a11y': jsxA11y,
      perfectionist: perfectionist,
      security: security,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
  },

  // 2. JSON Config
  {
    files: ['**/*.json'],
    language: 'json/json',
    ...json.configs.recommended,
  },

  // 3. CSS Config
  {
    files: ['**/*.css'],
    language: 'css/css',
    ...css.configs.recommended,
  },

  {
    files: ['eslint.config.js'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },

  // 4. Prettier (Must be last to override other rules)
  prettierPluginRecommended,
]);
