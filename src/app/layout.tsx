import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { RedeemProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FirebaseClientProvider } from '@/firebase';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'Less Talk Business - Professional Reward-Based Ecommerce Platform',
  description: 'A professional reward-based ecommerce web platform.',
  manifest: '/manifest.json', // This connects your PWA manifest
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="4Hj8k1Cc2-cFv7nmQfJE-rxlsQnzrvPjPkYjd7QJ5Xs" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <FirebaseClientProvider>
          <LanguageProvider>
            <RedeemProvider>
              <Suspense fallback={<div className="h-20 bg-black" />}>
                <Header />
                <main className="flex-grow">{children}</main>
              </Suspense>
              <Footer />
            </RedeemProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
