// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://joe-jns.github.io',
  base: '/cxl-portfolio',
  vite: {
    // @ts-ignore — vite version mismatch between @tailwindcss/vite and astro bundled vite
    plugins: [tailwindcss()],
  },
});
