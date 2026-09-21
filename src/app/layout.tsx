import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_Telugu } from 'next/font/google';
import './globals.css';

const englishFont = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const teluguFont = Noto_Sans_Telugu({
  variable: '--font-telugu',
  subsets: ['telugu'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TELUGUVA | తెలుగు AI — Understand English. Hear Telugu.',
  description:
    'Translate English words, sentences, documents and images into simple, natural Telugu instantly. Listen with clear Telugu voice.',
  keywords: [
    'Telugu translation',
    'English to Telugu',
    'Telugu AI',
    'OCR English to Telugu',
    'Telugu Speech',
    'Simple Telugu for parents',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="te" className={`${englishFont.variable} ${teluguFont.variable} scroll-smooth`}>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200 selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-amber-300">
        {children}
      </body>
    </html>
  );
}
