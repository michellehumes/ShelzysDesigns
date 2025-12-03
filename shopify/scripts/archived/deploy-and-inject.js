#!/usr/bin/env node

/**
 * Shelzy's Designs - Complete Auto-Deployment Script
 *
 * Deploys ALL features and automatically injects snippets into:
 * - theme.liquid (fonts, CSS, email popup)
 * - Cart drawer/page (free shipping bar, upsells)
 * - Product template (urgency elements)
 *
 * Usage: node deploy-and-inject.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
const API_VERSION = '2024-01';

if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN') {
  console.error('❌ Missing credentials! Set SHOPIFY_ACCESS_TOKEN environment variable.');
  process.exit(1);
}

// API request helper with retry
async function apiRequest(method, endpoint, data = null, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await makeRequest(method, endpoint, data);
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`   ⏳ Retry ${attempt + 1}/${retries}...`);
      await sleep(1000 * attempt);
    }
  }
}

function makeRequest(method, endpoint, data) {
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
  const absolutePath = path.join(__dirname, '..', filePath);
  return fs.readFileSync(absolutePath, 'utf8');
}

// Get asset from theme
async function getAsset(themeId, assetKey) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(assetKey)}`);
  if (response.status === 200 && response.data.asset) {
    return response.data.asset.value;
  }
  return null;
}

// Put asset to theme
async function putAsset(themeId, assetKey, content) {
  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key: assetKey, value: content }
  });
  return response.status === 200 || response.status === 201;
}

// List all assets in theme
async function listAssets(themeId) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json`);
  if (response.status === 200) {
    return response.data.assets.map(a => a.key);
  }
  return [];
}

// Find files matching patterns
function findMatchingAssets(assets, patterns) {
  return assets.filter(asset => {
    return patterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(asset);
      }
      return asset.includes(pattern);
    });
  });
}

// Inject snippet into content if not already present
function injectSnippet(content, snippet, location, marker = null) {
  // Check if already injected
  if (content.includes(snippet) || content.includes(snippet.replace(/'/g, '"'))) {
    return { content, injected: false, reason: 'already present' };
  }

  let newContent = content;
  let injected = false;

  if (marker) {
    // Inject after a specific marker/pattern
    const markerIndex = content.indexOf(marker);
    if (markerIndex !== -1) {
      const insertIndex = markerIndex + marker.length;
      newContent = content.slice(0, insertIndex) + `\n  ${snippet}\n` + content.slice(insertIndex);
      injected = true;
    }
  } else if (location === 'before_head_close') {
    const idx = content.indexOf('</head>');
    if (idx !== -1) {
      newContent = content.slice(0, idx) + `  ${snippet}\n` + content.slice(idx);
      injected = true;
    }
  } else if (location === 'before_body_close') {
    const idx = content.indexOf('</body>');
    if (idx !== -1) {
      newContent = content.slice(0, idx) + `  ${snippet}\n` + content.slice(idx);
      injected = true;
    }
  } else if (location === 'after_form_open') {
    // For cart forms - inject after the opening form tag
    const formMatch = content.match(/<form[^>]*cart[^>]*>/i);
    if (formMatch) {
      const idx = content.indexOf(formMatch[0]) + formMatch[0].length;
      newContent = content.slice(0, idx) + `\n  ${snippet}\n` + content.slice(idx);
      injected = true;
    }
  } else if (location === 'before_checkout_button') {
    // Look for checkout button patterns
    const patterns = [
      /(<button[^>]*checkout[^>]*>)/i,
      /(<input[^>]*checkout[^>]*>)/i,
      /(name="checkout")/i,
      /({%-?\s*render\s+['"]cart-footer)/i,
      /(class="cart__footer)/i,
      /(class="cart__ctas)/i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        const idx = content.indexOf(match[0]);
        newContent = content.slice(0, idx) + `${snippet}\n  ` + content.slice(idx);
        injected = true;
        break;
      }
    }
  } else if (location === 'after_add_to_cart') {
    // Look for add to cart button and inject after its container
    const patterns = [
      /(<\/product-form>)/i,
      /({%-?\s*endform\s*-?%})/i,
      /(class="product-form__buttons"[^>]*>[\s\S]*?<\/div>)/i,
      /(data-add-to-cart-form[\s\S]*?<\/form>)/i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        const idx = content.indexOf(match[0]) + match[0].length;
        newContent = content.slice(0, idx) + `\n  ${snippet}\n` + content.slice(idx);
        injected = true;
        break;
      }
    }
  }

  return { content: newContent, injected, reason: injected ? 'success' : 'location not found' };
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🚀 SHELZY\'S DESIGNS - COMPLETE AUTO-DEPLOYMENT               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📍 Store: ${STORE_URL}`);
  console.log('');

  // Get live theme
  console.log('📋 Finding live theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');

  if (themesResponse.status !== 200) {
    console.error('❌ Failed to fetch themes');
    process.exit(1);
  }

  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');
  if (!liveTheme) {
    console.error('❌ No live theme found');
    process.exit(1);
  }

  console.log(`✅ Live theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // List all theme assets
  console.log('📂 Scanning theme structure...');
  const assets = await listAssets(liveTheme.id);
  console.log(`   Found ${assets.length} assets`);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: Deploy all snippet files
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying Snippet Files');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const snippets = [
    { key: 'assets/shelzys-brand-v2.css', file: 'assets/shelzys-brand.css', name: 'Brand CSS' },
    { key: 'snippets/shelzys-fonts.liquid', file: 'snippets/shelzys-fonts.liquid', name: 'Fonts Loader' },
    { key: 'snippets/shelzys-email-popup.liquid', file: 'snippets/shelzys-email-popup.liquid', name: 'Email Popup' },
    { key: 'snippets/shelzys-free-shipping-bar.liquid', file: 'snippets/shelzys-free-shipping-bar.liquid', name: 'Free Shipping Bar' },
    { key: 'snippets/shelzys-cart-upsell.liquid', file: 'snippets/shelzys-cart-upsell.liquid', name: 'Cart Upsells' },
    { key: 'snippets/shelzys-urgency.liquid', file: 'snippets/shelzys-urgency.liquid', name: 'Urgency Elements' }
  ];

  for (const snippet of snippets) {
    console.log(`📄 ${snippet.name}...`);
    try {
      const content = readFile(snippet.file);
      if (await putAsset(liveTheme.id, snippet.key, content)) {
        console.log(`   ✅ Deployed`);
      } else {
        console.log(`   ❌ Failed`);
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
    await sleep(300);
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: Inject into theme.liquid
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Injecting into theme.liquid');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLayout) {
    let modified = false;

    // Inject fonts before </head>
    console.log('📝 Adding fonts/CSS to <head>...');
    let result = injectSnippet(themeLayout, "{% render 'shelzys-fonts' %}", 'before_head_close');
    if (result.injected) {
      themeLayout = result.content;
      modified = true;
      console.log('   ✅ Added');
    } else {
      console.log(`   ℹ️ ${result.reason}`);
    }

    // Inject email popup before </body>
    console.log('📝 Adding email popup before </body>...');
    result = injectSnippet(themeLayout, "{% render 'shelzys-email-popup' %}", 'before_body_close');
    if (result.injected) {
      themeLayout = result.content;
      modified = true;
      console.log('   ✅ Added');
    } else {
      console.log(`   ℹ️ ${result.reason}`);
    }

    if (modified) {
      if (await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout)) {
        console.log('   ✅ theme.liquid saved');
      } else {
        console.log('   ❌ Failed to save theme.liquid');
      }
    }
  } else {
    console.log('   ❌ Could not read theme.liquid');
  }

  await sleep(500);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: Find and inject into cart templates
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: Injecting into Cart Templates');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Find cart-related templates
  const cartPatterns = [
    'sections/cart-drawer.liquid',
    'sections/cart.liquid',
    'sections/main-cart.liquid',
    'sections/cart-template.liquid',
    'snippets/cart-drawer.liquid',
    'templates/cart.liquid',
    'sections/main-cart-footer.liquid',
    'sections/main-cart-items.liquid'
  ];

  const cartFiles = findMatchingAssets(assets, cartPatterns);
  console.log(`📂 Found ${cartFiles.length} cart-related files:`);
  cartFiles.forEach(f => console.log(`   • ${f}`));

  // Try to inject into cart files
  let cartInjected = false;
  for (const cartFile of cartFiles) {
    console.log(`\n📝 Processing ${cartFile}...`);
    let cartContent = await getAsset(liveTheme.id, cartFile);

    if (!cartContent) {
      console.log('   ⚠️ Could not read file');
      continue;
    }

    let modified = false;

    // Inject free shipping bar at top of cart
    let result = injectSnippet(cartContent, "{% render 'shelzys-free-shipping-bar' %}", 'after_form_open');
    if (result.injected) {
      cartContent = result.content;
      modified = true;
      console.log('   ✅ Added free shipping bar');
    } else {
      // Try alternate location - after cart header/title
      const altPatterns = [
        /(class="cart__header"[^>]*>[\s\S]*?<\/div>)/i,
        /(<h1[^>]*cart[^>]*>[\s\S]*?<\/h1>)/i,
        /(class="drawer__header"[^>]*>[\s\S]*?<\/div>)/i
      ];

      for (const pattern of altPatterns) {
        const match = cartContent.match(pattern);
        if (match && !cartContent.includes("shelzys-free-shipping-bar")) {
          const idx = cartContent.indexOf(match[0]) + match[0].length;
          cartContent = cartContent.slice(0, idx) + "\n  {% render 'shelzys-free-shipping-bar' %}\n" + cartContent.slice(idx);
          modified = true;
          console.log('   ✅ Added free shipping bar (alt location)');
          break;
        }
      }
    }

    // Inject cart upsells before checkout
    result = injectSnippet(cartContent, "{% render 'shelzys-cart-upsell' %}", 'before_checkout_button');
    if (result.injected) {
      cartContent = result.content;
      modified = true;
      console.log('   ✅ Added cart upsells');
      cartInjected = true;
    }

    if (modified) {
      if (await putAsset(liveTheme.id, cartFile, cartContent)) {
        console.log(`   ✅ ${cartFile} saved`);
      } else {
        console.log(`   ❌ Failed to save`);
      }
    } else {
      console.log('   ℹ️ No changes needed or locations not found');
    }

    await sleep(300);
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: Find and inject into product templates
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 4: Injecting into Product Templates');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const productPatterns = [
    'sections/main-product.liquid',
    'sections/product-template.liquid',
    'sections/product.liquid',
    'templates/product.liquid',
    'snippets/product-form.liquid',
    'snippets/buy-buttons.liquid'
  ];

  const productFiles = findMatchingAssets(assets, productPatterns);
  console.log(`📂 Found ${productFiles.length} product-related files:`);
  productFiles.forEach(f => console.log(`   • ${f}`));

  let productInjected = false;
  for (const productFile of productFiles) {
    console.log(`\n📝 Processing ${productFile}...`);
    let productContent = await getAsset(liveTheme.id, productFile);

    if (!productContent) {
      console.log('   ⚠️ Could not read file');
      continue;
    }

    // Skip if already has urgency snippet
    if (productContent.includes('shelzys-urgency')) {
      console.log('   ℹ️ Urgency already present');
      continue;
    }

    // Try to inject urgency after add-to-cart form
    let result = injectSnippet(productContent, "{% render 'shelzys-urgency', product: product %}", 'after_add_to_cart');

    if (result.injected) {
      if (await putAsset(liveTheme.id, productFile, result.content)) {
        console.log('   ✅ Added urgency elements');
        console.log(`   ✅ ${productFile} saved`);
        productInjected = true;
      } else {
        console.log('   ❌ Failed to save');
      }
    } else {
      // Try alternate: after product form div
      const formEndPatterns = [
        /(class="product-form"[^>]*>[\s\S]*?<\/div>\s*<\/div>)/i,
        /(<\/product-form>)/i,
        /(class="product__info-container"[^>]*>)/i
      ];

      let altInjected = false;
      for (const pattern of formEndPatterns) {
        const match = productContent.match(pattern);
        if (match) {
          const idx = productContent.indexOf(match[0]) + match[0].length;
          const newContent = productContent.slice(0, idx) +
            "\n  {% render 'shelzys-urgency', product: product %}\n" +
            productContent.slice(idx);

          if (await putAsset(liveTheme.id, productFile, newContent)) {
            console.log('   ✅ Added urgency elements (alt location)');
            console.log(`   ✅ ${productFile} saved`);
            productInjected = true;
            altInjected = true;
            break;
          }
        }
      }

      if (!altInjected) {
        console.log('   ℹ️ Could not find suitable injection point');
      }
    }

    await sleep(300);

    // Only inject into one product file
    if (productInjected) break;
  }

  // ═══════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📊 DEPLOYMENT COMPLETE                                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('✅ Deployed:');
  console.log('   • Brand CSS (Playfair Display, Inter, Sage Green palette)');
  console.log('   • Email Popup (10% off, exit-intent)');
  console.log('   • Free Shipping Progress Bar');
  console.log('   • Smart Cart Upsells');
  console.log('   • Product Urgency Elements');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
  console.log('💡 Clear browser cache (Ctrl+Shift+R) to see all changes');
  console.log('');

  if (!cartInjected) {
    console.log('⚠️  Cart upsells may need manual placement in your cart drawer.');
    console.log('   Add: {% render \'shelzys-cart-upsell\' %}');
  }

  if (!productInjected) {
    console.log('⚠️  Urgency elements may need manual placement on product pages.');
    console.log('   Add: {% render \'shelzys-urgency\', product: product %}');
  }

  console.log('');
  console.log('🎉 Done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
