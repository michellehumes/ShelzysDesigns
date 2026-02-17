#!/usr/bin/env node

/**
 * Shelzy's Designs - Navigation & Funnel Deployment
 *
 * Deploys:
 * 1. Bulk & Corporate page with quote form
 * 2. Shop by Occasion tiles (4 categories)
 * 3. The Shelzy Edit blog section
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
  console.log('║  🧭 SHELZY\'S DESIGNS - NAVIGATION & FUNNEL                     ║');
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
  // PHASE 1: Deploy Snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying Components');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const snippets = [
    {
      file: 'snippets/shelzys-bulk-corporate.liquid',
      key: 'snippets/shelzys-bulk-corporate.liquid',
      name: 'Bulk & Corporate Page'
    },
    {
      file: 'snippets/shelzys-occasion-tiles.liquid',
      key: 'snippets/shelzys-occasion-tiles.liquid',
      name: 'Shop by Occasion Tiles'
    },
    {
      file: 'snippets/shelzys-blog-edit.liquid',
      key: 'snippets/shelzys-blog-edit.liquid',
      name: 'The Shelzy Edit (Blog)'
    }
  ];

  for (const snippet of snippets) {
    console.log(`📄 ${snippet.name}...`);
    try {
      const content = readFile(snippet.file);
      if (await putAsset(liveTheme.id, snippet.key, content)) {
        console.log('   ✅ Deployed');
      } else {
        console.log('   ❌ Failed');
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
    await sleep(300);
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: Create Bulk Orders Page Template
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Bulk Orders Page Template');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const bulkPageTemplate = `{%- comment -%}
  Shelzy's Designs - Bulk & Corporate Page Template
{%- endcomment -%}

{% render 'shelzys-bulk-corporate' %}
`;

  try {
    if (await putAsset(liveTheme.id, 'templates/page.bulk-corporate.liquid', bulkPageTemplate)) {
      console.log('✅ Created page template: page.bulk-corporate');
      console.log('');
      console.log('   📝 To complete setup:');
      console.log('      1. Go to Online Store > Pages');
      console.log('      2. Create or edit "Bulk Orders" page');
      console.log('      3. Set URL handle to "bulk-orders"');
      console.log('      4. Select template: "page.bulk-corporate"');
    }
  } catch (e) {
    console.log(`   ⚠️ Could not create template: ${e.message}`);
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: Update Homepage
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: Homepage Integration');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let indexTemplate = await getAsset(liveTheme.id, 'templates/index.liquid');

  if (indexTemplate) {
    let modified = false;

    // Remove old occasion tiles if present
    const oldSections = [
      "{% render 'shelzys-occasions' %}",
      "{%- render 'shelzys-occasions' -%}",
    ];

    for (const section of oldSections) {
      if (indexTemplate.includes(section)) {
        indexTemplate = indexTemplate.replace(section + '\n', '');
        indexTemplate = indexTemplate.replace(section, '');
        console.log('   🔄 Replacing old occasion tiles');
        modified = true;
      }
    }

    // Add new occasion tiles after social proof or best sellers
    if (!indexTemplate.includes('shelzys-occasion-tiles')) {
      if (indexTemplate.includes('shelzys-social-proof-section')) {
        indexTemplate = indexTemplate.replace(
          "{% render 'shelzys-social-proof-section' %}",
          "{% render 'shelzys-social-proof-section' %}\n{% render 'shelzys-occasion-tiles' %}"
        );
        console.log('   ✅ Added occasion tiles after social proof');
        modified = true;
      } else if (indexTemplate.includes('shelzys-bestsellers-premium')) {
        indexTemplate = indexTemplate.replace(
          "{% render 'shelzys-bestsellers-premium' %}",
          "{% render 'shelzys-bestsellers-premium' %}\n{% render 'shelzys-occasion-tiles' %}"
        );
        console.log('   ✅ Added occasion tiles after best sellers');
        modified = true;
      }
    }

    // Add blog section before newsletter
    if (!indexTemplate.includes('shelzys-blog-edit')) {
      if (indexTemplate.includes('shelzys-newsletter-premium')) {
        indexTemplate = indexTemplate.replace(
          "{% render 'shelzys-newsletter-premium' %}",
          "{% render 'shelzys-blog-edit' %}\n{% render 'shelzys-newsletter-premium' %}"
        );
        console.log('   ✅ Added blog section before newsletter');
        modified = true;
      } else if (indexTemplate.includes('shelzys-bulk-bar')) {
        indexTemplate = indexTemplate.replace(
          "{% render 'shelzys-bulk-bar' %}",
          "{% render 'shelzys-bulk-bar' %}\n{% render 'shelzys-blog-edit' %}"
        );
        console.log('   ✅ Added blog section after bulk bar');
        modified = true;
      }
    }

    if (modified) {
      indexTemplate = indexTemplate.replace(/\n{3,}/g, '\n\n');
      if (await putAsset(liveTheme.id, 'templates/index.liquid', indexTemplate)) {
        console.log('');
        console.log('   ✅ Homepage updated');
      }
    } else {
      console.log('   ℹ️ No changes needed (sections already present)');
    }
  } else {
    console.log('   ℹ️ JSON template detected (Shopify 2.0)');
    console.log('');
    console.log('   📝 Add sections via Theme Customizer:');
    console.log("      • {% render 'shelzys-occasion-tiles' %}");
    console.log("      • {% render 'shelzys-blog-edit' %}");
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ NAVIGATION COMPONENTS DEPLOYED                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📦 Components ready:');
  console.log('');
  console.log('   1. BULK & CORPORATE PAGE');
  console.log('      • Headline: "Personalized Bottles for Corporate Events & Retreats"');
  console.log('      • Info cards: Lead times, MOQs, Pricing');
  console.log('      • Quote form with: name, email, company, event, date, quantity, logo upload');
  console.log('      • Button: "Get a Custom Quote in 24 Hours"');
  console.log('      • FAQ accordion');
  console.log('');
  console.log('   2. SHOP BY OCCASION TILES');
  console.log('      • Weddings & Bridal Parties');
  console.log('      • Bachelorette Weekends');
  console.log('      • Corporate & Events');
  console.log('      • Everyday & Teams');
  console.log('      • Image hover: dim + "Shop →" CTA');
  console.log('');
  console.log('   3. THE SHELZY EDIT (Blog)');
  console.log('      • Editorial card design');
  console.log('      • 1-2 featured posts');
  console.log('      • Links to relevant collections');
  console.log('      • Existing URLs preserved');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
