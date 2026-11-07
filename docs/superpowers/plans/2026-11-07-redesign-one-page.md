# Redesign Beranda Satu Halaman — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the multi-page public site with one long Smartles-style landing page (black + white, WhatsApp as the primary CTA), keeping `/blog`, `/privacy`, `/terms` as separate pages and all content editable from admin.

**Architecture:** Pure helpers (WhatsApp link, price formatting, brand-settings resolution, portfolio filtering) live in `lib/` with Vitest unit tests. Prisma gains `Service.priceFrom` and new `BrandSettings` fields; admin forms and APIs expose them. The public page is assembled in `app/(public)/page.tsx` from focused section components under `components/landing/`, fed by `lib/public-content.ts`. Old public pages become permanent redirects to anchors.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Framer Motion, Prisma 6 (PostgreSQL, `db push`), Zod 4, react-hook-form, Vitest (new dev dep).

**Spec:** `docs/superpowers/specs/2026-11-07-redesign-one-page-design.md` — read it before starting; the approved visual mockup is `.superpowers/brainstorm/96826-1794057695/content/arah-b-logo.html`.

## Global Constraints

- Colors: background `#09090b`; surfaces `#141416` / `#18181b`; borders `#232326`; text `#f4f4f5`; muted text `#a1a1aa` / `#71717a`; primary accent white (primary button = white bg, `#09090b` text); only other color: orange `#ea580c` (headline strike-through and ✦ in marquees).
- Fonts: Plus Jakarta Sans 400–800 (all text; headings weight 800, letter-spacing ≈ `-0.05em`); Instrument Serif italic for accent words. Load via `next/font/google`; Inter is removed.
- Company name everywhere public + metadata: `PT. RFT Digital Solution`; tagline `From Brand Vision to Virtual Experiences`.
- Copy language: Indonesian, casual-professional (like current `lib/marketing-data.ts`).
- Every animation respects `prefers-reduced-motion` (Framer Motion `useReducedMotion` / CSS media query).
- Every section works at 360px width with no horizontal page scroll; hero floating mockups hidden below `md`.
- Every admin API handler checks `auth()` **and** `session.user.role === 'admin'` (reuse the existing `requireAdmin()` pattern).
- Admin mutations affecting the landing page call `revalidatePath('/')`.
- Schema changes applied with `npm run db:push` (no migrations folder).
- Work on branch `feat/one-page-redesign` (create it from `main` before Task 1).

## Review Focus

1. WhatsApp number typed by admin in local formats (`0812-3456-7890`, `+62 812 3456 7890`, `62812…`) → link always `https://wa.me/628123456789`. Test in Task 1.
2. WhatsApp number empty → every WA button falls back to `mailto:<contactEmail>`; both empty → `#kontak`. Test in Task 1.
3. Seeded DB holding legacy `logoUrl = '/brand-logo.svg'` (or empty) → site shows the new logo, and admin can save WA/email without re-uploading a logo. Test in Task 2.
4. Service with `priceFrom` null/0 → price card shows `Hubungi kami`, never `Rp0`. Test in Task 1.
5. Portfolio project whose service tags differ in case/whitespace from the service title (`" pembuatan website "`) still appears under that filter; filter "Semua" shows all. Test in Task 5.

---

### Task 1: Vitest + WhatsApp and price helpers

**Files:**
- Modify: `package.json` (dev dep `vitest`, script `"test": "vitest run"`)
- Create: `vitest.config.ts` (node env, alias `@` → repo root)
- Create: `lib/whatsapp.ts`, `lib/format.ts`
- Test: `lib/__tests__/whatsapp.test.ts`, `lib/__tests__/format.test.ts`

**Interfaces:**
- Produces:
  - `normalizeWhatsAppNumber(raw: string | null | undefined): string | null` — digits only, leading `0` → `62`, `+` stripped; returns `null` when fewer than 9 digits.
  - `buildWhatsAppUrl(number: string, message?: string): string` — `https://wa.me/<number>` plus `?text=<encodeURIComponent(message)>` when message non-empty.
  - `getContactHref(opts: { whatsappNumber?: string | null; whatsappMessage?: string | null; contactEmail?: string | null; topic?: string }): string` — WA URL if number normalizes; when `topic` given, message becomes `${whatsappMessage} — saya mau tanya paket ${topic}`; else `mailto:<email>`; else `'#kontak'`.
  - `formatPriceFrom(priceFrom: number | null | undefined): string` — `'Mulai Rp2.500.000'` (id-ID grouping, no decimals); null/0/negative → `'Hubungi kami'`.

