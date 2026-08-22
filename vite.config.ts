import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

function staticMpaPreviewPlugin() {
  return {
    name: 'static-mpa-clean-url-preview',
    configurePreviewServer(server: any) {
      server.middlewares.use((req: any, _res: any, next: any) => {
        if (!req.url || req.method !== 'GET') return next();
        const requestUrl = new URL(req.url, 'http://127.0.0.1');
        const pathname = requestUrl.pathname.replace(/\/+$/, '') || '/';
        const acceptsHtml = String(req.headers.accept || '').includes('text/html');
        if (pathname !== '/' && acceptsHtml && !path.posix.extname(pathname)) {
          req.url = `${pathname}/index.html${requestUrl.search}`;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    // Every clean URL must resolve to its generated HTML document.
    appType: 'mpa' as const,
    plugins: [react(), tailwindcss(), staticMpaPreviewPlugin()],
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
