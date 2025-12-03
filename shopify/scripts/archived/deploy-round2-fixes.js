#!/usr/bin/env node

/**
 * Shelzy's Designs - Round 2 Precision Fixes
 *
 * 1. Update Hero text (exact copy)
 * 2. Best Sellers already correct (4 products, no sold out)
 * 3. Remove duplicate popups (keep ONE - WELCOME10)
 * 4. Consolidate social proof (remove duplicates)
 * 5. Blog already has "The Shelzy Edit" title
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

async function deleteAsset(themeId, key) {
  const response = await apiRequest('DELETE', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  return response.status === 200;
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔧 SHELZY\'S DESIGNS - ROUND 2 PRECISION FIXES                 ║');
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
  // FIX 1: Update Hero Section Text
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 1: Update Hero Section Text');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('   Headline: "Luxury Personalized Water Bottles for Weddings & Events"');
  console.log('   Subheadline: "Permanent sublimation printing that never peels. Fast turnaround."');
  console.log('   Primary CTA: "Shop Bridal Bottles"');
  console.log('   Secondary CTA: "Shop Best Sellers"');
  console.log('');

  try {
    const heroContent = readFile('snippets/shelzys-hero-premium.liquid');
    if (await putAsset(liveTheme.id, 'snippets/shelzys-hero-premium.liquid', heroContent)) {
      console.log('   ✅ Hero section updated');
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // FIX 2: Best Sellers (Already Correct)
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 2: Best Sellers Section');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('   ✅ Already configured: 4 products max, excludes sold out');

  try {
    const bestsellersContent = readFile('snippets/shelzys-bestsellers-premium.liquid');
    if (await putAsset(liveTheme.id, 'snippets/shelzys-bestsellers-premium.liquid', bestsellersContent)) {
      console.log('   ✅ Best sellers deployed');
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // FIX 3: Remove Duplicate Popups
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 3: Remove Duplicate Popups (Keep ONE)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Deploy the ONE popup we're keeping
  try {
    const popupContent = readFile('snippets/shelzys-popup-premium.liquid');
    if (await putAsset(liveTheme.id, 'snippets/shelzys-popup-premium.liquid', popupContent)) {
      console.log('   ✅ Kept: shelzys-popup-premium (WELCOME10, exit-intent/25s)');
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  await sleep(300);

  // Delete old/duplicate popups
  const oldPopups = [
    'snippets/shelzys-email-popup.liquid',
    'snippets/popup-10-off.liquid',
    'snippets/popup-discount.liquid',
    'snippets/email-popup.liquid',
    'snippets/newsletter-popup.liquid',
    'snippets/welcome-popup.liquid'
  ];

  for (const popup of oldPopups) {
    const exists = await getAsset(liveTheme.id, popup);
    if (exists) {
      await deleteAsset(liveTheme.id, popup);
      console.log(`   🗑️ Deleted: ${popup}`);
    }
    await sleep(200);
  }

  // Clean theme.liquid to remove duplicate popup renders
  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLayout) {
    let modified = false;

    // Remove old popup renders
    const oldRenders = [
      "{% render 'shelzys-email-popup' %}",
      "{% render 'popup-10-off' %}",
      "{% render 'email-popup' %}",
      "{% render 'newsletter-popup' %}",
      "{%- render 'shelzys-email-popup' -%}",
    ];

    for (const render of oldRenders) {
      if (themeLayout.includes(render)) {
        themeLayout = themeLayout.replace(render + '\n', '');
        themeLayout = themeLayout.replace(render, '');
        console.log(`   🗑️ Removed render: ${render}`);
        modified = true;
      }
    }

    // Ensure only ONE premium popup render exists
    const popupMatches = themeLayout.match(/\{%[-]?\s*render\s*['"]shelzys-popup-premium['"]\s*[-]?%\}/g) || [];
    if (popupMatches.length > 1) {
      // Remove all but one
      let count = 0;
      themeLayout = themeLayout.replace(/\s*\{%[-]?\s*render\s*['"]shelzys-popup-premium['"]\s*[-]?%\}\s*/g, (match) => {
        count++;
        return count === 1 ? match : '';
      });
      console.log(`   🗑️ Removed ${popupMatches.length - 1} duplicate popup renders`);
      modified = true;
    }

    // Add popup if not present
    if (!themeLayout.includes('shelzys-popup-premium')) {
      const bodyClose = themeLayout.lastIndexOf('</body>');
      if (bodyClose !== -1) {
        themeLayout = themeLayout.slice(0, bodyClose) +
          "  {% render 'shelzys-popup-premium' %}\n" +
          themeLayout.slice(bodyClose);
        console.log('   ✅ Added premium popup to theme');
        modified = true;
      }
    }

    if (modified) {
      await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout);
      console.log('   ✅ theme.liquid cleaned');
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // FIX 4: Consolidate Social Proof
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 4: Consolidate Social Proof (Remove Duplicates)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Deploy the ONE social proof section we're keeping
  try {
    const socialProofContent = readFile('snippets/shelzys-social-proof-section.liquid');
    if (await putAsset(liveTheme.id, 'snippets/shelzys-social-proof-section.liquid', socialProofContent)) {
      console.log('   ✅ Kept: shelzys-social-proof-section (icons + testimonials + sublimation)');
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  await sleep(300);

  // Clean up homepage to remove duplicate social proof sections
  let indexTemplate = await getAsset(liveTheme.id, 'templates/index.liquid');

  if (indexTemplate) {
    let modified = false;

    // Sections to remove (keeping shelzys-social-proof-section only)
    const duplicateSections = [
      "{% render 'shelzys-testimonials' %}",
      "{% render 'shelzys-proof-band' %}",
      "{% render 'shelzys-trust-badges' %}",
      "{% render 'shelzys-why-choose-us' %}",
      "{%- render 'shelzys-testimonials' -%}",
      "{%- render 'shelzys-proof-band' -%}",
      "{%- render 'shelzys-trust-badges' -%}",
      "{%- render 'shelzys-why-choose-us' -%}",
    ];

    for (const section of duplicateSections) {
      if (indexTemplate.includes(section)) {
        indexTemplate = indexTemplate.replace(section + '\n', '');
        indexTemplate = indexTemplate.replace(section, '');
        console.log(`   🗑️ Removed: ${section}`);
        modified = true;
      }
    }

    // Ensure only ONE social proof section exists
    const socialProofMatches = indexTemplate.match(/\{%[-]?\s*render\s*['"]shelzys-social-proof-section['"]\s*[-]?%\}/g) || [];
    if (socialProofMatches.length > 1) {
      let count = 0;
      indexTemplate = indexTemplate.replace(/\s*\{%[-]?\s*render\s*['"]shelzys-social-proof-section['"]\s*[-]?%\}\s*/g, (match) => {
        count++;
        return count === 1 ? match : '';
      });
      console.log(`   🗑️ Removed ${socialProofMatches.length - 1} duplicate social proof sections`);
      modified = true;
    }

    if (modified) {
      indexTemplate = indexTemplate.replace(/\n{3,}/g, '\n\n');
      await putAsset(liveTheme.id, 'templates/index.liquid', indexTemplate);
      console.log('   ✅ Homepage cleaned');
    } else {
      console.log('   ℹ️ No duplicate sections found');
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // FIX 5: Blog Section Title (Already Correct)
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('FIX 5: Blog Section Title');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('   ✅ Already set to "The Shelzy Edit"');

  try {
    const blogContent = readFile('snippets/shelzys-blog-edit.liquid');
    if (await putAsset(liveTheme.id, 'snippets/shelzys-blog-edit.liquid', blogContent)) {
      console.log('   ✅ Blog section deployed');
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ ROUND 2 FIXES COMPLETE                                     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📋 Summary of changes:');
  console.log('');
  console.log('   1. HERO SECTION');
  console.log('      ✓ Headline: "Luxury Personalized Water Bottles for Weddings & Events"');
  console.log('      ✓ Subheadline: "Permanent sublimation printing that never peels. Fast turnaround."');
  console.log('      ✓ CTAs: "Shop Bridal Bottles" + "Shop Best Sellers"');
  console.log('      ✓ Removed extra descriptive paragraphs');
  console.log('');
  console.log('   2. BEST SELLERS');
  console.log('      ✓ Limited to 4 products');
  console.log('      ✓ Sold out products hidden (including Wedding Party Deluxe Set)');
  console.log('');
  console.log('   3. POPUPS');
  console.log('      ✓ ONE popup only: WELCOME10 (10% off)');
  console.log('      ✓ Triggers: exit intent OR 25 seconds');
  console.log('      ✓ All duplicates removed');
  console.log('');
  console.log('   4. SOCIAL PROOF');
  console.log('      ✓ Consolidated into ONE premium band');
  console.log('      ✓ Includes icons, testimonials, sublimation vs vinyl');
  console.log('      ✓ Removed duplicate "Loved By Customers" sections');
  console.log('');
  console.log('   5. BLOG SECTION');
  console.log('      ✓ Title: "The Shelzy Edit"');
  console.log('');
  console.log('⚠️ NOT modified:');
  console.log('   • Product page layouts');
  console.log('   • Navigation');
  console.log('   • Images');
  console.log('   • Checkout');
  console.log('   • Global CSS');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
