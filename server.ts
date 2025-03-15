// server.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { dirname, join, resolve } from 'path';
import { CommonEngine } from '@angular/ssr/node';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();

  // 1. Figure out paths
  // __dirname doesn't exist in ESM by default, so we recreate it via fileURLToPath.
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  // 2. Create /api/gallery route
  server.get('/api/gallery', (req, res) => {
    try {
      // The folder that contains your built "assets" at runtime:
      // Adjust if your final build puts them in a different location
      const galleryFolder = join(browserDistFolder, 'assets', 'images', 'gallery');
      const altFile = join(galleryFolder, 'alttexts.json');

      // Load alt texts
      let altTexts: Record<string, string> = {};
      if (fs.existsSync(altFile)) {
        const data = fs.readFileSync(altFile, 'utf8');
        altTexts = JSON.parse(data);
      }

      // Read all files in gallery folder (except alttexts.json)
      const files = fs.readdirSync(galleryFolder).filter((f) => f !== 'alttexts.json');

      // Filter image files and map to { url, alt }
      const images = files
        .filter((file) => /\.(jpe?g|png|gif)$/i.test(file))
        .map((file) => {
          // The browser sees them under /assets/images/gallery/... by default
          return {
            url: `/assets/images/gallery/${file}`,
            alt: altTexts[file] || file,
          };
        });

      res.json(images);
    } catch (error) {
      console.error('Error in /api/gallery route:', error);
      res.status(500).json({ error: 'Failed to load gallery images.' });
    }
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y',
  }));

  // ... existing SSR setup ...
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: 'APP_BASE_HREF', useValue: baseUrl }],
      })
      .then((html) => {
        // If the HTML includes <app-page-not-found>, return 404
        if (html.includes('<app-page-not-found')) {
          res.status(404);
        }
        res.send(html);
      })
      .catch((err) => next(err));
  });

  return server;
}

// main entry point
export function run(): void {
  const port = process.env['SSR_PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();