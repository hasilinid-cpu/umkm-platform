import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/providers/AuthProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://umkmpengerak.id'),
  title: {
    default: 'UMKM Penggerak Indonesia — UMKM Kuat, Indonesia Maju',
    template: '%s | UMKM Penggerak Indonesia',
  },
  description: 'Platform ekosistem digital terpadu untuk pelatihan, pengembangan, komunitas, dan monetisasi UMKM di Indonesia.',
  keywords: ['UMKM', 'kursus bisnis', 'pelatihan UMKM', 'komunitas UMKM', 'mentor bisnis'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'UMKM Penggerak Indonesia',
    title: 'UMKM Penggerak Indonesia — UMKM Kuat, Indonesia Maju',
    description: 'Platform ekosistem digital terpadu untuk UMKM Indonesia.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${dmSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-body bg-slate-50 text-slate-900 antialiased">
        <GoogleAnalytics />
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" toastOptions={{
              duration: 4000,
              style: { background: '#1E3A5F', color: '#fff', borderRadius: '12px', padding: '12px 20px', fontSize: '14px' },
              success: { iconTheme: { primary: '#16A34A', secondary: '#fff' } },
              error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
            }} />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
