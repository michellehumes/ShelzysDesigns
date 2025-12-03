#!/usr/bin/env node

/**
 * SHELZY'S DESIGNS - MASTER DEPLOYMENT SCRIPT
 * ============================================
 * Single unified deployment for all site features.
 *
 * Usage:
 *   node shopify/scripts/deploy-master.js [options]
 *
 * Options:
 *   --dry-run      Preview changes without deploying
 *   --snippets     Deploy snippets only
 *   --pages        Deploy pages only
 *   --theme        Deploy theme assets only
 *   --all          Deploy everything (default)
 *
 * Environment Variables:
 *   SHOPIFY_STORE_URL    - Your myshopify.com URL
 *   SHOPIFY_ACCESS_TOKEN - Admin API access token
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01',
  dryRun: process.argv.includes('--dry-run'),
  deploySnippets: process.argv.includes('--snippets') || process.argv.includes('--all') || process.argv.length === 2,
  deployPages: process.argv.includes('--pages') || process.argv.includes('--all') || process.argv.length === 2,
  deployTheme: process.argv.includes('--theme') || process.argv.includes('--all') || process.argv.length === 2
};

// Console colors
const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  section: (msg) => console.log(`\n\x1b[35m${'═'.repeat(50)}\n${msg}\n${'═'.repeat(50)}\x1b[0m\n`)
};

// ============================================
// API HELPERS
// ============================================

function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    if (CONFIG.dryRun) {
      log.warn(`DRY RUN: ${method} ${endpoint}`);
      resolve({ success: true, dryRun: true });
      return;
    }

    if (!CONFIG.accessToken) {
      reject(new Error('SHOPIFY_ACCESS_TOKEN not set'));
      return;
    }

    const options = {
      hostname: CONFIG.storeUrl,
      port: 443,
      path: `/admin/api/${CONFIG.apiVersion}${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': CONFIG.accessToken
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else if (res.statusCode === 422) {
            resolve({ exists: true, status: 422 });
          } else {
            reject(new Error(`API ${res.statusCode}: ${body.substring(0, 200)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// SNIPPET DEFINITIONS
// ============================================

const CORE_SNIPPETS = [
  // SEO & Performance
  'shelzys-head-seo.liquid',
  'shelzys-css-variables.liquid',
  'shelzys-fonts.liquid',
  'shelzys-skip-links.liquid',

  // Navigation & UI
  'shelzys-announcement-bar.liquid',
  'shelzys-free-shipping-bar.liquid',
  'shelzys-back-to-top.liquid',

  // Homepage Sections
  'shelzys-hero-premium.liquid',
  'shelzys-bestsellers-premium.liquid',
  'shelzys-occasion-tiles.liquid',
  'shelzys-why-choose-us.liquid',
  'shelzys-sublimation-explainer.liquid',
  'shelzys-testimonials.liquid',
  'shelzys-newsletter-premium.liquid',

  // Product Page
  'shelzys-personalization.liquid',
  'shelzys-product-badges.liquid',
  'shelzys-product-faq.liquid',
  'shelzys-product-schema.liquid',
  'shelzys-sticky-atc.liquid',
  'shelzys-trust-badges.liquid',
  'shelzys-urgency.liquid',

  // Cart & Conversion
  'shelzys-cart-upsell.liquid',
  'shelzys-upsell-sets.liquid',
  'shelzys-price-per-bottle.liquid',

  // Social & Marketing
  'shelzys-popup-premium.liquid',
  'shelzys-social-proof-section.liquid',
  'shelzys-proof-band.liquid',
  'shelzys-instagram-feed.liquid',
  'shelzys-recently-viewed.liquid',

  // Collections
  'shelzys-collection-header.liquid',
  'shelzys-quick-view.liquid',

  // Utilities
  'shelzys-countdown.liquid',
  'shelzys-bulk-bar.liquid',
  'shelzys-faq-schema.liquid',
  'shelzys-settings.liquid'
];

// ============================================
// THEME INJECTION POINTS
// ============================================

const THEME_INJECTIONS = {
  'layout/theme.liquid': {
    head: [
      "{% render 'shelzys-head-seo' %}",
      "{% render 'shelzys-css-variables' %}",
      "{% render 'shelzys-fonts' %}"
    ],
    bodyStart: [
      "{% render 'shelzys-skip-links' %}",
      "{% render 'shelzys-announcement-bar' %}",
      "{% render 'shelzys-free-shipping-bar' %}"
    ],
    bodyEnd: [
      "{% render 'shelzys-popup-premium' %}",
      "{% render 'shelzys-back-to-top' %}",
      "{% render 'shelzys-social-proof-section' %}"
    ]
  },
  'templates/product.liquid': {
    main: [
      "{% render 'shelzys-product-schema', product: product %}",
      "{% render 'shelzys-personalization', product: product %}",
      "{% render 'shelzys-trust-badges' %}",
      "{% render 'shelzys-product-faq' %}",
      "{% render 'shelzys-sticky-atc', product: product %}"
    ]
  },
  'templates/cart.liquid': {
    main: [
      "{% render 'shelzys-cart-upsell' %}",
      "{% render 'shelzys-trust-badges' %}"
    ]
  },
  'templates/collection.liquid': {
    main: [
      "{% render 'shelzys-collection-header', collection: collection %}"
    ]
  }
};

// ============================================
// PAGE DEFINITIONS
// ============================================

const PAGES = [
  {
    title: 'About',
    handle: 'about',
    file: 'about-page.html'
  },
  {
    title: 'Contact',
    handle: 'contact',
    file: 'contact-page.html'
  },
  {
    title: 'FAQ',
    handle: 'faq',
    file: 'faq-page-accordion.html'
  },
  {
    title: 'Privacy Policy',
    handle: 'privacy-policy',
    file: 'privacy-policy.html'
  },
  {
    title: 'Terms of Service',
    handle: 'terms-of-service',
    file: 'terms-of-service.html'
  }
];

// ============================================
// DEPLOYMENT FUNCTIONS
// ============================================

async function deploySnippets() {
  log.section('DEPLOYING SNIPPETS');

  try {
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes?.find(t => t.role === 'main');

    if (!activeTheme) {
      log.error('No active theme found');
      return false;
    }

    log.info(`Active theme: ${activeTheme.name} (ID: ${activeTheme.id})`);

    const snippetsDir = path.join(__dirname, '..', 'snippets');
    let deployed = 0;
    let failed = 0;

    for (const snippet of CORE_SNIPPETS) {
      const filePath = path.join(snippetsDir, snippet);

      if (!fs.existsSync(filePath)) {
        log.warn(`Snippet not found: ${snippet}`);
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf8');
        await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
          asset: {
            key: `snippets/${snippet}`,
            value: content
          }
        });
        log.success(`Deployed: ${snippet}`);
        deployed++;
        await delay(300);
      } catch (e) {
        log.error(`Failed: ${snippet} - ${e.message}`);
        failed++;
      }
    }

    log.info(`Snippets: ${deployed} deployed, ${failed} failed`);
    return true;
  } catch (e) {
    log.error(`Snippet deployment failed: ${e.message}`);
    return false;
  }
}

async function deployPages() {
  log.section('DEPLOYING PAGES');

  const pagesDir = path.join(__dirname, '..', 'pages');
  let deployed = 0;

  for (const page of PAGES) {
    const filePath = path.join(pagesDir, page.file);

    if (!fs.existsSync(filePath)) {
      log.warn(`Page file not found: ${page.file}`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check if page exists
      const existing = await shopifyRequest('GET', `/pages.json?handle=${page.handle}`);

      if (existing.pages?.length > 0) {
        // Update existing page
        await shopifyRequest('PUT', `/pages/${existing.pages[0].id}.json`, {
          page: { body_html: content }
        });
        log.success(`Updated: ${page.title}`);
      } else {
        // Create new page
        await shopifyRequest('POST', '/pages.json', {
          page: {
            title: page.title,
            handle: page.handle,
            body_html: content,
            published: true
          }
        });
        log.success(`Created: ${page.title}`);
      }

      deployed++;
      await delay(500);
    } catch (e) {
      log.warn(`Page ${page.title}: ${e.message}`);
    }
  }

  log.info(`Pages: ${deployed} deployed`);
  return true;
}

async function deployThemeAssets() {
  log.section('DEPLOYING THEME ASSETS');

  try {
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes?.find(t => t.role === 'main');

    if (!activeTheme) {
      log.error('No active theme found');
      return false;
    }

    // Deploy robots.txt
    const robotsPath = path.join(__dirname, '..', 'robots.txt.liquid');
    if (fs.existsSync(robotsPath)) {
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
        asset: { key: 'templates/robots.txt.liquid', value: robotsContent }
      });
      log.success('Deployed: robots.txt.liquid');
    }

    // Log injection points for manual setup
    log.info('\nTheme injection points (add manually or via theme editor):');
    console.log('\n--- layout/theme.liquid ---');
    console.log('In <head>:');
    THEME_INJECTIONS['layout/theme.liquid'].head.forEach(s => console.log(`  ${s}`));
    console.log('After <body>:');
    THEME_INJECTIONS['layout/theme.liquid'].bodyStart.forEach(s => console.log(`  ${s}`));
    console.log('Before </body>:');
    THEME_INJECTIONS['layout/theme.liquid'].bodyEnd.forEach(s => console.log(`  ${s}`));

    return true;
  } catch (e) {
    log.error(`Theme deployment failed: ${e.message}`);
    return false;
  }
}

async function generateInjectionGuide() {
  log.section('GENERATING INJECTION GUIDE');

  const guide = `# Shelzy's Designs - Theme Injection Guide

## Quick Setup

Add these snippets to your theme files:

### layout/theme.liquid

**In \`<head>\` section:**
\`\`\`liquid
{% render 'shelzys-head-seo' %}
{% render 'shelzys-css-variables' %}
{% render 'shelzys-fonts' %}
\`\`\`

**After opening \`<body>\` tag:**
\`\`\`liquid
{% render 'shelzys-skip-links' %}
{% render 'shelzys-announcement-bar' %}
{% render 'shelzys-free-shipping-bar' %}
\`\`\`

**Before closing \`</body>\` tag:**
\`\`\`liquid
{% render 'shelzys-popup-premium' %}
{% render 'shelzys-back-to-top' %}
{% render 'shelzys-social-proof-section' %}
\`\`\`

### Product Template

\`\`\`liquid
{% render 'shelzys-product-schema', product: product %}
{% render 'shelzys-personalization', product: product %}
{% render 'shelzys-trust-badges' %}
{% render 'shelzys-product-faq' %}
{% render 'shelzys-sticky-atc', product: product %}
\`\`\`

### Cart Template

\`\`\`liquid
{% render 'shelzys-cart-upsell' %}
{% render 'shelzys-trust-badges' %}
\`\`\`

### Collection Template

\`\`\`liquid
{% render 'shelzys-collection-header', collection: collection %}
\`\`\`

---
Generated: ${new Date().toISOString()}
`;

  const guidePath = path.join(__dirname, '..', 'INJECTION_GUIDE.md');
  fs.writeFileSync(guidePath, guide);
  log.success(`Guide saved to: ${guidePath}`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n');
  console.log('\x1b[36m╔════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║   SHELZY\'S DESIGNS - MASTER DEPLOYMENT             ║\x1b[0m');
  console.log('\x1b[36m╚════════════════════════════════════════════════════╝\x1b[0m');
  console.log('\n');

  if (CONFIG.dryRun) {
    log.warn('DRY RUN MODE - No changes will be made\n');
  }

  if (!CONFIG.accessToken && !CONFIG.dryRun) {
    log.error('SHOPIFY_ACCESS_TOKEN not set!');
    console.log('\nRequired environment variables:');
    console.log('  SHOPIFY_STORE_URL    - Your myshopify.com URL');
    console.log('  SHOPIFY_ACCESS_TOKEN - Admin API access token');
    console.log('\nOr use --dry-run to preview changes');
    process.exit(1);
  }

  const startTime = Date.now();
  const results = { snippets: false, pages: false, theme: false };

  if (CONFIG.deploySnippets) {
    results.snippets = await deploySnippets();
  }

  if (CONFIG.deployPages) {
    results.pages = await deployPages();
  }

  if (CONFIG.deployTheme) {
    results.theme = await deployThemeAssets();
  }

  await generateInjectionGuide();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n');
  console.log('\x1b[32m╔════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[32m║            DEPLOYMENT COMPLETE                     ║\x1b[0m');
  console.log('\x1b[32m╚════════════════════════════════════════════════════╝\x1b[0m');
  console.log(`\nCompleted in ${elapsed} seconds\n`);

  console.log('Results:');
  console.log(`  Snippets: ${results.snippets ? '✓' : '✗'}`);
  console.log(`  Pages:    ${results.pages ? '✓' : '✗'}`);
  console.log(`  Theme:    ${results.theme ? '✓' : '✗'}`);

  console.log('\nNext Steps:');
  console.log('  1. Review INJECTION_GUIDE.md for theme setup');
  console.log('  2. Add snippet renders to theme files');
  console.log('  3. Test site functionality');
  console.log('  4. Set up Klaviyo (see KLAVIYO-SETUP-GUIDE.md)');
  console.log('\n');
}

main().catch(e => {
  log.error(`Fatal error: ${e.message}`);
  process.exit(1);
});
