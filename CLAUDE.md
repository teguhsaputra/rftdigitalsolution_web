# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Corporate website + CMS for PT. Reliable Future Technology. Next.js 16 (App Router, React 19), TypeScript, Tailwind v4 + shadcn/ui, Prisma (PostgreSQL 15), Auth.js v5 with Keycloak (OIDC), DragonflyDB (Redis-compatible) cache, MinIO (S3) for images. UI copy and many code comments are in Indonesian.

## Commands

```bash
npm run dev                  # Next dev server (localhost:3000)
npm run build && npm start   # production build (standalone output when NODE_ENV=production)
npm run lint                 # ESLint (flat config, eslint-config-next)

npm run db:push              # prisma db push — the project uses push, there is no prisma/migrations folder
npm run db:seed              # prisma/seed.ts (blog posts)
npm run db:seed:marketing    # prisma/seed-marketing.ts (services, portfolio, careers, about…)
npm run db:studio

npx tsx scripts/seed-keycloak.ts   # creates realm `rft`, client `rft-web`, roles, users in a running Keycloak
```

There is no test suite. Verify changes with `npm run lint` and `npm run build`.

Local infra (Postgres on host port **15432**, Dragonfly, MinIO, Keycloak) runs via `docker-compose -f docker-compose.dev.yml up -d`; Next.js runs on the host with `npm run dev`. `docker-compose.yml` is the production stack (requires external `global-net` network; schema push via `docker compose --profile tools run --rm prisma-setup` or `scripts/prod-prisma-push.sh`). See `SETUP_KEYCLOAK.md` and `SETUP_MINIO.md` for service setup and troubleshooting.

## Architecture

**Route groups**
- `app/(public)/` — marketing site + blog. Its layout sets `dynamic = 'force-dynamic'`, so pages render per-request from the DB.
- `app/admin/` — CMS pages (posts, services, portfolio, careers, trusted partners, about, brand). Each entity follows the same pattern: list page + `new/` + `[id]/` pages, backed by `components/admin-*-editor.tsx` / `admin-*-table.tsx` and a REST route in `app/api/admin/<entity>/` (`route.ts` for list/create, `[id]/route.ts` for update/delete).
- `app/api/upload/presigned/` — returns a MinIO presigned PUT URL; the browser uploads directly (`components/image-upload.tsx`).

**Auth** (`auth.ts`, `middleware.ts`, `types/next-auth.d.ts`)
- JWT session (1 day). Roles are extracted from Keycloak `realm_access` / `resource_access[KEYCLOAK_CLIENT_ID]` (falling back to decoding the access token) and collapsed into `session.user.role` (`'admin'` or other).
- `middleware.ts` only guards `/admin` pages. **API routes are not covered by middleware** — every `app/api/admin/*` handler must itself call `auth()` and check `session.user.role === 'admin'`.
- `KEYCLOAK_INTERNAL_BASE_URL` / `KEYCLOAK_WELL_KNOWN` let the server talk to Keycloak over the Docker network while `KEYCLOAK_ISSUER` stays the public URL (issuer must match Keycloak's `KC_HOSTNAME`).

**Environment** (`lib/env.ts`) — all env access goes through the Zod-validated `env` export. At build time (`NEXT_PHASE=phase-production-build`, or missing/"dummy" `DATABASE_URL`) required vars get dummy defaults. It also rewrites `AUTH_URL`/`NEXTAUTH_URL` to avoid `0.0.0.0` redirect URIs in Docker. When adding a new env var, add it both to the schema and to the explicit object passed to `envSchema.parse`.

**Public content with fallbacks** (`lib/public-content.ts`, `lib/marketing-data.ts`)
- `getPublic*()` functions read published rows from Prisma ordered by `sortOrder`; if the table is empty or the DB errors, they return the static defaults in `lib/marketing-data.ts`. Keep both shapes in sync when changing a model.
- JSON columns (e.g. `details`, `services`, about `body`/`values`) are parsed defensively with helper type guards.
- Brand logo: `BrandSettings` singleton (`lib/brand.ts`, `lib/brand-settings-db.ts`) with a static fallback.

**Caching / invalidation**
- Blog uses Redis via `lib/cache.ts` (`getCached`, `invalidateBlogCaches`). Redis is optional: if `REDIS_URL`/`REDIS_HOST` are unset, caching is bypassed. Post mutations must call `invalidateBlogCaches([slugs])` (include the old slug when it changes).
- Other admin mutations call `revalidatePath(...)` for the affected public pages.

**Images / S3** (`lib/s3.ts`) — path-style MinIO client. Stored URLs may contain the internal Docker hostname `minio`; pass them through `normalizePublicUrlForBrowser` before rendering. Remote image hosts are whitelisted in `next.config.ts`, which also defines the CSP — update `connect-src`/`img-src` there when adding new external origins.

**Other**: blog content is HTML authored with Tiptap (`components/tiptap-editor.tsx`); posts have a 1:1 `SeoMeta`. Client UI state lives in Zustand (`store/useUIStore.ts`). Path alias `@/*` maps to the repo root.

## Tooling note (from .cursorrules)

If the `rtk` CLI is available, prefer `rtk read <file>` for reading files to reduce tokens; otherwise use normal file reading.
