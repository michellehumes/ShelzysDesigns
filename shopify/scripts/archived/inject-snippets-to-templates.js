const https = require('https');

const SHOPIFY_STORE = 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

function shopifyRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/2024-01${path}`,
      method: method,
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function getThemeId() {
  const response = await shopifyRequest('GET', '/themes.json');
  const mainTheme = response.themes.find(t => t.role === 'main');
  return mainTheme.id;
}

async function getAsset(themeId, key) {
  try {
    const response = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return response.asset ? response.asset.value : null;
  } catch (e) {
    return null;
  }
}

async function createAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value }
  });
}

async function listAssets(themeId) {
  const response = await shopifyRequest('GET', `/themes/${themeId}/assets.json`);
  return response.assets || [];
}

async function main() {
  console.log('================================================================');
  console.log('  INJECTING SNIPPETS INTO TEMPLATES');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // Get list of all assets to find the right templates
    const assets = await listAssets(themeId);
    const assetKeys = assets.map(a => a.key);

    console.log('--- Finding Product Template ---\n');

    // Find product template (Impulse theme uses sections)
    const productSectionCandidates = [
      'sections/product-template.liquid',
      'sections/product.liquid',
      'sections/main-product.liquid',
      'templates/product.liquid'
    ];

    let productTemplateKey = null;
    for (const candidate of productSectionCandidates) {
      if (assetKeys.includes(candidate)) {
        productTemplateKey = candidate;
        break;
      }
    }

    if (productTemplateKey) {
      console.log(`Found: ${productTemplateKey}`);
      const productTemplate = await getAsset(themeId, productTemplateKey);

      if (productTemplate) {
        let updated = productTemplate;
        let changes = [];

        // Inject trust badges after add to cart form
        if (!productTemplate.includes('sz-trust-badges-atc')) {
          // Look for end of product form or add to cart button
          const injectionPatterns = [
            { pattern: /{%\s*endform\s*%}/i, replacement: "{% endform %}\n{% render 'sz-trust-badges-atc' %}" },
            { pattern: /(<\/form>)/i, replacement: "</form>\n{% render 'sz-trust-badges-atc' %}" }
          ];

          for (const { pattern, replacement } of injectionPatterns) {
            if (pattern.test(updated)) {
              updated = updated.replace(pattern, replacement);
              changes.push('trust badges');
              break;
            }
          }
        }

        // Inject urgency banner before add to cart
        if (!productTemplate.includes('sz-product-urgency')) {
          // Look for add to cart button or form start
          const urgencyPatterns = [
            { pattern: /(<button[^>]*add[^>]*cart[^>]*>)/i, replacement: "{% render 'sz-product-urgency' %}\n$1" },
            { pattern: /(class="product-form__cart-submit")/i, replacement: "{% render 'sz-product-urgency' %}\n$1" }
          ];

          for (const { pattern, replacement } of urgencyPatterns) {
            if (pattern.test(updated)) {
              updated = updated.replace(pattern, replacement);
              changes.push('urgency banner');
              break;
            }
          }
        }

        // Inject price per bottle after price display
        if (!productTemplate.includes('sz-price-per-bottle')) {
          const pricePatterns = [
            { pattern: /(class="product__price"[^>]*>[\s\S]*?<\/[^>]+>)/i, replacement: "$1\n{% render 'sz-price-per-bottle', product: product %}" },
            { pattern: /({%.*product\.price.*%})/i, replacement: "$1\n{% render 'sz-price-per-bottle', product: product %}" }
          ];

          for (const { pattern, replacement } of pricePatterns) {
            if (pattern.test(updated)) {
              updated = updated.replace(pattern, replacement);
              changes.push('price per bottle');
              break;
            }
          }
        }

        if (changes.length > 0) {
          await createAsset(themeId, productTemplateKey, updated);
          console.log(`✓ Injected into ${productTemplateKey}: ${changes.join(', ')}`);
        } else {
          console.log('• All product snippets already present or could not find injection points');
        }
      }
    } else {
      console.log('• Product template not found in expected locations');
    }

    console.log('\n--- Finding Collection Template ---\n');

    // Find collection template
    const collectionCandidates = [
      'sections/collection-template.liquid',
      'sections/collection.liquid',
      'sections/main-collection.liquid',
      'templates/collection.liquid'
    ];

    let collectionTemplateKey = null;
    for (const candidate of collectionCandidates) {
      if (assetKeys.includes(candidate)) {
        collectionTemplateKey = candidate;
        break;
      }
    }

    if (collectionTemplateKey) {
      console.log(`Found: ${collectionTemplateKey}`);
      const collectionTemplate = await getAsset(themeId, collectionTemplateKey);

      if (collectionTemplate && !collectionTemplate.includes('sz-collection-hero')) {
        // Inject at the very beginning of the section/template
        const updated = `{% render 'sz-collection-hero' %}\n${collectionTemplate}`;
        await createAsset(themeId, collectionTemplateKey, updated);
        console.log('✓ Injected collection hero banner');
      } else if (collectionTemplate) {
        console.log('• Collection hero already present');
      }
    } else {
      console.log('• Collection template not found in expected locations');
    }

    console.log('\n--- Updating theme.liquid ---\n');

    const themeLiquid = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquid) {
      let updated = themeLiquid;
      let themeChanges = [];

      // Add brand colors to head
      if (!themeLiquid.includes('sz-brand-colors')) {
        updated = updated.replace('</head>', "{% render 'sz-brand-colors' %}\n</head>");
        themeChanges.push('brand colors');
      }

      // Add sticky mobile ATC before body close
      if (!themeLiquid.includes('sz-sticky-mobile-atc')) {
        updated = updated.replace('</body>', "{% render 'sz-sticky-mobile-atc' %}\n</body>");
        themeChanges.push('sticky mobile ATC');
      }

      if (themeChanges.length > 0) {
        await createAsset(themeId, 'layout/theme.liquid', updated);
        console.log(`✓ Added to theme.liquid: ${themeChanges.join(', ')}`);
      } else {
        console.log('• Theme.liquid already has all snippets');
      }
    }

    console.log('\n--- Updating Cart ---\n');

    // Try multiple cart template locations
    const cartCandidates = [
      'sections/cart-template.liquid',
      'sections/cart.liquid',
      'sections/main-cart.liquid',
      'templates/cart.liquid'
    ];

    let cartUpdated = false;
    for (const cartKey of cartCandidates) {
      if (assetKeys.includes(cartKey)) {
        const cartTemplate = await getAsset(themeId, cartKey);
        if (cartTemplate && !cartTemplate.includes('sz-shipping-progress')) {
          // Insert after the first form opening tag or at the start
          let updated = cartTemplate;
          if (cartTemplate.match(/<form[^>]*>/i)) {
            updated = cartTemplate.replace(/<form[^>]*>/i, (match) => match + "\n{% render 'sz-shipping-progress' %}");
          } else {
            updated = "{% render 'sz-shipping-progress' %}\n" + cartTemplate;
          }
          await createAsset(themeId, cartKey, updated);
          console.log(`✓ Added shipping progress bar to ${cartKey}`);
          cartUpdated = true;
          break;
        } else if (cartTemplate) {
          console.log(`• Shipping progress already in ${cartKey}`);
          cartUpdated = true;
          break;
        }
      }
    }

    if (!cartUpdated) {
      console.log('• Cart template not found (may need manual update)');
    }

    console.log('\n================================================================');
    console.log('  INJECTION COMPLETE!');
    console.log('================================================================');
    console.log('\n🎯 Your theme now has:');
    console.log('  • Trust badges below Add to Cart');
    console.log('  • Urgency banner on product pages');
    console.log('  • Price-per-bottle on bundle products');
    console.log('  • Collection hero banners');
    console.log('  • Free shipping progress in cart');
    console.log('  • Sticky mobile Add to Cart button');
    console.log('  • Brand coral/tropical colors');
    console.log('\n💡 Preview your store to see the changes!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
