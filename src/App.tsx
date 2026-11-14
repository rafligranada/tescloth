import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Box,
  Clock,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { ARTICLES } from './data/articles';
import { ArticleCategory, RouteView, SubsystemId } from './types/editorial';
import { filterArticles, parseRoute, routeToPath } from './utils/articleFilter';
import { MovingNav } from './components/MovingNav';
import { CarInspection3D } from './components/CarInspection3D';
import { MaintenanceCalculator } from './components/MaintenanceCalculator';
import { ArticleDetailView } from './components/ArticleDetailView';
import { LegalPages } from './components/LegalPages';
import { Footer } from './components/Footer';

const CATEGORIES: ArticleCategory[] = [
  'Semua',
  'Mesin & Oli',
  'Rem & Suspensi',
  'Kelistrikan & Aki',
  'Ban & Kaki-kaki',
  'AC & Kabin',
  'Perawatan Bodi',
];

export default function App() {
  const [route, setRoute] = useState<RouteView>(() =>
    parseRoute(window.location.pathname)
  );
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectSubsystem, setInspectSubsystem] = useState<SubsystemId>('all');

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${routeToPath(route)}`;
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    let ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrlMeta) {
      ogUrlMeta = document.createElement('meta');
      ogUrlMeta.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlMeta);
    }
    ogUrlMeta.content = canonicalUrl;

    const pageSeo: Partial<Record<RouteView['page'], { title: string; desc: string }>> = {
      home: {
        title: 'PanduOto – Panduan Perawatan Mobil & Diagnostik 3D',
        desc: 'Panduan perawatan mobil tepercaya: artikel teknis oli mesin, rem ABS, aki, ban, transmisi CVT, kalkulator servis berkala, dan inspeksi kendaraan 3D interaktif.',
      },
      articles: {
        title: 'Arsip Artikel Teknis Perawatan Mobil | PanduOto',
        desc: 'Kumpulan panduan mekanik lengkap: pemilihan oli sintetik, servis rem ABS, diagnosa aki multimeter, spooring ban, AC mobil, dan transmisi CVT.',
      },
      'inspect-3d': {
        title: 'Inspeksi Komponen Mobil 3D Interaktif | PanduOto',
        desc: 'Jelajahi letak mesin, aki 12V, rem cakram ABS, kondensor AC, dan kaki-kaki mobil dalam model 3D interaktif dengan mode Bedah Bodi.',
      },
      calculator: {
        title: 'Kalkulator Jadwal Servis Odometer Mobil | PanduOto',
        desc: 'Hitung jadwal penggantian oli mesin, kampas rem, aki, ban, dan fluida transmisi otomatis berdasarkan kilometer dan kondisi berkendara.',
      },
      about: {
        title: 'Tentang Kami | PanduOto',
        desc: 'Mengenal portal edukasi otomotif independen PanduOto (panduoto.vercel.app) dan standar penulisan teknis berbasis manual servis pabrikan.',
      },
      contact: {
        title: 'Kontak Redaksi | PanduOto',
        desc: 'Hubungi redaksi PanduOto melalui rafligranada@gmail.com untuk pertanyaan teknis perawatan kendaraan, koreksi artikel, atau kerja sama.',
      },
      privacy: {
        title: 'Kebijakan Privasi (Privacy Policy) | PanduOto',
        desc: 'Kebijakan privasi, penggunaan berkas log, dan pengungkapan cookie Google AdSense pada situs panduoto.vercel.app.',
      },
      terms: {
        title: 'Ketentuan Layanan (Terms of Service) | PanduOto',
        desc: 'Ketentuan penggunaan situs, hak kekayaan intelektual editorial, dan aturan layanan PanduOto.',
      },
      disclaimer: {
        title: 'Disclaimer Teknis Otomotif | PanduOto',
        desc: 'Penafian teknis terkait informasi perawatan kendaraan, keselamatan pengerjaan mandiri, dan rujukan buku manual pabrikan.',
      },
      'editorial-policy': {
        title: 'Kebijakan Editorial | PanduOto',
        desc: 'Pedoman riset spesifikasi teknis, peninjauan praktisi mekanik, dan pembaruan artikel berkala di PanduOto.',
      },
    };

    const meta = pageSeo[route.page];
    if (meta) {
      document.title = meta.title;
      const descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (descEl) descEl.content = meta.desc;
    }
  }, [route]);

  const navigate = (nextRoute: RouteView) => {
    const nextPath = routeToPath(nextRoute);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    if (nextRoute.page === 'inspect-3d' && nextRoute.subsystem) {
      setInspectSubsystem(nextRoute.subsystem);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (slug: string) => {
    navigate({ page: 'article-detail', slug });
  };

  const handleInspectSubsystem = (subsystemId: SubsystemId) => {
    setInspectSubsystem(subsystemId);
    navigate({ page: 'inspect-3d', subsystem: subsystemId });
  };

  const filteredArticles = useMemo(
    () => filterArticles(ARTICLES, selectedCategory, searchQuery),
    [selectedCategory, searchQuery]
  );

  const activeArticle =
    route.page === 'article-detail'
      ? ARTICLES.find((a) => a.slug === route.slug) || ARTICLES[0]
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <MovingNav currentRoute={route} onNavigate={navigate} />

      <main className="flex-1">
        {route.page === 'home' && (
          <>
            {/* Editorial Hero Section */}
            <section className="border-b border-slate-200 bg-white">
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid items-center gap-10 lg:grid-cols-12">
                  <div className="space-y-6 lg:col-span-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                      Portal Edukasi Perawatan Kendaraan
                    </div>
                    <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
                      Rawat Mobil Lebih Cerdas dengan Panduan Mekanik &amp; Inspeksi 3D
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                      Pelajari interval servis yang akurat, cara mendeteksi kerusakan dini pada mesin, rem ABS, aki, dan ban, serta jelajahi posisi tiap komponen kendaraan secara interaktif dalam model 3D.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href="/artikel"
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                          e.preventDefault();
                          navigate({ page: 'articles' });
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                      >
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        <span>Jelajahi 8+ Artikel Teknis</span>
                      </a>
                      <a
                        href="/kalkulator"
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                          e.preventDefault();
                          navigate({ page: 'calculator' });
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100"
                      >
                        <Wrench className="h-4 w-4" aria-hidden="true" />
                        <span>Kalkulator Jadwal Servis</span>
                      </a>
                    </div>

                    {/* Trust Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-6 sm:gap-4">
                      <div className="min-w-0">
                        <div className="font-mono-tabular text-sm font-bold text-slate-900 sm:text-xl">
                          8 Panduan
                        </div>
                        <div className="text-[11px] leading-snug text-slate-500 sm:text-xs">
                          Artikel teknis mendalam
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono-tabular text-sm font-bold text-slate-900 sm:text-xl">
                          6 Subsistem
                        </div>
                        <div className="text-[11px] leading-snug text-slate-500 sm:text-xs">
                          Model 3D interaktif
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono-tabular text-sm font-bold text-slate-900 sm:text-xl">
                          Terverifikasi
                        </div>
                        <div className="text-[11px] leading-snug text-slate-500 sm:text-xs">
                          Ditinjau praktisi bengkel
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive 3D Preview right inside Hero */}
                  <div className="lg:col-span-6">
                    <CarInspection3D
                      initialSubsystem="all"
                      onOpenArticle={handleOpenArticle}
                      compact
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Guides Grid */}
            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                    Pustaka Perawatan Kendaraan
                  </div>
                  <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    Artikel Panduan Pilihan
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'articles' })}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline"
                >
                  <span>Lihat Semua Artikel</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Category Filter Strip */}
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.slice(0, 6).map((article) => (
                  <article
                    key={article.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-blue-600"
                  >
                    <a
                      href={`/artikel/${article.slug}`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                        e.preventDefault();
                        handleOpenArticle(article.slug);
                      }}
                      className="flex flex-1 flex-col text-left"
                    >
                      <div className="overflow-hidden bg-slate-200">
                        <img
                          src={article.image}
                          alt={article.imageAlt}
                          referrerPolicy="no-referrer"
                          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="font-semibold text-blue-700">{article.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{article.difficulty}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">{article.readMinutes} mnt</span>
                          </div>
                          <h3 className="font-display mt-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-700">
                            {article.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                            {article.excerpt}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-800">
                          <span>Baca Panduan Lengkap</span>
                          <ArrowRight className="h-3.5 w-3.5 text-blue-700" aria-hidden="true" />
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </section>

            {/* Quick Calculator Preview Banner */}
            <section className="border-t border-slate-200 bg-white">
              <MaintenanceCalculator
                onOpenArticle={handleOpenArticle}
                onInspectSubsystem={handleInspectSubsystem}
              />
            </section>
          </>
        )}

        {route.page === 'articles' && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Arsip Artikel Otomotif
                </div>
                <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Semua Panduan Perawatan Mobil
                </h1>
                <p className="mt-2 text-base text-slate-600">
                  Pilih kategori atau cari gejala kerusakan tertentu untuk menemukan langkah pemeriksaan mandiri dan estimasi biaya servis.
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <label htmlFor="article-search" className="sr-only">
                  Cari artikel perawatan mobil
                </label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="article-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari oli, rem ABS, aki, AC..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredArticles.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <p className="font-display text-lg font-semibold text-slate-900">
                  Tidak ada artikel yang cocok dengan pencarian Anda.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <article
                    key={article.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-blue-600"
                  >
                    <a
                      href={`/artikel/${article.slug}`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                        e.preventDefault();
                        handleOpenArticle(article.slug);
                      }}
                      className="flex flex-1 flex-col text-left"
                    >
                      <div className="overflow-hidden bg-slate-200">
                        <img
                          src={article.image}
                          alt={article.imageAlt}
                          referrerPolicy="no-referrer"
                          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="font-semibold text-blue-700">{article.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-mono-tabular">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              {article.readMinutes} mnt
                            </span>
                          </div>
                          <h2 className="font-display mt-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-700">
                            {article.title}
                          </h2>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                            {article.excerpt}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-800">
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                            Terverifikasi
                          </span>
                          <span className="text-blue-700">Baca Artikel →</span>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {route.page === 'article-detail' && activeArticle && (
          <ArticleDetailView
            article={activeArticle}
            onBack={() => navigate({ page: 'articles' })}
            onOpenArticle={handleOpenArticle}
            onInspectSubsystem={handleInspectSubsystem}
          />
        )}

        {route.page === 'inspect-3d' && (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <Box className="h-4 w-4" aria-hidden="true" />
                <span>Laboratorium Diagnostik 3D</span>
              </div>
              <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Inspeksi Subsistem Kendaraan 3D Interaktif
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Klik langsung area mesin, roda/rem, aki, atau pilih tab subsistem di dok kontrol bawah. Aktifkan mode <strong>Bedah Bodi</strong> untuk membuka kap mesin dan melihat komponen internal.
              </p>
            </div>

            <CarInspection3D
              initialSubsystem={inspectSubsystem}
              onOpenArticle={handleOpenArticle}
            />
          </section>
        )}

        {route.page === 'calculator' && (
          <MaintenanceCalculator
            onOpenArticle={handleOpenArticle}
            onInspectSubsystem={handleInspectSubsystem}
          />
        )}

        {(route.page === 'about' ||
          route.page === 'contact' ||
          route.page === 'privacy' ||
          route.page === 'terms' ||
          route.page === 'disclaimer' ||
          route.page === 'editorial-policy') && (
          <LegalPages page={route.page} onNavigate={navigate} />
        )}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
