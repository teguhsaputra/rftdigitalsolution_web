/**
 * Konten marketing & data publik — satu sumber kebenaran untuk semua halaman.
 * PT. RFT Digital Solution — digital agency.
 */

export const agencyName = 'PT. RFT Digital Solution';

export const agencyPositioning =
  'Kami bantu bisnis Anda tampil lebih kuat di dunia digital — dari bikin website sampai naikin traffic, branding, dan kelola media sosial.';

/** Klien yang sudah bekerja dengan kami (logo di public/partners). Admin: /admin/trusted-partners. */
export type TrustedPartnerItem = { name: string; imageUrl: string | null };

export const trustedPartners: TrustedPartnerItem[] = [
  { name: 'Bloometry Bouquet', imageUrl: '/partners/bloometry-bouquet.webp' },
  { name: 'Fakultas Kedokteran UIN Jakarta', imageUrl: '/partners/fk-uin-jakarta.webp' },
  { name: 'Reliprove', imageUrl: '/partners/reliprove.webp' },
  { name: 'Millenials Farm', imageUrl: '/partners/millenials-farm.webp' },
  { name: 'PT Yabes Mega Utama', imageUrl: '/partners/yabes-mega-utama.webp' },
  { name: 'Launa', imageUrl: '/partners/launa.webp' },
  { name: 'Natura Hills', imageUrl: '/partners/natura-hills.webp' },
  { name: 'Takar Rasa', imageUrl: '/partners/takar-rasa.webp' },
  { name: 'Thirstea', imageUrl: '/partners/thristea.webp' },
  { name: 'Terus Terang Teknologi', imageUrl: '/partners/terus-terang-teknologi.webp' },
];

export type ServiceItem = {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  details: string[];
  /** Harga mulai dari (Rp); null = "Hubungi kami". */
  priceFrom: number | null;
};

export const coreServices: ServiceItem[] = [
  {
    slug: 'website',
    priceFrom: 2500000,
    title: 'Pembuatan Website',
    titleEn: 'Website Development',
    summary:
      'Mau company profile, toko online, atau landing page yang benar-benar mendatangkan pelanggan? Kami kerjakan dari nol pakai teknologi terkini — hasilnya cepat, aman, dan enak dilihat di semua device.',
    details: [
      'Desain layout & struktur konten yang pas untuk bisnis Anda',
      'Dibangun pakai Next.js & stack modern, responsif di semua layar',
      'Bisa sambungin ke analytics, form inquiry, atau CMS kalau perlu',
    ],
  },
  {
    slug: 'mobile-apps',
    priceFrom: 15000000,
    title: 'Aplikasi Mobile',
    titleEn: 'Mobile Apps',
    summary:
      'Punya ide aplikasi untuk pelanggan atau operasional internal? Kami develop untuk iOS & Android sekaligus, dari prototipe sampai rilis di store.',
    details: [
      'Prototipe interaktif & testing bareng tim Anda',
      'Backend solid, API rapi, siap integrasi ke sistem yang sudah ada',
      'Bantu submit ke App Store & Play Store, plus maintenance',
    ],
  },
  {
    slug: 'seo',
    priceFrom: 1500000,
    title: 'SEO Management',
    titleEn: 'SEO Management',
    summary:
      'Biar website Anda nggak cuma bagus tapi juga ketemu di Google. Kami urus audit teknis, riset keyword, sampai strategi konten jangka panjang.',
    details: [
      'Audit on-page & teknikal menyeluruh',
      'Riset keyword + pemetaan konten yang realistis',
      'Laporan bulanan yang jelas — bukan cuma angka, tapi insight',
    ],
  },
  {
    slug: 'branding',
    priceFrom: 2000000,
    title: 'Branding',
    titleEn: 'Branding',
    summary:
      'Identitas visual yang konsisten bikin bisnis Anda lebih mudah diingat. Mulai dari logo, warna, tipografi, sampai guideline lengkap.',
    details: [
      'Desain logo, palet warna, & tipografi yang selaras',
      'Aset visual untuk digital dan cetak',
      'Brand story & positioning yang mudah diingat audiens',
    ],
  },
  {
    slug: 'social-media',
    priceFrom: 1500000,
    title: 'Social Media',
    titleEn: 'Social Media',
    summary:
      'Nggak cuma posting — kami bantu susun strategi konten, desain feed, dan jalankan iklan yang terukur hasilnya.',
    details: [
      'Content pillar & ide konten kreatif tiap bulan',
      'Manajemen komunitas & engagement',
      'Setup iklan + optimasi supaya budget iklan tidak terbuang',
    ],
  },
];

export type PortfolioItem = {
  slug: string;
  title: string;
  clientType: string;
  focus: string;
  description: string;
  image?: string | null;
  services: string[];
};

