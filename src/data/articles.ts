import { Article, SubsystemId } from '../types/editorial';
import imgEngineBay from '../assets/images/car_engine_bay_1794663987460.jpg';
import imgBrakes from '../assets/images/brake_rotor_caliper_1794663988623.jpg';
import imgBattery from '../assets/images/battery_electrical_diag_1794663989621.jpg';
import imgTires from '../assets/images/tire_tread_suspension_1794663989551.jpg';

export interface SubsystemMeta {
  id: SubsystemId;
  label: string;
  shortTitle: string;
  description: string;
  inspectionTip: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  relatedSlug?: string;
}

export const SUBSYSTEMS: SubsystemMeta[] = [
  {
    id: 'all',
    label: 'Semua Sistem',
    shortTitle: 'Inspeksi Menyeluruh 360°',
    description:
      'Tinjau arsitektur kendaraan secara utuh. Klik komponen pada bodi atau aktifkan mode Bedah Bodi untuk melihat posisi mesin, aki, kondensor AC, dan sistem rem.',
    inspectionTip: 'Gunakan drag mouse untuk memutar sudut pandang 360° dan scroll untuk zoom.',
    cameraPos: [4.85, 2.35, 5.2],
    cameraTarget: [0, 0.35, 0],
  },
  {
    id: 'engine',
    label: 'Mesin & Oli',
    shortTitle: 'Kompartemen Mesin & Pelumasan',
    description:
      'Blok mesin, intake manifold, dan filter oli berada di balik kap depan. Oli full synthetic menjaga lapisan film pelindung pada celah piston dan camshaft.',
    inspectionTip: 'Cek dipstick oli dalam kondisi mesin hangat (5 menit setelah dimatikan) di permukaan datar.',
    cameraPos: [2.2, 1.9, 2.4],
    cameraTarget: [1.15, 0.65, 0],
    relatedSlug: 'panduan-memilih-oli-mesin-sintetik-dan-interval-ganti',
  },
  {
    id: 'brakes',
    label: 'Rem & ABS',
    shortTitle: 'Cakram Ventilasi & Kaliper Hidrolik',
    description:
      'Sistem pengereman memadukan piringan cakram berventilasi, kaliper piston hidrolik, dan sensor kecepatan roda ABS untuk mencegah roda terkunci saat pengereman darurat.',
    inspectionTip: 'Perhatikan ketebalan kampas minimal 3 mm dan permukaan cakram yang rata tanpa alur dalam.',
    cameraPos: [1.85, 0.72, 2.05],
    cameraTarget: [1.28, 0.34, 0.88],
    relatedSlug: 'sistem-pengereman-cakram-abs-tanda-kampas-aus',
  },
  {
    id: 'electrical',
    label: 'Kelistrikan & Aki',
    shortTitle: 'Aki 12V, ECU & Alternator',
    description:
      'Aki 12V menyediakan arus starter awal sebelum alternator mengambil alih suplai daya ECU, injektor bahan bakar, dan sistem pencahayaan LED.',
    inspectionTip: 'Tegangan sehat aki diam adalah 12,4V–12,7V dan 13,8V–14,4V saat mesin menyala.',
    cameraPos: [2.35, 1.7, -2.1],
    cameraTarget: [1.25, 0.62, -0.45],
    relatedSlug: 'merawat-aki-mobil-dan-sistem-pengisian-alternator',
  },
  {
    id: 'tires',
    label: 'Ban & Suspensi',
    shortTitle: 'Tapak Ban, Velg & Kaki-Kaki',
    description:
      'Empat titik kontak ban menanggung seluruh beban traksi, pengereman, dan kenyamanan suspensi. Ketebalan tapak dan sudut spooring menentukan stabilitas lurus.',
    inspectionTip: 'Lakukan rotasi ban setiap 10.000 km dan cek tekanan angin saat ban masih dingin.',
    cameraPos: [-1.95, 0.78, 2.25],
    cameraTarget: [-1.26, 0.34, 0.88],
    relatedSlug: 'panduan-tekanan-angin-rotasi-ban-dan-spooring',
  },
  {
    id: 'ac',
    label: 'AC & Pendingin',
    shortTitle: 'Kondensor Depan & Sirkulasi Kabin',
    description:
      'Kondensor AC dan radiator bekerja di garis depan bumper untuk melepas panas refrigeran R134a dan cairan pendingin mesin secara efisien.',
    inspectionTip: 'Pastikan sirip kondensor tidak tersumbat lumpur dan ganti filter kabin tiap 15.000 km.',
    cameraPos: [3.2, 1.05, 0.9],
    cameraTarget: [1.85, 0.45, 0],
    relatedSlug: 'penyebab-ac-mobil-kurang-dingin-dan-perawatan-kompresor',
  },
  {
    id: 'body',
    label: 'Bodi & Cat',
    shortTitle: 'Lapisan Clearcoat & Proteksi UV',
    description:
      'Cat modern menggunakan lapisan basecoat metalik yang dilindungi clearcoat bening untuk menangkal oksidasi, hujan asam, dan paparan sinar UV harian.',
    inspectionTip: 'Cuci metode two-bucket dan lapisi sealant setiap 3–4 bulan untuk mencegah water spot.',
    cameraPos: [-3.4, 1.85, -3.2],
    cameraTarget: [-0.2, 0.72, 0],
    relatedSlug: 'merawat-cat-bodi-mobil-dari-jamur-dan-sinar-uv',
  },
];

