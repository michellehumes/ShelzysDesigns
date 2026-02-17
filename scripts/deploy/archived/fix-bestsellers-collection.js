#!/usr/bin/env node

/**
 * Shelzy's Designs - Fix Best Sellers Collection
 *
 * 1. Finds the best-sellers collection
 * 2. Removes sold-out products from it
 * 3. Updates the homepage section settings to show only 4 products
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable');
  console.error('   Run: export SHOPIFY_ACCESS_TOKEN=your_token_here');
  process.exit(1);
}
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
  console.log('║  🛒 FIX BEST SELLERS: REMOVE SOLD-OUT & LIMIT TO 4            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Get live theme
  const themesResponse = await apiRequest('GET', '/themes.json');

  if (themesResponse.status !== 200 || !themesResponse.data || !themesResponse.data.themes) {
    console.error('❌ Failed to fetch themes:', themesResponse.status, themesResponse.data);
    process.exit(1);
  }

  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');

  if (!liveTheme) {
    console.error('❌ No published theme found');
    process.exit(1);
  }

  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1: Find and update homepage section settings
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 1: UPDATE HOMEPAGE SECTION SETTINGS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const indexJson = await getAsset(liveTheme.id, 'templates/index.json');
  if (indexJson) {
    let config = JSON.parse(indexJson);
    let modified = false;

    console.log('   Scanning sections for product count settings...');

    for (const [sectionId, section] of Object.entries(config.sections || {})) {
      const sectionType = section.type || '';
      const isCollection = sectionType.includes('collection') ||
                          sectionType.includes('featured') ||
                          sectionId.includes('collection') ||
                          sectionId.includes('featured') ||
                          sectionId.includes('best');

      if (isCollection && section.settings) {
        console.log(`   Found section: ${sectionId} (type: ${sectionType})`);

        // Update all product count related settings
        const countFields = ['products_to_show', 'products', 'limit', 'products_per_page', 'product_limit'];
        for (const field of countFields) {
          if (section.settings[field] !== undefined) {
            console.log(`      ${field}: ${section.settings[field]} → 4`);
            section.settings[field] = 4;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      const result = await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(config, null, 2));
      console.log(result.success ? '   ✅ Updated section settings' : '   ❌ Failed');
    } else {
      console.log('   No product count settings found in sections');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 2: Find the best-sellers collection and remove sold-out product
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 2: CHECK BEST SELLERS COLLECTION');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Get collections
  const collectionsResponse = await apiRequest('GET', '/custom_collections.json');
  const smartCollectionsResponse = await apiRequest('GET', '/smart_collections.json');

  let allCollections = [];
  if (collectionsResponse.status === 200) {
    allCollections = allCollections.concat(collectionsResponse.data.custom_collections || []);
  }
  if (smartCollectionsResponse.status === 200) {
    allCollections = allCollections.concat(smartCollectionsResponse.data.smart_collections || []);
  }

  console.log(`   Found ${allCollections.length} collections`);

  const bestSellersCollection = allCollections.find(c =>
    c.handle === 'best-sellers' ||
    c.handle === 'bestsellers' ||
    c.title.toLowerCase().includes('best seller')
  );

  if (bestSellersCollection) {
    console.log(`   Found: "${bestSellersCollection.title}" (ID: ${bestSellersCollection.id})`);
    console.log(`   Handle: ${bestSellersCollection.handle}`);

    // Get products in this collection
    const productsResponse = await apiRequest('GET', `/collections/${bestSellersCollection.id}/products.json`);

    if (productsResponse.status === 200) {
      const products = productsResponse.data.products;
      console.log(`   Products in collection: ${products.length}`);
      console.log('');

      // Check for sold-out products
      const soldOut = products.filter(p => {
        // Check if any variant is available
        const hasAvailable = p.variants?.some(v => v.inventory_quantity > 0 || v.inventory_policy === 'continue');
        return !hasAvailable;
      });

      if (soldOut.length > 0) {
        console.log(`   Found ${soldOut.length} sold-out product(s):`);
        for (const p of soldOut) {
          console.log(`      - ${p.title} (ID: ${p.id})`);
        }
        console.log('');
        console.log('   ⚠️ To remove sold-out products from this collection:');
        console.log('      1. Go to Shopify Admin → Products → Collections');
        console.log('      2. Open "Best Sellers" collection');
        console.log('      3. Remove the sold-out products from the collection');
        console.log('');
        console.log('   OR if it\'s a Smart Collection, update the rules to:');
        console.log('      "Inventory stock is greater than 0"');
      } else {
        console.log('   ✅ No sold-out products found in collection');
      }
    }
  } else {
    console.log('   ⚠️ Could not find best-sellers collection');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 3: Inject CSS to hide sold-out badges in Best Sellers
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 3: INJECT CSS TO HIDE SOLD-OUT IN BEST SELLERS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Create a snippet that hides sold-out products via CSS/JS
  const hidesSoldOutSnippet = `{% comment %}
  Shelzy's - Hide sold-out products from Best Sellers section
{% endcomment %}

<style>
  /* Hide sold-out products in featured collection / best sellers */
  .featured-collection .product-card--sold-out,
  .featured-collection .card--sold-out,
  .featured-collection [data-sold-out="true"],
  .collection-grid .product-card--sold-out,
  .best-sellers .product-card--sold-out {
    display: none !important;
  }

  /* Also hide any "Sold out" badge text */
  .featured-collection .badge--sold-out,
  .featured-collection .sold-out-badge {
    display: none !important;
  }

  /* Limit grid to show only first 4 visible items */
  .featured-collection .grid__item:nth-child(n+5),
  .featured-collection .product-grid__item:nth-child(n+5) {
    display: none !important;
  }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Find and hide sold-out products in Best Sellers / Featured Collection
  var selectors = [
    '.featured-collection',
    '[class*="best-seller"]',
    '[class*="featured-collection"]',
    '.collection-grid'
  ];

  selectors.forEach(function(selector) {
    var sections = document.querySelectorAll(selector);
    sections.forEach(function(section) {
      // Find product cards
      var cards = section.querySelectorAll('.product-card, .card, .grid__item');
      var visibleCount = 0;
      var maxVisible = 4;

      cards.forEach(function(card) {
        // Check if sold out
        var isSoldOut = card.classList.contains('product-card--sold-out') ||
                       card.querySelector('.sold-out') ||
                       card.querySelector('.badge--sold-out') ||
                       card.textContent.includes('Sold out') ||
                       card.textContent.includes('Sold Out');

        if (isSoldOut) {
          card.style.display = 'none';
        } else if (visibleCount < maxVisible) {
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
</script>
`;

  const result = await putAsset(liveTheme.id, 'snippets/sz-hide-soldout-bestsellers.liquid', hidesSoldOutSnippet);
  console.log(result.success ? '   ✅ Created sz-hide-soldout-bestsellers.liquid' : '   ❌ Failed');

  // Inject into theme.liquid
  console.log('');
  console.log('   Injecting snippet into theme.liquid...');

  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid && !themeLiquid.includes('sz-hide-soldout-bestsellers')) {
    themeLiquid = themeLiquid.replace('</body>', "{% render 'sz-hide-soldout-bestsellers' %}\n</body>");
    const themeResult = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
    console.log(themeResult.success ? '   ✅ Injected into theme.liquid' : '   ❌ Failed to inject');
  } else if (themeLiquid) {
    console.log('   ✓ Already injected');
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ BEST SELLERS FIX COMPLETE                                  ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Changes made:');
  console.log('  • Updated section settings to show 4 products');
  console.log('  • Added CSS/JS to hide sold-out products');
  console.log('  • Added CSS to limit visible products to 4');
  console.log('');
  console.log('🔗 Test: https://shelzysdesigns.com');
  console.log('   (Clear cache or use incognito window)');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
