import type { Metadata } from "next";
import localFont from "next/font/local";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import "./globals.css";

// Self-hosted (app/fonts, Fontsource latin subset, SIL OFL): next/font/google fetches from Google at
// build time and broke the GitHub Actions build, so the build no longer needs the network for fonts.
const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} | Digital Agency`,
  description: `${BRAND_TAGLINE}. Pembuatan website, aplikasi mobile, SEO, branding, dan social media untuk bisnis Anda.`,
  keywords: [
    "digital agency",
    "pembuatan website",
    "aplikasi mobile",
    "SEO management",
    "branding",
    "social media",
    "jasa website",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        {/* Tandai JS aktif sebelum paint, supaya animasi reveal tidak menyembunyikan konten tanpa JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className={`${jakarta.variable} ${instrument.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