- [ ] **Step 1: Create branch, install Vitest, add config and `test` script**

Run: `git checkout -b feat/one-page-redesign && npm i -D vitest`

- [ ] **Step 2: Write failing tests**

```ts
// lib/__tests__/whatsapp.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeWhatsAppNumber, buildWhatsAppUrl, getContactHref } from '@/lib/whatsapp';

describe('normalizeWhatsAppNumber', () => {
  it.each([
    ['0812-3456-7890', '6281234567890'],
    ['+62 812 3456 7890', '6281234567890'],
    ['6281234567890', '6281234567890'],
  ])('%s → %s', (raw, out) => expect(normalizeWhatsAppNumber(raw)).toBe(out));
  it('rejects empty/short', () => {
    expect(normalizeWhatsAppNumber('')).toBeNull();
    expect(normalizeWhatsAppNumber(null)).toBeNull();
    expect(normalizeWhatsAppNumber('0812')).toBeNull();
  });
});

describe('buildWhatsAppUrl', () => {
  it('encodes message', () =>
    expect(buildWhatsAppUrl('6281234567890', 'Halo RFT & tim')).toBe(
      'https://wa.me/6281234567890?text=Halo%20RFT%20%26%20tim'));
  it('omits empty message', () =>
    expect(buildWhatsAppUrl('6281234567890', '')).toBe('https://wa.me/6281234567890'));
});

describe('getContactHref', () => {
  it('uses WA with topic', () =>
    expect(getContactHref({ whatsappNumber: '0812-3456-7890', whatsappMessage: 'Halo RFT', topic: 'Branding' }))
      .toBe(buildWhatsAppUrl('6281234567890', 'Halo RFT — saya mau tanya paket Branding')));
  it('falls back to email', () =>
    expect(getContactHref({ whatsappNumber: '', contactEmail: 'hi@rft.id' })).toBe('mailto:hi@rft.id'));
  it('falls back to #kontak', () => expect(getContactHref({})).toBe('#kontak'));
});
```

```ts
// lib/__tests__/format.test.ts
import { it, expect } from 'vitest';
import { formatPriceFrom } from '@/lib/format';
it('formats rupiah', () => expect(formatPriceFrom(2500000)).toBe('Mulai Rp2.500.000'));
it('null/0 → Hubungi kami', () => {
  expect(formatPriceFrom(null)).toBe('Hubungi kami');
  expect(formatPriceFrom(0)).toBe('Hubungi kami');
});
```

- [ ] **Step 3: Run `npm test` — expect FAIL (modules not found)**
- [ ] **Step 4: Implement `lib/whatsapp.ts` and `lib/format.ts` per Interfaces** (format with `Intl.NumberFormat('id-ID')`, prefix `Rp` without space)
- [ ] **Step 5: Run `npm test` — expect PASS; run `npm run lint` — expect no new errors**
- [ ] **Step 6: Commit** — `git add package.json package-lock.json vitest.config.ts lib/whatsapp.ts lib/format.ts lib/__tests__ && git commit -m "feat: add vitest and whatsapp/price helpers"`

---

### Task 2: Schema, brand settings resolution, new logo assets, seed

**Files:**
- Modify: `prisma/schema.prisma` (Service, BrandSettings)
- Modify: `lib/brand.ts`, `lib/brand-settings-db.ts`, `lib/public-content.ts` (`getPublicBrandLogoUrl` → replaced)
- Modify: `prisma/seed-marketing-content.ts` (brand upsert)
- Create: `public/brand-logo.webp` (copy of `~/Downloads/logo-rft.webp`), `public/brand-mark.webp` (square crop of the symbol only)
- Test: `lib/__tests__/brand.test.ts`

