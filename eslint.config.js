import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import jsonFiles from 'eslint-plugin-json-files'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.json'],
    ignores: [
      'package.json',
      'package-lock.json',
      'tsconfig*.json',
      'components.json',
    ],
    plugins: { 'json-files': jsonFiles },
    rules: {
      'json-files/sort-keys': 'warn',
    },
  },
])
