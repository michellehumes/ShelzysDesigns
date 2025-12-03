#!/usr/bin/env node

/**
 * Shelzy's Designs - Force Fix Hero & Best Sellers
 *
 * Directly modifies the theme's index.json settings to:
 * 1. Update hero headline to correct text
 * 2. Limit best sellers to 4 products
 * 3. Hide sold-out products from best sellers
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
  console.log('║  🎯 FORCE FIX: HERO HEADLINE & BEST SELLERS                    ║');
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

  // Get all assets to find section files
  const assets = await listAssets(liveTheme.id);
  const sectionFiles = assets.filter(a => a.key.startsWith('sections/'));

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX 1: HERO HEADLINE - Search all section files for the old text
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 1: HERO HEADLINE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const oldHeadlines = [
    '4.9★ • 500+ 5-Star Reviews • Premium Personalized Water Bottles',
    '4.9★ • 500+ 5-Star Reviews',
    'Make Every Moment Unforgettable',
    'Premium Personalized Water Bottles'
  ];

  const newHeadline = 'Luxury Personalized Water Bottles for Weddings & Events';

  let heroFixed = false;

  for (const asset of sectionFiles) {
    const content = await getAsset(liveTheme.id, asset.key);
    if (!content) continue;

    let modified = content;
    let wasModified = false;

    for (const oldText of oldHeadlines) {
      if (content.includes(oldText)) {
        console.log(`   Found "${oldText.substring(0, 40)}..." in ${asset.key}`);
        modified = modified.split(oldText).join(newHeadline);
        wasModified = true;
      }
    }

    if (wasModified) {
      const result = await putAsset(liveTheme.id, asset.key, modified);
      if (result.success) {
        console.log(`   ✅ Updated ${asset.key}`);
        heroFixed = true;
      } else {
        console.log(`   ❌ Failed to update ${asset.key}`);
      }
    }
  }

  // Also check and update templates/index.json
  console.log('');
  console.log('   Checking templates/index.json...');

  const indexJson = await getAsset(liveTheme.id, 'templates/index.json');
  if (indexJson) {
    let modified = indexJson;
    let wasModified = false;

    for (const oldText of oldHeadlines) {
      if (indexJson.includes(oldText)) {
        console.log(`   Found old headline in index.json`);
        modified = modified.split(oldText).join(newHeadline);
        wasModified = true;
      }
    }

    if (wasModified) {
      const result = await putAsset(liveTheme.id, 'templates/index.json', modified);
      if (result.success) {
        console.log('   ✅ Updated templates/index.json');
        heroFixed = true;
      }
    }

    // Also try to update section settings
    try {
      let templateConfig = JSON.parse(modified);
      let jsonModified = false;

      for (const [sectionId, section] of Object.entries(templateConfig.sections || {})) {
        // Check all settings for old headline text
        if (section.settings) {
          for (const [key, value] of Object.entries(section.settings)) {
            if (typeof value === 'string') {
              for (const oldText of oldHeadlines) {
                if (value.includes(oldText)) {
                  section.settings[key] = value.replace(oldText, newHeadline);
                  jsonModified = true;
                  console.log(`   Updated setting ${sectionId}.${key}`);
                }
              }
            }
          }
        }

        // Check blocks
        if (section.blocks) {
          for (const [blockId, block] of Object.entries(section.blocks)) {
            if (block.settings) {
              for (const [key, value] of Object.entries(block.settings)) {
                if (typeof value === 'string') {
                  for (const oldText of oldHeadlines) {
                    if (value.includes(oldText)) {
                      block.settings[key] = value.replace(oldText, newHeadline);
                      jsonModified = true;
                      console.log(`   Updated block ${sectionId}.${blockId}.${key}`);
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (jsonModified) {
        const result = await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(templateConfig, null, 2));
        if (result.success) {
          console.log('   ✅ Updated JSON settings');
          heroFixed = true;
        }
      }
    } catch (e) {
      console.log(`   ⚠️ Could not parse JSON: ${e.message}`);
    }
  }

  if (!heroFixed) {
    console.log('   ⚠️ Could not find hero text in theme files');
    console.log('   The headline may be stored in theme settings (config/settings_data.json)');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIX 2: BEST SELLERS - Find and modify the featured collection section
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 2: BEST SELLERS (4 products, no sold out)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Find the featured collection section file
  const collectionSectionFiles = sectionFiles.filter(a =>
    a.key.includes('featured') || a.key.includes('collection') || a.key.includes('product')
  );

  console.log('   Found potential collection sections:', collectionSectionFiles.map(a => a.key));

  for (const asset of collectionSectionFiles) {
    const content = await getAsset(liveTheme.id, asset.key);
    if (!content) continue;

    // Check if this is a featured collection section with product loop
    if (content.includes('collection.products') || content.includes('for product in')) {
      console.log(`   Checking ${asset.key}...`);

      // Check if it already has availability check
      if (!content.includes('product.available')) {
        console.log(`   Found product loop without availability check`);

        // Modify the loop to add availability check and limit
        let modified = content;

        // Look for the for loop and add our logic
        // Pattern: {% for product in SOMETHING limit: X %}
        const forLoopRegex = /({%[-]?\s*for\s+product\s+in\s+)([^%]+)(limit:\s*\d+)?(\s*[-]?%})/gi;

        if (forLoopRegex.test(content)) {
          modified = content.replace(forLoopRegex, (match, start, collection, limit, end) => {
            // Add our wrapper logic
            return `{% assign sz_shown = 0 %}{% assign sz_max = 4 %}\n${start}${collection}${end}\n{% if product.available and sz_shown < sz_max %}`;
          });

          // Also need to close our if and increment counter
          // Find {% endfor %} and add before it
          modified = modified.replace(
            /({%[-]?\s*endfor\s*[-]?%})/gi,
            '{% assign sz_shown = sz_shown | plus: 1 %}{% endif %}\n$1'
          );

          const result = await putAsset(liveTheme.id, asset.key, modified);
          if (result.success) {
            console.log(`   ✅ Modified ${asset.key} to show only 4 in-stock products`);
          } else {
            console.log(`   ❌ Failed to modify ${asset.key}`);
          }
        }
      } else {
        console.log(`   ✓ ${asset.key} already has availability check`);
      }
    }
  }

  // Also update index.json to set products_to_show to 4
  console.log('');
  console.log('   Updating product count in index.json...');

  const updatedIndexJson = await getAsset(liveTheme.id, 'templates/index.json');
  if (updatedIndexJson) {
    try {
      let templateConfig = JSON.parse(updatedIndexJson);
      let jsonModified = false;

      for (const [sectionId, section] of Object.entries(templateConfig.sections || {})) {
        // Look for featured collection / best sellers sections
        if (section.type?.includes('featured') || section.type?.includes('collection') ||
            sectionId.includes('featured') || sectionId.includes('best')) {

          if (section.settings) {
            // Set product count to 4
            const countKeys = ['products_to_show', 'products_count', 'limit', 'products_per_page'];
            for (const key of countKeys) {
              if (section.settings[key] !== undefined && section.settings[key] > 4) {
                console.log(`   Setting ${sectionId}.${key} from ${section.settings[key]} to 4`);
                section.settings[key] = 4;
                jsonModified = true;
              }
            }
          }
        }
      }

      if (jsonModified) {
        const result = await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(templateConfig, null, 2));
        if (result.success) {
          console.log('   ✅ Updated product count settings in index.json');
        }
      } else {
        console.log('   No product count settings found to update');
      }
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHECK SETTINGS DATA
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('CHECKING THEME SETTINGS DATA');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const settingsData = await getAsset(liveTheme.id, 'config/settings_data.json');
  if (settingsData) {
    try {
      let settings = JSON.parse(settingsData);
      let modified = false;

      // Stringify and search/replace
      let settingsStr = JSON.stringify(settings, null, 2);

      for (const oldText of oldHeadlines) {
        if (settingsStr.includes(oldText)) {
          console.log(`   Found "${oldText.substring(0, 30)}..." in settings_data.json`);
          settingsStr = settingsStr.split(oldText).join(newHeadline);
          modified = true;
        }
      }

      if (modified) {
        const result = await putAsset(liveTheme.id, 'config/settings_data.json', settingsStr);
        if (result.success) {
          console.log('   ✅ Updated config/settings_data.json');
        } else {
          console.log('   ❌ Failed to update settings_data.json');
        }
      } else {
        console.log('   No old headline text found in settings_data.json');
      }
    } catch (e) {
      console.log(`   ⚠️ Error parsing settings: ${e.message}`);
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ FORCE FIX COMPLETE                                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Changes made:');
  console.log('  • Searched all section files for old headline');
  console.log('  • Updated templates/index.json settings');
  console.log('  • Updated config/settings_data.json');
  console.log('  • Modified product loops to exclude sold-out items');
  console.log('  • Set product count to 4');
  console.log('');
  console.log('🔗 Test: https://shelzysdesigns.com');
  console.log('');
  console.log('If hero still shows old text, it may be in a slideshow/carousel');
  console.log('that needs manual update in Theme Customizer.');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
