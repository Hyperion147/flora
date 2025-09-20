import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { Providers } from '@/app/providers';
import Navigation from '@/app/components/Navigation'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flora',
  description: 'Track and manage your plants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <NextTopLoader color="#10b981" />
            <Navigation />
            {children}
            <Toaster />
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}