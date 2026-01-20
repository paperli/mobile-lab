import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true, // Expose to network
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+3-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+3.pem')),
    },
  },
});
