import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { config } from 'dotenv';
import svgr from 'vite-plugin-svgr';
import mime from 'mime-types';
import fs from 'fs';
import { visualizer } from 'rollup-plugin-visualizer';

// Load environment variables from .env file
config();

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    {
      name: 'inline-assets-in-dev',
      enforce: 'pre',
      apply: 'serve', // Apply only in development mode
      async load(id: string) {
        // Check if the import includes '?inline'
        if (id.includes('?inline')) {
          // Separate the file path and query
          const [filePath] = id.split('?');
          try {
            // Read the file content
            const fileContent = await fs.promises.readFile(filePath);
            // Get the MIME type
            const mimeType = mime.lookup(filePath) || 'application/octet-stream';
            // Convert to base64
            const base64 = fileContent.toString('base64');
            // Return as a data URL
            return `export default 'data:${mimeType};base64,${base64}';`;
          } catch (error) {
            // If there's an error reading the file, return null to defer to other plugins
            console.error(error);
            return null;
          }
        }
        // For other files, fallback to default behavior
        return null;
      },
    },
    // Serve assets-cdn/ locally in dev when VITE_CDN_URL defaults to localhost
    {
      name: 'serve-assets-cdn-in-dev',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use('/assets-cdn', (req, res, next) => {
          const filePath = path.join(__dirname, 'assets-cdn', req.url || '');
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', mime.lookup(filePath) || 'application/octet-stream');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      },
    },
    tailwindcss(),
    react(),
    svgr({
      svgrOptions: {},
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@public': path.resolve(__dirname, './public'),
      '@types': path.resolve(__dirname, './src/types.ts'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@preact/signals-react': path.resolve(__dirname, './src/shims/signals-react'),
      '@preact/signals-react/runtime': path.resolve(__dirname, './src/shims/signals-react/runtime'),
    },
  },
  define: {
    // Pick out the environment variables we need
    'process.env': {
      ENV: process.env.ENV,
    },
  },
  build: {
    assetsInlineLimit: 100 * 1024, // 100 KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Bundle all image/JSON assets (from anywhere in src/) into a separate chunk
          if (/\.(png|jpe?g|webp|gif|svg|avif|json)(\?.*)?$/i.test(id) && id.includes('/src/')) {
            return 'assets';
          }
          if (id.includes('/src/assets/')) {
            return 'assets';
          }
        },
      },
      plugins: [
        ...(process.env.ANALYSE
          ? [
              visualizer({
                open: true,
                filename: 'bundle-stats.html',
                gzipSize: true,
                template: 'treemap',
              }),
            ]
          : []),
      ],
    },
  },
});
