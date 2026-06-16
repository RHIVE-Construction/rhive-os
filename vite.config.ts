
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vite plugin that exposes a /api/config endpoint during LOCAL DEV ONLY.
 * This serves the Google Maps key to prevent it being bundled into JS.
 *
 * NOTE: This middleware does NOT run in production.
 * In production (Firebase App Hosting), the Maps key is injected by Vite
 * via import.meta.env.VITE_GOOGLE_MAPS_API_KEY at build time from Secret Manager.
 *
 * The Gemini key uses import.meta.env.VITE_GEMINI_API_KEY directly —
 * injected from Secret Manager at build time, never stored in git.
 */
function configApiPlugin(mapsApiKey: string): Plugin {
  const handler = (req: any, res: any, next: any) => {
    if (req.url === '/api/config') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
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
      'process.env.VITE_GOOGLE_WEATHER_API_KEY': JSON.stringify(env.VITE_GOOGLE_WEATHER_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
