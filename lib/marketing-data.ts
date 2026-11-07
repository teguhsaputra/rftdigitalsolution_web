/**
 * Konten marketing & data publik — satu sumber kebenaran untuk semua halaman.
 * PT. RFT Digital Solution — digital agency.
 */

export const agencyName = 'PT. RFT Digital Solution';

export const agencyPositioning =
  'Kami bantu bisnis Anda tampil lebih kuat di dunia digital — dari bikin website sampai naikin traffic, branding, dan kelola media sosial.';

/** Fallback marquee jika belum ada mitra di database (admin: /admin/trusted-partners). */
export type TrustedPartnerItem = { name: string; imageUrl: string | null };

export const trustedPartnerPlaceholders: TrustedPartnerItem[] = [
  { name: 'Mitra 1', imageUrl: null },
  { name: 'Mitra 2', imageUrl: null },
  { name: 'Mitra 3', imageUrl: null },
  { name: 'Mitra 4', imageUrl: null },
  { name: 'Mitra 5', imageUrl: null },
  { name: 'Mitra 6', imageUrl: null },
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
      'Mau company profile, toko online, atau landing page yang converting? Kami kerjakan dari nol pakai teknologi terkini — hasilnya cepat, aman, dan enak dilihat di semua device.',
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
      'Desain logo, palet warna, & tipografi yang cohesive',
      'Aset visual untuk digital dan cetak',
      'Brand story & positioning yang relatable',
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
      'Setup iklan + optimasi biar budget nggak boncos',
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

export const portfolioProjects: PortfolioItem[] = [
  {
    slug: 'korporat-fnb',
    title: 'Website restoran + sistem pemesanan online',
    clientType: 'F&B • Jakarta',
    focus: 'Website • SEO • Social Media',
    description:
      'Bikin website responsif lengkap dengan menu, lokasi cabang, dan tombol reservasi. Kontennya dioptimasi buat pencarian lokal, plus kami siapin template sosmed untuk promo musiman.',
    services: ['Pembuatan Website', 'SEO Management', 'Social Media'],
  },
  {
    slug: 'startup-logistik',
    title: 'Dashboard operasional & landing page investor',
    clientType: 'Logistik • Bandung',
    focus: 'Website • Branding',
    description:
      'Landing page yang ngejelasin value proposition ke calon investor, branding kit digital yang rapi, dan halaman dokumentasi API buat mitra integrasi.',
    services: ['Pembuatan Website', 'Branding'],
  },
  {
    slug: 'retail-kosmetik',
    title: 'Mini e-commerce & kampanye Instagram',
    clientType: 'Retail • Surabaya',
    focus: 'Website • Social Media • SEO',
    description:
      'Katalog produk online dengan checkout simpel, template konten reels dan story yang tinggal pakai, plus artikel blog yang nembak long-tail keyword.',
    services: ['Pembuatan Website', 'Social Media', 'SEO Management'],
  },
  {
    slug: 'edtech-membership',
    title: 'Aplikasi membership untuk platform pelatihan',
    clientType: 'EdTech • Remote',
    focus: 'Mobile Apps • Website',
    description:
      'Aplikasi mobile buat peserta pelatihan — akses materi, cek jadwal, dan terima notifikasi. Plus website marketing untuk akuisisi lead baru.',
    services: ['Mobile Apps', 'Pembuatan Website'],
  },
  {
    slug: 'klinik-kesehatan',
    title: 'Rebranding klinik & sistem jadwal online',
    clientType: 'Kesehatan • Yogyakarta',
    focus: 'Branding • Website • SEO',
    description:
      'Rebranding visual dari nol, website profil dokter dan layanan, plus schema markup khusus fasilitas kesehatan biar muncul di pencarian lokal.',
    services: ['Branding', 'Pembuatan Website', 'SEO Management'],
  },
];

export const aboutContent = {
  headline: 'Partner digital yang mikirin bisnis Anda, bukan cuma ngoding',
  intro:
    `${agencyName} fokus di lima hal: bikin Website, develop Aplikasi Mobile, kelola SEO, Branding, dan Social Media. Klien kami mulai dari UMKM, startup, sampai perusahaan — semuanya kami dampingi dari awal diskusi sampai project jalan.`,
  body: [
    'Tim kami gabungin skill desain, engineering, dan growth marketing. Jadi setiap hal yang kami deliver bukan cuma tampil bagus, tapi benar-benar bantu konversi dan operasional Anda.',
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
