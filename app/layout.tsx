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
  title: {
    default: 'WhoVisited',
    template: '%s | WhoVisited',
  },
  description:
    'Privacy-first website analytics that helps you understand your traffic without invasive tracking. Simple, lightweight, and privacy-friendly insights.',
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
