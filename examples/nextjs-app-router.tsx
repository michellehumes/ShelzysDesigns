/**
 * Next.js 13+ App Router - Vercel Analytics Integration Example
 * 
 * File: app/layout.tsx
 * 
 * This example shows how to integrate Vercel Web Analytics in a Next.js 13+ application
 * using the App Router pattern.
 */

import { inject } from '@vercel/analytics';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shelzy's Designs - Premium Personalized Water Bottles",
  description:
    'Custom-made sublimation water bottles for weddings, bridesmaids, holidays, and every day.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Call inject() to enable Vercel Web Analytics
  // This must run on the client side and captures page view data
  inject();

  return (
    <html lang="en">
      <head>
        {/* Other head elements */}
      </head>
      <body>
        {/* Main content */}
        {children}

        {/* Analytics will automatically track page views and user interactions */}
      </body>
    </html>
  );
}
