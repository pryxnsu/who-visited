import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inconsolata } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inconsolata = Inconsolata({
  variable: '--font-inconsolata-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WhoVisited | Know when someone visits your portfolio',
  description:
    'A simple visit tracker for portfolio owners. Embed one snippet and monitor every new portfolio visit live.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inconsolata.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
