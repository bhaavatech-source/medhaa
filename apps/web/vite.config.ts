import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        faqs: fileURLToPath(new URL('./FAQs.html', import.meta.url)),
        feedback: fileURLToPath(new URL('./medhaa-feedback.html', import.meta.url)),
      },
    },
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@medhaa/ui': '../../packages/ui/src',
    },
  },
});