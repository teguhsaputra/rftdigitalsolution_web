# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Corporate website + CMS for PT. RFT Digital Solution. Next.js 16 (App Router, React 19), TypeScript, Tailwind v4 + shadcn/ui, Prisma (PostgreSQL 15), Auth.js v5 with email + password admin accounts (no external identity provider), Redis cache, MinIO (S3) for images. UI copy and many code comments are in Indonesian.

## Commands

```bash
npm run dev                  # Next dev server (localhost:3000)
npm run build && npm start   # production build (standalone output when NODE_ENV=production)
npm run lint                 # ESLint (flat config, eslint-config-next)
npm test                     # Vitest unit tests (lib/**/__tests__); single file: npx vitest run lib/__tests__/whatsapp.test.ts

npm run db:push              # prisma db push — the project uses push, there is no prisma/migrations folder
npm run db:seed              # prisma/seed.ts (blog posts)
npm run db:seed:marketing    # prisma/seed-marketing.ts (services, portfolio, careers, about…)
npm run db:studio

npm run admin:create -- --email a@b.com --name "Nama"   # create/reset an admin account (prompts for password, or ADMIN_PASSWORD env)
```

Unit tests cover the pure helpers in `lib/` (WhatsApp links, price formatting, brand settings resolution, portfolio filter, redirects). UI is verified with `npm run lint` + `npm run build`. `npm run build` needs a `DATABASE_URL`; without a DB use `DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy` (same as the Dockerfile).

Local infra (Postgres on host port **15432**, Redis, MinIO) runs via `docker-compose -f docker-compose.dev.yml up -d`; Next.js runs on the host with `npm run dev`. `docker-compose.yml` is the production stack (requires external `global-net` network; schema push via `docker compose --profile tools run --rm prisma-setup` or `scripts/prod-prisma-push.sh`). See `SETUP_MINIO.md` for service setup and troubleshooting.

**Production (Tencent VPS)**: `deploy/docker-compose.prod.yml` (web + Redis only). It uses the VPS's **shared Postgres** (container `postgres` from `/opt/native-apps/postgres`, role `rft`, database `rft_blog`, via the external Docker network `db`; new apps get a role + database with its `add-project.sh`) and the shared MinIO/Caddy; never add a Postgres service. Push to `main` → `.github/workflows/ci-cd.yml` runs lint/tsc/test/build, builds the image on GitHub and ships it over SSH (`docker save | docker load`). Schema changes are applied manually with the `prisma-setup` tools service. `deploy/deploy.sh` is the manual rsync fallback (it deploys the local working tree).

## Architecture

**Route groups**
- `app/(public)/` — one-page landing (`page.tsx`) + `/blog`, `/privacy`, `/terms`. The layout (`force-dynamic`) renders the announcement bar, floating navbar, closing section/footer and floating WhatsApp CTA. Landing sections live in `components/landing/` (one file per section, anchors `#layanan`, `#portofolio`, `#harga`, `#tentang`, `#blog`, `#faq`, `#kontak`); static copy lives in `lib/landing-copy.ts`. Old routes `/about`, `/services`, `/projects`, `/contact` are 308 redirects to those anchors in `next.config.ts`; `/career` redirects to `/` (the careers section is currently not shown publicly; admin careers and data remain).
- `app/admin/` — CMS pages (posts, services, portfolio, careers, trusted partners, about, brand). Each entity follows the same pattern: list page + `new/` + `[id]/` pages, backed by `components/admin-*-editor.tsx` / `admin-*-table.tsx` and a REST route in `app/api/admin/<entity>/` (`route.ts` for list/create, `[id]/route.ts` for update/delete).
- `app/api/upload/presigned/` — returns a MinIO presigned PUT URL; the browser uploads directly (`components/image-upload.tsx`).

