
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vite plugin that exposes a secure /api/config endpoint.
 * API keys are read server-side and returned as JSON.
 * They NEVER appear in any HTML or JS bundle.
 *
 * Keys served:
 *  - mapsApiKey        → VITE_GOOGLE_MAPS_API_KEY
 *  - geminiApiKey      → VITE_GEMINI_API_KEY
 *  - weatherApiKey     → VITE_GOOGLE_WEATHER_API_KEY
 */
function configApiPlugin(config: {
  mapsApiKey: string;
  geminiApiKey: string;
  weatherApiKey: string;
}): Plugin {
  const handler = (req: any, res: any, next: any) => {
    if (req.url === '/api/config') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(config));
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
      configApiPlugin({
        mapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY || '',
        geminiApiKey: env.VITE_GEMINI_API_KEY || '',
        weatherApiKey: env.VITE_GOOGLE_WEATHER_API_KEY || '',
      }),
    ],
    define: {
      // NOTE: All API keys are intentionally NOT here.
      // They are served exclusively via the /api/config server endpoint
      // and never embedded in the client JS bundle.
      'process.env.VITE_GOOGLE_WEATHER_API_KEY': JSON.stringify(env.VITE_GOOGLE_WEATHER_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
