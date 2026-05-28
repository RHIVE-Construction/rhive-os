
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vite plugin that exposes a secure /api/config endpoint.
 * The Google Maps API key is read from process.env server-side
 * and returned as JSON — it never appears in any HTML or JS bundle.
 */
function configApiPlugin(mapsApiKey: string): Plugin {
  const handler = (req: any, res: any, next: any) => {
    if (req.url === '/api/config') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store'); // Never cache — secrets shouldn't be cached
      res.end(JSON.stringify({ mapsApiKey }));
    } else {
      next();
    }
  };

  return {
    name: 'config-api',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      configApiPlugin(env.VITE_GOOGLE_MAPS_API_KEY || ''),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_GOOGLE_WEATHER_API_KEY': JSON.stringify(env.VITE_GOOGLE_WEATHER_API_KEY),
      // NOTE: VITE_GOOGLE_MAPS_API_KEY is intentionally NOT here.
      // It is served exclusively via the /api/config backend endpoint.
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