/** Contoh project lama (fiktif) — seed menyembunyikannya bila masih ada di database. */
export const legacyPortfolioSlugs = [
  'korporat-fnb',
  'startup-logistik',
  'retail-kosmetik',
  'edtech-membership',
  'klinik-kesehatan',
];

export const portfolioProjects: PortfolioItem[] = [
  {
    slug: 'bloometry-bouquet-ecommerce',
    title: 'Website e-commerce Bloometry Bouquet',
    clientType: 'Florist & Beauty • E-commerce',
    focus: 'React.js • Node.js • PostgreSQL',
    description:
      'Toko online cepat dengan katalog produk, pencarian & filter, checkout aman dengan banyak metode pembayaran, pelacakan pesanan, dan CMS untuk promo musiman. Dibangun SEO-friendly supaya mudah ditemukan dan gampang konversi.',
    image: '/portfolio/bloometry-ecommerce.webp',
    services: ['Pembuatan Website', 'SEO Management'],
  },
  {
    slug: 'meducalc-fk-uin-jakarta',
    title: 'MeduCalc — aplikasi web pendidikan kedokteran',
    clientType: 'Fakultas Kedokteran UIN Jakarta • Pendidikan',
    focus: 'React.js • Node.js • SQL',
    description:
      'Aplikasi web untuk FK UIN Jakarta dengan modul perhitungan medis yang akurat dan pembelajaran interaktif. Cepat, aman, dan siap dipakai untuk kebutuhan akademik yang kompleks.',
    image: '/portfolio/meducalc-fk-uin.webp',
    services: ['Pembuatan Website'],
  },
  {
    slug: 'reliprove-sertifikasi',
    title: 'Reliprove — aplikasi web sertifikasi',
    clientType: 'Asesmen & Sertifikasi • Korporat & Akademik',
    focus: 'Aplikasi web • Auto scoring • Verifikasi QR',
    description:
      'Platform sertifikasi dengan peran admin, asesor, dan peserta: pendaftaran online, bank soal, tes acak, rubrik, penilaian otomatis, verifikasi sertifikat lewat QR code, tanda tangan digital, dan dashboard real-time.',
    image: '/portfolio/reliprove-sertifikasi.webp',
    services: ['Pembuatan Website'],
  },
  {
    slug: 'lppm-yabes-mega-utama',
    title: 'Aplikasi web custom untuk LPPM',
    clientType: 'PT Yabes Mega Utama • Institusi',
    focus: 'React.js • Node.js • SQL',
    description:
      'Aplikasi web custom hasil kolaborasi dengan LPPM dan PT Yabes Mega Utama (Jakarta Barat) untuk kebutuhan akademik dan institusi — performa cepat, data andal, dan mudah dikembangkan.',
    image: '/portfolio/lppm-yabes-web-app.webp',
    services: ['Pembuatan Website'],
  },
  {
    slug: 'kleon-uiux-website',
    title: 'Desain UI/UX website KLEON',
    clientType: 'Korporat • Jakarta Pusat',
    focus: 'Figma • Wireframe • Prototype',
    description:
      'Desain UI/UX end-to-end di Figma: dari wireframe sampai prototype interaktif, dengan design system yang rapi dan siap dikembangkan, fokus pada pengalaman pengguna dan aksesibilitas.',
    image: '/portfolio/kleon-uiux-web.webp',
    services: ['Pembuatan Website', 'Branding'],
  },
  {
    slug: 'aplikasi-mobile-fnb',
    title: 'Aplikasi mobile F&B (Android & iOS)',
    clientType: 'F&B • Restoran & Kafe',
    focus: 'Flutter • Firebase • REST API',
    description:
      'Aplikasi restoran dengan pemesanan online, pelacakan pengiriman real-time, reservasi meja, pembayaran terintegrasi, loyalty & promo, plus dashboard analitik untuk meningkatkan repeat order.',
    image: '/portfolio/aplikasi-fnb.webp',
    services: ['Aplikasi Mobile'],
  },
  {
    slug: 'aplikasi-fitness-kesehatan',
    title: 'Desain UI/UX aplikasi fitness & kesehatan',
    clientType: 'Kesehatan • Android & iOS',
    focus: 'UI/UX mobile app',
    description:
      'Desain aplikasi untuk memantau kalori, nutrisi, dan performa latihan — lengkap dengan saran menu, jadwal olahraga, dashboard personal, dan grafik progres yang jelas dan memotivasi.',
    image: '/portfolio/aplikasi-fitness.webp',
    services: ['Aplikasi Mobile', 'Branding'],
  },
  {
    slug: 'sosmed-strategi-konten',
    title: 'Strategi & konten media sosial',
    clientType: 'Event & Lifestyle • BSD',
    focus: 'Desain konten • Kampanye • Iklan',
    description:
      'Strategi kreatif, konten yang engaging, dan pesan brand yang konsisten di Instagram, TikTok, dan Facebook — fokus menumbuhkan audiens dan hasil yang terukur.',
    image: '/portfolio/sosmed-strategi-konten.webp',
    services: ['Social Media'],
  },
  {
    slug: 'sosmed-desain-bsd',
    title: 'Kelola & desain media sosial',
    clientType: 'UMKM • BSD, Tangerang Selatan',
    focus: 'Desain konten • Copywriting • Ads',
    description:
      'Desain konten, produksi foto & video, copywriting, dan eksekusi kampanye, plus pengelolaan iklan dan analitik performa untuk memaksimalkan jangkauan dan ROI.',
    image: '/portfolio/sosmed-desain-bsd.webp',
    services: ['Social Media'],
  },
  {
    slug: 'sosmed-agribisnis',
    title: 'Media sosial untuk brand agribisnis',
    clientType: 'Pertanian & Agribisnis',
    focus: 'Konten lapangan • Kalender musiman',
    description:
      'Konten dari lahan dan fasilitas, kalender konten mengikuti musim tanam dan panen, cerita farm-to-table, serta iklan untuk menambah jangkauan, leads, dan penjualan marketplace.',
    image: '/portfolio/sosmed-agribisnis.webp',
    services: ['Social Media'],
  },
  {
    slug: 'sosmed-florist',
    title: 'Media sosial untuk florist',
    clientType: 'Florist & Dekorasi Event',
    focus: 'Konten studio • Kampanye musiman',
    description:
      'Kalender konten untuk Valentine, Hari Ibu, pernikahan, dan hadiah korporat — menonjolkan keindahan buket, proses di balik layar, dan ulasan pelanggan untuk mendorong inquiry dan penjualan.',
    image: '/portfolio/sosmed-florist.webp',
    services: ['Social Media'],
  },
];

