/**
 * Next.js 12 and Earlier - Vercel Analytics Integration Example
 * 
 * File: pages/_app.tsx
 * 
 * This example shows how to integrate Vercel Web Analytics in Next.js applications
 * using the Pages Router pattern (pre v13).
 */

import type { AppProps } from 'next/app';
import { inject } from '@vercel/analytics';

function App({ Component, pageProps }: AppProps) {
  // Call inject() to enable Vercel Web Analytics
  // This runs on every page load and captures analytics data
  inject();

  return <Component {...pageProps} />;
}

export default App;

/**
 * Alternative: Using useEffect for more control
 * 
 * import { useEffect } from 'react';
 * 
 * function App({ Component, pageProps }: AppProps) {
 *   useEffect(() => {
 *     inject();
 *   }, []);
 * 
 *   return <Component {...pageProps} />;
 * }
 */
