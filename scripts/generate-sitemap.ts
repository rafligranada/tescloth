import fs from 'node:fs';
import path from 'node:path';
import {
  buildRobotsTxt,
  buildSitemapXml,
  extractArticleEntriesFromSource,
  resolveSiteOrigin,
} from '../src/utils/sitemap';

const rootDir = path.resolve(import.meta.dirname, '..');
const articlesPath = path.join(rootDir, 'src', 'data', 'articles.ts');
const articlesSource = fs.readFileSync(articlesPath, 'utf8');
const articleEntries = extractArticleEntriesFromSource(articlesSource);
const siteOrigin = resolveSiteOrigin(process.env);

const sitemapXml = buildSitemapXml(siteOrigin, articleEntries);
const robotsTxt = buildRobotsTxt(siteOrigin);

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(rootDir, 'public', 'robots.txt'), robotsTxt, 'utf8');

console.log(
  `Generated sitemap.xml (${articleEntries.length} articles, origin: ${siteOrigin})`
);