export const aboutContent = {
  headline: 'Partner digital yang mikirin bisnis Anda, bukan cuma ngoding',
  intro:
    `${agencyName} fokus di lima hal: pembuatan website, aplikasi mobile, SEO, branding, dan media sosial. Klien kami mulai dari UMKM, institusi pendidikan, startup, sampai perusahaan — semuanya kami dampingi dari diskusi pertama sampai project berjalan.`,
  body: [
    'Tim kami menggabungkan desain, engineering, dan digital marketing. Hasilnya bukan cuma tampil bagus, tapi benar-benar membantu penjualan dan operasional Anda.',
    'Kami selalu transparan soal scope, timeline, dan cara kerja. Setiap project dimulai dari ngobrol soal bisnis Anda — bukan langsung lempar template.',
  ],
  values: [
    { title: 'Orientasi bisnis', text: 'Target dan metrik klien jadi acuan utama kami, bukan sekadar checklist fitur.' },
    { title: 'Standar teknis tinggi', text: 'Performa, aksesibilitas, dan keamanan itu non-negotiable di setiap project.' },
    { title: 'Kerja bareng', text: 'Kami kerja seperti perpanjangan tim Anda — bukan vendor yang menghilang setelah serah terima.' },
  ],
};

export type CareerOpening = {
  slug: string;
  title: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
};

export const careerOpenings: CareerOpening[] = [
  {
    slug: 'fullstack-developer',
    title: 'Full-stack Developer (Next.js)',
    location: 'Hybrid • Jakarta',
    type: 'Full-time',
    description:
      'Bangun website dan integrasi API untuk berbagai klien agency. Kerja bareng desainer dan PM, banyak variasi project — nggak monoton.',
    responsibilities: [
      'Next.js App Router, TypeScript — ini stack utama kami',
      'REST/GraphQL, Prisma atau ORM sejenis',
      'Code review dan dokumentasi yang to the point',
    ],
  },
  {
    slug: 'ui-ux-designer',
    title: 'UI/UX Designer',
    location: 'Remote',
    type: 'Full-time / Contract',
    description:
      'Rancang pengalaman digital untuk project website & mobile apps klien kami. Kalau kamu suka tantangan desain yang beda-beda tiap minggu, ini tempatnya.',
    responsibilities: [
      'Figma — wireframe, prototyping, design system',
      'User flow & usability yang make sense',
      'Handoff ke developer yang rapi dan jelas',
    ],
  },
  {
    slug: 'seo-specialist',
    title: 'SEO & Content Specialist',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Handle SEO untuk beberapa klien sekaligus: mulai dari audit, brief konten, sampai pelaporan bulanan. Cocok buat yang suka ngulik data dan nulis.',
    responsibilities: [
      'Technical & on-page SEO',
      'Riset keyword dan strategi konten',
      'Koordinasi sama tim konten klien',
    ],
  },
];
