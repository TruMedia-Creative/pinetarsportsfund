import { createConfigForNuxt } from '@nuxt/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default createConfigForNuxt().append(
  // Disables all ESLint formatting rules that Prettier already owns
  eslintConfigPrettier,
  // Structural/Vue rules that Prettier doesn't touch — kept after Prettier block
  {
    rules: {
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  }
);
