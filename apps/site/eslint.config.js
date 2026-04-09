import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['**/dist/**', '**/.nuxt/**', '**/.output/**', '**/.vercel/**', '**/coverage/**', '--port/**'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ...(js.configs.recommended.languageOptions ?? {}),
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]
