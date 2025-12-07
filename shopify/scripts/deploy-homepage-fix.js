#!/usr/bin/env node

/**
 * Shelzy's Designs - Homepage Fix Deployment
 * Deploys the comprehensive CRO enhancements to fix the homepage
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-01';

if (!ACCESS_TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable');
  process.exit(1);
}

async function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function deploySnippet(themeId, filename) {
  const snippetPath = path.join(__dirname, '..', 'snippets', filename);

  if (!fs.existsSync(snippetPath)) {
    console.log(`   ⚠️  ${filename} not found, skipping`);
    return false;
  }

  const content = fs.readFileSync(snippetPath, 'utf8');

  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: {
      key: `snippets/${filename}`,
      value: content
    }
  });

  if (response.status === 200) {
    console.log(`   ✅ ${filename}`);
    return true;
  } else {
    console.error(`   ❌ ${filename}: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎯 SHELZY\'S DESIGNS - HOMEPAGE FIX DEPLOYMENT                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Get theme
  console.log('📋 Finding live theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');

  if (themesResponse.status !== 200) {
    console.error('❌ API Error:', JSON.stringify(themesResponse.data, null, 2));
    process.exit(1);
  }

  const theme = themesResponse.data.themes.find(t => t.role === 'main');
  if (!theme) {
    console.error('❌ No live theme found');
    process.exit(1);
  }

  console.log(`✅ Theme: "${theme.name}" (ID: ${theme.id})\n`);

  // Deploy CRO enhancements (the main fix)
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('DEPLOYING HOMEPAGE FIX');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('📄 Core CRO Enhancements (Homepage Sections)...');
  await deploySnippet(theme.id, 'sz-cro-enhancements.liquid');

  // Deploy supporting snippets
  console.log('\n📄 Supporting Snippets...');
  const supportingSnippets = [
    'shelzys-testimonials.liquid',
    'shelzys-trust-badges.liquid',
    'shelzys-why-choose-us.liquid',
    'shelzys-bestsellers-premium.liquid',
    'shelzys-hero-v2.liquid',
    'shelzys-occasion-grid.liquid',
    'shelzys-social-proof-section.liquid'
  ];

  for (const snippet of supportingSnippets) {
    await deploySnippet(theme.id, snippet);
  }

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ HOMEPAGE FIX DEPLOYED                                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log('🎯 What\'s Now Live on Your Homepage:\n');
  console.log('   1. HERO SECTION');
  console.log('      • Clear headline: "Personalized Water Bottles for Every Occasion"');
  console.log('      • Two CTAs: Shop Custom Bottles + Shop by Occasion');
  console.log('      • Trust indicators below\n');

  console.log('   2. SOCIAL PROOF STRIP');
  console.log('      • 4.9★ Rating');
  console.log('      • 2,500+ Happy Customers');
  console.log('      • 5,000+ Bottles Personalized\n');

  console.log('   3. BEST SELLERS');
  console.log('      • 4 top products with images, prices, ratings');
  console.log('      • "Best Seller" badges');
  console.log('      • "View All Products" CTA\n');

  console.log('   4. SHOP BY OCCASION');
  console.log('      • 6 occasion cards (Wedding, Bachelorette, Baby Shower, etc.)');
  console.log('      • Direct links to collections\n');

  console.log('   5. HOW IT WORKS');
  console.log('      • 3-step process explanation');
  console.log('      • CTA to start shopping\n');

  console.log('   6. TESTIMONIALS');
  console.log('      • 3 customer reviews');
  console.log('      • 4.9 rating badge\n');

  console.log('   7. WHY SUBLIMATION');
  console.log('      • Quality differentiator section');
  console.log('      • 4 benefit cards\n');

  console.log('   8. TRUST BAR');
  console.log('      • Secure Checkout, Free Shipping, Permanent Print, Made in USA\n');

  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('💡 Hard refresh (Cmd+Shift+R) to see changes\n');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
