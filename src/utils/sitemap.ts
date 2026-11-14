export interface SitemapStaticRoute {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
}

export interface SitemapArticleEntry {
  slug: string;
  lastmod?: string;
}

export const DEFAULT_SITE_ORIGIN = 'https://panduoto.vercel.app';
export const DEFAULT_LASTMOD = '2026-11-14';

export const STATIC_SITEMAP_ROUTES: SitemapStaticRoute[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/artikel', changefreq: 'weekly', priority: '0.9' },
  { path: '/inspeksi-3d', changefreq: 'monthly', priority: '0.9' },
  { path: '/kalkulator', changefreq: 'monthly', priority: '0.8' },
  { path: '/tentang', changefreq: 'monthly', priority: '0.7' },
  { path: '/kontak', changefreq: 'monthly', priority: '0.7' },
  { path: '/privasi', changefreq: 'yearly', priority: '0.5' },
  { path: '/ketentuan', changefreq: 'yearly', priority: '0.5' },
  { path: '/disclaimer', changefreq: 'yearly', priority: '0.5' },
  { path: '/kebijakan-editorial', changefreq: 'yearly', priority: '0.5' },
];

const INDONESIAN_MONTHS: Record<string, string> = {
  januari: '01',
  jan: '01',
  februari: '02',
  feb: '02',
  maret: '03',
  mar: '03',
  april: '04',
  apr: '04',
  mei: '05',
  juni: '06',
  jun: '06',
  juli: '07',
  jul: '07',
  agustus: '08',
  agu: '08',
  agt: '08',
  september: '09',
  sep: '09',
  oktober: '10',
  okt: '10',
  november: '11',
  nov: '11',
  desember: '12',
  des: '12',
};

export function parseIndonesianDateToIso(
  dateStr: string,
  fallback: string = DEFAULT_LASTMOD
): string {
  const cleaned = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  const match = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!match) {
    return fallback;
  }

  const day = match[1].padStart(2, '0');
  const monthKey = match[2].toLowerCase();
  const month = INDONESIAN_MONTHS[monthKey];
  const year = match[3];

  if (!month) {
    return fallback;
  }

  return `${year}-${month}-${day}`;
}

export function extractArticleEntriesFromSource(tsSource: string): SitemapArticleEntry[] {
  const entries: SitemapArticleEntry[] = [];
  const seen = new Set<string>();

  const articlesArrayStart = tsSource.indexOf('export const ARTICLES');
  const slice = articlesArrayStart >= 0 ? tsSource.slice(articlesArrayStart) : tsSource;

  const slugRegex = /slug:\s*['"]([a-z0-9-]+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = slugRegex.exec(slice)) !== null) {
    const slug = match[1];
    if (seen.has(slug)) continue;
    seen.add(slug);

    const windowAfterSlug = slice.slice(match.index, match.index + 600);
    const updatedMatch = windowAfterSlug.match(/updatedAt:\s*['"]([^'"]+)['"]/);
    const lastmod = updatedMatch
      ? parseIndonesianDateToIso(updatedMatch[1])
      : DEFAULT_LASTMOD;

    entries.push({ slug, lastmod });
  }

  return entries;
}

export function resolveSiteOrigin(
  env: Record<string, string | undefined> = {}
): string {
  const candidates = [
    env.VITE_SITE_URL,
    env.SITE_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, '')}`
      : undefined,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const trimmed = candidate.trim();
    if (!trimmed || trimmed === 'MY_APP_URL') continue;
    try {
      const parsed = new URL(trimmed);
      return `${parsed.protocol}//${parsed.host}`;
    } catch {
      continue;
    }
  }

  return DEFAULT_SITE_ORIGIN;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildSitemapXml(
  baseUrl: string,
  articleEntries: SitemapArticleEntry[],
  defaultLastMod: string = DEFAULT_LASTMOD
): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const latestArticleDate = articleEntries.reduce(
    (latest, item) => (item.lastmod && item.lastmod > latest ? item.lastmod : latest),
    defaultLastMod
  );

  const urlBlocks: string[] = [];

  for (const route of STATIC_SITEMAP_ROUTES) {
    const loc = `${normalizedBase}${route.path === '/' ? '/' : route.path}`;
    const lastmod =
      route.path === '/' || route.path === '/artikel'
        ? latestArticleDate
        : defaultLastMod;

    urlBlocks.push(
      [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
        '  </url>',
      ].join('\n')
    );
  }

  for (const article of articleEntries) {
    const cleanSlug = article.slug.replace(/^\/+/, '');
    const loc = `${normalizedBase}/artikel/${cleanSlug}`;
    const lastmod = article.lastmod || defaultLastMod;

    urlBlocks.push(
      [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
      ].join('\n')
    );
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlBlocks,
    '</urlset>',
    '',
  ].join('\n');
}

export function buildRobotsTxt(baseUrl: string): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${normalizedBase}/sitemap.xml`,
    '',
  ].join('\n');
}
