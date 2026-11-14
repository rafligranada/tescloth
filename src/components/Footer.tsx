import React from 'react';
import { Mail } from 'lucide-react';
import { RouteView } from '../types/editorial';
import { routeToPath } from '../utils/articleFilter';

interface FooterProps {
  onNavigate: (route: RouteView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, route: RouteView) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(route);
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Summary */}
          <div className="space-y-3">
            <div className="font-display text-xl font-bold text-white">PanduOto</div>
            <p className="text-xs leading-relaxed text-slate-400">
              Portal edukasi perawatan mobil, diagnostik gejala kerusakan, kalkulator servis berkala, dan inspeksi subsistem kendaraan 3D interaktif.
            </p>
            <a
              href="mailto:rafligranada@gmail.com"
              className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>rafligranada@gmail.com</span>
            </a>
          </div>

          {/* Navigasi Utama */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Eksplorasi
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLinkClick(e, { page: 'home' })}
                  className="hover:text-white"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/artikel"
                  onClick={(e) => handleLinkClick(e, { page: 'articles' })}
                  className="hover:text-white"
                >
                  Semua Artikel Panduan
                </a>
              </li>
              <li>
                <a
                  href="/inspeksi-3d"
                  onClick={(e) => handleLinkClick(e, { page: 'inspect-3d' })}
                  className="hover:text-white"
                >
                  Inspeksi Mobil 3D
                </a>
              </li>
              <li>
                <a
                  href="/kalkulator"
                  onClick={(e) => handleLinkClick(e, { page: 'calculator' })}
                  className="hover:text-white"
                >
                  Kalkulator Jadwal Servis
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-white">
                  Sitemap XML
                </a>
              </li>
            </ul>
          </div>

          {/* Topik Populer */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Panduan Unggulan
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              {[
                {
                  slug: 'panduan-memilih-oli-mesin-sintetik-dan-interval-ganti',
                  label: 'Memilih Oli Mesin Sintetik',
                },
                {
                  slug: 'sistem-pengereman-cakram-abs-tanda-kampas-aus',
                  label: 'Cek Kampas Rem & Minyak Rem',
                },
                {
                  slug: 'merawat-aki-mobil-dan-sistem-pengisian-alternator',
                  label: 'Diagnosa Aki & Alternator',
                },
                {
                  slug: 'panduan-tekanan-angin-rotasi-ban-dan-spooring',
                  label: 'Tekanan Ban & Spooring',
                },
              ].map((item) => {
                const route: RouteView = { page: 'article-detail', slug: item.slug };
                return (
                  <li key={item.slug}>
                    <a
                      href={routeToPath(route)}
                      onClick={(e) => handleLinkClick(e, route)}
                      className="text-left hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Kepatuhan AdSense & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Informasi &amp; Kepatuhan
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              {(
                [
                  { page: 'about', label: 'Tentang Kami' },
                  { page: 'contact', label: 'Kontak Redaksi' },
                  { page: 'privacy', label: 'Kebijakan Privasi' },
                  { page: 'terms', label: 'Ketentuan Layanan' },
                  { page: 'disclaimer', label: 'Disclaimer Teknis' },
                  { page: 'editorial-policy', label: 'Kebijakan Editorial' },
                ] as const
              ).map((item) => {
                const route: RouteView = { page: item.page };
                return (
                  <li key={item.page}>
                    <a
                      href={routeToPath(route)}
                      onClick={(e) => handleLinkClick(e, route)}
                      className="hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>© 2026 PanduOto (panduoto.vercel.app). Seluruh hak cipta dilindungi.</p>
          <p>
            Kontak resmi:{' '}
            <a href="mailto:rafligranada@gmail.com" className="text-slate-300 underline hover:text-white">
              rafligranada@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
