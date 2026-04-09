import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#1f2937',
            '[class~="lead"]': {
              color: '#6b7280',
            },
            strong: {
              color: '#111827',
            },
            'ol > li::before': {
              color: '#9ca3af',
            },
            'ul > li::before': {
              backgroundColor: '#d1d5db',
            },
            hr: {
              borderColor: '#e5e7eb',
            },
            blockquote: {
              color: '#6b7280',
              borderLeftColor: '#e5e7eb',
            },
            h1: {
              color: '#111827',
            },
            h2: {
              color: '#1f2937',
            },
            h3: {
              color: '#374151',
            },
            h4: {
              color: '#4b5563',
            },
            'figure figcaption': {
              color: '#6b7280',
            },
            code: {
              color: '#e5e7eb',
              backgroundColor: '#1f2937',
            },
            'a code': {
              color: '#60a5fa',
            },
            pre: {
              color: '#e5e7eb',
              backgroundColor: '#1f2937',
            },
            thead: {
              color: '#111827',
              borderBottomColor: '#d1d5db',
            },
            'tbody tr': {
              borderBottomColor: '#e5e7eb',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
} satisfies Config
