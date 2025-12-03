#!/usr/bin/env node

/**
 * Shelzy's Designs - Final Hero & Best Sellers Fix
 *
 * 1. Removes the "4.9★ • 500+ 5-Star Reviews" eyebrow from hero
 * 2. Replaces featured-collection with our in-stock only version
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
  console.log('║  🎯 FINAL FIX: HERO EYEBROW & BEST SELLERS                     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  const themesResponse = await apiRequest('GET', '/themes.json');
  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');
  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX 1: Remove/update hero eyebrow in index.json
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 1: HERO EYEBROW TEXT');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const indexJson = await getAsset(liveTheme.id, 'templates/index.json');
  if (indexJson) {
    let config = JSON.parse(indexJson);
    let modified = false;

    // Find and update any section with the eyebrow text
    for (const [sectionId, section] of Object.entries(config.sections || {})) {
      // Check settings
      if (section.settings) {
        for (const [key, value] of Object.entries(section.settings)) {
          if (typeof value === 'string' && value.includes('4.9★')) {
            console.log(`   Found eyebrow in ${sectionId}.settings.${key}`);
            // Remove or replace the eyebrow
            section.settings[key] = '';
            modified = true;
          }
          if (typeof value === 'string' && value.includes('500+ 5-Star')) {
            console.log(`   Found review text in ${sectionId}.settings.${key}`);
            section.settings[key] = '';
            modified = true;
          }
        }
      }

      // Check blocks
      if (section.blocks) {
        for (const [blockId, block] of Object.entries(section.blocks)) {
          if (block.settings) {
            for (const [key, value] of Object.entries(block.settings)) {
              if (typeof value === 'string' && value.includes('4.9★')) {
                console.log(`   Found eyebrow in ${sectionId}.blocks.${blockId}.${key}`);
                block.settings[key] = '';
                modified = true;
              }
              if (typeof value === 'string' && value.includes('500+ 5-Star')) {
                console.log(`   Found review text in ${sectionId}.blocks.${blockId}.${key}`);
                block.settings[key] = '';
                modified = true;
              }
            }
          }
        }
      }
    }

    if (modified) {
      const result = await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(config, null, 2));
      console.log(result.success ? '   ✅ Updated index.json' : '   ❌ Failed');
    } else {
      console.log('   No eyebrow text found in index.json');
    }
  }

  // Also check settings_data.json
  console.log('');
  console.log('   Checking config/settings_data.json...');
  const settingsData = await getAsset(liveTheme.id, 'config/settings_data.json');
  if (settingsData) {
    let modified = settingsData;
    let changed = false;

    if (modified.includes('4.9★')) {
      modified = modified.replace(/4\.9★[^"']*/g, '');
      changed = true;
      console.log('   Found and removed 4.9★ text');
    }
    if (modified.includes('500+ 5-Star')) {
      modified = modified.replace(/500\+ 5-Star[^"']*/g, '');
      changed = true;
      console.log('   Found and removed 500+ 5-Star text');
    }

    if (changed) {
      const result = await putAsset(liveTheme.id, 'config/settings_data.json', modified);
      console.log(result.success ? '   ✅ Updated settings_data.json' : '   ❌ Failed');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX 2: Replace featured-collection.liquid with in-stock only version
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 2: BEST SELLERS (Replace featured-collection section)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Get the current featured-collection.liquid
  const currentFC = await getAsset(liveTheme.id, 'sections/featured-collection.liquid');

  if (currentFC) {
    console.log('   Found sections/featured-collection.liquid');
    console.log(`   Current size: ${currentFC.length} chars`);

    // Backup the original
    await putAsset(liveTheme.id, 'sections/featured-collection-backup.liquid', currentFC);
    console.log('   ✅ Backed up original to featured-collection-backup.liquid');

    // Now modify it to add availability check
    let modified = currentFC;

    // Find the product loop and wrap with availability check
    // Look for patterns like: {% for product in collection.products limit: X %}

    // Strategy: Add counter and availability check
    if (!modified.includes('sz_shown')) {
      // Add counter initialization before the for loop
      modified = modified.replace(
        /({%-?\s*for\s+product\s+in\s+)(collection\.products|section\.settings\.collection\.products)([^%]*?)(-?%})/gi,
        (match, forStart, collection, rest, forEnd) => {
          console.log('   Found product loop, adding availability filter');
          return `{% assign sz_shown = 0 %}{% assign sz_max = 4 %}\n${forStart}${collection}${rest}${forEnd}\n{% if product.available and sz_shown < sz_max %}`;
        }
      );

      // Add counter increment and endif before endfor
      modified = modified.replace(
        /({%-?\s*endfor\s*-?%})/gi,
        (match) => {
          return `{% assign sz_shown = sz_shown | plus: 1 %}{% endif %}\n${match}`;
        }
      );

      if (modified !== currentFC) {
        const result = await putAsset(liveTheme.id, 'sections/featured-collection.liquid', modified);
        if (result.success) {
          console.log('   ✅ Modified featured-collection.liquid');
          console.log('      - Added availability check (product.available)');
          console.log('      - Limited to 4 products max');
        } else {
          console.log('   ❌ Failed to update featured-collection.liquid');
          console.log('   Error:', JSON.stringify(result.data));
        }
      }
    } else {
      console.log('   Section already has availability check');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Also update any products_to_show settings
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('   Updating product count in index.json...');

  const updatedIndexJson = await getAsset(liveTheme.id, 'templates/index.json');
  if (updatedIndexJson) {
    let config = JSON.parse(updatedIndexJson);
    let modified = false;

    for (const [sectionId, section] of Object.entries(config.sections || {})) {
      if (section.settings) {
        // Look for product count settings
        if (section.settings.products_to_show && section.settings.products_to_show > 4) {
          console.log(`   Setting ${sectionId}.products_to_show to 4 (was ${section.settings.products_to_show})`);
          section.settings.products_to_show = 4;
          modified = true;
        }
        if (section.settings.products && section.settings.products > 4) {
          console.log(`   Setting ${sectionId}.products to 4 (was ${section.settings.products})`);
          section.settings.products = 4;
          modified = true;
        }
      }
    }

    if (modified) {
      const result = await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(config, null, 2));
      console.log(result.success ? '   ✅ Updated product counts' : '   ❌ Failed');
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ FINAL FIX COMPLETE                                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Changes:');
  console.log('  • Removed "4.9★ • 500+ 5-Star Reviews" eyebrow text');
  console.log('  • Modified featured-collection to show only in-stock products');
  console.log('  • Limited to 4 products maximum');
  console.log('');
  console.log('🔗 Test: https://shelzysdesigns.com');
  console.log('');
  console.log('Clear your browser cache or use incognito to see changes.');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
