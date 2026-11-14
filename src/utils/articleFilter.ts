import { Article, ArticleCategory, RouteView, SubsystemId } from '../types/editorial';

export function filterArticles(
  articles: Article[],
  category: ArticleCategory,
  searchQuery: string,
  subsystemFilter: SubsystemId = 'all'
): Article[] {
  const q = searchQuery.trim().toLowerCase();

  return articles.filter((article) => {
    if (category !== 'Semua' && article.category !== category) {
      return false;
    }
    if (subsystemFilter !== 'all' && article.subsystemId !== subsystemFilter) {
      return false;
    }
    if (!q) return true;

    const haystack = [
      article.title,
      article.excerpt,
      article.category,
      ...article.keyTakeaways,
      ...article.sections.map((s) => s.heading),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function parseRoute(pathname: string): RouteView {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean === '/') return { page: 'home' };
  if (clean === '/artikel') return { page: 'articles' };
  if (clean.startsWith('/artikel/')) {
    const slug = clean.slice('/artikel/'.length);
    if (slug) return { page: 'article-detail', slug };
    return { page: 'articles' };
  }
  if (clean === '/inspeksi-3d') return { page: 'inspect-3d' };
  if (clean === '/kalkulator') return { page: 'calculator' };
  if (clean === '/tentang') return { page: 'about' };
  if (clean === '/kontak') return { page: 'contact' };
  if (clean === '/privasi') return { page: 'privacy' };
  if (clean === '/ketentuan') return { page: 'terms' };
  if (clean === '/disclaimer') return { page: 'disclaimer' };
  if (clean === '/kebijakan-editorial') return { page: 'editorial-policy' };

  return { page: 'home' };
}

export function routeToPath(route: RouteView): string {
  switch (route.page) {
    case 'home':
      return '/';
    case 'articles':
      return '/artikel';
    case 'article-detail':
      return `/artikel/${route.slug}`;
    case 'inspect-3d':
      return '/inspeksi-3d';
    case 'calculator':
      return '/kalkulator';
    case 'about':
      return '/tentang';
    case 'contact':
      return '/kontak';
    case 'privacy':
      return '/privasi';
    case 'terms':
      return '/ketentuan';
    case 'disclaimer':
      return '/disclaimer';
    case 'editorial-policy':
      return '/kebijakan-editorial';
  }
}
