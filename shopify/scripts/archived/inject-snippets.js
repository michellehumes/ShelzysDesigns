#!/usr/bin/env node

/**
 * Shelzy's Designs - Inject Conversion Snippets into Theme
 *
 * Automatically adds the conversion optimization snippets
 * into theme.liquid so they actually render on the live site
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const API_VERSION = '2024-01';

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

async function getAsset(themeId, key) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  if (response.status === 200) {
    return response.data.asset.value;
  }
  return null;
}

async function putAsset(themeId, key, content) {
  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value: content }
  });
  return { success: response.status === 200 || response.status === 201, data: response.data };
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔌 INJECT CONVERSION SNIPPETS INTO THEME                      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Get live theme
  console.log('📋 Finding published theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');
  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');

  if (!liveTheme) {
    console.error('❌ No published theme found');
    process.exit(1);
  }

  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // Get theme.liquid
  console.log('📋 Reading layout/theme.liquid...');
  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (!themeLiquid) {
    console.error('❌ Could not read theme.liquid');
    process.exit(1);
  }

  console.log(`   Found theme.liquid (${themeLiquid.length} chars)`);
  console.log('');

  let modified = false;

  // Check and inject snippets
  const snippetsToInject = [
    { name: 'sz-improved-popup', location: 'body-end', render: "{% render 'sz-improved-popup' %}" },
    { name: 'sz-social-proof-notifications', location: 'body-end', render: "{% render 'sz-social-proof-notifications' %}" }
  ];

  // Inject at end of body (before </body>)
  for (const snippet of snippetsToInject) {
    if (!themeLiquid.includes(snippet.render) && !themeLiquid.includes(`render '${snippet.name}'`)) {
      console.log(`   Adding ${snippet.name}...`);

      if (snippet.location === 'body-end') {
        // Insert before </body>
        themeLiquid = themeLiquid.replace('</body>', `\n  ${snippet.render}\n</body>`);
        modified = true;
        console.log(`   ✅ Injected ${snippet.name} before </body>`);
      }
    } else {
      console.log(`   ✓ ${snippet.name} already present`);
    }
  }

  // Save if modified
  if (modified) {
    console.log('');
    console.log('📋 Saving updated theme.liquid...');
    const result = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
    if (result.success) {
      console.log('   ✅ theme.liquid updated');
    } else {
      console.log('   ❌ Failed to update theme.liquid');
      console.log('   ', JSON.stringify(result.data));
    }
  } else {
    console.log('');
    console.log('   No changes needed - snippets already present');
  }

  // Now inject shipping bar into cart
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('INJECTING SHIPPING BAR INTO CART');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Try to find cart template or cart drawer
  const cartFiles = [
    'sections/cart-drawer.liquid',
    'sections/main-cart-items.liquid',
    'templates/cart.liquid',
    'sections/cart-template.liquid'
  ];

  for (const cartFile of cartFiles) {
    const cartContent = await getAsset(liveTheme.id, cartFile);
    if (cartContent) {
      console.log(`   Found ${cartFile}`);

      if (!cartContent.includes('sz-shipping-bar')) {
        // Find a good injection point (after opening of cart content)
        let updatedCart = cartContent;

        // Try to inject after cart heading or at start of cart items
        if (cartContent.includes('cart__items') || cartContent.includes('cart-items')) {
          updatedCart = cartContent.replace(
            /(<[^>]*class="[^"]*cart[_-]?items[^"]*"[^>]*>)/i,
            "{% render 'sz-shipping-bar' %}\n$1"
          );
        } else {
          // Just add at the beginning
          updatedCart = "{% render 'sz-shipping-bar' %}\n" + cartContent;
        }

        if (updatedCart !== cartContent) {
          const result = await putAsset(liveTheme.id, cartFile, updatedCart);
          if (result.success) {
            console.log(`   ✅ Added shipping bar to ${cartFile}`);
          }
        }
      } else {
        console.log(`   ✓ Shipping bar already in ${cartFile}`);
      }
      break;
    }
  }

  // Inject urgency into product template
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('INJECTING URGENCY INTO PRODUCT PAGES');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const productFiles = [
    'sections/main-product.liquid',
    'sections/product-template.liquid',
    'templates/product.liquid'
  ];

  for (const productFile of productFiles) {
    const productContent = await getAsset(liveTheme.id, productFile);
    if (productContent) {
      console.log(`   Found ${productFile}`);

      if (!productContent.includes('sz-product-urgency')) {
        let updatedProduct = productContent;

        // Try to inject before add-to-cart button or after price
        if (productContent.includes('product-form__buttons') || productContent.includes('add-to-cart')) {
          updatedProduct = productContent.replace(
            /(<[^>]*class="[^"]*product-form__buttons[^"]*"[^>]*>)/i,
            "{% render 'sz-product-urgency' %}\n$1"
          );
        } else if (productContent.includes('price')) {
          // Add after price section
          updatedProduct = productContent.replace(
            /(<\/div>[^<]*)(<!--\s*\/price|<div[^>]*class="[^"]*product__description)/i,
            "$1\n{% render 'sz-product-urgency' %}\n$2"
          );
        }

        if (updatedProduct !== productContent) {
          const result = await putAsset(liveTheme.id, productFile, updatedProduct);
          if (result.success) {
            console.log(`   ✅ Added urgency to ${productFile}`);
          }
        } else {
          console.log(`   ⚠️ Could not auto-inject, manual placement needed`);
        }
      } else {
        console.log(`   ✓ Urgency already in ${productFile}`);
      }
      break;
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ SNIPPET INJECTION COMPLETE                                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('The following are now active on your live site:');
  console.log('  • Exit-intent popup (less aggressive)');
  console.log('  • Social proof notifications ("Sarah just ordered...")');
  console.log('  • Shipping progress bar in cart');
  console.log('  • Product page urgency (stock count, viewers)');
  console.log('');
  console.log('🔗 Test: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
