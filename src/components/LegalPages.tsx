import React, { useState } from 'react';
import { Mail, CheckCircle2, Shield, FileText, Scale, Info } from 'lucide-react';
import { RouteView } from '../types/editorial';

interface LegalPageProps {
  page: 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'editorial-policy';
  onNavigate: (route: RouteView) => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ page, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Pertanyaan Teknis Perawatan Mobil');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) nextErrors.name = 'Mohon isi nama lengkap Anda.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Mohon masukkan alamat email yang valid.';
    }
    if (message.trim().length < 15) {
      nextErrors.message = 'Mohon tulis pesan minimal 15 karakter agar tim kami dapat membantu.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  };

  if (page === 'contact') {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Hubungi Redaksi PanduOto
          </div>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Kontak &amp; Kerja Sama Editorial
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Punya pertanyaan seputar perawatan kendaraan, masukan koreksi teknis artikel, atau penawaran kerja sama? Hubungi kami melalui email resmi di bawah ini atau kirim pesan langsung.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Direct Contact Info Card */}
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 md:col-span-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email Resmi Redaksi &amp; Pengelola
              </div>
              <a
                href="mailto:rafligranada@gmail.com"
                className="mt-2 inline-flex items-center gap-2 text-base font-bold text-blue-700 hover:underline break-all"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>rafligranada@gmail.com</span>
              </a>
            </div>

            <div className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">
              <div className="font-semibold text-slate-900">Waktu Respons</div>
              <p className="mt-1">
                Senin – Jumat, pukul 09.00 – 17.00 WIB. Pertanyaan teknis maupun korespondensi kebijakan privasi &amp; hak cipta umumnya dibalas dalam 1×24 jam kerja.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">
              <div className="font-semibold text-slate-900">Topik yang Kami Layani</div>
              <ul className="mt-2 space-y-1.5 text-xs">
                <li>• Konsultasi artikel panduan servis &amp; interval kilometer</li>
                <li>• Koreksi data teknis atau pembaruan spesifikasi pabrikan</li>
                <li>• Permintaan privasi data &amp; pertanyaan iklan (AdSense)</li>
              </ul>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:col-span-3">
            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
                <div className="flex items-center gap-2 font-display text-lg font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                  <span>Pesan Berhasil Disiapkan</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  Terima kasih, <strong>{name}</strong>. Pesan Anda mengenai <em>{subject}</em> telah disiapkan. Anda dapat melanjutkan pengiriman langsung melalui aplikasi email ke{' '}
                  <a href="mailto:rafligranada@gmail.com" className="font-semibold underline">
                    rafligranada@gmail.com
                  </a>{' '}
                  atau tunggu tim redaksi menghubungi <strong>{email}</strong>.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`mailto:rafligranada@gmail.com?subject=${encodeURIComponent(
                      `[PanduOto] ${subject} - ${name}`
                    )}&body=${encodeURIComponent(
                      `Nama: ${name}\nEmail: ${email}\n\n${message}`
                    )}`}
                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                  >
                    Buka di Aplikasi Email
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-900">
                    Nama Lengkap
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Andi Pratama"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-900">
                    Alamat Email Anda
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-900">
                    Subjek Pesan
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    <option>Pertanyaan Teknis Perawatan Mobil</option>
                    <option>Saran &amp; Koreksi Artikel Editorial</option>
                    <option>Privasi Data &amp; Kebijakan Situs</option>
                    <option>Kemitraan &amp; Kolaborasi</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-900">
                    Pesan
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pertanyaan atau detail kendaraan Anda..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  Kirim Pesan ke Redaksi
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (page === 'about') {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Info className="h-4 w-4" aria-hidden="true" />
            <span>Tentang PanduOto</span>
          </div>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Membantu Pemilik Mobil Merawat Kendaraan Berbasis Data Teknis
          </h1>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-base leading-relaxed text-slate-700">
          <p>
            <strong>PanduOto</strong> (<strong>panduoto.vercel.app</strong>) adalah portal edukasi otomotif independen yang berfokus pada perawatan kendaraan harian, diagnostik gejala kerusakan dini, dan pemahaman sistem mekanis modern melalui panduan tertulis mendalam serta visualisasi 3D interaktif.
          </p>
          <p>
            Banyak pemilik kendaraan di Indonesia mengalami pembengkakan biaya bengkel karena minimnya referensi terstruktur mengenai interval servis yang sesuai dengan kondisi macet perkotaan dan iklim tropis. Kami menyusun artikel teknis yang ringkas, terverifikasi manual servis pabrikan, dan mudah dipraktikkan bahkan oleh pengemudi pemula.
          </p>

          <h2 className="font-display pt-2 text-xl font-bold text-slate-900">
            Prinsip Penulisan Kami
          </h2>
          <ul className="space-y-2.5 text-sm">
            <li>• <strong>Akurasi Teknis:</strong> Setiap panduan viskositas oli, standar titik didih minyak rem, hingga tegangan kelistrikan mengacu pada parameter teknik otomotif standar (SAE, API, DOT, JIS/DIN).</li>
            <li>• <strong>Independen &amp; Objektif:</strong> PanduOto tidak menjual suku cadang tertentu atau menerima ulasan berbayar yang menyesatkan pembaca.</li>
            <li>• <strong>Kontak Terbuka:</strong> Pembaca dapat menghubungi pengelola secara langsung melalui email resmi <a href="mailto:rafligranada@gmail.com" className="font-semibold text-blue-700 underline">rafligranada@gmail.com</a>.</li>
          </ul>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'editorial-policy' })}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Baca Kebijakan Editorial Lengkap
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (page === 'privacy') {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span>Kepatuhan Privasi &amp; Cookie</span>
          </div>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="font-mono-tabular mt-2 text-xs text-slate-500">
            Terakhir diperbarui: 14 November 2026 · Berlaku untuk panduoto.vercel.app
          </p>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-sm leading-7 text-slate-700">
          <p>
            Privasi pengunjung di <strong>PanduOto</strong> (<strong>https://panduoto.vercel.app</strong>) sangat penting bagi kami. Dokumen Kebijakan Privasi ini menjelaskan jenis informasi yang dikumpulkan dan dicatat oleh PanduOto serta bagaimana kami menggunakannya.
          </p>

          <h2 className="font-display pt-2 text-lg font-bold text-slate-900">1. Berkas Log (Log Files)</h2>
          <p>
            PanduOto mengikuti prosedur standar penggunaan berkas log. Informasi yang dicatat meliputi alamat protokol internet (IP), jenis peramban, Penyedia Layanan Internet (ISP), cap tanggal dan waktu, halaman rujukan/keluar, serta jumlah klik. Data ini tidak ditautkan ke informasi apa pun yang dapat diidentifikasi secara pribadi dan hanya digunakan untuk menganalisis tren serta menjaga stabilitas situs.
          </p>

          <h2 className="font-display pt-2 text-lg font-bold text-slate-900">2. Cookie, Google AdSense, dan Mitra Iklan Pihak Ketiga</h2>
          <p>
            Situs ini bermitra dengan <strong>Google AdSense</strong> untuk menayangkan iklan yang relevan bagi pembaca. Google menggunakan cookie (termasuk cookie DART) untuk menayangkan iklan berdasarkan kunjungan pengguna sebelumnya ke <strong>panduoto.vercel.app</strong> maupun situs web lain di internet.
          </p>
          <p>
            Vendor pihak ketiga dan jaringan iklan dapat menggunakan teknologi seperti cookie, JavaScript, atau Web Beacon pada iklan yang muncul di PanduOto. Pengunjung dapat menonaktifkan penggunaan iklan yang dipersonalisasi kapan saja melalui{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 underline"
            >
              Pengaturan Iklan Google (Google Ads Settings)
            </a>
            , mempelajari kebijakan iklan Google di{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 underline"
            >
              policies.google.com/technologies/ads
            </a>
            , atau mengelola preferensi melalui{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 underline"
            >
              aboutads.info/choices
            </a>
            .
          </p>

          <h2 className="font-display pt-2 text-lg font-bold text-slate-900">3. Formulir Kontak &amp; Informasi Pribadi</h2>
          <p>
            Ketika Anda menghubungi kami melalui formulir kontak atau mengirim email ke{' '}
            <a href="mailto:rafligranada@gmail.com" className="font-semibold text-blue-700 underline">
              rafligranada@gmail.com
            </a>
            , nama dan alamat email Anda hanya digunakan untuk membalas pertanyaan Anda. Kami tidak menjual, menyewakan, atau membagikan data kontak pribadi Anda kepada pihak ketiga.
          </p>

          <h2 className="font-display pt-2 text-lg font-bold text-slate-900">4. Persetujuan</h2>
          <p>
            Dengan menggunakan situs web <strong>panduoto.vercel.app</strong>, Anda menyetujui Kebijakan Privasi ini beserta Ketentuan Layanan yang berlaku. Pertanyaan privasi maupun permintaan penghapusan data dapat dikirimkan ke{' '}
            <a href="mailto:rafligranada@gmail.com" className="font-semibold text-blue-700 underline">
              rafligranada@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  if (page === 'terms') {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Scale className="h-4 w-4" aria-hidden="true" />
            <span>Aturan Penggunaan Situs</span>
          </div>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Ketentuan Layanan (Terms of Service)
          </h1>
          <p className="font-mono-tabular mt-2 text-xs text-slate-500">
            Terakhir diperbarui: 14 November 2026
          </p>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-sm leading-7 text-slate-700">
          <p>
            Dengan mengakses situs <strong>PanduOto</strong>, Anda setuju untuk terikat oleh Ketentuan Layanan ini serta seluruh hukum dan peraturan yang berlaku.
          </p>
          <h2 className="font-display pt-2 text-lg font-bold text-slate-900">1. Hak Kekayaan Intelektual</h2>
          <p>
            Seluruh artikel panduan teknis, tabel referensi, kalkulator jadwal servis, dan aset visual yang diterbitkan di PanduOto merupakan milik editorial PanduOto kecuali dinyatakan lain. Anda diperbolehkan membagikan tautan artikel untuk tujuan edukasi non-komersial dengan mencantumkan sumber yang jelas.
          </p>
          <h2 className="font-display pt-2 text-lg font-bold text-slate-900">2. Batasan Penggunaan</h2>
          <p>
            Pengguna dilarang melakukan penyalinan massal otomatis (scraping) seluruh artikel untuk diterbitkan ulang di situs lain, menyisipkan skrip berbahaya, atau menyalahgunakan formulir kontak situs.
          </p>
          <h2 className="font-display pt-2 text-lg font-bold text-slate-900">3. Kontak Hukum &amp; Hak Cipta</h2>
          <p>
            Laporan pelanggaran hak cipta atau pertanyaan ketentuan layanan dapat dikirimkan ke{' '}
            <a href="mailto:rafligranada@gmail.com" className="font-semibold text-blue-700 underline">
              rafligranada@gmail.com
            </a>.
          </p>
        </div>
      </section>
    );
  }

  if (page === 'disclaimer') {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>Penafian Teknis</span>
          </div>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Disclaimer Teknis Otomotif
          </h1>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-sm leading-7 text-slate-700">
          <p>
            Seluruh informasi yang disajikan di <strong>PanduOto</strong>, termasuk artikel perawatan mesin, kalkulator interval servis, dan visualisasi model 3D interaktif, disediakan semata-mata untuk tujuan edukasi dan informasi umum.
          </p>
          <p>
            Setiap merek dan tipe kendaraan memiliki spesifikasi teknis, kapasitas fluida, nilai torsi baut, dan jadwal servis resmi tersendiri yang tercantum pada Buku Pedoman Pemilik (Owner’s Manual) pabrikan. PanduOto tidak bertanggung jawab atas kerugian materiil, kerusakan komponen, atau cedera akibat praktik perbaikan mandiri tanpa peralatan keselamatan yang memadai.
          </p>
          <p>
            Untuk pekerjaan kritis keselamatan—seperti sistem pengereman hidrolik, suspensi, kemudi, dan kelistrikan tegangan tinggi mobil hybrid/EV—selalu konsultasikan dengan teknisi bengkel bersertifikat. Jika Anda menemukan ketidakakuratan teknis, hubungi kami di{' '}
            <a href="mailto:rafligranada@gmail.com" className="font-semibold text-blue-700 underline">
              rafligranada@gmail.com
            </a>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span>Standar Kualitas Konten</span>
        </div>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Kebijakan Editorial PanduOto
        </h1>
      </div>

      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-sm leading-7 text-slate-700">
        <p>
          Redaksi <strong>PanduOto</strong> berkomitmen menerbitkan panduan perawatan otomotif yang orisinal, terstruktur, dan bermanfaat nyata bagi pemilik kendaraan di Indonesia.
        </p>
        <p>
          Setiap artikel disusun melalui riset spesifikasi pabrikan, ditinjau ulang oleh praktisi mekanik untuk memastikan keamanan prosedur, serta mencantumkan estimasi biaya dan waktu pengerjaan yang realistis. Pembaruan konten dilakukan secara berkala ketika terdapat perubahan standar pelumas maupun teknologi kendaraan terbaru.
        </p>
        <p>
          Untuk masukan koreksi fakta atau usulan topik panduan baru, silakan hubungi editor di{' '}
          <a href="mailto:rafligranada@gmail.com" className="font-semibold text-blue-700 underline">
            rafligranada@gmail.com
          </a>.
        </p>
      </div>
    </section>
  );
};