export const ARTICLES: Article[] = [
  {
    slug: 'panduan-memilih-oli-mesin-sintetik-dan-interval-ganti',
    title: 'Panduan Lengkap Memilih Oli Mesin Sintetik dan Menentukan Interval Ganti yang Tepat',
    excerpt:
      'Pahami arti kode viskositas SAE 0W-20 vs 5W-30, standar API SP, serta cara membaca kondisi pelumas di iklim tropis dan kemacetan perkotaan.',
    category: 'Mesin & Oli',
    subsystemId: 'engine',
    readMinutes: 7,
    updatedAt: '10 November 2026',
    author: { name: 'Rafli Granada', role: 'Editor Teknis Otomotif' },
    reviewer: 'Hendra Wijaya (Teknisi Bersertifikat)',
    difficulty: 'Pemula',
    estimatedCost: 'Rp 450.000 – Rp 950.000',
    image: imgEngineBay,
    imageAlt: 'Teknisi memeriksa ruang mesin mobil modern untuk pengecekan oli dan belt',
    keyTakeaways: [
      'Selalu prioritaskan viskositas SAE yang tertera di buku manual pabrikan, bukan sekadar menebalkan kekentalan pada mobil lama.',
      'Kondisi macet stop-and-go di Indonesia tergolong severe driving, sehingga interval ganti ideal berada di 7.000–7.500 km meski memakai oli full synthetic.',
      'Setiap pergantian oli mesin wajib disertai penggantian filter oli baru agar kotoran lama tidak ikut bersirkulasi.',
    ],
    sections: [
      {
        id: 'memahami-sae-api',
        heading: '1. Memahami Kode Viskositas SAE dan Standar API / ILSAC',
        paragraphs: [
          'Banyak pemilik mobil memilih oli hanya berdasarkan merek terkenal atau rekomendasi teman tanpa membaca dua label teknis terpenting pada kemasan: SAE (Society of Automotive Engineers) dan API (American Petroleum Institute). Pada kode seperti 0W-20 atau 5W-30, angka sebelum huruf W (Winter) menunjukkan kelancaran aliran oli saat mesin dingin di pagi hari, sedangkan angka setelah tanda hubung menunjukkan ketebalan film pelindung saat mesin bekerja pada suhu operasi sekitar 100°C.',
          'Mesin mobil modern tahun 2018 ke atas umumnya dirancang dengan celah toleransi komponen presisi yang sangat rapat (sekitar 0,02–0,04 mm). Menggunakan oli yang terlalu kental seperti 20W-50 pada mesin yang meminta 0W-20 justru menghambat pompa oli mencapai kepala silinder dalam detik-detik awal starter, memicu gesekan kering pada camshaft dan konsumsi BBM yang lebih boros.',
        ],
        table: {
          headers: ['Kode Viskositas', 'Karakteristik Utama', 'Umumnya Cocok Untuk'],
          rows: [
            ['0W-16 / 0W-20', 'Sangat encer saat dingin, minim hambatan pompa', 'LCGC, Hybrid, dan mesin bensin modern 2019+'],
            ['5W-30', 'Keseimbangan proteksi panas dan efisiensi bahan bakar', 'MPV, SUV turbo, dan sedan keluaran 2012–2024'],
            ['10W-40', 'Lapisan film lebih tebal pada suhu tinggi', 'Mesin generasi lama atau jarak tempuh tinggi (>150.000 km)'],
            ['5W-40 / 15W-40 CK-4', 'Tahan jelaga dan tekanan kompresi tinggi', 'Mesin diesel common-rail dan turbo diesel'],
          ],
        },
      },
      {
        id: 'interval-ideal',
        heading: '2. Mengapa Odometer Bukan Satu-Satunya Patokan?',
        paragraphs: [
          'Buku servis sering mencantumkan interval penggantian oli setiap 10.000 km atau 6 bulan, mana yang tercapai lebih dulu. Namun, angka 10.000 km tersebut dihitung berdasarkan kondisi berkendara normal (kecepatan konstan di jalan bebas hambatan). Ketika mobil terjebak kemacetan kota selama 2 jam setiap hari, odometer mungkin hanya bertambah 15 km, tetapi mesin tetap berputar dan mengalami siklus panas setara dengan menempuh 80–100 km di jalan tol.',
          'Untuk pemakaian urban yang padat, batas aman terbaik untuk oli Full Synthetic adalah 7.000–7.500 km atau maksimal 6 bulan. Apabila mobil jarang digunakan dan hanya dipanaskan di garasi, uap air akibat kondensasi di dalam crankcase tidak sempat menguap sempurna dan berisiko membentuk lumpur oli (oil sludge) yang menyumbat saluran pelumasan.',
        ],
        bullets: [
          'Periksa level oli lewat dipstick setiap 2 minggu sekali di permukaan garasi yang rata.',
          'Pastikan warna oli masih cokelat bening hingga gelap wajar; warna putih susu menandakan kebocoran air radiator ke ruang oli.',
          'Simpan catatan tanggal, kilometer, dan merek oli terakhir di stiker kaca atau aplikasi pengingat servis.',
        ],
        tip: 'Jangan pernah menambahkan aditif oli aftermarket secara sembarangan. Oli berstandar API SP dan ILSAC GF-6A sudah memiliki paket deterjen, anti-aus (ZDDP), dan pencegah LSPI yang seimbang.',
      },
      {
        id: 'langkah-cek-mandiri',
        heading: '3. Prosedur Cek Level Oli Secara Mandiri dalam 3 Menit',
        paragraphs: [
          'Parkirkan mobil di area datar lalu matikan mesin. Jika mesin baru saja beroperasi, tunggu sekitar 5 menit agar seluruh oli dari bagian atas kepala silinder turun kembali ke carter (oil pan). Tarik batang dipstick berwarna kuning atau oranye, lap bersih dengan tisu bebas serat, masukkan kembali hingga mentok, lalu tarik sekali lagi.',
          'Posisi lapisan oli harus berada di antara titik atau garis batas bawah (MIN) dan batas atas (MAX). Jika berada di bawah garis tengah atau mendekati MIN, segera tambahkan oli dengan spesifikasi SAE yang sama persis sambil memeriksa apakah terdapat rembesan di sekitar gasket tutup klep atau baut pembuangan oli.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah aman mengganti merek oli saat servis berkala?',
        answer:
          'Aman, selama viskositas SAE dan standar API/ILSAC memenuhi atau melebihi spesifikasi buku manual, serta oli lama dikuras tuntas bersama penggantian filter oli.',
      },
      {
        question: 'Apakah mesin tua wajib naik ke oli lebih kental?',
        answer:
          'Tidak wajib selama tekanan oli normal, tidak ada asap biru dari knalpot, dan konsumsi oli tidak menyusut drastis antar jadwal servis.',
      },
    ],
  },
  {
    slug: 'sistem-pengereman-cakram-abs-tanda-kampas-aus',
    title: 'Sistem Pengereman Cakram & ABS: 6 Tanda Kampas Aus dan Jadwal Kuras Minyak Rem',
    excerpt:
      'Kenali bunyi decit indikator aus, getaran pedal saat pengereman kecepatan tinggi, serta bahaya kadar air pada minyak rem DOT 3 dan DOT 4.',
    category: 'Rem & Suspensi',
    subsystemId: 'brakes',
    readMinutes: 6,
    updatedAt: '08 November 2026',
    author: { name: 'Rafli Granada', role: 'Editor Teknis Otomotif' },
    reviewer: 'Budi Santoso (Spesialis Kaki-Kaki & Rem)',
    difficulty: 'Pemula',
    estimatedCost: 'Rp 400.000 – Rp 1.200.000',
    image: imgBrakes,
    imageAlt: 'Cakram rem berventilasi dan kaliper metalik di balik velg alloy mobil',
    keyTakeaways: [
      'Kampas rem wajib diganti ketika ketebalan material friksinya tersisa 3 mm atau kurang, sebelum pelat besi menggerus permukaan piringan cakram.',
      'Minyak rem bersifat higroskopis (menyerap kelembapan udara) sehingga harus dikuras setiap 2 tahun atau 40.000 km.',
      'Setir bergetar saat pedal rem diinjak pada kecepatan 80+ km/jam menandakan ketebalan cakram sudah tidak rata (disc runout / warping).',
    ],
    sections: [
      {
        id: 'gejala-kampas-aus',
        heading: '1. Mengenali Sinyal Fisik Sebelum Rem Kehilangan Daya Cengkeram',
        paragraphs: [
          'Sebagian besar kampas rem cakram modern dibekali pelat logam kecil bernama wear indicator. Ketika kampas menipis hingga ambang 2–3 mm, pelat tersebut akan menyentuh piringan cakram yang berputar dan menghasilkan bunyi decit nyaring bernada tinggi saat Anda melaju pelan atau menekan rem ringan.',
          'Jika bunyi peringatan ini diabaikan, material kampas akan habis total sehingga pelat besi dudukan kampas bergesekan langsung dengan rotor baja. Bunyi berubah menjadi geraman kasar logam beradu logam, jarak pengereman memanjang drastis, dan biaya perbaikan membengkak karena piringan cakram ikut tergores dalam dan harus dibubut atau diganti sepasang.',
        ],
        bullets: [
          'Pedal rem terasa lebih dalam dari biasanya saat diinjak penuh.',
          'Mobil terasa sedikit menarik ke kiri atau kanan ketika melakukan pengereman mendadak.',
          'Terdapat serbuk debu hitam tebal tidak wajar pada satu sisi velg akibat kaliper macet (seized slide pin).',
          'Lampu indikator rem parkir atau ABS di panel instrumen menyala terus saat kendaraan berjalan.',
        ],
      },
      {
        id: 'minyak-rem-dot',
        heading: '2. Pentingnya Menguras Minyak Rem DOT 3 & DOT 4 Secara Berkala',
        paragraphs: [
          'Berbeda dengan oli mesin yang bersirkulasi, minyak rem bekerja dalam sistem hidrolik tertutup namun tetap mampu menyerap uap air dari udara melalui selang rem fleksibel dan tutup reservoir. Kandungan air lebih dari 3% menurunkan titik didih minyak rem secara tajam. Ketika Anda melewati turunan panjang seperti jalur pegunungan dan terus menahan rem, panas dari kaliper dapat membuat air di dalam minyak rem mendidih dan membentuk gelembung uap (vapor lock).',
          'Karena gas bersifat dapat dimampatkan, pedal rem mendadak terasa empuk atau blong saat diinjak. Itulah sebabnya bengkel profesional selalu memeriksa kadar air minyak rem dengan brake fluid tester dan merekomendasikan bleeding/pengurasan total setiap 24 bulan.',
        ],
        table: {
          headers: ['Spesifikasi', 'Titik Didih Kering Min.', 'Titik Didih Basah Min.', 'Catatan Penggunaan'],
          rows: [
            ['DOT 3', '205°C', '140°C', 'Mobil penumpang harian dan MPV standar'],
            ['DOT 4', '230°C', '155°C', 'Mobil modern dengan sistem ABS, EBD, dan ESP/VSC'],
            ['DOT 5.1', '260°C', '180°C', 'Kendaraan performa tinggi atau beban angkut berat'],
          ],
        },
        tip: 'Jangan pernah mencampur minyak rem berbasis glikol (DOT 3/4/5.1) dengan DOT 5 berbasis silikon karena dapat merusak seal karet kaliper dan modul ABS.',
      },
    ],
    faqs: [
      {
        question: 'Kapan piringan cakram harus dibubut atau diganti?',
        answer:
          'Bubut cakram (disc skimming) hanya boleh dilakukan jika ketebalan sisa rotor masih di atas angka minimal (Min. Thickness) yang terukir pada bibir cakram. Jika sudah di bawah batas, wajib diganti baru.',
      },
      {
        question: 'Mengapa pedal rem bergetar saat ABS bekerja?',
        answer:
          'Getaran cepat disertai bunyi ketukan halus saat pengereman darurat di jalan licin adalah reaksi normal modul ABS yang memompa tekanan hidrolik puluhan kali per detik agar roda tetap dapat dikendalikan.',
      },
    ],
  },
  {
    slug: 'merawat-aki-mobil-dan-sistem-pengisian-alternator',
    title: 'Cara Merawat Aki Mobil dan Mendeteksi Alternator Lemah dengan Multimeter',
    excerpt:
      'Pelajari perbedaan aki basah, MF, dan EFB/AGM untuk mobil Start-Stop, angka tegangan normal saat starter, dan cara mencegah aki tekor mendadak.',
    category: 'Kelistrikan & Aki',
    subsystemId: 'electrical',
    readMinutes: 6,
    updatedAt: '06 November 2026',
    author: { name: 'Rafli Granada', role: 'Editor Teknis Otomotif' },
    reviewer: 'Dimas Pratama (Teknisi Kelistrikan Mobil)',
    difficulty: 'Pemula',
    estimatedCost: 'Rp 900.000 – Rp 2.400.000 (ganti unit)',
    image: imgBattery,
    imageAlt: 'Teknisi mengukur tegangan aki mobil 12V menggunakan multimeter digital',
    keyTakeaways: [
      'Aki sehat menunjukkan tegangan 12,4V–12,7V saat mesin mati dan naik ke 13,8V–14,4V ketika mesin menyala.',
      'Mobil dengan fitur Idling Start-Stop wajib memakai aki tipe EFB atau AGM, bukan aki MF biasa.',
      'Serbuk putih kebiruan pada terminal aki menghambat arus starter dan harus dibersihkan dengan air hangat serta sikat kawat halus.',
    ],
    sections: [
      {
        id: 'diagnosa-tegangan',
        heading: '1. Membaca Kesehatan Aki dan Alternator dalam Tiga Pengukuran',
        paragraphs: [
          'Kegagalan aki jarang terjadi secara tiba-tiba tanpa gejala; umumnya pemilik hanya melewatkan tanda penurunan performa seperti suara dinamo starter yang terdengar lebih lambat di pagi hari atau lampu utama sedikit meredup saat idle. Dengan multimeter digital sederhana seharga seratus ribuan rupiah, Anda bisa memeriksa kondisi sistem kelistrikan mobil sendiri sebelum melakukan perjalanan jauh.',
          'Pengukuran pertama dilakukan saat mesin mati minimal 2 jam (tegangan istirahat). Pengukuran kedua dilakukan tepat saat kunci kontak diputar ke posisi START untuk melihat apakah tegangan turun drastis di bawah 9,6V (tanda sel aki lemah). Pengukuran ketiga dilakukan saat mesin menyala di 1.500 RPM dengan AC dan lampu dinyalakan untuk memastikan alternator mengisi dengan stabil.',
        ],
        table: {
          headers: ['Kondisi Pengukuran', 'Rentang Tegangan Normal', 'Indikasi Jika Di Luar Batas'],
          rows: [
            ['Mesin Mati (Istirahat)', '12,4 V – 12,7 V', 'Di bawah 12,2 V: aki butuh charge atau mulai drop'],
            ['Saat Proses Starter (Cranking)', '≥ 10,0 V', 'Di bawah 9,6 V: kapasitas CCA sel aki sudah lemah'],
            ['Mesin Hidup + Beban AC/Lampu', '13,8 V – 14,4 V', 'Di bawah 13,2 V: alternator/IC regulator bermasalah'],
            ['Overcharging (Mesin Hidup)', '> 14,8 V', 'Regulator alternator rusak; berisiko merusak ECU & aki'],
          ],
        },
      },
      {
        id: 'jenis-aki-dan-perawatan',
        heading: '2. Memilih Tipe Aki yang Tepat dan Kebiasaan Agar Awet 3+ Tahun',
        paragraphs: [
          'Banyak kasus aki baru cepat rusak dalam 6 bulan terjadi karena salah memilih spesifikasi teknologi aki. Kendaraan yang memiliki fitur Auto Start-Stop atau sistem pengisian pintar (smart charging) membutuhkan aki tipe EFB (Enhanced Flooded Battery) atau AGM (Absorbent Glass Mat) yang tahan siklus pengosongan berulang. Memasang aki kering standar (Maintenance Free biasa) pada mobil Start-Stop akan membuat pelat timahnya cepat melengkung dan gagal menyimpan muatan.',
          'Pastikan pula aksesori tambahan seperti dashcam 24 jam, audio amplifier, atau lampu aftermarket dipasang melalui sekring terpisah (add-a-circuit) yang benar dan memiliki pemutus tegangan rendah (low-voltage cut-off) agar tidak menguras aki saat mobil diparkir berhari-hari.',
        ],
        bullets: [
          'Untuk aki basah konvensional, cek ketinggian air aki (H2O murni tutup biru, bukan air zuur) setiap bulan antara garis LOWER dan UPPER.',
          'Pastikan klem aki terpasang kencang dan bebas kerak sulfat agar arus pengisian dari alternator tidak terhambat.',
          'Matikan seluruh beban listrik (AC, audio, lampu) sebelum mematikan mesin dan sebelum memutar starter.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Berapa rata-rata usia pakai aki mobil di iklim tropis?',
        answer:
          'Umumnya 1,5 hingga 2,5 tahun untuk aki standar di kota panas dan macet, atau hingga 3–4 tahun jika suhu ruang mesin terjaga dan jarak tempuh harian cukup panjang untuk pengisian optimal.',
      },
      {
        question: 'Apakah aman melepas kabel aki saat mobil lama tidak dipakai?',
        answer:
          'Pada mobil modern dengan ECU kompleks, melepas terminal negatif terlalu lama dapat mereset memori idle throttle dan pengaturan audio. Lebih disarankan menggunakan smart trickle charger atau menyalakan mesin 15 menit setiap 5–7 hari.',
      },
    ],
  },
  {
    slug: 'panduan-tekanan-angin-rotasi-ban-dan-spooring',
    title: 'Tekanan Angin Ban, Rotasi Silang, dan Kapan Mobil Wajib Spooring & Balancing',
    excerpt:
      'Cara membaca TWI pada alur ban, pola rotasi ban penggerak depan vs belakang, serta gejala kaki-kaki yang membutuhkan penyetelan camber dan toe.',
    category: 'Ban & Kaki-kaki',
    subsystemId: 'tires',
    readMinutes: 6,
    updatedAt: '05 November 2026',
    author: { name: 'Rafli Granada', role: 'Editor Teknis Otomotif' },
    reviewer: 'Budi Santoso (Spesialis Kaki-Kaki & Rem)',
    difficulty: 'Pemula',
    estimatedCost: 'Rp 250.000 – Rp 450.000',
    image: imgTires,
    imageAlt: 'Pemeriksaan kedalaman alur tapak ban dan spooring roda di bengkel modern',
    keyTakeaways: [
      'Cek tekanan angin sesuai stiker di pilar B pintu pengemudi (umumnya 30–35 PSI) saat ban masih dingin sebelum berjalan jauh.',
      'Batas aman kedalaman alur ban minimal adalah 1,6 mm (sejajar tonjolan TWI di sela alur ban).',
      'Rotasi ban setiap 10.000 km meratakan keausan sehingga umur pakai satu set ban bisa bertambah hingga 25%.',
    ],
    sections: [
      {
        id: 'tekanan-dan-twi',
        heading: '1. Dampak Tekanan Angin dan Cara Membaca Indikator Keausan (TWI)',
        paragraphs: [
          'Ban kurang angin menyebabkan sisi bahu luar dan dalam ban tertekuk berlebihan saat menanggung bobot kendaraan. Akibatnya, dinding samping ban cepat panas, risiko pecah ban di jalan tol meningkat, dan konsumsi bahan bakar lebih boros karena hambatan gulir naik. Sebaliknya, tekanan angin yang terlalu keras memusatkan gesekan hanya pada bagian tengah tapak ban serta mengurangi daya serap benturan suspensi.',
          'Periksa juga tonjolan kecil di dasar alur utama ban yang sejajar dengan tanda segitiga atau tulisan TWI (Tread Wear Indicator) di dinding ban. Ketika permukaan karet tapak sudah sejajar dengan tonjolan TWI (1,6 mm), kemampuan ban memecah genangan air hilang drastis dan mobil sangat rentan mengalami aquaplaning saat hujan.',
        ],
        bullets: [
          'Mobil penggerak depan (FWD): pindahkan ban depan lurus ke belakang, dan ban belakang menyilang ke depan.',
          'Mobil penggerak belakang/4WD (RWD/AWD): pindahkan ban belakang lurus ke depan, dan ban depan menyilang ke belakang.',
          'Untuk ban bertipe tapak searah (directional), lakukan rotasi depan-ke-belakang di sisi yang sama saja.',
        ],
      },
      {
        id: 'spooring-vs-balancing',
        heading: '2. Membedakan Kebutuhan Spooring dan Balancing',
        paragraphs: [
          'Banyak pengemudi masih tertukar antara fungsi spooring (wheel alignment) dan balancing. Balancing bertujuan menyeimbangkan distribusi bobot velg dan ban dengan menambahkan timah penyeimbang agar roda tidak bergetar pada kecepatan tertentu (biasanya terasa di setir pada rentang 80–110 km/jam). Balancing wajib dilakukan setiap kali ganti ban baru, menambal ban dari dalam, atau membentur lubang jalan keras.',
          'Sementara itu, spooring menyetel ulang sudut geometri roda (toe, camber, dan caster) agar keempat roda bergerak paralel sempurna. Spooring diperlukan apabila setir tampak miring saat melaju lurus, mobil cenderung menarik ke satu arah di jalan rata, atau muncul pola keausan ban yang botak sebelah (feathering/inner wear).',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah ban berumur lebih dari 5 tahun masih aman jika kembangnya tebal?',
        answer:
          'Kompon karet mengalami oksidasi dan mengeras seiring waktu meski jarang dipakai. Setelah 5–6 tahun sejak kode produksi (4 digit di dinding ban, misal 2421 berarti minggu ke-24 tahun 2021), periksa ketat apakah ada retak rambut sebelum dipakai perjalanan jauh.',
      },
      {
        question: 'Nitrogen atau angin biasa, mana yang lebih baik?',
        answer:
          'Keduanya aman. Keunggulan nitrogen adalah molekulnya lebih besar sehingga penurunan tekanan bulanan sedikit lebih lambat dan kadar kelembapannya rendah, namun menjaga tekanan PSI rutin jauh lebih menentukan keselamatan.',
      },
    ],
  },
  {
    slug: 'penyebab-ac-mobil-kurang-dingin-dan-perawatan-kompresor',
    title: '5 Penyebab AC Mobil Kurang Dingin Saat Macet dan Cara Merawat Kompresor',
    excerpt:
      'Mengapa AC dingin di jalan tol tetapi hangat saat berhenti di lampu merah? Pelajari peran extra fan, kondensor, filter kabin, dan oli kompresor.',
    category: 'AC & Kabin',
    subsystemId: 'ac',
    readMinutes: 5,
    updatedAt: '03 November 2026',
    author: { name: 'Rafli Granada', role: 'Editor Teknis Otomotif' },
    reviewer: 'Hendra Wijaya (Teknisi Bersertifikat)',
    difficulty: 'Pemula',
    estimatedCost: 'Rp 180.000 – Rp 850.000',
    image: imgEngineBay,
    imageAlt: 'Pemeriksaan sistem pendingin dan kondensor di ruang mesin mobil',
    keyTakeaways: [
      'AC hanya terasa panas saat macet hampir selalu mengarah ke motor extra fan lemah atau sirip kondensor yang sangat kotor.',
      'Freon (refrigeran) dalam sistem tertutup tidak pernah habis kecuali terjadi kebocoran pada seal, selang, atau evaporator.',
      'Mengganti filter kabin setiap 15.000 km menjaga hembusan blower tetap kencang dan mencegah bau apek dari jamur evaporator.',
    ],
    sections: [
      {
        id: 'diagnosa-ac-macet',
        heading: '1. Membedakan Masalah Aliran Udara Kondensor vs Kebocoran Refrigeran',
        paragraphs: [
          'Jika AC terasa dingin menggigit saat mobil melaju 60–80 km/jam di jalan bebas hambatan tetapi mendadak berhembus hangat ketika berhenti di kemacetan, masalah utamanya jarang berasal dari freon habis. Saat mobil melaju cepat, terpaan angin alami membantu kondensor di belakang gril depan membuang panas. Ketika berhenti, tugas pendinginan tersebut sepenuhnya bergantung pada putaran kipas radiator/extra fan.',
          'Motor kipas yang sudah aus (carbon brush habis) berputar jauh lebih lambat sehingga tekanan di sisi tinggi kompresor melonjak dan fitur pengaman memutus magnetic clutch secara otomatis. Penyebab lain adalah sirip kondensor yang tertutup debu pekat atau bekas serangga.',
        ],
        bullets: [
          'Buka kap mesin saat AC hidup dan pastikan kipas radiator/kondensor berputar kencang dan stabil.',
          'Jika hembusan angin dari kisi-kisi dasbor lemah meski fan blower sudah disetel ke level tinggi, periksa dan ganti filter kabin di balik laci penumpang.',
          'Jangan langsung menambah freon tanpa melakukan uji vakum dan deteksi kebocoran, karena kelebihan tekanan justru memperberat kerja kompresor.',
        ],
      },
      {
        id: 'perawatan-kompresor',
        heading: '2. Menjaga Umur Kompresor dan Kebersihan Udara Kabin',
        paragraphs: [
          'Kompresor AC memiliki oli pelumas khusus (PAG oil) yang bersirkulasi bersama refrigeran. Setiap 30.000–40.000 km atau 2 tahun sekali, lakukan perawatan berkala berupa flushing atau penggantian oli kompresor beserta filter dryer agar pelumasan piston kompresor tetap optimal dan tidak macet.',
          'Kebiasaan sederhana seperti membuka kaca sebentar untuk membuang udara panas yang terperangkap di kabin setelah parkir di bawah terik matahari sebelum menyalakan AC maksimal juga meringankan beban awal kompresor secara signifikan.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah mematikan AC sebelum mematikan mesin itu wajib?',
        answer:
          'Mobil modern memutus kopling kompresor secara otomatis saat starter berputar, namun mematikan tombol A/C beberapa menit sebelum tiba sambil tetap menyalakan blower membantu mengeringkan uap air di evaporator sehingga kabin tidak bau apek.',
      },
    ],
  },
  {
    slug: 'servis-berkala-transmisi-otomatis-cvt-dan-atf',
    title: 'Servis Transmisi Otomatis CVT dan AT Konvensional: Jangan Tunggu Selip',
    excerpt:
      'Mitos "lifetime transmission fluid", perbedaan karakter oli CVT dan ATF, serta gejala awal body valve atau sabuk baja yang mulai bermasalah.',
    category: 'Mesin & Oli',
    subsystemId: 'engine',
    readMinutes: 7,
    updatedAt: '01 November 2026',
    author: { name: 'Rafli Granada', role: 'Editor Teknis Otomotif' },
    reviewer: 'Hendra Wijaya (Teknisi Bersertifikat)',
    difficulty: 'Menengah',
    estimatedCost: 'Rp 850.000 – Rp 1.800.000',
    image: imgEngineBay,
    imageAlt: 'Pemeriksaan teknis area powertrain dan transmisi otomatis mobil',
    keyTakeaways: [
      'Meski sebagian stiker kap mesin menyebut "lifetime fluid", di iklim tropis dan kemacetan, ganti oli CVT/ATF tiap 40.000 km adalah investasi terbaik.',
      'Jangan pernah menukar spesifikasi oli ATF ke oli CVT (atau sebaliknya) karena koefisien gesek sabuk baja dan kopling basah sangat berbeda.',
      'Jika jarak tempuh sudah di atas 100.000 km tanpa riwayat ganti oli transmisi, pilih metode tap/refill bertahap dibanding flushing bertekanan tinggi.',
    ],
    sections: [
      {
        id: 'mitos-lifetime',
        heading: '1. Mengapa Istilah "Lifetime Fluid" Sering Menyesatkan Pemilik Mobil?',
        paragraphs: [
          'Beberapa pabrikan tidak mencantumkan jadwal penggantian oli transmisi di buku servis dasar karena menganggap masa pakai transmisi berada di rentang garansi pabrik (misalnya 100.000 km atau 3–5 tahun). Bagi pemilik mobil di Indonesia yang berencana menggunakan kendaraan hingga 8–10 tahun, membiarkan fluida transmisi tidak diganti hingga 100.000 km akan membuat viskositas dan aditif pencegah gesekannya rusak akibat panas tinggi kemacetan.',
          'Pada transmisi CVT (Continuously Variable Transmission), sabuk baja (steel belt) bergesekan langsung dengan puli kerucut di bawah tekanan hidrolik ekstrem. Serbuk logam mikroskopis dari gesekan normal akan menumpuk dan menyumbat solenoid body valve jika oli tidak diganti secara teratur setiap 40.000 km.',
        ],
        table: {
          headers: ['Tipe Transmisi', 'Mekanisme Kerja', 'Interval Aman Ganti Oli'],
          rows: [
            ['AT Konvensional (Torque Converter)', 'Roda gigi planetary & kopling basah', 'Setiap 40.000 km (tap) / 60.000 km (kuras)'],
            ['CVT (Steel Belt / Chain)', 'Sepasang puli variabel & sabuk baja', 'Setiap 35.000 – 40.000 km (wajib spesifik CVT)'],
            ['DCT (Dual Clutch)', 'Kopling ganda kering atau basah', 'Kering: cek aktuator; Basah: tiap 40.000 km'],
          ],
        },
      },
      {
        id: 'gejala-awal',
        heading: '2. Gejala Awal Penurunan Performa Transmisi Otomatis',
        paragraphs: [
          'Waspadai jeda perpindahan gigi lebih dari 1,5 detik saat memindahkan tuas dari N ke D atau R (delay engagement), hentakan kasar (jedug) saat perpindahan turun di kemacetan, atau putaran mesin RPM yang melonjak tinggi namun akselerasi mobil terasa tertahan. Pemeriksaan level dan bau oli transmisi (jika berbau hangus dan berwarna hitam pekat) harus segera dilakukan sebelum kerusakan mekanis menyebar.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Mana yang lebih aman, kuras (flushing) atau ganti biasa (drain & fill)?',
        answer:
          'Jika servis dilakukan rutin sejak kilometer rendah (tiap 40.000 km), keduanya aman. Namun untuk mobil dengan riwayat servis tidak jelas di atas 100.000 km, drain & fill dua kali lebih aman agar kerak lama tidak terlepas mendadak menyumbat valve body.',
      },
    ],
  },
  {
    slug: 'merawat-cat-bodi-mobil-dari-jamur-dan-sinar-uv',
    title: 'Merawat Cat Bodi Mobil dari Jamur Air Hujan, Getah Pohon, dan Oksidasi UV',
    excerpt:
      'Teknik mencuci two-bucket method agar bebas swirl mark, cara menghilangkan water spot secara aman, dan perbandingan wax vs ceramic sealant.',
    category: 'Perawatan Bodi',
    subsystemId: 'body',
    readMinutes: 5,
    updatedAt: '29 Oktober 2026',
    author: { name: 'Rafli Granada', role: 'Editor Teknis Otomotif' },
    reviewer: 'Dimas Pratama (Teknisi Kelistrikan Mobil)',
    difficulty: 'Pemula',
    estimatedCost: 'Rp 150.000 – Rp 600.000 (produk mandiri)',
    image: imgTires,
    imageAlt: 'Bodi mobil dengan kilap clearcoat bersih terawat di area workshop terang',
    keyTakeaways: [
      'Sebanyak 80% baret halus (swirl mark) berasal dari teknik mencuci satu ember dan penggunaan kanebo kotor yang menyeret pasir di atas clearcoat.',
      'Jangan biarkan air hujan mengering di bawah terik matahari; kandungan mineral dan asamnya dapat menembus clearcoat membentuk etching permanen.',
      'Gunakan microfiber wash mitt dan handuk pengering GSM tinggi (≥ 500 GSM) yang ditarik perlahan tanpa tekanan berlebih.',
    ],
    sections: [
      {
        id: 'two-bucket-method',
        heading: '1. Teknik Cuci Dua Ember untuk Mencegah Swirl Mark',
        paragraphs: [
          'Lapisan pernis (clearcoat) cat mobil modern hanya setebal 35–50 mikron—lebih tipis dari sehelai rambut manusia. Saat Anda mencuci mobil dengan satu ember saja, kotoran pasir yang terangkat oleh spons akan kembali menempel ke bodi pada usapan berikutnya dan menggores lapisan bening tersebut.',
          'Gunakan metode dua ember: satu ember berisi larutan sampo mobil pH netral (pH 7), dan ember kedua berisi air bersih untuk membilas wash mitt setiap selesai membersihkan satu panel. Mulailah selalu dari bagian atap dan kaca ke bawah, lalu gunakan kuas dan ember terpisah khusus untuk area velg serta kolong ban yang penuh debu kampas rem.',
        ],
      },
      {
        id: 'proteksi-cat',
        heading: '2. Memilih Proteksi: Carnauba Wax, Polymer Sealant, atau Ceramic?',
        paragraphs: [
          'Setelah mobil dicuci bersih dan dikeringkan, melapisi bodi dengan proteksi hidrofobik akan membuat air dan debu sulit menempel serta melindungi pigmen cat dari sinar ultraviolet. Untuk penggunaan harian di Indonesia yang sering diguyur hujan tropis lalu tersengat matahari, SiO2 spray sealant atau polymer sealant jauh lebih tahan lama (3–6 bulan) dibanding wax alami yang mudah luntur oleh panas mesin.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Apakah sampo pencuci piring aman dipakai mencuci mobil?',
        answer:
          'Tidak disarankan untuk cuci rutin karena sifat degreasing-nya yang kuat akan melucuti lapisan wax/sealant pelindung dan membuat karet trim pintu lebih cepat getas.',
      },
    ],
  },
  {
    slug: 'checklist-inspeksi-mobil-sebelum-perjalanan-jauh',
    title: 'Checklist Inspeksi 12 Titik Mobil Sebelum Perjalanan Jauh & Mudik Jalan Tol',
    excerpt:
      'Daftar periksa praktis mencakup seluruh fluida vital, ban serep, sistem lampu, wiper, hingga perlengkapan darurat yang dapat diselesaikan dalam 20 menit.',
    category: 'Ban & Kaki-kaki',
    subsystemId: 'tires',
    readMinutes: 6,
    updatedAt: '25 Oktober 2026',
    author: { name: 'Rafli Granada', role: 'Editor Teknis Otomotif' },
    reviewer: 'Hendra Wijaya (Teknisi Bersertifikat)',
    difficulty: 'Pemula',
    estimatedCost: 'Gratis (inspeksi mandiri)',
    image: imgBattery,
    imageAlt: 'Pemeriksaan menyeluruh kompartemen depan mobil sebelum perjalanan jarak jauh',
    keyTakeaways: [
      'Lakukan pengecekan fisik minimal H-7 sebelum keberangkatan agar tersedia waktu cukup jika harus memesan suku cadang.',
      'Jangan pernah melupakan tekanan angin ban serep (sering diabaikan hingga kempis saat benar-benar dibutuhkan).',
      'Pastikan cairan pendingin radiator (coolant) berada di garis MAX pada tabung cadangan dalam kondisi mesin dingin.',
    ],
    sections: [
      {
        id: 'fluida-dan-kap',
        heading: '1. Enam Poin Pemeriksaan di Balik Kap Mesin',
        paragraphs: [
          'Sebelum menempuh ratusan kilometer di kecepatan konstan jalan tol, luangkan 10 menit di pagi hari saat mesin dingin untuk membuka kap mesin. Periksa level oli mesin, ketinggian radiator coolant di tangki reservoir, level minyak rem di wadah transparan dekat booster, serta isi penuh tabung air wiper dengan cairan pembersih kaca (hindari memakai sabun berbusa tinggi yang menyumbat nozel).',
          'Perhatikan juga kondisi V-belt / drive belt alternator dan AC; pastikan tidak ada retakan melintang di sisi dalam alur karet maupun bunyi berdecit saat mesin baru dinyalakan.',
        ],
      },
      {
        id: 'keselamatan-dan-darurat',
        heading: '2. Enam Poin Ban, Penerangan, dan Peralatan Darurat',
        paragraphs: [
          'Ukur tekanan angin keempat ban sesuai beban penuh (penumpang + bagasi) yang biasanya tercantum di stiker kusen pintu, serta pompa ban cadangan hingga batas maksimal yang tertera di dindingnya. Nyalakan seluruh lampu eksterior—lampu senja, lampu dekat, lampu jauh, sein kiri-kanan, lampu rem termasuk high-mount stop lamp, dan lampu mundur.',
          'Terakhir, pastikan dongkrak, kunci roda, segitiga pengaman, kabel jumper, dan kotak P3K tersimpan di tempat yang mudah dijangkau tanpa harus membongkar seluruh isi bagasi terlebih dahulu.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Bolehkah mencampur air keran ke tabung radiator coolant?',
        answer:
          'Hindari air keran karena kandungan mineral dan kapurnya memicu karat serta kerak di kisi radiator aluminium. Gunakan coolant premix pabrikan atau air distilasi (air aki tutup biru) hanya dalam kondisi darurat sementara.',
      },
    ],
  },
];
