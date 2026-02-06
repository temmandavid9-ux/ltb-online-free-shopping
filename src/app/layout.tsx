import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { RedeemProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Eden 0² - Professional Reward-Based Ecommerce Platform',
  description: 'A professional reward-based ecommerce web platform.',
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
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <FirebaseClientProvider>
          <RedeemProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </RedeemProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
