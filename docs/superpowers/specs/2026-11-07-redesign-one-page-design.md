# Redesign: beranda satu halaman bergaya Smartles

Tanggal: 2026-11-07 · Status: draf, menunggu persetujuan

## Maksud dan alasan

Situs publik RFT sekarang terpecah ke banyak halaman (About, Services, Projects, Career, Contact, Blog) dengan desain dark mode generik. Pemilik ingin situs terasa seperti landing page produk modern, mengikuti gaya https://smartles.tapp.web.id/beranda (situs milik pemilik sendiri), dan menggiring pengunjung ke **satu tindakan: chat WhatsApp untuk konsultasi**.

Dua hal yang paling sering ditanyakan calon klien saat chat adalah **harga** dan **contoh hasil kerja**. Halaman harus menjawab keduanya sebelum mereka chat.

## Tujuan

- Beranda `/` menjadi satu halaman panjang berisi semua konten publik utama, dalam gaya visual Smartles dengan palet **hitam penuh + putih sebagai aksen** (arah "B" yang dipilih pemilik).
- CTA utama di mana-mana: **Chat WhatsApp** (link `wa.me` dengan pesan pembuka terisi).
- Portofolio dan harga "mulai dari" ditonjolkan.
- Semua konten yang sekarang bisa diedit dari admin tetap diambil dari admin.
- Identitas baru: logo `logo-rft.webp`, nama **PT. RFT Digital Solution**, tagline **"From Brand Vision to Virtual Experiences"**.

## Bukan tujuan

- Mendesain ulang panel admin (hanya ditambah field baru).
- Sistem paket/harga bertingkat; cukup satu harga "mulai dari" per layanan.
- Form kontak, chatbot, atau integrasi WA API; cukup link `wa.me`.
- Mengubah alur auth, cache Redis, atau MinIO.

## Anti-tujuan (gagal walau "jalan")

- Tampilan masih terasa seperti template dark-mode generik, bukan gaya Smartles.
- Tombol WhatsApp sulit ditemukan atau nomor WA tertanam di kode.
- Link lama (`/about`, `/services`, …) atau hasil Google jadi 404.
- Blog tidak lagi bisa dibuka atau terlihat beda gaya dari beranda.
- Halaman berat/lambat di HP karena animasi atau mockup.

## Gaya visual (diputuskan)

Referensi: Smartles, disalin polanya; warna diganti.

- **Warna:** latar `#09090b`, permukaan `#141416`/`#18181b`, garis `#232326`, teks `#f4f4f5`, teks redup `#a1a1aa`/`#71717a`. Aksen utama **putih** (tombol primer putih dengan teks hitam). Satu-satunya warna lain: **oranye `#ea580c`** untuk coretan judul dan tanda ✦ di pita teks.
- **Font:** Plus Jakarta Sans (400–800) untuk semua teks; judul weight 800 dengan letter-spacing rapat (~-0.05em). Instrument Serif italic untuk kata aksen di judul. Ganti Inter di `app/layout.tsx`.
- **Pola Smartles yang dipakai:** bar pengumuman tipis di paling atas; navbar kapsul melayang dan sticky di tengah; hero dengan judul raksasa + kata yang dicoret oranye + mockup mengambang (sebagian di-blur) di kiri-kanan; pita teks miring berjalan; kalimat besar dengan cahaya radial bulat di belakangnya; kartu yang bisa digeser dengan tombol +; eyebrow kecil huruf kapital sebelum judul section; baris angka; accordion FAQ; section penutup dengan sudut atas membulat dan latar radial; tombol CTA melayang di pojok kanan bawah.
- **Animasi:** muncul/memudar saat scroll (Framer Motion, sudah ada), marquee berjalan. Wajib menghormati `prefers-reduced-motion`.
- Mockup visual yang sudah disetujui: `.superpowers/brainstorm/96826-1794057695/content/arah-b-logo.html`.

## Struktur halaman `/` (diputuskan, urutan dari atas)

| # | Section | Anchor | Sumber isi |
|---|---------|--------|------------|
| 1 | Bar pengumuman + navbar + Hero (CTA WA + "Lihat portofolio") | `#beranda` | baru (statis) |
| 2 | Pita teks miring berisi nama layanan | — | admin: Service |
| 3 | Dipercaya oleh (marquee logo mitra) | — | admin: TrustedPartner |
| 4 | Kalimat besar dengan cahaya bulat | — | baru (statis) |
| 5 | Layanan: kartu geser, tombol + membuka detail | `#layanan` | admin: Service |
| 6 | Portofolio: galeri geser, filter per layanan | `#portofolio` | admin: PortfolioProject |
| 7 | Cara kerja: 4 langkah (Chat WA → Konsultasi & penawaran → Pengerjaan → Rilis & pendampingan) | `#cara-kerja` | baru (statis) |
| 8 | Harga "mulai dari": satu kartu per layanan + tombol "Tanya paket ini via WhatsApp" | `#harga` | admin: Service (field baru) |
| 9 | Tentang + 3 nilai + baris angka | `#tentang` | admin: AboutPage; angka baru (statis) |
| 10 | Karier: daftar lowongan ringkas; disembunyikan jika kosong | `#karier` | admin: CareerOpening |
| 11 | Artikel terbaru: 3 post, link ke `/blog` | `#blog` | admin: Post |
| 12 | FAQ "Masih ada yang bikin ragu?" (lama pengerjaan, revisi, hosting, maintenance, pembayaran) | `#faq` | baru (statis) |
| 13 | Penutup: logo utuh, ajakan terakhir, tombol WA + email, footer (Privasi, Syarat) | `#kontak` | baru (statis) + admin: Brand |

