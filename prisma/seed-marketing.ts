/**
 * Hanya seed layanan, portfolio, dan tentang (tanpa post blog).
 * Pakai: npm run db:seed:marketing
 */
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { seedMarketingContent } from './seed-marketing-content';

const databaseUrlFromEnv = process.env.DATABASE_URL;
config();
config({ path: '.env.local', override: true });
if (databaseUrlFromEnv) {
  process.env.DATABASE_URL = databaseUrlFromEnv;
}

const prisma = new PrismaClient();

async function main() {
  await seedMarketingContent(prisma);
  console.log('Seed marketing: tentang, layanan, portfolio, dan mitra disinkronkan ke database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
