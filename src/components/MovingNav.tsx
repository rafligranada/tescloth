import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, X, Wrench } from 'lucide-react';
import { RouteView } from '../types/editorial';
import { routeToPath } from '../utils/articleFilter';

interface MovingNavProps {
  currentRoute: RouteView;
  onNavigate: (route: RouteView) => void;
}

interface NavItem {
  id: RouteView['page'];
  label: string;
  route: RouteView;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Beranda', route: { page: 'home' } },
  { id: 'articles', label: 'Artikel', route: { page: 'articles' } },
  { id: 'inspect-3d', label: 'Inspeksi 3D', route: { page: 'inspect-3d' } },
  { id: 'calculator', label: 'Kalkulator Servis', route: { page: 'calculator' } },
  { id: 'about', label: 'Tentang', route: { page: 'about' } },
  { id: 'contact', label: 'Kontak', route: { page: 'contact' } },
];

export const MovingNav: React.FC<MovingNavProps> = ({ currentRoute, onNavigate }) => {
  const activePageId =
    currentRoute.page === 'article-detail' ? 'articles' : currentRoute.page;

  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const targetId =
    hoveredId ??
    (NAV_ITEMS.some((item) => item.id === activePageId) ? activePageId : 'home');

  const updateSlider = () => {
    const container = navContainerRef.current;
    const el = itemRefs.current[targetId];
    if (!container || !el) return;
    setSliderStyle({
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
    });
  };

  useLayoutEffect(() => {
    updateSlider();
  }, [targetId, currentRoute.page]);

  useEffect(() => {
    const onResize = () => updateSlider();
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [targetId]);

  const handleLinkClick = (e: React.MouseEvent, route: RouteView) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(route);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 border-b border-slate-200 shadow-sm'
          : 'bg-white border-b border-slate-200/80'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark (single clean element) */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, { page: 'home' })}
          className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          PanduOto
        </a>

        {/* Zone 2: Moving Navigation with Magnetic Sliding Indicator */}
        <nav
          ref={navContainerRef}
          aria-label="Navigasi utama"
          onMouseLeave={() => setHoveredId(null)}
          className="relative hidden lg:flex items-center gap-1 rounded-full bg-slate-100 p-1"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-slate-900 transition-all duration-200 ease-out"
            style={{
              transform: `translateX(${sliderStyle.left - 4}px)`,
              width: `${sliderStyle.width}px`,
              opacity: sliderStyle.opacity,
            }}
          />
          {NAV_ITEMS.map((item) => {
            const isHighlighted = targetId === item.id;
            return (
              <a
                key={item.id}
                ref={(node) => {
                  itemRefs.current[item.id] = node;
                }}
                href={routeToPath(item.route)}
                onMouseEnter={() => setHoveredId(item.id)}
                onFocus={() => setHoveredId(item.id)}
                onClick={(e) => handleLinkClick(e, item.route)}
                className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isHighlighted
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/kalkulator"
            onClick={(e) => handleLinkClick(e, { page: 'calculator' })}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-blue-800"
          >
            <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Cek Jadwal Servis</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activePageId === item.id;
              return (
                <a
                  key={item.id}
                  href={routeToPath(item.route)}
                  onClick={(e) => handleLinkClick(e, item.route)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
            <a
              href="/kalkulator"
              onClick={(e) => handleLinkClick(e, { page: 'calculator' })}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Wrench className="h-4 w-4" aria-hidden="true" />
              <span>Cek Jadwal Servis</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
