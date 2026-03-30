import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-upload-api',
      configureServer(server) {
        server.middlewares.use('/api/upload', (req, res, next) => {
          if (req.method === 'POST') {
            req.on('data', () => { });
            req.on('end', () => {
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true }));
            });
            return;
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: true
  }
});