**Interfaces:**
- Schema: `Service.priceFrom Int?`; `BrandSettings.logoUrl String?`, `logoMarkUrl String?`, `whatsappNumber String?`, `whatsappMessage String?`, `contactEmail String?`.
- `lib/brand.ts` produces: `BRAND_NAME = 'PT. RFT Digital Solution'`, `BRAND_TAGLINE = 'From Brand Vision to Virtual Experiences'`, `BRAND_LOGO_FALLBACK_SRC = '/brand-logo.webp'`, `BRAND_MARK_FALLBACK_SRC = '/brand-mark.webp'`, `LEGACY_LOGO_SRCS = ['/brand-logo.svg']`, `DEFAULT_WHATSAPP_MESSAGE = 'Halo RFT, saya mau konsultasi soal project digital.'`, `DEFAULT_CONTACT_EMAIL = 'info@rfttech.com'`, `BRAND_LOGO_ALT` (updated name).
- `lib/brand-settings-db.ts` produces:
  - `type BrandSettingsPublic = { logoUrl: string; logoMarkUrl: string; whatsappNumber: string | null; whatsappMessage: string; contactEmail: string }`
  - `resolveBrandSettings(row: { logoUrl?: string | null; logoMarkUrl?: string | null; whatsappNumber?: string | null; whatsappMessage?: string | null; contactEmail?: string | null } | null): BrandSettingsPublic` — pure; empty/legacy logo → fallback; URLs through `normalizePublicUrlForBrowser`; empty message/email → defaults.
  - `getBrandSettings(): Promise<BrandSettingsPublic>` — reads row `BRAND_SETTINGS_ID` via `prisma.brandSettings`, DB error → `resolveBrandSettings(null)`.
  - `upsertBrandSettings(data: Partial<Omit<BrandSettingsPublic,'whatsappNumber'>> & { whatsappNumber?: string | null }): Promise<void>`
  - Remove `getBrandSettingsLogoUrl` / `upsertBrandSettingsLogoUrl` and the raw SQL; update all callers (`app/api/admin/brand/route.ts`, `app/admin/brand/page.tsx`, `lib/public-content.ts`).

- [ ] **Step 1: Write failing test `lib/__tests__/brand.test.ts`** (mock `@/lib/prisma` with `vi.mock` so the import has no DB)

```ts
expect(resolveBrandSettings(null)).toEqual({
  logoUrl: '/brand-logo.webp', logoMarkUrl: '/brand-mark.webp', whatsappNumber: null,
  whatsappMessage: DEFAULT_WHATSAPP_MESSAGE, contactEmail: DEFAULT_CONTACT_EMAIL });
expect(resolveBrandSettings({ logoUrl: '/brand-logo.svg' }).logoUrl).toBe('/brand-logo.webp');
expect(resolveBrandSettings({ logoUrl: '' }).logoUrl).toBe('/brand-logo.webp');
expect(resolveBrandSettings({ logoUrl: 'http://minio:9000/b/x.png' }).logoUrl).toBe('http://localhost:9000/b/x.png');
expect(resolveBrandSettings({ whatsappNumber: '0812', contactEmail: '' }).contactEmail).toBe(DEFAULT_CONTACT_EMAIL);
```

- [ ] **Step 2: Run `npm test` — expect FAIL**
- [ ] **Step 3: Update schema; run `npm run db:push` (dev DB from `docker-compose.dev.yml`) — expect "in sync" and client regenerated**
- [ ] **Step 4: Implement `lib/brand.ts` + `lib/brand-settings-db.ts`; create the two webp files** (crop with `sips`/any tool: symbol region of the 250×250 source, roughly x 70–180, y 50–160, output square on black)
- [ ] **Step 5: Update seed brand upsert to `{ logoUrl: null, whatsappMessage: DEFAULT_WHATSAPP_MESSAGE }` (update branch also clears legacy `/brand-logo.svg`)**
- [ ] **Step 6: Run `npm test` + `npx tsc --noEmit` — expect PASS (callers compile)**
- [ ] **Step 7: Commit** — `feat: brand settings with whatsapp/contact fields and new RFT logo`

