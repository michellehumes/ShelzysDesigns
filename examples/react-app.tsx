/**
 * React Application - Vercel Analytics Integration Example
 * 
 * File: src/App.tsx
 * 
 * This example shows how to integrate Vercel Web Analytics in a React application
 * (Create React App, Vite, etc.)
 */

import { useEffect } from 'react';
import { inject } from '@vercel/analytics';
import './App.css';

function App() {
  useEffect(() => {
    // Call inject() once on component mount
    // This enables Vercel Web Analytics for your application
    inject();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="App">
      <header>
        <h1>Shelzy's Designs - Premium Personalized Water Bottles</h1>
      </header>

      <main>
        {/* Your app content */}
        <p>
          Vercel Web Analytics is now active and tracking user behavior.
        </p>
      </main>

      {/* Analytics will automatically track:
          - Page views
          - Device information
          - Referral sources
          - User interactions (with custom events)
      */}
    </div>
  );
}

export default App;

/**
 * Alternative: Using a Custom Hook
 * 
 * Create src/hooks/useAnalytics.ts:
 * 
 * import { useEffect } from 'react';
 * import { inject } from '@vercel/analytics';
 * 
 * export function useAnalytics() {
 *   useEffect(() => {
 *     inject();
 *   }, []);
 * }
 * 
 * Then use in App.tsx:
 * 
 * function App() {
 *   useAnalytics();
 *   
 *   return <div>Your content</div>;
 * }
 */
