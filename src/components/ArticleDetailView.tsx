import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  ShieldCheck,
  UserCheck,
  Box,
} from 'lucide-react';
import { Article, SubsystemId } from '../types/editorial';
import { ARTICLES } from '../data/articles';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  onOpenArticle: (slug: string) => void;
  onInspectSubsystem: (subsystemId: SubsystemId) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  onOpenArticle,
  onInspectSubsystem,
}) => {
  const [readProgress, setReadProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setReadProgress(100);
        return;
      }
      setReadProgress(
        Math.min(100, Math.max(0, Math.round((window.scrollY / docHeight) * 100)))
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [article.slug]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${article.title} | PanduOto`;
    return () => {
      document.title = prevTitle;
    };
  }, [article.title]);

  const related = ARTICLES.filter(
    (a) => a.slug !== article.slug && (a.category === article.category || a.subsystemId === article.subsystemId)
  ).slice(0, 3);

  const canonicalArticleUrl = `https://panduoto.vercel.app/artikel/${article.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: canonicalArticleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalArticleUrl,
    },
    inLanguage: 'id-ID',
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PanduOto',
      url: 'https://panduoto.vercel.app',
      email: 'rafligranada@gmail.com',
    },
  };

  return (
    <article className="bg-slate-50 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Bar */}
      <div className="sticky top-16 z-30 h-1 w-full bg-slate-200">
        <div
          className="h-full bg-blue-700 transition-all duration-100"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Back & Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Daftar Artikel</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">Diperbarui {article.updatedAt}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-5">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {article.title}
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            {article.excerpt}
          </p>

          {/* Author & Reviewer Metadata Strip (E-E-A-T Signal for Google AdSense) */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-slate-900">{article.author.name}</span>
                  <span className="mx-1.5 text-slate-300">|</span>
                  <span>{article.author.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                <span>Ditinjau: {article.reviewer}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono-tabular">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {article.readMinutes} menit baca
              </span>
              <span>Estimasi biaya: {article.estimatedCost}</span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
          <img
            src={article.image}
            alt={article.imageAlt}
            referrerPolicy="no-referrer"
            className="aspect-video w-full object-cover"
          />
        </div>

        {/* Key Takeaways Box */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Poin Penting (Ringkasan Cepat)
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-700">
            {article.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono-tabular mt-0.5 text-xs font-bold text-blue-700">
                  0{idx + 1}.
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">
              Ingin melihat letak komponen ini secara visual di kendaraan?
            </span>
            <button
              type="button"
              onClick={() => onInspectSubsystem(article.subsystemId)}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Box className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Buka Subsistem di Inspeksi 3D</span>
            </button>
          </div>
        </div>

        {/* Table of Contents */}
        <nav
          aria-label="Daftar isi artikel"
          className="mt-6 rounded-xl border border-slate-200 bg-slate-100/70 p-4"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Daftar Isi Panduan
          </div>
          <ol className="mt-2 space-y-1.5 text-sm font-medium text-slate-800">
            {article.sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="hover:text-blue-700 hover:underline"
                >
                  {sec.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Article Body Sections */}
        <div className="mt-10 space-y-10">
          {article.sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24 space-y-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                {sec.heading}
              </h2>

              {sec.paragraphs.map((p, idx) => (
                <p key={idx} className="text-base leading-7 text-slate-700">
                  {p}
                </p>
              ))}

              {sec.bullets && (
                <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700">
                  {sec.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.table && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
                      <tr>
                        {sec.table.headers.map((h, i) => (
                          <th key={i} className="px-4 py-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-4 py-3 ${
                                cIdx === 0 ? 'font-semibold text-slate-900' : 'text-slate-600'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sec.tip && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                  <span className="font-semibold">Catatan Mekanik: </span>
                  {sec.tip}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* FAQ Accordion */}
        {article.faqs.length > 0 && (
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <div className="mt-4 divide-y divide-slate-200">
              {article.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-slate-900"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Panduan Terkait Lainnya
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              {related.map((rel) => (
                <button
                  key={rel.slug}
                  type="button"
                  onClick={() => onOpenArticle(rel.slug)}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition-colors hover:border-blue-600"
                >
                  <img
                    src={rel.image}
                    alt={rel.imageAlt}
                    referrerPolicy="no-referrer"
                    className="aspect-video w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="text-xs font-medium text-blue-700">{rel.category}</div>
                    <div className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                      {rel.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
