import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Header } from '@/components/Header';
import { getTrendingCoins } from '@/lib/coingecko.actions';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CoinPulse | Real-Time Crypto Tracker',
  description: 'Stay ahead of the market with real-time tracking powered by CoinGecko.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const trendingCoins = await getTrendingCoins();

  return (
    <html lang='en' className='dark'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header trendingCoins={trendingCoins || []} />
        {children}
      </body>
    </html>
  );
}