---

### Task 3: Admin Brand form & API

**Files:**
- Modify: `app/api/admin/brand/route.ts`, `components/admin-brand-editor.tsx`, `app/admin/brand/page.tsx`

**Interfaces:**
- Consumes: `getBrandSettings`, `upsertBrandSettings`, `normalizeWhatsAppNumber` (Tasks 1–2).
- API `PUT` body schema: `{ logoUrl?: string; logoMarkUrl?: string; whatsappNumber?: string; whatsappMessage?: string; contactEmail?: string }` — `logoUrl`/`logoMarkUrl` accept `''`, a path starting with `/`, or a full URL; `whatsappNumber` `''` or must normalize (else 400 `"Nomor WhatsApp tidak valid"`); `contactEmail` `''` or email. Stores normalized number. Keep `requireAdmin()`, `revalidatePath('/', 'layout')`.
- `AdminBrandEditor({ initial }: { initial: BrandSettingsPublic })`.

- [ ] **Step 1: Update API schema + handlers (GET returns `getBrandSettings()`)**
- [ ] **Step 2: Editor: two `ImageUpload`s (Logo utuh, Simbol navbar) + inputs Nomor WhatsApp, Pesan pembuka WA, Email kontak; button "Simpan brand"; logo not required**
- [ ] **Step 3: Verify** — `npm run lint && npx tsc --noEmit`; `npm run dev`, log in as admin, open `/admin/brand`, save number `0812-3456-7890` without touching logos → success; reload shows `6281234567890`; save `abc` → error message shown.
- [ ] **Step 4: Commit** — `feat(admin): whatsapp, email and logo mark in brand settings`

---

### Task 4: Service `priceFrom` end to end

**Files:**
- Modify: `app/api/admin/services/route.ts`, `app/api/admin/services/[id]/route.ts`, `components/admin-service-editor.tsx`, `app/admin/services/[id]/page.tsx` (pass `priceFrom`), `components/admin-services-table.tsx` (show formatted price column)
- Modify: `lib/marketing-data.ts` (`ServiceItem.priceFrom: number | null`; fallback prices: Website 2500000, Mobile 15000000, SEO 1500000, Branding 2000000, Social Media 1500000), `lib/public-content.ts` (`getPublicServices` maps `priceFrom`)

**Interfaces:**
- API schemas add `priceFrom: z.number().int().positive().nullable().optional()`.
- Editor field `priceFrom` text input "Harga mulai dari (Rp)", empty → `null`, digits only (strip `.`/`,`).

- [ ] **Step 1: Implement API + type + public mapping + fallback**
- [ ] **Step 2: Implement editor input and table column (uses `formatPriceFrom`)**
- [ ] **Step 3: Verify** — `npm run lint && npx tsc --noEmit`; in admin set Website price `2.500.000`, clear another → saved as `2500000` / `null`.
- [ ] **Step 4: Commit** — `feat(admin): starting price per service`

---

### Task 5: Portfolio service checklist + filter helper

**Files:**
- Create: `lib/portfolio.ts`
- Test: `lib/__tests__/portfolio.test.ts`
- Modify: `components/admin-portfolio-editor.tsx` (replace `servicesText` textarea with checkbox list), `app/admin/portfolio/new/page.tsx`, `app/admin/portfolio/[id]/page.tsx` (load service titles via `prisma.service.findMany` ordered like public, pass `serviceOptions: string[]`)

