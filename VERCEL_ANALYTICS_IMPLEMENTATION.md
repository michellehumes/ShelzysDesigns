# Vercel Web Analytics - Complete Implementation Guide

This guide covers how to install and configure Vercel Web Analytics for different platforms and frameworks used by Shelzy's Designs.

## 📋 Table of Contents

1. [Shopify Store](#shopify-store) - Using Liquid snippets
2. [Next.js Application](#nextjs-application) - Using @vercel/analytics
3. [React Application](#react-application) - Using @vercel/analytics
4. [Plain HTML Sites](#plain-html-sites) - Direct script injection
5. [Other Frameworks](#other-frameworks) - Framework-specific patterns
6. [Verification & Testing](#verification--testing)
7. [Custom Events & Advanced Usage](#custom-events--advanced-usage)

---

## Shopify Store

### Prerequisites

- Vercel account with Web Analytics enabled
- Shopify store admin access
- Access to theme code editor

### Installation Steps

#### Step 1: Verify Analytics Snippet Exists

The snippet file is already created at: `./shopify/snippets/shelzys-vercel-analytics.liquid`

**Contents:**
```liquid
<!-- Vercel Web Analytics -->
<script defer src="/_vercel/insights/script.js"></script>
```

#### Step 2: Add Snippet to Theme Layout

1. Go to **Shopify Admin → Online Store → Themes**
2. Find your active theme and click **Edit code**
3. In the left sidebar, navigate to **Layout** folder
4. Open `theme.liquid`
5. Find the `{{ content_for_header }}` line (usually in the `<head>` section)
6. Add the following line **immediately after** `{{ content_for_header }}`:

```liquid
{{ content_for_header }}

<!-- Vercel Web Analytics -->
{% render 'shelzys-vercel-analytics' %}
```

**Important:** Must be placed AFTER `{{ content_for_header }}` to avoid conflicts with Shopify's native tracking.

7. Click **Save**

#### Step 3: Verify in Browser

1. Visit your Shopify store
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Check for any errors related to Vercel analytics
5. Open **Network** tab and verify `/_vercel/insights/script.js` loads successfully

#### Step 4: Check Analytics Dashboard

1. Log in to [vercel.com](https://vercel.com)
2. Select your project
3. Navigate to **Analytics** tab
4. You should see data appearing within 1-2 minutes

### Features Available in Shopify

Once installed, you can:

- ✅ Track page views and unique visitors
- ✅ Monitor device types (mobile, tablet, desktop)
- ✅ View top performing pages
- ✅ Analyze referral sources
- ✅ Track bounce rates
- ✅ Monitor conversion funnels

### Custom Event Tracking in Shopify

To track specific user actions, add this code to relevant sections:

#### Track Product Customization

Add to personalization form sections:

```liquid
<script>
  function trackCustomization(productName, colorOption) {
    if (window.va) {
      window.va.track('personalization_started', {
        product: productName,
        color: colorOption,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Trigger on customization field change
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('personalization-field')) {
      trackCustomization(e.target.dataset.product, e.target.value);
    }
  });
</script>
```

#### Track Add to Cart

```liquid
<script>
  // Hook into Shopify's cart events
  document.addEventListener('shopify:cart:add', function(e) {
    if (window.va) {
      window.va.track('add_to_cart', {
        product_id: e.detail.product_id,
        product_name: e.detail.product_name,
        price: e.detail.price,
        quantity: e.detail.quantity
      });
    }
  });
</script>
```

#### Track Newsletter Signup

```liquid
<script>
  document.getElementById('newsletter-form')?.addEventListener('submit', function() {
    if (window.va) {
      window.va.track('newsletter_signup', {
        source: 'footer',
        timestamp: new Date().toISOString()
      });
    }
  });
</script>
```

---

## Next.js Application

### Prerequisites

- Node.js 16+ installed
- Existing Next.js project (v12+)
- Vercel account with Web Analytics enabled

### Installation Steps

#### Step 1: Install @vercel/analytics Package

```bash
npm install @vercel/analytics
# or
pnpm add @vercel/analytics
# or
yarn add @vercel/analytics
# or
bun add @vercel/analytics
```

#### Step 2: Import in App Entry Point

For **App Router** (Next.js 13+):

Create or update `app/layout.tsx` (or `app/layout.jsx`):

```typescript
import { inject } from '@vercel/analytics';

export const metadata = {
  title: "Shelzy's Designs - Premium Personalized Water Bottles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  inject();

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

For **Pages Router** (Next.js 12 and earlier):

Update `pages/_app.tsx` (or `pages/_app.jsx`):

```typescript
import type { AppProps } from 'next/app';
import { inject } from '@vercel/analytics';

function App({ Component, pageProps }: AppProps) {
  inject();

  return <Component {...pageProps} />;
}

export default App;
```

#### Step 3: (Optional) Configure with React

If using React 18+ with Server Components, you can use a client component:

Create `app/analytics.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { inject } from '@vercel/analytics';

export function Analytics() {
  useEffect(() => {
    inject();
  }, []);

  return null;
}
```

Then in `app/layout.tsx`:

```typescript
import { Analytics } from './analytics';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Step 4: Verify Installation

1. Run your Next.js app: `npm run dev`
2. Open in browser and navigate to a page
3. Open DevTools Console
4. Check for any errors
5. Verify analytics script loads in Network tab

#### Step 5: Deploy to Vercel

```bash
vercel deploy
```

Analytics will automatically be enabled when deployed to Vercel.

### Custom Events in Next.js

Track user interactions:

```typescript
import { useEffect } from 'react';

export default function ProductPage() {
  useEffect(() => {
    // Track product view
    if (window.va) {
      window.va.track('product_view', {
        product_name: 'Signature Personalized Bottle',
        category: 'wedding',
        price: 34.99
      });
    }
  }, []);

  const handleAddToCart = (productId: string) => {
    window.va?.track('add_to_cart', {
      product_id: productId,
      product_name: 'Signature Personalized Bottle',
      price: 34.99,
      quantity: 1
    });

    // Continue with add to cart logic
  };

  return (
    // Your component JSX
    <button onClick={() => handleAddToCart('prod_123')}>
      Add to Cart
    </button>
  );
}
```

---

## React Application

### Prerequisites

- Node.js 16+ installed
- Existing React project (Create React App, Vite, etc.)
- Vercel account with Web Analytics enabled

### Installation Steps

#### Step 1: Install @vercel/analytics Package

```bash
npm install @vercel/analytics
# or
pnpm add @vercel/analytics
# or
yarn add @vercel/analytics
```

#### Step 2: Add to App Entry Point

In your main app file (`src/App.tsx` or `src/App.jsx`):

```typescript
import { useEffect } from 'react';
import { inject } from '@vercel/analytics';
import './App.css';

function App() {
  useEffect(() => {
    inject();
  }, []);

  return (
    <div className="App">
      {/* Your app content */}
    </div>
  );
}

export default App;
```

Or, create a hook for reusability (`src/hooks/useAnalytics.ts`):

```typescript
import { useEffect } from 'react';
import { inject } from '@vercel/analytics';

export function useAnalytics() {
  useEffect(() => {
    inject();
  }, []);
}
```

Then use in your App:

```typescript
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  useAnalytics();

  return <div className="App">{/* content */}</div>;
}
```

#### Step 3: Verify Installation

1. Run your React app: `npm start`
2. Check DevTools Console for errors
3. Verify analytics is loading in Network tab
4. Open [vercel.com/analytics](https://vercel.com/analytics) to see data

### Custom Events in React

Create a tracking utility (`src/utils/analytics.ts`):

```typescript
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (window.va) {
    window.va.track(eventName, properties);
  }
}

export function trackProductView(productName: string, price: number) {
  trackEvent('product_view', {
    product_name: productName,
    price,
    timestamp: new Date().toISOString()
  });
}

export function trackAddToCart(productId: string, quantity: number = 1) {
  trackEvent('add_to_cart', {
    product_id: productId,
    quantity,
    timestamp: new Date().toISOString()
  });
}

export function trackCheckout(total: number, itemsCount: number) {
  trackEvent('checkout_started', {
    total,
    items_count: itemsCount,
    timestamp: new Date().toISOString()
  });
}
```

Use in components:

```typescript
import { trackProductView, trackAddToCart } from '../utils/analytics';

export function ProductCard({ product }) {
  useEffect(() => {
    trackProductView(product.name, product.price);
  }, [product]);

  const handleAddToCart = () => {
    trackAddToCart(product.id);
    // Continue with cart logic
  };

  return (
    <div>
      <h2>{product.name}</h2>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

---

## Plain HTML Sites

For static HTML sites, no package installation is needed. Simply add the script tag directly.

### Step 1: Add Script Tag to HTML

Add this line in the `<head>` section of your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Shelzy's Designs - Premium Personalized Water Bottles</title>
    
    <!-- Vercel Web Analytics -->
    <script defer src="/_vercel/insights/script.js"></script>
    
    <!-- Your other head content -->
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### Step 2: For Multiple Files

If you have multiple HTML pages, create a shared analytics snippet and include it:

Create `analytics.html`:

```html
<!-- Vercel Web Analytics -->
<script defer src="/_vercel/insights/script.js"></script>
```

Include it in each HTML file using a build tool or server-side includes:

```html
<!-- Using SSI (if server supports) -->
<!--#include virtual="/analytics.html" -->

<!-- Or as a template fragment -->
{% include 'analytics.html' %}
```

### Step 3: Verify

1. Open your HTML file in a browser
2. Check DevTools Network tab for `/_vercel/insights/script.js`
3. Check Console for any errors
4. Data should appear in Vercel Analytics dashboard within 1-2 minutes

### Custom Events in Plain HTML

```javascript
// Simple event tracking
document.getElementById('contact-form').addEventListener('submit', function(e) {
  if (window.va) {
    window.va.track('contact_form_submitted', {
      form_type: 'contact',
      timestamp: new Date().toISOString()
    });
  }
});

// Track button clicks
document.querySelectorAll('.cta-button').forEach(button => {
  button.addEventListener('click', function(e) {
    if (window.va) {
      window.va.track('cta_clicked', {
        button_text: e.target.innerText,
        page: window.location.pathname
      });
    }
  });
});
```

---

## Other Frameworks

### Vue.js / Nuxt

#### For Vue 3 with Vite:

```bash
npm install @vercel/analytics
```

In `src/main.ts`:

```typescript
import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import App from './App.vue'

inject()

createApp(App).mount('#app')
```

#### For Nuxt 3:

Create `app.vue`:

```vue
<script setup>
import { inject } from '@vercel/analytics'

onMounted(() => {
  inject()
})
</script>

<template>
  <NuxtPage />
</template>
```

### Svelte

```bash
npm install @vercel/analytics
```

In `src/app.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset='utf-8' />
    <link rel='icon' href='/favicon.png' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    
    <!-- Vercel Web Analytics -->
    <script defer src="/_vercel/insights/script.js"></script>
    
    %sveltekit.head%
</head>
<body>
    <div id='app'>%sveltekit.body%</div>
</body>
</html>
```

### Astro

```bash
npm install @vercel/analytics
```

In `src/layouts/Layout.astro`:

```astro
---
import { inject } from '@vercel/analytics';
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <title>Shelzy's Designs</title>
    <script is:inline>
        import { inject } from '@vercel/analytics';
        inject();
    </script>
</head>
<body>
    <slot />
</body>
</html>
```

### Express / Node.js Backend

For server-side rendered applications, use the client-side script in your HTML template:

In your HTML template:

```html
<head>
    <script defer src="/_vercel/insights/script.js"></script>
</head>
```

---

## Verification & Testing

### Step 1: Verify Script Loads

1. Open your website
2. Press F12 to open DevTools
3. Go to **Network** tab
4. Look for `/_vercel/insights/script.js` request
5. Status should be 200

### Step 2: Verify in Analytics Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Click **Analytics** tab
4. You should see:
   - Real-time page views
   - Visitor count
   - Device information
   - Referral sources

**Note:** First data may take 1-2 minutes to appear.

### Step 3: Test Different Scenarios

- ✅ Visit from desktop (check device distribution)
- ✅ Visit from mobile (check mobile traffic)
- ✅ Visit from incognito window (check if tracked)
- ✅ Different referral sources (check referral data)

### Step 4: Check Browser Console

```javascript
// In browser console, run:
console.log(window.va)
// Should output the Vercel Analytics object

// Test custom event:
window.va?.track('test_event', { test: true })
```

---

## Custom Events & Advanced Usage

### Recommended Events to Track

For e-commerce optimization:

```javascript
// Product Page View
window.va?.track('product_viewed', {
  product_id: 'prod_123',
  product_name: 'Signature Personalized Bottle',
  category: 'wedding',
  price: 34.99
})

// Add to Cart
window.va?.track('item_added_to_cart', {
  product_id: 'prod_123',
  quantity: 1,
  price: 34.99,
  category: 'wedding'
})

// Personalization Started
window.va?.track('personalization_started', {
  product_id: 'prod_123',
  personalization_type: 'name',
  color: 'sage-green'
})

// Remove from Cart
window.va?.track('item_removed_from_cart', {
  product_id: 'prod_123',
  quantity: 1
})

// Checkout Started
window.va?.track('checkout_started', {
  items_count: 2,
  cart_value: 99.97,
  currency: 'USD'
})

// Purchase Completed
window.va?.track('purchase_completed', {
  order_id: 'ord_12345',
  total: 99.97,
  items_count: 2,
  currency: 'USD',
  shipping_method: 'standard'
})

// Newsletter Signup
window.va?.track('newsletter_signup', {
  source: 'popup',
  email_domain: 'gmail.com'
})

// Search Query
window.va?.track('search_executed', {
  query: 'bridesmaid bottles',
  results_count: 12
})
```

### Advanced: Event Properties

```javascript
window.va?.track('event_name', {
  // String properties
  user_segment: 'vip_customer',
  referral_code: 'FRIEND10',
  
  // Numeric properties
  value: 99.99,
  quantity: 5,
  discount_percent: 10,
  
  // Boolean properties
  is_first_purchase: true,
  uses_personalization: true,
  
  // Date properties
  timestamp: new Date().toISOString(),
  
  // Nested objects (will be flattened)
  product: {
    id: 'prod_123',
    name: 'Signature Bottle'
  }
})
```

---

## Best Practices

### ✅ DO

- ✅ Place analytics script early in page load
- ✅ Use descriptive event names (snake_case)
- ✅ Track meaningful user actions
- ✅ Include context in event properties
- ✅ Test events in browser console before production
- ✅ Use consistent property names across events

### ❌ DON'T

- ❌ Don't collect personally identifiable information (PII)
- ❌ Don't track on every single interaction
- ❌ Don't include passwords, credit cards, or sensitive data
- ❌ Don't add the script multiple times
- ❌ Don't use inconsistent property naming
- ❌ Don't call inject() multiple times

---

## Troubleshooting

### Issue: Analytics not showing data

**Solutions:**
1. Verify script loads: Check Network tab for `/_vercel/insights/script.js`
2. Wait 1-2 minutes for first data to appear
3. Open site in incognito window to bypass cache
4. Check that Vercel Analytics is enabled in project settings
5. Check browser console for JavaScript errors

### Issue: Duplicate tracking

**Solutions:**
1. Ensure `inject()` is called only once
2. Don't add script tag twice
3. Check for duplicate snippet inclusions
4. Clear browser cache and retry

### Issue: Custom events not tracking

**Solutions:**
1. Verify `window.va` exists: `console.log(window.va)`
2. Use optional chaining: `window.va?.track()`
3. Test event in console first
4. Check event name for special characters

---

## Performance Impact

- **Script Size:** ~1KB gzipped
- **Load Time:** Async (non-blocking)
- **Processing:** Server-side, no impact on client
- **Cookies:** None used (privacy-friendly)
- **Performance Impact:** < 2ms per page view

---

## Privacy & Compliance

✅ **Vercel Web Analytics is:**
- GDPR compliant
- CCPA compliant
- No cookies
- No third-party tracking
- No personal data collection

Optional: Add to privacy policy:
> We use Vercel Web Analytics to understand how visitors use our website. This analytics service does not use cookies and does not collect personal information.

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs/concepts/analytics
- **API Reference:** https://vercel.com/docs/concepts/analytics/events-api
- **Events Guide:** https://vercel.com/docs/concepts/analytics/custom-events
- **Troubleshooting:** https://vercel.com/support

---

**Last Updated:** December 9, 2025
**Status:** Complete & Ready for Implementation
