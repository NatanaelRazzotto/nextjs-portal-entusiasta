import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import SideNav from './ui/dashboard/sidenavManager';

import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

import { SessionProvider } from 'next-auth/react';





 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className={`${inter.className} antialiased`}>

      <div>{children}</div>

        <Analytics />
      </body>
    </html>
  );
}