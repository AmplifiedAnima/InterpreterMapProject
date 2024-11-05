import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows the server to be accessible from external networks
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000, // Use the PORT environment variable from Heroku
  },
});
