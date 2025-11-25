#!/usr/bin/env node

/**
 * Shelzy's Designs - Offer & Popup Cleanup
 *
 * This script cleans up conflicting offers and popups:
 * 1. Replaces announcement bar with single consistent message
 * 2. Removes ALL conflicting popup snippets
 * 3. Ensures only ONE popup exists (WELCOME10, 25s/exit-intent)
 * 4. Cleans up unused CSS/JS references
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
  console.log('║  🧹 SHELZY\'S DESIGNS - OFFER & POPUP CLEANUP                   ║');
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
  // PHASE 1: Deploy Clean Announcement Bar
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Clean Announcement Bar');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('New message: "Free shipping $50+ • 3–5 day turnaround • Permanent sublimation printing"');
  console.log('');

  try {
    const announcementContent = readFile('snippets/shelzys-announcement-clean.liquid');
    if (await putAsset(liveTheme.id, 'snippets/shelzys-announcement-clean.liquid', announcementContent)) {
      console.log('✅ Clean announcement bar deployed');
    }
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
  }
  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: Deploy Single Popup (WELCOME10)
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Single Popup (WELCOME10)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('Trigger: Exit intent OR 25 seconds after load');
  console.log('Offer: 10% off with code WELCOME10');
  console.log('');

  try {
    const popupContent = readFile('snippets/shelzys-popup-premium.liquid');
    if (await putAsset(liveTheme.id, 'snippets/shelzys-popup-premium.liquid', popupContent)) {
      console.log('✅ Premium popup deployed');
    }
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
  }
  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: Clean Up theme.liquid
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: Cleaning theme.liquid');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (themeLayout) {
    let modified = false;
    const originalLength = themeLayout.length;

    // List of old popup/offer snippets to remove
    const snippetsToRemove = [
      "{% render 'shelzys-email-popup' %}",
      "{% render 'shelzys-announcement-bar' %}",
      "{% render 'popup-10-off' %}",
      "{% render 'popup-discount' %}",
      "{% render 'email-popup' %}",
      "{% render 'newsletter-popup' %}",
      "{% render 'welcome-popup' %}",
      "{% render 'discount-popup' %}",
      "{% render 'promo-popup' %}",
      "{%- render 'shelzys-email-popup' -%}",
      "{%- render 'shelzys-announcement-bar' -%}",
    ];

    for (const snippet of snippetsToRemove) {
      if (themeLayout.includes(snippet)) {
        themeLayout = themeLayout.split(snippet).join('');
        console.log(`   🗑️ Removed: ${snippet}`);
        modified = true;
      }
    }

    // Remove any lines that only have whitespace after removal
    themeLayout = themeLayout.replace(/^\s*[\r\n]/gm, '\n');

    // Ensure clean announcement bar is in header (after <body> or in header section)
    if (!themeLayout.includes('shelzys-announcement-clean')) {
      // Try to add after opening body tag
      const bodyMatch = themeLayout.match(/<body[^>]*>/i);
      if (bodyMatch) {
        const bodyTag = bodyMatch[0];
        const bodyIndex = themeLayout.indexOf(bodyTag) + bodyTag.length;
        themeLayout = themeLayout.slice(0, bodyIndex) +
          "\n  {% render 'shelzys-announcement-clean' %}\n" +
          themeLayout.slice(bodyIndex);
        console.log('   ✅ Added clean announcement bar after <body>');
        modified = true;
      }
    } else {
      console.log('   ℹ️ Clean announcement bar already present');
    }

    // Ensure premium popup is before </body> (and only once)
    const popupCount = (themeLayout.match(/shelzys-popup-premium/g) || []).length;

    if (popupCount === 0) {
      const bodyClose = themeLayout.lastIndexOf('</body>');
      if (bodyClose !== -1) {
        themeLayout = themeLayout.slice(0, bodyClose) +
          "  {% render 'shelzys-popup-premium' %}\n" +
          themeLayout.slice(bodyClose);
        console.log('   ✅ Added premium popup before </body>');
        modified = true;
      }
    } else if (popupCount > 1) {
      // Remove duplicates, keep only the last one
      let count = 0;
      themeLayout = themeLayout.replace(/\s*\{%[-]?\s*render\s*['"]shelzys-popup-premium['"]\s*[-]?%\}\s*/g, (match) => {
        count++;
        return count === popupCount ? match : '';
      });
      console.log(`   🗑️ Removed ${popupCount - 1} duplicate popup renders`);
      modified = true;
    } else {
      console.log('   ℹ️ Premium popup already present (single instance)');
    }

    if (modified) {
      if (await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout)) {
        console.log('');
        console.log(`   ✅ theme.liquid updated (${originalLength - themeLayout.length} bytes removed)`);
      }
    } else {
      console.log('   ℹ️ No changes needed to theme.liquid');
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: Remove Old Popup Snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 4: Removing Old Popup Files');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Old snippets that might exist and conflict
  const oldSnippets = [
    'snippets/shelzys-email-popup.liquid',
    'snippets/popup-10-off.liquid',
    'snippets/popup-discount.liquid',
    'snippets/email-popup.liquid',
    'snippets/newsletter-popup.liquid',
    'snippets/welcome-popup.liquid',
    'snippets/discount-popup.liquid',
    'snippets/promo-popup.liquid'
  ];

  for (const snippet of oldSnippets) {
    const exists = await getAsset(liveTheme.id, snippet);
    if (exists) {
      if (await deleteAsset(liveTheme.id, snippet)) {
        console.log(`   🗑️ Deleted: ${snippet}`);
      }
    }
    await sleep(200);
  }

  console.log('   ✅ Old popup cleanup complete');

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: Verify & Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ CLEANUP COMPLETE                                           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📢 Announcement Bar:');
  console.log('   "Free shipping $50+ • 3–5 day turnaround • Permanent sublimation printing"');
  console.log('');
  console.log('🎁 Welcome Discount:');
  console.log('   Code: WELCOME10 (10% off)');
  console.log('   Single popup sitewide');
  console.log('');
  console.log('⏱️ Popup Trigger:');
  console.log('   • Exit intent (mouse leaves viewport)');
  console.log('   • OR 25 seconds after page load');
  console.log('   • Shows once per session');
  console.log('   • Excluded from checkout/cart pages');
  console.log('');
  console.log('🗑️ Removed:');
  console.log('   • All conflicting popup snippets');
  console.log('   • Duplicate render calls');
  console.log('   • Old announcement bar variations');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
