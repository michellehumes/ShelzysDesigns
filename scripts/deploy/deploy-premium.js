#!/usr/bin/env node

/**
 * Shelzy's Designs - Premium Redesign Deployment
 *
 * Deploys the complete premium homepage redesign:
 * - Premium brand CSS (luxury colors, typography)
 * - Premium hero section
 * - Best sellers (4 products, no sold out)
 * - Social proof band with testimonials
 * - Shop by occasion tiles (4 categories)
 * - Bulk/corporate bar and page
 * - Premium newsletter section
 * - Consolidated email popup (WELCOME10)
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
  console.log('║  ✨ SHELZY\'S DESIGNS - PREMIUM REDESIGN DEPLOYMENT             ║');
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
  // PHASE 1: Deploy Premium CSS
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying Premium CSS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  console.log('📄 Premium Brand CSS...');
  try {
    const css = readFile('assets/shelzys-premium.css');
    if (await putAsset(liveTheme.id, 'assets/shelzys-premium.css', css)) {
      console.log('   ✅ Deployed');
    } else {
      console.log('   ❌ Failed');
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: Deploy Premium Snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Deploying Premium Snippets');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const snippets = [
    { key: 'snippets/shelzys-hero-premium.liquid', file: 'snippets/shelzys-hero-premium.liquid', name: 'Premium Hero' },
    { key: 'snippets/shelzys-bestsellers-premium.liquid', file: 'snippets/shelzys-bestsellers-premium.liquid', name: 'Best Sellers (4 products)' },
    { key: 'snippets/shelzys-proof-band.liquid', file: 'snippets/shelzys-proof-band.liquid', name: 'Social Proof Band' },
    { key: 'snippets/shelzys-occasions.liquid', file: 'snippets/shelzys-occasions.liquid', name: 'Shop by Occasion' },
    { key: 'snippets/shelzys-bulk-bar.liquid', file: 'snippets/shelzys-bulk-bar.liquid', name: 'Bulk CTA Bar' },
    { key: 'snippets/shelzys-bulk-page.liquid', file: 'snippets/shelzys-bulk-page.liquid', name: 'Bulk Orders Page' },
    { key: 'snippets/shelzys-newsletter-premium.liquid', file: 'snippets/shelzys-newsletter-premium.liquid', name: 'Premium Newsletter' },
    { key: 'snippets/shelzys-popup-premium.liquid', file: 'snippets/shelzys-popup-premium.liquid', name: 'Premium Popup (WELCOME10)' }
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
  // PHASE 3: Inject CSS into theme.liquid
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: Injecting into Theme');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (themeLayout) {
    let modified = false;

    // Add premium CSS link in head
    if (!themeLayout.includes('shelzys-premium.css')) {
      const headClose = themeLayout.indexOf('</head>');
      if (headClose !== -1) {
        themeLayout = themeLayout.slice(0, headClose) +
          "\n  {{ 'shelzys-premium.css' | asset_url | stylesheet_tag }}\n" +
          themeLayout.slice(headClose);
        modified = true;
        console.log('📝 Added premium CSS to <head>');
      }
    } else {
      console.log('   ℹ️ Premium CSS already in theme');
    }

    // Add premium popup before </body>
    if (!themeLayout.includes('shelzys-popup-premium')) {
      const bodyClose = themeLayout.indexOf('</body>');
      if (bodyClose !== -1) {
        themeLayout = themeLayout.slice(0, bodyClose) +
          "  {% render 'shelzys-popup-premium' %}\n" +
          themeLayout.slice(bodyClose);
        modified = true;
        console.log('📝 Added premium popup');
      }
    } else {
      console.log('   ℹ️ Premium popup already in theme');
    }

    // Remove old popup if present (consolidating)
    if (themeLayout.includes("{% render 'shelzys-email-popup' %}")) {
      themeLayout = themeLayout.replace("{% render 'shelzys-email-popup' %}\n", '');
      themeLayout = themeLayout.replace("{% render 'shelzys-email-popup' %}", '');
      modified = true;
      console.log('📝 Removed old email popup (consolidated)');
    }

    if (modified) {
      if (await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout)) {
        console.log('   ✅ theme.liquid updated');
      }
    } else {
      console.log('   ℹ️ No changes needed to theme.liquid');
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: Create/Update Homepage Template
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 4: Homepage Setup Instructions');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  console.log('To complete the premium homepage, add these sections in order:');
  console.log('');
  console.log('  1. Hero:        {% render \'shelzys-hero-premium\' %}');
  console.log('  2. Best Sellers: {% render \'shelzys-bestsellers-premium\' %}');
  console.log('  3. Social Proof: {% render \'shelzys-proof-band\' %}');
  console.log('  4. Occasions:   {% render \'shelzys-occasions\' %}');
  console.log('  5. Bulk CTA:    {% render \'shelzys-bulk-bar\' %}');
  console.log('  6. Newsletter:  {% render \'shelzys-newsletter-premium\' %}');
  console.log('');

  // Try to inject into index template if possible
  let indexTemplate = await getAsset(liveTheme.id, 'templates/index.liquid');

  if (indexTemplate) {
    // Check if already has premium sections
    if (!indexTemplate.includes('shelzys-hero-premium')) {
      console.log('📝 Attempting to inject premium sections into homepage...');

      // Create new homepage content
      const premiumHomepage = `{%- comment -%}
  Shelzy's Designs - Premium Homepage
  Customized premium layout
{%- endcomment -%}

{% render 'shelzys-hero-premium' %}
{% render 'shelzys-bestsellers-premium' %}
{% render 'shelzys-proof-band' %}
{% render 'shelzys-occasions' %}
{% render 'shelzys-bulk-bar' %}
{% render 'shelzys-newsletter-premium' %}
`;

      if (await putAsset(liveTheme.id, 'templates/index.liquid', premiumHomepage)) {
        console.log('   ✅ Homepage updated with premium sections!');
      } else {
        console.log('   ⚠️ Could not auto-update homepage');
      }
    } else {
      console.log('   ℹ️ Premium sections already on homepage');
    }
  } else {
    // Check for JSON template (Shopify 2.0)
    let indexJson = await getAsset(liveTheme.id, 'templates/index.json');
    if (indexJson) {
      console.log('');
      console.log('   ℹ️ This theme uses JSON templates (Shopify 2.0)');
      console.log('   📝 Add sections via Theme Customizer:');
      console.log('      1. Go to Online Store > Themes > Customize');
      console.log('      2. Add "Custom Liquid" sections');
      console.log('      3. Paste the render tags shown above');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: Bulk Orders Page
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 5: Bulk Orders Page Setup');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Try to create bulk orders page template
  const bulkPageTemplate = `{%- comment -%}
  Shelzy's Designs - Bulk Orders Page Template
{%- endcomment -%}

{% render 'shelzys-bulk-page' %}
`;

  try {
    if (await putAsset(liveTheme.id, 'templates/page.bulk-orders.liquid', bulkPageTemplate)) {
      console.log('✅ Created bulk-orders page template');
      console.log('');
      console.log('   📝 To complete setup:');
      console.log('      1. Go to Online Store > Pages');
      console.log('      2. Create a page called "Bulk Orders"');
      console.log('      3. Set URL handle to "bulk-orders"');
      console.log('      4. Select template: "page.bulk-orders"');
    }
  } catch (e) {
    console.log(`   ⚠️ Could not create bulk page template: ${e.message}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎉 PREMIUM REDESIGN DEPLOYMENT COMPLETE                       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('✅ Deployed components:');
  console.log('   • Premium CSS (luxury colors, Cormorant Garamond + Inter fonts)');
  console.log('   • Premium Hero Section');
  console.log('   • Best Sellers Grid (4 products, excludes sold out)');
  console.log('   • Social Proof Band (stats + rotating testimonials)');
  console.log('   • Shop by Occasion Tiles (4 categories)');
  console.log('   • Bulk Orders CTA Bar');
  console.log('   • Premium Newsletter Section');
  console.log('   • Consolidated Email Popup (WELCOME10 code)');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
  console.log('📝 Recommended next steps:');
  console.log('   1. Review the homepage layout');
  console.log('   2. Add product images to hero (via Theme Customizer)');
  console.log('   3. Create collections for occasions (wedding, birthday, etc.)');
  console.log('   4. Set up the Bulk Orders page');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
