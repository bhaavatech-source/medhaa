export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxg_2A1n7OjZBOngzja8cywD3LBwyX0dCyhqwPiq3rrcoxK-Ili8CV51vX4SLvio7x2cA/exec";

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@medhaa/ui': '../packages/ui/src',
    },
  },
});
