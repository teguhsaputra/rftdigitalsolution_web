/**
 * Buat akun admin (atau reset password + aktifkan kembali akun yang sudah ada).
 *
 * Usage:
 *   npm run admin:create -- --email nama@rftdigitalsolution.com --name "Nama Lengkap"
 *   (password ditanyakan di terminal; atau set ADMIN_PASSWORD=... untuk otomatis/CI)
 *
 * Docker production:
 *   docker compose --profile tools run --rm prisma-setup sh -c "npm ci && npm run admin:create -- --email ... --name ..."
 */
import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { PrismaClient } from '@prisma/client';
import { hashPassword, passwordProblem } from '../lib/password';
import { normalizeEmail } from '../lib/admin-auth-email';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = arg('email');
  const name = arg('name');
  if (!email || !name) {
    console.error('Usage: npm run admin:create -- --email <email> --name "<nama>"');
    process.exit(1);
  }

  let password = process.env.ADMIN_PASSWORD ?? '';
  if (!password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    password = await rl.question('Password (minimal 10 karakter): ');
    rl.close();
  }
  const problem = passwordProblem(password);
  if (problem) {
    console.error(`❌ ${problem}`);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const data = { name, passwordHash: await hashPassword(password), active: true, failedLoginCount: 0, lockedUntil: null };
    const user = await prisma.adminUser.upsert({
      where: { email: normalizeEmail(email) },
      create: { email: normalizeEmail(email), ...data },
      update: data,
    });
    console.log(`✅ Admin siap: ${user.name} <${user.email}>. Login di /login.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
