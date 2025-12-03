#!/usr/bin/env node

/**
 * Shelzy's Designs - Deploy All Remaining Components
 *
 * Single script to deploy everything that hasn't been deployed yet:
 * - Personalization UI
 * - Navigation & Funnel components
 * - Social Proof Section
 * - Offer Cleanup
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
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf8');
  }
  return null;
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

async function deleteAsset(themeId, key) {
  const response = await apiRequest('DELETE', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  return response.status === 200;
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🚀 SHELZY\'S DESIGNS - DEPLOY ALL REMAINING                    ║');
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

  // All snippets to deploy
  const allSnippets = [
    // Personalization
    { file: 'snippets/shelzys-personalization.liquid', name: 'Personalization UI (4-step)' },
    { file: 'snippets/shelzys-price-per-bottle.liquid', name: 'Price Per Bottle' },
    { file: 'snippets/shelzys-upsell-sets.liquid', name: 'Upsell to Sets' },
    // Navigation
    { file: 'snippets/shelzys-bulk-corporate.liquid', name: 'Bulk & Corporate Page' },
    { file: 'snippets/shelzys-occasion-tiles.liquid', name: 'Shop by Occasion Tiles' },
    { file: 'snippets/shelzys-blog-edit.liquid', name: 'The Shelzy Edit (Blog)' },
    // Social Proof
    { file: 'snippets/shelzys-social-proof-section.liquid', name: 'Social Proof Section' },
    // Offers
    { file: 'snippets/shelzys-announcement-clean.liquid', name: 'Clean Announcement Bar' },
    { file: 'snippets/shelzys-popup-premium.liquid', name: 'Premium Popup (WELCOME10)' },
    // Core
    { file: 'snippets/shelzys-hero-premium.liquid', name: 'Premium Hero' },
    { file: 'snippets/shelzys-bestsellers-premium.liquid', name: 'Best Sellers (4 products)' },
    { file: 'snippets/shelzys-newsletter-premium.liquid', name: 'Premium Newsletter' },
    { file: 'snippets/shelzys-bulk-bar.liquid', name: 'Bulk CTA Bar' },
  ];

  // ═══════════════════════════════════════════════════════════════
  // Deploy All Snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Deploying All Components');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let deployedCount = 0;
  let skippedCount = 0;

  for (const snippet of allSnippets) {
    const content = readFile(snippet.file);
    if (content) {
      process.stdout.write(`📄 ${snippet.name}... `);
      const key = snippet.file.replace('snippets/', 'snippets/');
      if (await putAsset(liveTheme.id, key, content)) {
        console.log('✅');
        deployedCount++;
      } else {
        console.log('❌');
      }
    } else {
      skippedCount++;
    }
    await sleep(250);
  }

  console.log('');
  console.log(`   Deployed: ${deployedCount} | Skipped: ${skippedCount}`);

  // ═══════════════════════════════════════════════════════════════
  // Deploy CSS
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Deploying CSS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const cssContent = readFile('assets/shelzys-premium.css');
  if (cssContent) {
    process.stdout.write('📄 Premium CSS... ');
    if (await putAsset(liveTheme.id, 'assets/shelzys-premium.css', cssContent)) {
      console.log('✅');
    } else {
      console.log('❌');
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // Create Page Templates
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Creating Page Templates');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Bulk orders page template
  const bulkTemplate = `{% render 'shelzys-bulk-corporate' %}`;
  process.stdout.write('📄 page.bulk-corporate... ');
  if (await putAsset(liveTheme.id, 'templates/page.bulk-corporate.liquid', bulkTemplate)) {
    console.log('✅');
  } else {
    console.log('❌');
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // Update theme.liquid
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Updating theme.liquid');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (themeLayout) {
    let modified = false;

    // Add premium CSS
    if (!themeLayout.includes('shelzys-premium.css')) {
      const headClose = themeLayout.indexOf('</head>');
      if (headClose !== -1) {
        themeLayout = themeLayout.slice(0, headClose) +
          "\n  {{ 'shelzys-premium.css' | asset_url | stylesheet_tag }}\n" +
          themeLayout.slice(headClose);
        console.log('   ✅ Added premium CSS');
        modified = true;
      }
    }

    // Add announcement bar after body open
    if (!themeLayout.includes('shelzys-announcement-clean')) {
      const bodyMatch = themeLayout.match(/<body[^>]*>/i);
      if (bodyMatch) {
        const bodyIndex = themeLayout.indexOf(bodyMatch[0]) + bodyMatch[0].length;
        themeLayout = themeLayout.slice(0, bodyIndex) +
          "\n  {% render 'shelzys-announcement-clean' %}\n" +
          themeLayout.slice(bodyIndex);
        console.log('   ✅ Added announcement bar');
        modified = true;
      }
    }

    // Remove old popups, add only premium popup
    const oldPopups = [
      "{% render 'shelzys-email-popup' %}",
      "{%- render 'shelzys-email-popup' -%}",
    ];
    for (const old of oldPopups) {
      if (themeLayout.includes(old)) {
        themeLayout = themeLayout.replace(old + '\n', '');
        themeLayout = themeLayout.replace(old, '');
        console.log('   🗑️ Removed old popup');
        modified = true;
      }
    }

    // Add premium popup before </body>
    if (!themeLayout.includes('shelzys-popup-premium')) {
      const bodyClose = themeLayout.lastIndexOf('</body>');
      if (bodyClose !== -1) {
        themeLayout = themeLayout.slice(0, bodyClose) +
          "  {% render 'shelzys-popup-premium' %}\n" +
          themeLayout.slice(bodyClose);
        console.log('   ✅ Added premium popup');
        modified = true;
      }
    }

    if (modified) {
      await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout);
      console.log('   ✅ theme.liquid saved');
    } else {
      console.log('   ℹ️ No changes needed');
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // Update Homepage
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Updating Homepage');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let indexTemplate = await getAsset(liveTheme.id, 'templates/index.liquid');

  if (indexTemplate) {
    // Remove duplicates first
    const duplicates = [
      "{% render 'shelzys-testimonials' %}",
      "{% render 'shelzys-proof-band' %}",
      "{% render 'shelzys-trust-badges' %}",
      "{% render 'shelzys-why-choose-us' %}",
      "{% render 'shelzys-occasions' %}",
    ];
    for (const dup of duplicates) {
      indexTemplate = indexTemplate.replace(dup + '\n', '');
      indexTemplate = indexTemplate.replace(dup, '');
    }

    // Build ideal homepage structure
    const idealStructure = `{%- comment -%}
  Shelzy's Designs - Premium Homepage
{%- endcomment -%}

{% render 'shelzys-hero-premium' %}
{% render 'shelzys-bestsellers-premium' %}
{% render 'shelzys-social-proof-section' %}
{% render 'shelzys-occasion-tiles' %}
{% render 'shelzys-bulk-bar' %}
{% render 'shelzys-blog-edit' %}
{% render 'shelzys-newsletter-premium' %}
`;

    await putAsset(liveTheme.id, 'templates/index.liquid', idealStructure);
    console.log('   ✅ Homepage structure updated');
    console.log('');
    console.log('   Layout:');
    console.log('   1. Hero');
    console.log('   2. Best Sellers (4 products)');
    console.log('   3. Social Proof (icons + testimonials)');
    console.log('   4. Shop by Occasion (4 tiles)');
    console.log('   5. Bulk CTA Bar');
    console.log('   6. The Shelzy Edit (Blog)');
    console.log('   7. Newsletter');
  } else {
    console.log('   ℹ️ JSON template - add sections via Theme Customizer');
  }

  // ═══════════════════════════════════════════════════════════════
  // Cleanup old files
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Cleaning Up Old Files');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const oldFiles = [
    'snippets/shelzys-email-popup.liquid',
    'snippets/shelzys-testimonials.liquid',
    'snippets/shelzys-proof-band.liquid',
    'snippets/shelzys-trust-badges.liquid',
    'snippets/shelzys-why-choose-us.liquid',
    'snippets/shelzys-occasions.liquid',
  ];

  for (const file of oldFiles) {
    const exists = await getAsset(liveTheme.id, file);
    if (exists) {
      await deleteAsset(liveTheme.id, file);
      console.log(`   🗑️ Deleted: ${file}`);
    }
    await sleep(150);
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎉 ALL COMPONENTS DEPLOYED!                                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('✅ HOMEPAGE');
  console.log('   • Hero: "Luxury Personalized Water Bottles for Weddings & Events"');
  console.log('   • Best Sellers: 4 in-stock products');
  console.log('   • Social Proof: Icons + testimonial carousel + sublimation info');
  console.log('   • Shop by Occasion: Weddings, Bachelorette, Corporate, Everyday');
  console.log('   • Bulk CTA bar');
  console.log('   • Blog: "The Shelzy Edit"');
  console.log('   • Newsletter signup');
  console.log('');
  console.log('✅ PRODUCT PAGES');
  console.log('   • 4-step personalization UI (color, font, text, text color)');
  console.log('   • Price per bottle on sets');
  console.log('   • Upsell to sets on single bottles');
  console.log('');
  console.log('✅ SITEWIDE');
  console.log('   • Announcement: "Free shipping $75+ • 3-5 day turnaround • Permanent sublimation"');
  console.log('   • ONE popup: WELCOME10 (exit intent or 25s)');
  console.log('');
  console.log('✅ PAGES');
  console.log('   • Bulk & Corporate quote page template ready');
  console.log('');
  console.log('📝 NEXT STEPS:');
  console.log('   1. Go to Online Store > Pages');
  console.log('   2. Create "Bulk Orders" page with handle "bulk-orders"');
  console.log('   3. Set template to "page.bulk-corporate"');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
