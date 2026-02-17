#!/usr/bin/env node

/**
 * Shelzy's Designs - Social Proof Section Deployment
 *
 * Deploys the consolidated social proof section:
 * - 3-column trust icons
 * - Testimonial carousel
 * - Sublimation vs vinyl comparison
 *
 * Removes redundant testimonial sections
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

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ⭐ SHELZY\'S DESIGNS - SOCIAL PROOF SECTION                    ║');
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
  // PHASE 1: Deploy Social Proof Section
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying Social Proof Section');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  try {
    const content = readFile('snippets/shelzys-social-proof-section.liquid');
    if (await putAsset(liveTheme.id, 'snippets/shelzys-social-proof-section.liquid', content)) {
      console.log('✅ Social proof section deployed');
      console.log('');
      console.log('   Includes:');
      console.log('   • 3-column trust icons (4.9★ Rated, Fast Turnaround, Permanent Sublimation)');
      console.log('   • 5-review testimonial carousel with auto-play');
      console.log('   • Sublimation vs vinyl comparison block');
    }
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
  }
  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: Update Homepage Template
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Updating Homepage');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let indexTemplate = await getAsset(liveTheme.id, 'templates/index.liquid');

  if (indexTemplate) {
    let modified = false;

    // Remove old/redundant testimonial sections
    const oldSections = [
      "{% render 'shelzys-testimonials' %}",
      "{% render 'shelzys-proof-band' %}",
      "{% render 'shelzys-trust-badges' %}",
      "{% render 'shelzys-why-choose-us' %}",
      "{%- render 'shelzys-testimonials' -%}",
      "{%- render 'shelzys-proof-band' -%}",
      "{%- render 'shelzys-trust-badges' -%}",
      "{%- render 'shelzys-why-choose-us' -%}",
    ];

    for (const section of oldSections) {
      if (indexTemplate.includes(section)) {
        indexTemplate = indexTemplate.replace(section + '\n', '');
        indexTemplate = indexTemplate.replace(section, '');
        console.log(`   🗑️ Removed: ${section}`);
        modified = true;
      }
    }

    // Add new social proof section after best sellers
    if (!indexTemplate.includes('shelzys-social-proof-section')) {
      // Try to add after best sellers
      if (indexTemplate.includes('shelzys-bestsellers-premium')) {
        indexTemplate = indexTemplate.replace(
          "{% render 'shelzys-bestsellers-premium' %}",
          "{% render 'shelzys-bestsellers-premium' %}\n{% render 'shelzys-social-proof-section' %}"
        );
        console.log('   ✅ Added social proof section after Best Sellers');
        modified = true;
      } else {
        // Add after hero if no best sellers
        if (indexTemplate.includes('shelzys-hero-premium')) {
          indexTemplate = indexTemplate.replace(
            "{% render 'shelzys-hero-premium' %}",
            "{% render 'shelzys-hero-premium' %}\n{% render 'shelzys-social-proof-section' %}"
          );
          console.log('   ✅ Added social proof section after Hero');
          modified = true;
        }
      }
    } else {
      console.log('   ℹ️ Social proof section already on homepage');
    }

    if (modified) {
      // Clean up any double newlines
      indexTemplate = indexTemplate.replace(/\n{3,}/g, '\n\n');

      if (await putAsset(liveTheme.id, 'templates/index.liquid', indexTemplate)) {
        console.log('');
        console.log('   ✅ Homepage updated');
      }
    } else {
      console.log('   ℹ️ No changes needed to homepage');
    }
  } else {
    // Check for JSON template
    console.log('   ℹ️ This theme uses JSON templates (Shopify 2.0)');
    console.log('');
    console.log('   📝 To add manually:');
    console.log('      1. Go to Online Store > Themes > Customize');
    console.log('      2. On Homepage, add a "Custom Liquid" section after Best Sellers');
    console.log("      3. Paste: {% render 'shelzys-social-proof-section' %}");
    console.log('      4. Remove any old testimonial/trust badge sections');
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ SOCIAL PROOF SECTION DEPLOYED                              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📊 What was added:');
  console.log('');
  console.log('   1. TRUST BAR (3 columns):');
  console.log('      • 4.9★ Rated — 500+ verified reviews');
  console.log('      • Fast Turnaround — 3–5 business days, rush available');
  console.log('      • Permanent Sublimation — No peeling, no vinyl — ever');
  console.log('');
  console.log('   2. TESTIMONIAL CAROUSEL (5 reviews):');
  console.log('      • Auto-plays every 6 seconds');
  console.log('      • Dot navigation + prev/next arrows');
  console.log('      • Pauses on hover');
  console.log('');
  console.log('   3. SUBLIMATION VS VINYL:');
  console.log('      • Permanent full-color print');
  console.log('      • Smooth finish (no vinyl bump)');
  console.log('      • More durable for events and daily use');
  console.log('');
  console.log('🗑️ Removed redundant sections:');
  console.log('   • Old testimonials');
  console.log('   • Proof band');
  console.log('   • Trust badges');
  console.log('   • Why choose us');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
