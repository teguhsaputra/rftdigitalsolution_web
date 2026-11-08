import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { seedMarketingContent } from './seed-marketing-content';

// Sudah diset oleh Docker / shell (deploy) — jangan timpa dengan .env.local (localhost).
const databaseUrlFromEnv = process.env.DATABASE_URL;
config();
config({ path: '.env.local', override: true });
if (databaseUrlFromEnv) {
  process.env.DATABASE_URL = databaseUrlFromEnv;
}

const prisma = new PrismaClient();

const samplePosts = [
  {
    slug: 'website-profil-perusahaan-yang-konversi',
    title: '5 Elemen Website Profil Perusahaan yang Mendukung Konversi',
    content: `
<p>Website bukan sekadar brosur digital. Untuk digital agency, halaman profil perusahaan yang baik memuat value proposition jelas, bukti sosial, dan CTA yang terukur.</p>
<p>Pastikan kecepatan muat, struktur heading untuk SEO, dan konten yang menjawab pertanyaan utama pengunjung dalam 10 detik pertama.</p>
`.trim(),
    metaTitle: 'Website profil perusahaan yang konversi | Blog RFT',
    metaDescription:
      'Tips struktur website company profile agar mendukung SEO dan konversi untuk bisnis B2B.',
  },
  {
    slug: 'seo-teknis-untuk-nextjs',
    title: 'SEO Teknis untuk Proyek Next.js: Yang Sering Terlewat',
    content: `
<p>Framework modern seperti Next.js memberi fondasi bagus untuk performa, tetapi SEO teknis tetap perlu pengecekan: metadata, canonical, sitemap, dan render konten penting di server.</p>
<p>Gabungkan audit Core Web Vitals dengan peta keyword agar perbaikan teknis selaras dengan strategi konten.</p>
`.trim(),
    metaTitle: 'SEO teknis Next.js | Blog RFT',
    metaDescription:
      'Ringkasan pengecekan SEO teknis untuk aplikasi Next.js di lingkungan production.',
  },
  {
    slug: 'branding-dan-social-media-selaras',
    title: 'Menyelaraskan Branding dengan Social Media',
    content: `
<p>Branding yang kuat memudahkan tim social media membuat konten konsisten: palet warna, tone of voice, dan template visual yang dapat diulang.</p>
<p>Dokumentasikan guideline singkat agar kolaborasi klien dan agency tetap cepat tanpa mengorbankan identitas merek.</p>
`.trim(),
    metaTitle: 'Branding & social media | Blog RFT',
    metaDescription:
      'Cara menyelaraskan identitas merek dengan eksekusi konten di channel sosial.',
  },
];

async function main() {
  for (const post of samplePosts) {
    const row = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        published: true,
      },
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        published: true,
      },
    });

    await prisma.seoMeta.upsert({
      where: { postId: row.id },
      update: {
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
      },
      create: {
        postId: row.id,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
      },
    });
  }

  await seedMarketingContent(prisma);

  console.log(`Seed: ${samplePosts.length} artikel blog (dummy) siap dipublikasikan.`);
  console.log('Seed: layanan, portfolio, mitra, dan tentang disinkronkan ke database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
