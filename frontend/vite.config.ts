import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      uuid: 'uuid/dist/esm-browser/index.js',
    },
  },
  server: {
    allowedHosts: [
      'ffcf-2a01-e0a-1ff-b170-5c51-6cdf-af84-634e.ngrok-free.app',
      '784a-2a01-e0a-1ff-b170-5c51-6cdf-af84-634e.ngrok-free.app'
    ],
  },
});