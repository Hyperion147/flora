import type { Metadata } from 'next';
import { Fraunces, JetBrains_Mono, Manrope } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Toaster as Sonner } from 'sonner';
import { Providers } from '@/app/providers';
import Navigation from '@/app/components/Navigation'
import { Analytics } from "@vercel/analytics/next"

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${manrope.variable} ${fraunces.variable} ${jetBrainsMono.variable} font-sans`}
      >
        <Providers>
          <AuthProvider>
            <Navigation />
            {children}
            <Toaster />
            <Sonner />
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
