import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { fontVariables } from '@/lib/fonts';
import { ThemeScript } from '@/components/layout/ThemeScript';
import { SITE_URL, profile } from '@/content/data/profile';

/** Racine anglaise — miroir complet servi sous /en. */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — AI Engineer | Data & Agentic Systems`,
    template: `%s | ${profile.name}`,
  },
  description: profile.summary.en,
  applicationName: profile.name,
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { telephone: false, email: false, address: false },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0c10' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
