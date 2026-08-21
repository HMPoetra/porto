import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import GraffitiEffects from "@/components/GraffitiEffects";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

import { LanguageProvider } from "@/context/LanguageContext";
import FloatingControls from "@/components/FloatingControls";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFD600",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://porto-self-ten.vercel.app'),
  title: {
    default: "Hapsoro Mahendra Poetra - Portofolio",
    template: "%s | HMPoetra",
  },
  description:
    "Personal portfolio of Hapsoro Mahendra Poetra — D3 Informatics student & Fullstack Web Developer from Bandung, Indonesia. Specializing in Next.js, TypeScript, React.js, and Supabase.",
  applicationName: "HMPoetra Portfolio",
  keywords: [
    "Hapsoro Mahendra Poetra",
    "HMPoetra",
    "web developer",
    "portfolio",
    "Next.js",
    "TypeScript",
    "React",
    "fullstack",
    "Indonesia",
    "Bandung",
    "ULBI",
    "freelance developer",
    "internship",
  ],
  authors: [{ name: "Hapsoro Mahendra Poetra", url: "https://github.com/HMPoetra" }],
  creator: "Hapsoro Mahendra Poetra",
  publisher: "Hapsoro Mahendra Poetra",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://porto-self-ten.vercel.app",
    siteName: "HMPoetra Portfolio",
    title: "Hapsoro Mahendra Poetra - Portofolio",
    description:
      "D3 Informatics Student & Fullstack Web Developer from Bandung, Indonesia. Specializing in Next.js, TypeScript, React.js, and modern digital experiences.",
    images: [
      {
        url: "https://porto-self-ten.vercel.app/og-image.png",
        secureUrl: "https://porto-self-ten.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Hapsoro Mahendra Poetra — Web Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hapsoro Mahendra Poetra - Portofolio",
    description:
      "D3 Informatics Student & Fullstack Web Developer from Bandung, Indonesia.",
    images: ["https://porto-self-ten.vercel.app/og-image.png"],
    creator: "@HMPoetra",
    site: "@HMPoetra",
  },
  icons: {
    icon: [
      { url: "/icon.png?v=3", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico?v=3" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [
      { url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json?v=3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${archivoBlack.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <LanguageProvider>
            {/* Skip to content for accessibility */}
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <LoadingScreen />
            <GraffitiEffects />
            <FloatingControls />
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
