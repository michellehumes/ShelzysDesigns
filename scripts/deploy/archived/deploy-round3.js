#!/usr/bin/env node

/**
 * Shelzy's Designs - Round 3 Deployment
 *
 * Deploys:
 * - Sticky add-to-cart bar (mobile)
 * - Recently viewed products
 * - Social proof notifications
 * - Product FAQ accordion
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
const API_VERSION = '2024-01';

if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN') {
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
  console.log('║  🚀 SHELZY\'S DESIGNS - ROUND 3 DEPLOYMENT                     ║');
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
  // Deploy snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying New Snippets');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const snippets = [
    { key: 'snippets/shelzys-sticky-atc.liquid', file: 'snippets/shelzys-sticky-atc.liquid', name: 'Sticky Add to Cart (Mobile)' },
    { key: 'snippets/shelzys-recently-viewed.liquid', file: 'snippets/shelzys-recently-viewed.liquid', name: 'Recently Viewed Products' },
    { key: 'snippets/shelzys-social-proof.liquid', file: 'snippets/shelzys-social-proof.liquid', name: 'Social Proof Notifications' },
    { key: 'snippets/shelzys-product-faq.liquid', file: 'snippets/shelzys-product-faq.liquid', name: 'Product FAQ Accordion' }
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
  // Inject social proof into theme.liquid
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Injecting into Theme');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (themeLayout) {
    let modified = false;

    // Add social proof before </body>
    if (!themeLayout.includes('shelzys-social-proof')) {
      const bodyClose = themeLayout.indexOf('</body>');
      if (bodyClose !== -1) {
        themeLayout = themeLayout.slice(0, bodyClose) +
          "  {% render 'shelzys-social-proof' %}\n" +
          themeLayout.slice(bodyClose);
        modified = true;
        console.log('📝 Added social proof notifications');
      }
    } else {
      console.log('   ℹ️ Social proof already present');
    }

    if (modified) {
      if (await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout)) {
        console.log('   ✅ theme.liquid updated');
      }
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // Inject into product template
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: Injecting into Product Pages');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Get list of assets
  const assetsResponse = await apiRequest('GET', `/themes/${liveTheme.id}/assets.json`);
  const assets = assetsResponse.data.assets.map(a => a.key);

  // Try product templates
  const productTemplates = [
    'sections/main-product.liquid',
    'sections/product-template.liquid',
    'templates/product.liquid'
  ];

  for (const templateKey of productTemplates) {
    if (!assets.includes(templateKey)) continue;

    console.log(`📝 Checking ${templateKey}...`);
    let content = await getAsset(liveTheme.id, templateKey);

    if (!content) continue;

    let modified = false;

    // Add sticky ATC if not present
    if (!content.includes('shelzys-sticky-atc')) {
      // Add at end of section/template
      if (content.includes('{% schema %}')) {
        const schemaIdx = content.indexOf('{% schema %}');
        content = content.slice(0, schemaIdx) +
          "\n{% render 'shelzys-sticky-atc', product: product %}\n\n" +
          content.slice(schemaIdx);
        modified = true;
        console.log('   ✅ Added sticky add-to-cart');
      }
    }

    // Add FAQ if not present
    if (!content.includes('shelzys-product-faq')) {
      if (content.includes('{% schema %}')) {
        const schemaIdx = content.indexOf('{% schema %}');
        content = content.slice(0, schemaIdx) +
          "{% render 'shelzys-product-faq' %}\n\n" +
          content.slice(schemaIdx);
        modified = true;
        console.log('   ✅ Added product FAQ');
      }
    }

    // Add recently viewed if not present
    if (!content.includes('shelzys-recently-viewed')) {
      if (content.includes('{% schema %}')) {
        const schemaIdx = content.indexOf('{% schema %}');
        content = content.slice(0, schemaIdx) +
          "{% render 'shelzys-recently-viewed' %}\n\n" +
          content.slice(schemaIdx);
        modified = true;
        console.log('   ✅ Added recently viewed');
      }
    }

    if (modified) {
      if (await putAsset(liveTheme.id, templateKey, content)) {
        console.log(`   ✅ ${templateKey} updated`);
      }
      break; // Only update one product template
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📊 ROUND 3 DEPLOYMENT COMPLETE                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('✅ New features deployed:');
  console.log('   • Sticky Add to Cart - Fixed bar on mobile when scrolling');
  console.log('   • Recently Viewed - Shows products customer browsed');
  console.log('   • Social Proof - "Someone just purchased..." notifications');
  console.log('   • Product FAQ - Common questions answered on every product');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
  console.log('💡 Test on mobile to see the sticky add-to-cart bar!');
  console.log('');
  console.log('🎉 Done!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
