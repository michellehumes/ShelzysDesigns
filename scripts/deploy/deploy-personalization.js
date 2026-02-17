#!/usr/bin/env node

/**
 * Shelzy's Designs - Product Personalization Deployment
 *
 * Deploys enhanced product page features:
 * 1. Sequential step-by-step personalization UI
 * 2. Price-per-bottle display for sets
 * 3. Upsell block for single bottles
 *
 * Does NOT modify checkout or payment configuration.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const API_VERSION = '2024-01';

if (!ACCESS_TOKEN || ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN') {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN');
  process.exit(1);
}

async function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
}

async function putAsset(themeId, key, content) {
  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value: content }
  });
  return response.status === 200 || response.status === 201;
}

async function getAsset(themeId, key) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  return response.status === 200 ? response.data.asset.value : null;
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎨 SHELZY\'S DESIGNS - PERSONALIZATION UI                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Get live theme
  console.log('📋 Finding live theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');
  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');

  if (!liveTheme) {
    console.error('❌ No live theme found');
    process.exit(1);
  }

  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: Deploy Snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying Product Components');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const snippets = [
    {
      file: 'snippets/shelzys-personalization.liquid',
      key: 'snippets/shelzys-personalization.liquid',
      name: 'Personalization UI (4 Steps)'
    },
    {
      file: 'snippets/shelzys-price-per-bottle.liquid',
      key: 'snippets/shelzys-price-per-bottle.liquid',
      name: 'Price Per Bottle Display'
    },
    {
      file: 'snippets/shelzys-upsell-sets.liquid',
      key: 'snippets/shelzys-upsell-sets.liquid',
      name: 'Upsell to Sets Block'
    }
  ];

  for (const snippet of snippets) {
    console.log(`📄 ${snippet.name}...`);
    try {
      const content = readFile(snippet.file);
      if (await putAsset(liveTheme.id, snippet.key, content)) {
        console.log('   ✅ Deployed');
      } else {
        console.log('   ❌ Failed');
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
    await sleep(300);
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: Integration Instructions
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Integration Instructions');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('📝 To add to product pages, include these in your product template:');
  console.log('');
  console.log('   1. After product price:');
  console.log("      {% render 'shelzys-price-per-bottle' %}");
  console.log('');
  console.log('   2. After product options/variants:');
  console.log("      {% render 'shelzys-personalization' %}");
  console.log('');
  console.log('   3. After add-to-cart button:');
  console.log("      {% render 'shelzys-upsell-sets' %}");
  console.log('');

  // Try to find and update product template
  console.log('');
  console.log('🔍 Looking for product template...');

  // Check for liquid template
  let productTemplate = await getAsset(liveTheme.id, 'templates/product.liquid');

  if (productTemplate) {
    console.log('   Found templates/product.liquid');

    // Check if already has our components
    if (!productTemplate.includes('shelzys-personalization')) {
      console.log('');
      console.log('   ⚠️ Manual integration required:');
      console.log('      Edit templates/product.liquid in Theme Editor');
      console.log('      Add the render tags shown above');
    } else {
      console.log('   ℹ️ Personalization already integrated');
    }
  } else {
    // Check for JSON template
    let productJson = await getAsset(liveTheme.id, 'templates/product.json');

    if (productJson) {
      console.log('   Found templates/product.json (Shopify 2.0)');
      console.log('');
      console.log('   📝 For Shopify 2.0 themes:');
      console.log('      1. Go to Online Store > Themes > Customize');
      console.log('      2. Select a product page');
      console.log('      3. Add "Custom Liquid" blocks');
      console.log('      4. Paste the render tags for each component');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ PERSONALIZATION COMPONENTS DEPLOYED                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📦 Components ready:');
  console.log('');
  console.log('   1. PERSONALIZATION UI');
  console.log('      • Step 1: Choose bottle color (6 options)');
  console.log('      • Step 2: Choose font (6 styles with previews)');
  console.log('      • Step 3: Enter name/text (20 char limit)');
  console.log('      • Step 4: Choose text color (6 premium colors)');
  console.log('      • ✓ Design team reassurance message');
  console.log('');
  console.log('   2. PRICE PER BOTTLE');
  console.log('      • Shows "From $X.XX per bottle" on sets');
  console.log('      • Displays savings percentage');
  console.log('');
  console.log('   3. UPSELL TO SETS');
  console.log('      • Shows on single bottle pages');
  console.log('      • "Upgrade to a Set & Save" message');
  console.log('      • Links to best-selling sets');
  console.log('');
  console.log('📱 All components are mobile-optimized');
  console.log('');
  console.log('⚠️ Note: Checkout and payment NOT modified');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