Bagian Smartles yang **tidak** dipakai: kalkulator, tabel perbandingan, galeri "24 layar", tab cerita per peran.

## WhatsApp

- Nomor WA dan pesan pembuka default disimpan di **BrandSettings** dan diatur dari halaman admin Brand.
- Link: `https://wa.me/<nomor>?text=<pesan ter-encode>`; tombol di kartu harga menambahkan nama layanan ke pesan ("…saya mau tanya paket Pembuatan Website").
- Tombol WA muncul di: navbar, hero, kartu harga, penutup, dan tombol melayang kanan bawah.
- Jika nomor belum diisi, tombol WA jatuh ke `mailto:` email kontak.

## Perubahan data & admin (diputuskan)

- `Service`: tambah `priceFrom Int?` (rupiah). Kosong = kartu harga menampilkan "Hubungi kami". Form admin layanan mendapat input harga.
- `BrandSettings`: tambah `whatsappNumber String?`, `whatsappMessage String?`, `contactEmail String?`, `logoMarkUrl String?`; `logoUrl` menjadi opsional. Form admin Brand mendapat input-input ini.
- *Keputusan pembangun:* filter portofolio mencocokkan `PortfolioProject.services` (JSON berisi nama layanan) dengan judul `Service` berdasarkan nama. Agar tidak meleset karena salah ketik, input layanan di editor portofolio admin diganti menjadi checklist dari layanan yang ada (format data tetap array nama, tanpa ubah skema).
- Skema diterapkan dengan `prisma db push` (pola proyek saat ini).
- Fallback statis di `lib/marketing-data.ts` ikut diperbarui (nama perusahaan, harga contoh) agar halaman tetap tampil tanpa DB.

## Halaman lain & routing (diputuskan)

- `/about`, `/services`, `/projects`, `/career`, `/contact` → redirect permanen (308) ke `/#tentang`, `/#layanan`, `/#portofolio`, `/#karier`, `/#kontak`.
- `/blog`, `/blog/[slug]`, `/privacy`, `/terms` tetap halaman sendiri, memakai navbar + footer baru dan gaya visual yang sama.
- Link navbar memakai anchor (`/#layanan`, dst.) supaya juga bekerja dari halaman blog.
- `app/sitemap.ts` dan metadata (`app/layout.tsx`) diperbarui: hapus rute yang di-redirect, nama perusahaan baru.

## Branding (diputuskan)

- Nama di semua teks publik dan metadata: **PT. RFT Digital Solution** (menggantikan "PT. Reliable Future Technology").
- Logo: `logo-rft.webp` (250×250, latar hitam, sumber `~/Downloads/logo-rft.webp`) disalin ke `public/` dan dijadikan `BRAND_LOGO_FALLBACK_SRC`; logo dari admin tetap bisa menimpanya. Navbar menampilkan simbol saja, penutup menampilkan logo utuh.
- *Keputusan pembangun (dikonfirmasi saat review):* seed lama mengisi `BrandSettings.logoUrl = '/brand-logo.svg'`, sehingga fallback baru tidak akan pernah tampil. Maka: nilai `'/brand-logo.svg'` (dan nilai kosong) diperlakukan sebagai "belum diatur"; seed diperbarui ke logo baru; `logoUrl` dibuat opsional dan validasinya menerima path relatif (`/…`) maupun URL penuh, supaya admin bisa menyimpan nomor WA/email tanpa wajib upload ulang logo.
- *Keputusan pembangun:* simbol navbar disimpan sebagai file terpisah — `public/brand-mark.webp` (crop persegi simbol dari `logo-rft.webp`) — plus field opsional `BrandSettings.logoMarkUrl` dengan upload di admin Brand. Tidak memakai crop CSS dengan angka tetap.

## Kendala

- Next.js 16 App Router, Tailwind v4, shadcn/ui, Framer Motion yang sudah ada; tidak menambah framework UI baru.
- Halaman publik `force-dynamic`; perubahan admin memanggil `revalidatePath('/')`.
- Mobile-first: semua section harus rapi di lebar 360px; mockup mengambang disembunyikan di HP.
- Gambar remote harus lolos `images.remotePatterns` dan CSP di `next.config.ts`; font dari Google lewat `next/font`.

## Diserahkan ke pembangun

- Copywriting final untuk hero, kalimat besar, cara kerja, FAQ, angka statistik, dan bar pengumuman (tulis draf yang masuk akal dalam Bahasa Indonesia santai-profesional; pemilik akan mengoreksi).
- Isi mockup mengambang di hero (boleh pakai screenshot portofolio dari admin, atau kartu ilustrasi).
- Pembagian komponen, detail animasi, dan perilaku kartu geser.
