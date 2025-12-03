#!/usr/bin/env node

/**
 * Shelzy's Designs - Round 2 Deployment
 *
 * Deploys additional conversion features:
 * - Testimonials section
 * - Enhanced announcement bar
 * - Product badges
 * - Trust badges
 * - Why Choose Us section
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
  console.log('║  🚀 SHELZY\'S DESIGNS - ROUND 2 DEPLOYMENT                     ║');
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
  // Deploy new snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying New Snippets');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const snippets = [
    { key: 'snippets/shelzys-testimonials.liquid', file: 'snippets/shelzys-testimonials.liquid', name: 'Testimonials Section' },
    { key: 'snippets/shelzys-announcement-bar.liquid', file: 'snippets/shelzys-announcement-bar.liquid', name: 'Announcement Bar' },
    { key: 'snippets/shelzys-product-badges.liquid', file: 'snippets/shelzys-product-badges.liquid', name: 'Product Badges' },
    { key: 'snippets/shelzys-trust-badges.liquid', file: 'snippets/shelzys-trust-badges.liquid', name: 'Trust Badges' },
    { key: 'snippets/shelzys-why-choose-us.liquid', file: 'snippets/shelzys-why-choose-us.liquid', name: 'Why Choose Us Section' }
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
  // Inject into homepage (index.liquid or index.json sections)
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Injecting Homepage Sections');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Try to add testimonials and why-choose-us to the homepage
  // First check if there's a templates/index.liquid or we need to work with sections

  // Get list of assets to find homepage template
  const assetsResponse = await apiRequest('GET', `/themes/${liveTheme.id}/assets.json`);
  const assets = assetsResponse.data.assets.map(a => a.key);

  // Check for index.json (JSON template) vs index.liquid
  const hasJsonTemplate = assets.includes('templates/index.json');

  if (hasJsonTemplate) {
    console.log('📝 Found JSON template system...');
    console.log('   ℹ️ Homepage sections managed via theme customizer');
    console.log('   💡 Add sections manually in: Online Store > Themes > Customize');
  } else {
    // Try to find and modify index.liquid
    let indexContent = await getAsset(liveTheme.id, 'templates/index.liquid');

    if (indexContent) {
      console.log('📝 Found templates/index.liquid...');
      let modified = false;

      // Add testimonials if not present
      if (!indexContent.includes('shelzys-testimonials')) {
        // Try to add before footer or at end
        if (indexContent.includes('{% section')) {
          // Add after last section
          const lastSectionMatch = indexContent.match(/{% section [^%]+%}(?![\s\S]*{% section)/);
          if (lastSectionMatch) {
            const idx = indexContent.indexOf(lastSectionMatch[0]) + lastSectionMatch[0].length;
            indexContent = indexContent.slice(0, idx) +
              "\n\n{% render 'shelzys-testimonials' %}\n{% render 'shelzys-why-choose-us' %}\n{% render 'shelzys-trust-badges' %}\n" +
              indexContent.slice(idx);
            modified = true;
          }
        } else {
          // Just append
          indexContent += "\n\n{% render 'shelzys-testimonials' %}\n{% render 'shelzys-why-choose-us' %}\n{% render 'shelzys-trust-badges' %}\n";
          modified = true;
        }
      }

      if (modified) {
        if (await putAsset(liveTheme.id, 'templates/index.liquid', indexContent)) {
          console.log('   ✅ Added homepage sections');
        } else {
          console.log('   ❌ Failed to update index.liquid');
        }
      } else {
        console.log('   ℹ️ Sections already present');
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Inject announcement bar into theme.liquid header
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: Adding Announcement Bar');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (themeLayout) {
    if (!themeLayout.includes('shelzys-announcement-bar')) {
      // Try to add after opening body tag
      const bodyMatch = themeLayout.match(/<body[^>]*>/i);
      if (bodyMatch) {
        const idx = themeLayout.indexOf(bodyMatch[0]) + bodyMatch[0].length;
        themeLayout = themeLayout.slice(0, idx) +
          "\n  {% render 'shelzys-announcement-bar' %}\n" +
          themeLayout.slice(idx);

        if (await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout)) {
          console.log('📝 Added announcement bar after <body>');
          console.log('   ✅ theme.liquid updated');
        } else {
          console.log('   ❌ Failed to update theme.liquid');
        }
      }
    } else {
      console.log('   ℹ️ Announcement bar already present');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Try to add product badges to collection product cards
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 4: Adding Product Badges');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Common product card snippet names
  const cardSnippets = [
    'snippets/product-card.liquid',
    'snippets/card-product.liquid',
    'snippets/product-item.liquid',
    'snippets/product-grid-item.liquid'
  ];

  let badgesAdded = false;
  for (const snippetKey of cardSnippets) {
    if (!assets.includes(snippetKey)) continue;

    console.log(`📝 Checking ${snippetKey}...`);
    let cardContent = await getAsset(liveTheme.id, snippetKey);

    if (cardContent && !cardContent.includes('shelzys-product-badges')) {
      // Find the product image wrapper and add badges inside
      const imgPatterns = [
        /(<div[^>]*class="[^"]*card__media[^"]*"[^>]*>)/i,
        /(<div[^>]*class="[^"]*product-card__image[^"]*"[^>]*>)/i,
        /(<div[^>]*class="[^"]*card__inner[^"]*"[^>]*>)/i,
        /(<a[^>]*class="[^"]*card[^"]*"[^>]*>)/i
      ];

      for (const pattern of imgPatterns) {
        const match = cardContent.match(pattern);
        if (match) {
          const idx = cardContent.indexOf(match[0]) + match[0].length;
          cardContent = cardContent.slice(0, idx) +
            "\n    {% render 'shelzys-product-badges', product: product %}\n" +
            cardContent.slice(idx);

          if (await putAsset(liveTheme.id, snippetKey, cardContent)) {
            console.log('   ✅ Added badges to product cards');
            badgesAdded = true;
          }
          break;
        }
      }
    }

    if (badgesAdded) break;
    await sleep(300);
  }

  if (!badgesAdded) {
    console.log('   ℹ️ Could not auto-inject badges into product cards');
    console.log('   💡 Manually add: {% render \'shelzys-product-badges\', product: product %}');
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📊 ROUND 2 DEPLOYMENT COMPLETE                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('✅ New features deployed:');
  console.log('   • Testimonials section (6 reviews with 4.9★ rating)');
  console.log('   • Enhanced announcement bar (rotating messages)');
  console.log('   • Product badges (Sale %, Bestseller, Low Stock, New)');
  console.log('   • Trust badges bar (Secure, Free Ship, Quality, USA)');
  console.log('   • "Why Choose Us" comparison section');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
  console.log('💡 To fully enable homepage sections, go to:');
  console.log('   Online Store > Themes > Customize > Add Section');
  console.log('');
  console.log('   Available sections to add:');
  console.log('   • shelzys-testimonials');
  console.log('   • shelzys-why-choose-us');
  console.log('   • shelzys-trust-badges');
  console.log('');
  console.log('🎉 Done!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