**Interfaces:**
- `filterPortfolioByService<T extends { services: string[] }>(items: T[], service: string | null): T[]` — `null` → all; match `trim().toLowerCase()` equality.
- `AdminPortfolioEditor({ project?, serviceOptions }: { project?: …; serviceOptions: string[] })` — checklist shows `serviceOptions` plus any existing project tag not in options (so old tags aren't silently lost); at least one required ("Pilih minimal satu layanan"). Payload stays `services: string[]`.

- [ ] **Step 1: Failing test**

```ts
const items = [{ services: [' pembuatan website '] }, { services: ['Branding'] }];
expect(filterPortfolioByService(items, 'Pembuatan Website')).toEqual([items[0]]);
expect(filterPortfolioByService(items, null)).toEqual(items);
expect(filterPortfolioByService(items, 'SEO Management')).toEqual([]);
```

- [ ] **Step 2: `npm test` → FAIL; implement; `npm test` → PASS**
- [ ] **Step 3: Implement editor checklist + page props; verify in `/admin/portfolio/new` and an existing project edit page**
- [ ] **Step 4: Commit** — `feat(admin): portfolio services as checklist; add portfolio filter helper`

---

### Task 6: Visual foundation — fonts, palette, name

**Files:**
- Modify: `app/layout.tsx` (fonts via `next/font/google`: `Plus_Jakarta_Sans` weights 400–800 as `--font-sans`, `Instrument_Serif` weight 400 styles normal+italic as `--font-serif`; metadata title `PT. RFT Digital Solution | Digital Agency`, description mentions tagline)
- Modify: `app/globals.css` — `.dark` tokens mapped to Global Constraints colors (`--background`, `--card`, `--border`, `--foreground`, `--muted-foreground`, `--primary` white / `--primary-foreground` `#09090b`); add `--color-accent-orange: #ea580c`, `--font-serif`; utility classes `.font-serif-accent` (italic serif, letter-spacing 0), `.text-strike-orange` (orange rotated bar via `::after`), keyframes `marquee` / `marquee-reverse` disabled under `prefers-reduced-motion`.
- Modify: every file containing "Reliable Future" (`app/(public)/terms/page.tsx`, `app/(public)/blog/[slug]/page.tsx`, `components/admin-sidebar.tsx`, `lib/marketing-data.ts`) → `BRAND_NAME` / new name.

- [ ] **Step 1: Implement**
- [ ] **Step 2: Verify** — `grep -rn "Reliable Future" app components lib prisma` → no output; `npm run build` succeeds; `/blog` renders in the new palette and font.
- [ ] **Step 3: Commit** — `feat: RFT Digital Solution fonts, palette and naming`

---

### Task 7: Shell — announcement bar, navbar, floating WA button, closing section/footer

**Files:**
- Create: `components/landing/announcement-bar.tsx`, `components/landing/site-navbar.tsx` (client; replaces `components/navbar.tsx`), `components/landing/floating-cta.tsx` (client), `components/landing/closing-section.tsx` (replaces `components/footer.tsx`), `lib/landing-copy.ts` (all static copy: bar text, hero, statement, steps, FAQ, stats, closing)
- Modify: `app/(public)/layout.tsx` (load `getBrandSettings()` once; pass to navbar/closing/floating CTA; remove `pt-20`)
- Delete: `components/navbar.tsx`, `components/footer.tsx` (after callers updated)

**Interfaces:**
- Consumes: `BrandSettingsPublic`, `getContactHref`, `BRAND_NAME`, `BRAND_TAGLINE`.
- `SiteNavbar({ brand }: { brand: BrandSettingsPublic })` — sticky floating capsule (`top-3`, centered, max-w ~720px, blurred `#18181b` bg, border `white/10`); left: `logoMarkUrl` 34px rounded + name + tagline (tagline hidden < sm); links `/#layanan` Layanan, `/#portofolio` Portofolio, `/#harga` Harga, `/#tentang` Tentang, `/#karier` Karier, `/blog` Blog; right: white pill "Chat WhatsApp" → `getContactHref(brand)` (`target="_blank" rel="noopener"` for http links); mobile: menu button opening a sheet (reuse `components/ui/sheet.tsx` + `useUIStore`).
- `FloatingCta({ brand })` — fixed bottom-right dark pill "Konsultasi gratis · balas cepat" + white button "Chat WA"; appears after scrolling past hero (≥ 600px).
- `ClosingSection({ brand })` — `id="kontak"`; rounded-top panel with radial gradient; full logo 150px; headline from copy with serif accent; buttons Chat WhatsApp + `mailto:` email; footer row: `© {year} PT. RFT Digital Solution`, links Layanan, Blog, `/privacy` Kebijakan Privasi, `/terms` Syarat.

- [ ] **Step 1: Write `lib/landing-copy.ts`** (draft copy per spec; hero lines: "Website yang" / strike "cuma pajangan" / "jadi mesin *penjualan*."; statement: "WEBSITE ITU MUDAH." / "YANG MENJUAL ITU BEDA." / sub "BIAR RFT YANG MERANCANG"; steps: Chat WhatsApp → Konsultasi & penawaran → Pengerjaan → Rilis & pendampingan; 5 FAQ: lama pengerjaan, revisi, hosting & domain, maintenance, cara pembayaran; 3 stats with values clearly marked `// TODO(owner): angka asli`)
- [ ] **Step 2: Implement components + layout**
- [ ] **Step 3: Verify** — `npm run lint && npm run build`; dev server: navbar sticky on `/` and `/blog`; WA button opens `wa.me/62…` with message; with WA number cleared in admin it becomes `mailto:`; 360px width: no horizontal scroll, sheet menu works.
- [ ] **Step 4: Commit** — `feat: landing shell with navbar, floating WA CTA and closing section`

---

### Task 8: Landing sections A — hero, marquee, partners, statement, services

**Files:**
- Create in `components/landing/`: `hero-section.tsx`, `service-marquee.tsx`, `partners-marquee.tsx`, `statement-section.tsx`, `services-carousel.tsx`, `reveal.tsx` (client wrapper: fade/slide-in on view, no-op under reduced motion; replaces `components/motion-fade-in.tsx`)

**Interfaces:**
- `HeroSection({ brand, projects }: { brand: BrandSettingsPublic; projects: PortfolioItem[] })` — `id="beranda"`; floating cards (hidden < md) use up to 4 project images (fallback: illustrated cards with project title + clientType); 2 outer ones blurred; CTAs: white "Chat WhatsApp →", outline "Lihat portofolio" → `#portofolio`; reassurance line under buttons from copy.
- `ServiceMarquee({ services }: { services: ServiceItem[] })` — two rotated (−2deg / +1.5deg) bands, white band (`#09090b` text) and `#18181b` band, opposite directions, ✦ in orange, uppercase titles.
- `PartnersMarquee({ partners }: { partners: TrustedPartnerItem[] })` — eyebrow "Dipercaya oleh"; grayscale logos, placeholders render name text.
- `StatementSection()` — two giant lines (second line white with glow), radial white glow circle with dashed ring.
- `ServicesCarousel({ services })` — `id="layanan"`; eyebrow + heading with serif accent; horizontal scroll-snap cards (`#141416`, border `#232326`) with title, summary; "+" button toggles details list inside card; progress bar under carousel.

- [ ] **Step 1: Implement components**
- [ ] **Step 2: Temporarily render them in `app/(public)/page.tsx` (with data from `getPublicServices`, `getPublicPortfolio`, `getPublicTrustedPartners`, `getBrandSettings`)**
- [ ] **Step 3: Verify** — `npm run lint && npm run build`; visual check against mockup `arah-b-logo.html` at 1440px and 360px; enable "reduce motion" in OS → marquees static, no reveal animation.
- [ ] **Step 4: Commit** — `feat(landing): hero, marquees, statement and services`

---

### Task 9: Landing sections B — portfolio, process, pricing

**Files:**
- Create in `components/landing/`: `portfolio-gallery.tsx` (client), `process-steps.tsx`, `pricing-cards.tsx`

**Interfaces:**
- Consumes: `filterPortfolioByService`, `formatPriceFrom`, `getContactHref`.
- `PortfolioGallery({ projects, services }: { projects: PortfolioItem[]; services: ServiceItem[] })` — `id="portofolio"`; filter chips "Semua (n)" + one per service title (hide chips with 0 matches); horizontal scroll-snap cards: image (or gradient placeholder with title), dark caption bar with `clientType`, title, focus, service tags; empty filter result → text "Belum ada contoh untuk layanan ini."
- `ProcessSteps()` — `id="cara-kerja"`; 4 numbered cards from copy.
- `PricingCards({ services, brand })` — `id="harga"`; one card per service: title, summary, `formatPriceFrom(priceFrom)` large, first 4 `details` as check items, button "Tanya paket ini via WhatsApp" → `getContactHref({ ...brand, topic: service.title })`; footnote "Harga final menyesuaikan kebutuhan. Konsultasi gratis."

- [ ] **Step 1: Implement and add to page after services**
- [ ] **Step 2: Verify** — lint/build; filter chips change cards; price card for a service with null price shows "Hubungi kami"; WA link text includes the service name.
- [ ] **Step 3: Commit** — `feat(landing): portfolio gallery, process and pricing`

---

### Task 10: Landing sections C — about, careers, blog, FAQ; assemble page

**Files:**
- Create in `components/landing/`: `about-section.tsx`, `careers-section.tsx`, `blog-preview.tsx`, `faq-section.tsx`
- Modify: `app/(public)/page.tsx` (final order per spec table, single `Promise.all` for data incl. `getPublicCareers`, `getPublishedPostSummaries({ take: 3 })`)
- Delete: `components/home-sections.tsx`, `hero-section.tsx`, `services-section.tsx`, `projects-section.tsx`, `about-section.tsx` (old), `trusted-by-section.tsx`, `blog-preview-section.tsx`, `page-header.tsx`, `motion-fade-in.tsx` — only those with no remaining imports (check with grep).

**Interfaces:**
- `AboutSection({ about }: { about: AboutPublic })` — `id="tentang"`; headline with serif accent on last two words, intro, body paragraphs, 3 value cards, stats row (3 columns, from copy).
- `CareersSection({ careers, brand })` — `id="karier"`; returns `null` when `careers.length === 0`; compact rows (title, location · type) expandable to description + responsibilities; apply button → `mailto:${brand.contactEmail}?subject=Lamaran%20${encodeURIComponent(title)}`.
- `BlogPreview({ posts })` — `id="blog"`; returns `null` when empty; 3 cards reusing `components/blog-post-card.tsx` styling; link "Lihat semua artikel" → `/blog`.
- `FaqSection()` — `id="faq"`; heading "Masih ada yang bikin ragu?"; accordion via `components/ui/accordion.tsx`.

- [ ] **Step 1: Implement sections and final page order**
- [ ] **Step 2: Delete unused old components**
- [ ] **Step 3: Verify** — lint/build; with all careers unpublished in admin, `#karier` absent and navbar link hidden (navbar receives `hasCareers: boolean` prop from layout — add to `SiteNavbar` props); all navbar anchors scroll to the right section.
- [ ] **Step 4: Commit** — `feat(landing): about, careers, blog preview, FAQ; assemble one-page home`

---

### Task 11: Redirects, removed pages, sitemap, final pass

**Files:**
- Modify: `next.config.ts` — `redirects()` with `permanent: true`: `/about`→`/#tentang`, `/services`→`/#layanan`, `/projects`→`/#portofolio`, `/career`→`/#karier`, `/contact`→`/#kontak`
- Delete: `app/(public)/about`, `services`, `projects`, `career`, `contact` page folders
- Modify: `app/sitemap.ts` (static paths: `""`, `/blog`, `/privacy`, `/terms`)
- Modify: `app/(public)/privacy/page.tsx`, `app/(public)/terms/page.tsx`, `app/(public)/blog/page.tsx`, `app/(public)/blog/[slug]/page.tsx` — headings in new type style (weight 800, tight tracking), top padding for floating navbar, emails from `getBrandSettings().contactEmail` instead of hard-coded `info@rfttech.com`
- Modify: `CLAUDE.md` (route groups section: one-page home + `components/landing/`, `npm test`)

- [ ] **Step 1: Implement**
- [ ] **Step 2: Verify** — `npm test && npm run lint && npm run build`; `curl -sI localhost:3000/about` → `308` with `location: /#tentang` (repeat for the other four); `/sitemap.xml` lists only the 4 static paths + posts; `grep -rn "rfttech" app components` → only none or brand default constant.
- [ ] **Step 3: Full manual QA at 1440px and 360px** — hero, every section, `/blog`, a post, `/privacy`, `/terms`, admin brand/services/portfolio still work.
- [ ] **Step 4: Commit** — `feat: redirect old pages to one-page anchors; update sitemap and docs`