**Auth** (`auth.config.ts`, `auth.ts`, `proxy.ts`, `lib/admin-auth.ts`, `types/next-auth.d.ts`)
- Admins are rows in `AdminUser` (Prisma); passwords hashed with Node scrypt (`lib/password.ts`). Login = Auth.js Credentials provider → `authenticateAdmin()` (case-insensitive email; attempts are claimed atomically and the account locks 15 min after 5 failures). Team members are managed in `/admin/team`; own password in `/admin/account`; first admin / emergency reset via `npm run admin:create`.
- JWT session, absolute max 12 h from login. Every `auth()` call re-checks the account via `refreshAdminToken`: deactivated account, changed/reset password (`AdminUser.sessionVersion` bumped) or expired login → session ends.
- `proxy.ts` (Next 16 proxy, Node runtime) runs full `auth()` on `/admin/*` (so client-side navigation is re-checked too) and rejects cross-origin mutating requests to `/api/admin/*` and `/api/upload/*` (CSRF, `lib/safe-redirect.ts`). It does **not** authenticate API routes — every `app/api/admin/*` handler must use `requireAdminSession()` (`lib/require-admin.ts`) or call `auth()` and check `session.user.role === 'admin'`.
- Image fields accept site paths or http(s) URLs only (`lib/image-ref.ts`); login `callbackUrl` is restricted with `safeCallbackPath`.

**Environment** (`lib/env.ts`) — all env access goes through the Zod-validated `env` export. At build time (`NEXT_PHASE=phase-production-build`, or missing/"dummy" `DATABASE_URL`) required vars get dummy defaults. It also rewrites `AUTH_URL`/`NEXTAUTH_URL` to avoid `0.0.0.0` redirect URIs in Docker. When adding a new env var, add it both to the schema and to the explicit object passed to `envSchema.parse`.

**Public content with fallbacks** (`lib/public-content.ts`, `lib/marketing-data.ts`)
- `getPublic*()` functions read published rows from Prisma ordered by `sortOrder`; if the table is empty or the DB errors, they return the static defaults in `lib/marketing-data.ts`. Keep both shapes in sync when changing a model.
- JSON columns (e.g. `details`, `services`, about `body`/`values`) are parsed defensively with helper type guards.
- Brand: `BrandSettings` singleton read via `getBrandSettings()` (`lib/brand-settings-db.ts`) — logo, navbar mark, WhatsApp number/message, contact email — with fallbacks in `lib/brand.ts` (the legacy seeded `/brand-logo.svg` is treated as unset). Every CTA goes through `components/landing/contact-button.tsx` → `getContactHref()` (`lib/whatsapp.ts`): WhatsApp if a number is set, else `mailto:`.
- Pricing: `Service.priceFrom` (nullable, rupiah) shown as "Mulai Rp…" or "Hubungi kami" (`lib/format.ts`). Portfolio filtering matches `PortfolioProject.services` names to `Service.title` (`lib/portfolio.ts`); the admin editor offers them as a checklist.

**Caching / invalidation**
- Blog uses Redis via `lib/cache.ts` (`getCached`, `invalidateBlogCaches`). Redis is optional: if `REDIS_URL`/`REDIS_HOST` are unset, caching is bypassed. Post mutations must call `invalidateBlogCaches([slugs])` (include the old slug when it changes).
- Other admin mutations call `revalidatePath(...)` for the affected public pages.

**Images / S3** (`lib/s3.ts`) — path-style MinIO client. Stored URLs may contain the internal Docker hostname `minio`; pass them through `normalizePublicUrlForBrowser` before rendering. Remote image hosts are whitelisted in `next.config.ts`, which also defines the CSP — update `connect-src`/`img-src` there when adding new external origins.

**Visual system**: dark only — palette tokens in `app/globals.css` (`.dark`), Plus Jakarta Sans + Instrument Serif via `next/font` (`--font-jakarta`, `--font-instrument`), helpers `.heading-display`, `.font-serif-accent`, `.text-strike-orange`, marquee keyframes (disabled under `prefers-reduced-motion`).

**Other**: blog content is HTML authored with Tiptap (`components/tiptap-editor.tsx`); posts have a 1:1 `SeoMeta`. Client UI state lives in Zustand (`store/useUIStore.ts`). Path alias `@/*` maps to the repo root.

## Tooling note (from .cursorrules)

If the `rtk` CLI is available, prefer `rtk read <file>` for reading files to reduce tokens; otherwise use normal file reading.
