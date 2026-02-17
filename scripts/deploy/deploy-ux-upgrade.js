#!/usr/bin/env node
/**
 * Shelzy's Designs - UX Upgrade Deployment Script
 *
 * Deploys all new/improved theme snippets:
 * - shelzys-master-styles.liquid (unified design system)
 * - shelzys-announcement-unified.liquid (clean announcement bar)
 * - shelzys-nav-header.liquid (improved navigation)
 * - shelzys-hero-v2.liquid (conversion-focused hero)
 * - shelzys-occasion-grid.liquid (6 occasion cards)
 * - shelzys-reviews-carousel.liquid (compact reviews)
 * - shelzys-trust-strip.liquid (bottom trust section)
 * - shelzys-footer-v2.liquid (organized footer)
 * - shelzys-collection-hero.liquid (collection headers)
 * - shelzys-product-extras.liquid (product page enhancements)
 *
 * Usage:
 *   SHOPIFY_STORE_URL="your-store.myshopify.com" \
 *   SHOPIFY_ACCESS_TOKEN="shpat_xxx" \
 *   node deploy-ux-upgrade.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Error: SHOPIFY_ACCESS_TOKEN environment variable required');
  process.exit(1);
}

// Snippets to deploy
const SNIPPETS = [
  'shelzys-master-styles.liquid',
  'shelzys-announcement-unified.liquid',
  'shelzys-nav-header.liquid',
  'shelzys-hero-v2.liquid',
  'shelzys-occasion-grid.liquid',
  'shelzys-reviews-carousel.liquid',
  'shelzys-trust-strip.liquid',
  'shelzys-footer-v2.liquid',
  'shelzys-collection-hero.liquid',
  'shelzys-product-extras.liquid'
];

// API helper
function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/2024-01${endpoint}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Get main theme ID
async function getMainThemeId() {
  const { themes } = await shopifyRequest('GET', '/themes.json');
  const mainTheme = themes.find(t => t.role === 'main');
  if (!mainTheme) {
    throw new Error('No main theme found');
  }
  return mainTheme.id;
}

// Upload a single snippet
async function uploadSnippet(themeId, filename) {
  const snippetPath = path.join(__dirname, '..', 'snippets', filename);

  if (!fs.existsSync(snippetPath)) {
    console.log(`⚠️  Skipping ${filename} (file not found)`);
    return false;
  }

  const content = fs.readFileSync(snippetPath, 'utf8');
  const assetKey = `snippets/${filename}`;

  try {
    await shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
      asset: {
        key: assetKey,
        value: content
      }
    });
    console.log(`✅ Uploaded: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${filename} - ${error.message}`);
    return false;
  }
}

// Main deployment
async function deploy() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   Shelzy\'s Designs - UX Upgrade Deployment               ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📦 Store: ${STORE_URL}`);
  console.log('');

  try {
    // Get theme ID
    console.log('🔍 Finding main theme...');
    const themeId = await getMainThemeId();
    console.log(`✅ Main theme ID: ${themeId}`);
    console.log('');

    // Upload snippets
    console.log('📤 Uploading snippets...');
    console.log('─────────────────────────────────────────────────────────');

    let successCount = 0;
    let failCount = 0;

    for (const snippet of SNIPPETS) {
      const success = await uploadSnippet(themeId, snippet);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 300));
    }

    console.log('');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`✅ Deployed: ${successCount}/${SNIPPETS.length} snippets`);

    if (failCount > 0) {
      console.log(`⚠️  Failed: ${failCount} snippets`);
    }

    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 NEXT STEPS - Add these to your theme:');
    console.log('');
    console.log('1. In theme.liquid <head>:');
    console.log('   {% render \'shelzys-master-styles\' %}');
    console.log('');
    console.log('2. After <body> opening:');
    console.log('   {% render \'shelzys-announcement-unified\' %}');
    console.log('   {% render \'shelzys-nav-header\' %}');
    console.log('');
    console.log('3. Homepage sections (in order):');
    console.log('   {% render \'shelzys-hero-v2\' %}');
    console.log('   {% render \'shelzys-bestsellers-premium\' %}');
    console.log('   {% render \'shelzys-occasion-grid\' %}');
    console.log('   {% render \'shelzys-reviews-carousel\' %}');
    console.log('   {% render \'shelzys-trust-strip\' %}');
    console.log('');
    console.log('4. Collection templates:');
    console.log('   {% render \'shelzys-collection-hero\', collection: collection %}');
    console.log('');
    console.log('5. Product templates:');
    console.log('   {% render \'shelzys-product-extras\', product: product %}');
    console.log('');
    console.log('6. Before </body>:');
    console.log('   {% render \'shelzys-footer-v2\' %}');
    console.log('   {% render \'shelzys-popup-premium\' %}');
    console.log('');
    console.log('════════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('');
    console.error(`❌ Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

// Run
deploy();
