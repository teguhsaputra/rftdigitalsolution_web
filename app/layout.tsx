import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
    <html lang="id" className="dark">
      <body className={`${jakarta.variable} ${instrument.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
