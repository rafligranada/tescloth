import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin} from 'vite';
import {
  buildRobotsTxt,
  buildSitemapXml,
  extractArticleEntriesFromSource,
  resolveSiteOrigin,
} from './src/utils/sitemap';

function panduotoSitemapPlugin(): Plugin {
  const articlesPath = path.resolve(__dirname, 'src/data/articles.ts');

  const getDynamicOutputs = (overrideOrigin?: string) => {
    const source = fs.readFileSync(articlesPath, 'utf8');
    const articles = extractArticleEntriesFromSource(source);
    const origin = overrideOrigin || resolveSiteOrigin(process.env);
    return {
      sitemapXml: buildSitemapXml(origin, articles),
      robotsTxt: buildRobotsTxt(origin),
    };
  };

  return {
    name: 'panduoto-dynamic-sitemap',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = req.url?.split('?')[0];
        if (urlPath !== '/sitemap.xml' && urlPath !== '/robots.txt') {
          return next();
        }

        const forwardedProto = req.headers['x-forwarded-proto'];
        const proto =
          typeof forwardedProto === 'string'
            ? forwardedProto.split(',')[0].trim()
            : 'http';
        const host = req.headers.host;
        const requestOrigin = host ? `${proto}://${host}` : undefined;
        const envOrigin = resolveSiteOrigin({
          VITE_SITE_URL: process.env.VITE_SITE_URL,
          SITE_URL: process.env.SITE_URL,
        });
        const activeOrigin =
          process.env.VITE_SITE_URL || process.env.SITE_URL
            ? envOrigin
            : requestOrigin || resolveSiteOrigin(process.env);

        const {sitemapXml, robotsTxt} = getDynamicOutputs(activeOrigin);

        if (urlPath === '/sitemap.xml') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(sitemapXml);
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(robotsTxt);
      });
    },
    generateBundle() {
      const {sitemapXml, robotsTxt} = getDynamicOutputs();
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemapXml,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt,
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), panduotoSitemapPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
