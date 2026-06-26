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

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://flora.example.com"
).replace(/\/+$/, "");

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Flora",
  url: siteUrl,
  description:
    "Flora helps plant lovers discover, track, map, and celebrate plants around the world.",
  inLanguage: "en",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Flora",
  url: siteUrl,
  logo: `${siteUrl}/favicon/android-chrome-512x512.png`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Flora",
  manifest: "/site.webmanifest",
  title: {
    default: "Flora | Discover, Track, and Map Plants Worldwide",
    template: "%s | Flora",
  },
  description:
    "Flora helps plant lovers discover, track, map, and celebrate plants around the world with geotagged discoveries, search, and community leaderboards.",
  keywords: [
    "plant tracking",
    "plant map",
    "flora app",
    "botanical discoveries",
    "geotagged plants",
    "plant community",
    "plant identification log",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon/favicon.ico"],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Flora",
    title: "Flora | Discover, Track, and Map Plants Worldwide",
    description:
      "Explore geotagged plant discoveries, track your own plants, and join a growing global community of plant lovers.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Flora plant discovery platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flora | Discover, Track, and Map Plants Worldwide",
    description:
      "Explore geotagged plant discoveries, track your own plants, and join a growing global community of plant lovers.",
    images: ["/og-image"],
  },
  authors: [{ name: "Suryansu" }],
  creator: "Suryansu",
  publisher: "Flora",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "nature",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
