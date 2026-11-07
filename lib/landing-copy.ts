/**
 * Teks statis beranda satu halaman (bagian yang tidak diatur dari admin).
 * Draf — silakan dikoreksi pemilik.
 */

export const announcement = {
  label: 'KONSULTASI GRATIS',
  highlight: 'Website, aplikasi, SEO & branding',
  rest: 'satu tim, dari desain sampai rilis',
};

export const navLinks = [
  { href: '/#layanan', label: 'Layanan' },
  { href: '/#portofolio', label: 'Portofolio' },
  { href: '/#harga', label: 'Harga' },
  { href: '/#tentang', label: 'Tentang' },
  { href: '/#karier', label: 'Karier', id: 'karier' },
  { href: '/blog', label: 'Blog' },
] as const;

export const hero = {
  /** Chip kepercayaan di atas judul — diisi otomatis dari daftar mitra. */
  trustTitle: (count: number) => `Dipercaya ${count}+ klien`,
  trustText: (names: string[]) => `${names.join(', ')}, dan lainnya`,
  lineMuted: 'Website yang',
  lineStruck: 'cuma pajangan',
  lineMain: 'jadi mesin',
  lineAccent: 'penjualan',
  lead: 'Website, aplikasi, SEO, branding, dan media sosial — dikerjakan satu tim.',
  body: 'Target bisnis Anda jadi patokan kami, dari diskusi pertama sampai project live dan terus berkembang.',
  primaryCta: 'Chat WhatsApp',
  secondaryCta: 'Lihat portofolio',
  reassurance: 'Konsultasi gratis, tanpa kewajiban. Kami balas di jam kerja.',
};

export const statement = {
  lineOne: 'BANYAK YANG BISA BIKIN WEBSITE.',
  lineTwo: 'YANG MENJUAL ITU BEDA.',
  sub: 'BIAR RFT YANG MERANCANG',
};

export const servicesHeading = {
  eyebrow: 'Layanan kami',
  title: 'Satu tim untuk semua urusan',
  accent: 'digital',
  titleEnd: 'bisnis Anda.',
  hint: 'Tekan tanda + di tiap kartu untuk melihat detail yang kami kerjakan.',
};

export const portfolioHeading = {
  eyebrow: 'Hasil kerja, bukan janji',
  title: 'Intip',
  accent: 'project',
  titleEnd: 'yang sudah kami kerjakan.',
  empty: 'Belum ada contoh untuk layanan ini.',
};

export const processHeading = {
  eyebrow: 'Cara kerja',
  title: 'Dari chat pertama sampai',
  accent: 'live',
  titleEnd: 'dan terus didampingi.',
};

export const processSteps = [
  {
    title: 'Chat WhatsApp',
    text: 'Ceritakan bisnis dan kebutuhan Anda. Tidak perlu brief rapi — kami yang bantu merumuskan.',
  },
  {
    title: 'Konsultasi & penawaran',
    text: 'Kami usulkan solusi, lingkup kerja, jadwal, dan harga yang jelas sebelum mulai.',
  },
  {
    title: 'Pengerjaan',
    text: 'Desain dan pengembangan bertahap. Anda bisa melihat progres dan memberi masukan.',
  },
  {
    title: 'Rilis & pendampingan',
    text: 'Website/aplikasi live, lalu kami bantu maintenance, SEO, dan pengembangan berikutnya.',
  },
];

export const pricingHeading = {
  eyebrow: 'Harga transparan',
  title: 'Mulai dari angka yang',
  accent: 'masuk akal.',
  footnote: 'Harga final menyesuaikan kebutuhan. Konsultasi dan penawaran gratis.',
  cta: 'Tanya paket ini via WhatsApp',
};

export const aboutHeading = {
  eyebrow: 'Tentang RFT',
};

/** Baris angka di section Tentang — dihitung dari data mitra, portofolio, dan layanan. */
export function buildStats(counts: { clients: number; projects: number; services: number }) {
  return [
    { value: `${counts.clients}+`, unit: 'KLIEN', text: 'dari pendidikan, F&B, sampai florist' },
    { value: `${counts.projects}`, unit: 'PROJECT', text: 'web, aplikasi, dan media sosial' },
    { value: `${counts.services}`, unit: 'LAYANAN', text: 'dikerjakan satu tim' },
  ];
}

export const careersHeading = {
  eyebrow: 'Karier',
  title: 'Mau ikut',
  accent: 'membangun',
  titleEnd: 'bersama kami?',
  apply: 'Kirim lamaran',
};

export const blogHeading = {
  eyebrow: 'Artikel terbaru',
  title: 'Catatan dari',
  accent: 'dapur',
  titleEnd: 'RFT.',
  all: 'Lihat semua artikel',
};

export const faqHeading = {
  title: 'Masih ada',
  accent: 'yang bikin ragu?',
};

export const faqs = [
  {
    q: 'Berapa lama pengerjaan website?',
    a: 'Website company profile biasanya 2–4 minggu. Toko online atau sistem custom bisa 1–3 bulan, tergantung fitur. Jadwal pasti kami tulis di penawaran.',
  },
  {
    q: 'Apakah bisa revisi?',
    a: 'Bisa. Setiap tahap desain dan pengembangan ada sesi review. Jumlah revisi dan batasannya dijelaskan di penawaran supaya sama-sama jelas.',
  },
  {
    q: 'Hosting dan domain diurus siapa?',
    a: 'Kami bisa bantu dari pembelian domain, setup hosting/server, sampai email bisnis. Kalau Anda sudah punya, kami tinggal pakai yang ada.',
  },
  {
    q: 'Setelah website jadi, apakah ada maintenance?',
    a: 'Ada. Kami menyediakan paket maintenance bulanan: update keamanan, backup, perbaikan kecil, dan pemantauan performa.',
  },
  {
    q: 'Bagaimana sistem pembayarannya?',
    a: 'Umumnya bertahap: uang muka di awal, sisanya sesuai progres atau saat serah terima. Detailnya disepakati di penawaran.',
  },
];

export const closing = {
  lead: 'Ceritakan rencana Anda. Kami bantu dari ide sampai live.',
  lineOne: 'Siap bawa bisnis Anda',
  accent: 'naik kelas',
  lineEnd: '?',
  primaryCta: 'Chat WhatsApp',
  emailCta: 'Kirim email',
  note: 'Konsultasi gratis · tanpa kewajiban · balas di jam kerja',
};

export const floatingCta = {
  title: 'Konsultasi gratis',
  sub: 'balas cepat di jam kerja',
  button: 'Chat WA',
};
