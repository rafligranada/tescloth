import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMaintenanceSchedule } from '../src/utils/maintenanceCalculator';
import { filterArticles, parseRoute, routeToPath } from '../src/utils/articleFilter';
import {
  STATIC_SITEMAP_ROUTES,
  buildRobotsTxt,
  buildSitemapXml,
  extractArticleEntriesFromSource,
  parseIndonesianDateToIso,
  resolveSiteOrigin,
} from '../src/utils/sitemap';
import { Article } from '../src/types/editorial';

test('calculateMaintenanceSchedule computes severe_city intervals and status accurately', () => {
  const result = calculateMaintenanceSchedule(13500, 'mpv', 'severe_city');
  const oil = result.find((r) => r.id === 'engine-oil');
  assert.ok(oil, 'engine-oil rule should exist');
  // 10000 * 0.7 = 7000 km interval; at 13500 km, nextDueKm = 14000 km, remaining = 500 km -> Segera Servis
  assert.equal(oil.effectiveIntervalKm, 7000);
  assert.equal(oil.nextDueKm, 14000);
  assert.equal(oil.remainingKm, 500);
  assert.equal(oil.status, 'Segera Servis');

  const normalResult = calculateMaintenanceSchedule(2000, 'hybrid', 'normal');
  const normalOil = normalResult.find((r) => r.id === 'engine-oil');
  assert.ok(normalOil);
  assert.equal(normalOil.effectiveIntervalKm, 11000);
  assert.equal(normalOil.status, 'Kondisi Aman');
});

test('filterArticles filters by category, subsystem, and search query', () => {
  const sampleArticles: Article[] = [
    {
      slug: 'oli-sintetik',
      title: 'Panduan Oli Mesin Sintetik',
      excerpt: 'Memilih SAE 0W-20 untuk mesin modern.',
      category: 'Mesin & Oli',
      subsystemId: 'engine',
      readMinutes: 6,
      updatedAt: '10 Nov 2026',
      author: { name: 'Rafli Granada', role: 'Editor' },
      reviewer: 'Hendra Wijaya',
      difficulty: 'Pemula',
      estimatedCost: 'Rp 500.000',
      image: '',
      imageAlt: '',
      keyTakeaways: ['Cek dipstick rutin'],
      sections: [{ id: 's1', heading: 'Viskositas SAE', paragraphs: ['Detail'] }],
      faqs: [],
    },
    {
      slug: 'aki-mobil',
      title: 'Merawat Aki Mobil 12V',
      excerpt: 'Mengukur tegangan alternator dan CCA.',
      category: 'Kelistrikan & Aki',
      subsystemId: 'electrical',
      readMinutes: 5,
      updatedAt: '06 Nov 2026',
      author: { name: 'Rafli Granada', role: 'Editor' },
      reviewer: 'Dimas Pratama',
      difficulty: 'Pemula',
      estimatedCost: 'Rp 900.000',
      image: '',
      imageAlt: '',
      keyTakeaways: ['Tegangan ideal 12,6V'],
      sections: [{ id: 's2', heading: 'Multimeter', paragraphs: ['Detail'] }],
      faqs: [],
    },
  ];

  assert.equal(filterArticles(sampleArticles, 'Semua', '').length, 2);
  assert.equal(filterArticles(sampleArticles, 'Mesin & Oli', '').length, 1);
  assert.equal(filterArticles(sampleArticles, 'Semua', 'alternator').length, 1);
  assert.equal(filterArticles(sampleArticles, 'Semua', '', 'electrical')[0].slug, 'aki-mobil');
});

test('parseRoute and routeToPath round-trip all AdSense and app routes', () => {
  const paths = [
    '/',
    '/artikel',
    '/artikel/panduan-memilih-oli-mesin-sintetik-dan-interval-ganti',
    '/inspeksi-3d',
    '/kalkulator',
    '/tentang',
    '/kontak',
    '/privasi',
    '/ketentuan',
    '/disclaimer',
    '/kebijakan-editorial',
  ];

  for (const p of paths) {
    const parsed = parseRoute(p);
    assert.equal(routeToPath(parsed), p);
  }
});

test('sitemap utilities extract all dynamic article slugs and build valid XML sitemap', () => {
  assert.equal(parseIndonesianDateToIso('10 November 2026'), '2026-11-10');
  assert.equal(parseIndonesianDateToIso('29 Oktober 2026'), '2026-10-29');

  const articlesSource = fs.readFileSync(
    path.resolve(import.meta.dirname, '../src/data/articles.ts'),
    'utf8'
  );
  const extracted = extractArticleEntriesFromSource(articlesSource);
  assert.equal(extracted.length, 8);
  assert.equal(
    extracted[0].slug,
    'panduan-memilih-oli-mesin-sintetik-dan-interval-ganti'
  );
  assert.equal(extracted[0].lastmod, '2026-11-10');

  assert.equal(
    resolveSiteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: 'panduoto.com' }),
    'https://panduoto.com'
  );
  assert.equal(
    resolveSiteOrigin({ APP_URL: 'MY_APP_URL' }),
    'https://panduoto.vercel.app'
  );

  const xml = buildSitemapXml('https://panduoto.vercel.app', extracted);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);

  for (const route of STATIC_SITEMAP_ROUTES) {
    const expectedUrl =
      route.path === '/'
        ? 'https://panduoto.vercel.app/'
        : `https://panduoto.vercel.app${route.path}`;
    assert.ok(xml.includes(`<loc>${expectedUrl}</loc>`), `missing ${expectedUrl}`);
  }

  for (const item of extracted) {
    const expectedUrl = `https://panduoto.vercel.app/artikel/${item.slug}`;
    assert.ok(xml.includes(`<loc>${expectedUrl}</loc>`), `missing ${expectedUrl}`);
  }

  const robots = buildRobotsTxt('https://panduoto.vercel.app');
  assert.ok(robots.includes('Sitemap: https://panduoto.vercel.app/sitemap.xml'));
});
