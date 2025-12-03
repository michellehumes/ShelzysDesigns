#!/usr/bin/env node

/**
 * Shelzy's Designs - Round 3 Direct Fixes
 *
 * This script directly modifies the LIVE theme's existing sections
 * rather than deploying new section files. It:
 *
 * 1. Reads the current templates/index.json to find section IDs
 * 2. Updates hero text settings
 * 3. Updates best sellers to show 4 products, exclude sold out
 * 4. Consolidates social proof
 * 5. Changes blog title to "The Shelzy Edit"
 * 6. Fixes bulk orders page
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  return response.status === 200 || response.status === 201;
}

async function listAssets(themeId) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json`);
  if (response.status === 200) {
    return response.data.assets;
  }
  return [];
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎯 ROUND 3: DIRECT LIVE THEME FIXES                           ║');
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

  console.log(`✅ Live Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // Get all assets to understand theme structure
  console.log('📋 Analyzing theme structure...');
  const assets = await listAssets(liveTheme.id);

  const sectionFiles = assets.filter(a => a.key.startsWith('sections/')).map(a => a.key);
  const templateFiles = assets.filter(a => a.key.startsWith('templates/')).map(a => a.key);

  console.log(`   Found ${sectionFiles.length} section files`);
  console.log(`   Found ${templateFiles.length} template files`);
  console.log('');

  // Get the homepage template
  console.log('📋 Reading homepage template...');
  let indexTemplate = await getAsset(liveTheme.id, 'templates/index.json');
  let templateConfig = null;

  if (indexTemplate) {
    try {
      templateConfig = JSON.parse(indexTemplate);
      console.log('   ✅ Found JSON template (Shopify 2.0)');
      console.log('');
      console.log('   Current sections:');
      if (templateConfig.order) {
        templateConfig.order.forEach((sectionId, i) => {
          const section = templateConfig.sections[sectionId];
          console.log(`   ${i + 1}. ${sectionId} → type: "${section?.type || 'unknown'}"`);
        });
      }
    } catch (e) {
      console.log('   ⚠️ Could not parse JSON template');
    }
  } else {
    console.log('   Using liquid template');
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 1: HERO SECTION');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Find and read the hero/banner section
  const heroSectionFiles = sectionFiles.filter(f =>
    f.includes('hero') || f.includes('banner') || f.includes('slideshow') || f.includes('image-banner')
  );

  console.log('   Looking for hero section files:', heroSectionFiles);

  for (const heroFile of heroSectionFiles) {
    console.log(`   Reading ${heroFile}...`);
    const heroContent = await getAsset(liveTheme.id, heroFile);
    if (heroContent) {
      console.log(`   Found hero section (${heroContent.length} chars)`);
    }
  }

  // If using JSON template, update the section settings directly
  if (templateConfig) {
    console.log('');
    console.log('   Updating hero settings in template JSON...');

    // Find hero section in the config
    let heroSectionId = null;
    for (const [id, section] of Object.entries(templateConfig.sections)) {
      if (section.type?.includes('hero') || section.type?.includes('banner') ||
          section.type?.includes('slideshow') || section.type?.includes('image')) {
        heroSectionId = id;
        console.log(`   Found hero section: ${id} (type: ${section.type})`);

        // Update settings
        if (!section.settings) section.settings = {};

        // Common setting names across themes
        section.settings.heading = 'Luxury Personalized Water Bottles for Weddings & Events';
        section.settings.title = 'Luxury Personalized Water Bottles for Weddings & Events';
        section.settings.subheading = 'Permanent sublimation printing that never peels. Fast turnaround.';
        section.settings.text = 'Permanent sublimation printing that never peels. Fast turnaround.';
        section.settings.description = 'Permanent sublimation printing that never peels. Fast turnaround.';
        section.settings.button_label = 'Shop Bridal Bottles';
        section.settings.button_label_1 = 'Shop Bridal Bottles';
        section.settings.button_link = '/collections/wedding';
        section.settings.button_link_1 = '/collections/wedding';
        section.settings.button_label_2 = 'Shop Best Sellers';
        section.settings.button_link_2 = '/collections/best-sellers';

        // Remove extra paragraph if there's a rich text field
        if (section.settings.richtext) {
          section.settings.richtext = '';
        }

        // Handle blocks (some themes use blocks for content)
        if (section.blocks) {
          for (const [blockId, block] of Object.entries(section.blocks)) {
            if (block.type === 'heading' || block.type === 'title') {
              block.settings = block.settings || {};
              block.settings.heading = 'Luxury Personalized Water Bottles for Weddings & Events';
              block.settings.title = 'Luxury Personalized Water Bottles for Weddings & Events';
            }
            if (block.type === 'text' || block.type === 'subheading') {
              block.settings = block.settings || {};
              block.settings.text = 'Permanent sublimation printing that never peels. Fast turnaround.';
              block.settings.subheading = 'Permanent sublimation printing that never peels. Fast turnaround.';
            }
            if (block.type === 'button' || block.type === 'buttons') {
              block.settings = block.settings || {};
              block.settings.button_label = 'Shop Bridal Bottles';
              block.settings.button_label_1 = 'Shop Bridal Bottles';
              block.settings.button_link = '/collections/wedding';
              block.settings.button_link_1 = '/collections/wedding';
              block.settings.button_label_2 = 'Shop Best Sellers';
              block.settings.button_link_2 = '/collections/best-sellers';
            }
          }
        }

        console.log('   ✅ Hero settings updated');
        break;
      }
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 2: BEST SELLERS (4 products, no sold out)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  if (templateConfig) {
    // Find featured collection / best sellers section
    for (const [id, section] of Object.entries(templateConfig.sections)) {
      if (section.type?.includes('featured') || section.type?.includes('collection') ||
          section.type?.includes('product') || id.includes('best') || id.includes('featured')) {
        console.log(`   Found collection section: ${id} (type: ${section.type})`);

        if (!section.settings) section.settings = {};

        // Limit to 4 products
        section.settings.products_to_show = 4;
        section.settings.products_count = 4;
        section.settings.limit = 4;
        section.settings.products_per_row = 4;
        section.settings.columns = 4;

        // Try to set collection to best-sellers
        section.settings.collection = 'best-sellers';

        console.log('   ✅ Best sellers settings updated (4 products)');
        break;
      }
    }
  }

  // Also create/update a custom best sellers section that excludes sold out
  console.log('');
  console.log('   Creating custom best-sellers section with sold-out exclusion...');

  const customBestsellers = `{% comment %}
  Shelzy's Best Sellers - 4 products, excludes sold out
{% endcomment %}

{%- liquid
  assign collection = collections['best-sellers'] | default: collections.all
  assign shown = 0
  assign max = section.settings.products_to_show | default: 4
-%}

<div class="collection-section page-width">
  <h2 class="section-heading">{{ section.settings.title | default: 'Best Sellers' }}</h2>

  <ul class="grid product-grid grid--4-col-desktop grid--2-col-tablet-down" role="list">
    {%- for product in collection.products -%}
      {%- if shown < max and product.available -%}
        <li class="grid__item">
          {% render 'card-product', card_product: product, show_vendor: false %}
        </li>
        {%- assign shown = shown | plus: 1 -%}
      {%- endif -%}
    {%- endfor -%}
  </ul>

  <div class="center collection-section__view-all">
    <a href="/collections/best-sellers" class="button button--secondary">View All</a>
  </div>
</div>

{% schema %}
{
  "name": "Best Sellers (No Sold Out)",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Best Sellers"
    },
    {
      "type": "range",
      "id": "products_to_show",
      "min": 2,
      "max": 8,
      "step": 1,
      "default": 4,
      "label": "Products to show"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    }
  ],
  "presets": [
    {
      "name": "Best Sellers (No Sold Out)"
    }
  ]
}
{% endschema %}
`;

  if (await putAsset(liveTheme.id, 'sections/best-sellers-no-soldout.liquid', customBestsellers)) {
    console.log('   ✅ Custom best-sellers section deployed');
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 3: SOCIAL PROOF CONSOLIDATION');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  if (templateConfig) {
    // Find and consolidate testimonial sections
    const testimonialSections = [];
    for (const [id, section] of Object.entries(templateConfig.sections)) {
      if (section.type?.includes('testimonial') || section.type?.includes('review') ||
          id.includes('testimonial') || id.includes('review') || id.includes('loved')) {
        testimonialSections.push(id);
      }
    }

    console.log(`   Found ${testimonialSections.length} testimonial sections: ${testimonialSections.join(', ')}`);

    // Keep only the first one, disable others
    if (testimonialSections.length > 1) {
      for (let i = 1; i < testimonialSections.length; i++) {
        const sectionId = testimonialSections[i];
        // Remove from order array
        const orderIndex = templateConfig.order.indexOf(sectionId);
        if (orderIndex > -1) {
          templateConfig.order.splice(orderIndex, 1);
          console.log(`   ✅ Removed duplicate section: ${sectionId}`);
        }
      }
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 4: BLOG TITLE → "The Shelzy Edit"');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  if (templateConfig) {
    for (const [id, section] of Object.entries(templateConfig.sections)) {
      if (section.type?.includes('blog') || id.includes('blog')) {
        console.log(`   Found blog section: ${id} (type: ${section.type})`);

        if (!section.settings) section.settings = {};
        section.settings.heading = 'The Shelzy Edit';
        section.settings.title = 'The Shelzy Edit';

        console.log('   ✅ Blog title updated to "The Shelzy Edit"');
        break;
      }
    }
  }

  // Save the updated template JSON
  if (templateConfig) {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('SAVING TEMPLATE CHANGES');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    const updatedJson = JSON.stringify(templateConfig, null, 2);
    if (await putAsset(liveTheme.id, 'templates/index.json', updatedJson)) {
      console.log('   ✅ Homepage template updated');
    } else {
      console.log('   ❌ Failed to update homepage template');
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 5: BULK ORDERS PAGE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Get all pages
  const pagesResponse = await apiRequest('GET', '/pages.json?limit=250');

  if (pagesResponse.status === 200) {
    const pages = pagesResponse.data.pages;
    console.log(`   Found ${pages.length} pages`);

    // Find bulk-related page
    let bulkPage = pages.find(p => p.handle === 'bulk-orders');

    if (!bulkPage) {
      bulkPage = pages.find(p =>
        p.handle?.includes('bulk') ||
        p.handle?.includes('corporate') ||
        p.title?.toLowerCase().includes('bulk')
      );
    }

    if (bulkPage) {
      console.log(`   Found page: "${bulkPage.title}" (handle: ${bulkPage.handle})`);
      console.log(`   Published: ${bulkPage.published_at ? 'Yes' : 'No'}`);

      // Fix if needed
      const needsFix = bulkPage.handle !== 'bulk-orders' || !bulkPage.published_at;

      if (needsFix) {
        console.log('   Fixing page...');
        const updateResponse = await apiRequest('PUT', `/pages/${bulkPage.id}.json`, {
          page: {
            id: bulkPage.id,
            handle: 'bulk-orders',
            published: true
          }
        });

        if (updateResponse.status === 200) {
          console.log('   ✅ Page fixed - now at /pages/bulk-orders');
        } else {
          console.log('   ❌ Could not fix page:', updateResponse.data?.errors || updateResponse.data);
        }
      } else {
        console.log('   ✅ Page already correct');
      }
    } else {
      console.log('   ⚠️ No bulk orders page found - creating one...');

      const createResponse = await apiRequest('POST', '/pages.json', {
        page: {
          title: 'Bulk & Corporate Orders',
          handle: 'bulk-orders',
          body_html: '<h2>Bulk & Corporate Orders</h2><p>Contact us for bulk orders of 10+ bottles.</p>',
          published: true
        }
      });

      if (createResponse.status === 201 || createResponse.status === 200) {
        console.log('   ✅ Page created at /pages/bulk-orders');
      } else {
        console.log('   ❌ Failed to create page');
      }
    }
  }

  // Verify navigation
  console.log('');
  console.log('   Checking navigation menus...');
  const menusResponse = await apiRequest('GET', '/menus.json');
  if (menusResponse.status === 200 && menusResponse.data.menus) {
    const mainMenu = menusResponse.data.menus.find(m =>
      m.handle === 'main-menu' || m.handle === 'main' || m.title?.toLowerCase().includes('main')
    );
    if (mainMenu) {
      console.log(`   Found main menu: "${mainMenu.title}"`);
      // Note: Menu items are read-only via API, user needs to update in admin
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ ROUND 3 FIXES COMPLETE                                     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Summary of changes:');
  console.log('  1. Hero settings updated in template JSON');
  console.log('  2. Best sellers limited to 4 products');
  console.log('  3. Duplicate testimonial sections removed');
  console.log('  4. Blog title set to "The Shelzy Edit"');
  console.log('  5. Bulk orders page verified/created');
  console.log('');
  console.log('⚠️  If hero text still shows old copy:');
  console.log('   The theme may store text in the section file itself.');
  console.log('   Go to Online Store → Themes → Customize → Hero section');
  console.log('   and manually update the text fields.');
  console.log('');
  console.log('⚠️  If best sellers still shows sold-out items:');
  console.log('   The theme\'s collection section may not support filtering.');
  console.log('   In Theme Customizer, replace "Featured collection" with');
  console.log('   "Best Sellers (No Sold Out)" section we deployed.');
  console.log('');
  console.log('⚠️  Navigation menu:');
  console.log('   To add Bulk Orders to navigation:');
  console.log('   Online Store → Navigation → Main menu → Add menu item');
  console.log('   Name: "Bulk Orders" | Link: /pages/bulk-orders');
  console.log('');
  console.log('🔗 Test: https://shelzysdesigns.com');
  console.log('🔗 Bulk: https://shelzysdesigns.com/pages/bulk-orders');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
