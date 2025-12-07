#!/usr/bin/env node

/**
 * Shelzy's Designs - UX & Navigation Audit Deployment
 *
 * Deploys all components from the UX audit:
 * 1. Enhanced navigation header with occasion-based mega menu
 * 2. Breadcrumbs component
 * 3. Delivery estimator with event date calculator
 * 4. Proof process explainer
 * 5. Social proof badges
 * 6. Enhanced footer
 * 7. Updated personalization (mobile optimizations)
 * 8. Wedding timeline page
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
  console.log('║  🎯 SHELZY\'S DESIGNS - UX & NAVIGATION AUDIT DEPLOYMENT       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Get live theme
  console.log('📋 Finding live theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');

  // Debug: Check API response
  if (themesResponse.status !== 200) {
    console.error(`❌ API Error (${themesResponse.status}):`, JSON.stringify(themesResponse.data, null, 2));
    console.error('');
    console.error('💡 Check your Shopify credentials:');
    console.error('   SHOPIFY_STORE_URL:', STORE_URL);
    console.error('   SHOPIFY_ACCESS_TOKEN:', ACCESS_TOKEN ? '***' + ACCESS_TOKEN.slice(-6) : 'NOT SET');
    console.error('');
    console.error('   Make sure your access token has these scopes:');
    console.error('   - read_themes, write_themes');
    console.error('   - read_content, write_content');
    process.exit(1);
  }

  if (!themesResponse.data || !themesResponse.data.themes) {
    console.error('❌ Unexpected API response:', JSON.stringify(themesResponse.data, null, 2));
    process.exit(1);
  }

  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');

  if (!liveTheme) {
    console.error('❌ No live theme found');
    console.error('   Available themes:', themesResponse.data.themes.map(t => `${t.name} (${t.role})`).join(', '));
    process.exit(1);
  }

  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: Deploy Core Snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying Core Components');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const snippets = [
    {
      file: 'snippets/shelzys-nav-header.liquid',
      key: 'snippets/shelzys-nav-header.liquid',
      name: 'Navigation Header (with Best Sellers & Mega Menu)'
    },
    {
      file: 'snippets/shelzys-breadcrumbs.liquid',
      key: 'snippets/shelzys-breadcrumbs.liquid',
      name: 'Breadcrumbs Navigation'
    },
    {
      file: 'snippets/shelzys-delivery-estimator.liquid',
      key: 'snippets/shelzys-delivery-estimator.liquid',
      name: 'Delivery Estimator (Event Date Calculator)'
    },
    {
      file: 'snippets/shelzys-proof-process.liquid',
      key: 'snippets/shelzys-proof-process.liquid',
      name: 'Proof Approval Process'
    },
    {
      file: 'snippets/shelzys-social-proof-badge.liquid',
      key: 'snippets/shelzys-social-proof-badge.liquid',
      name: 'Social Proof Badges'
    },
    {
      file: 'snippets/shelzys-footer-v2.liquid',
      key: 'snippets/shelzys-footer-v2.liquid',
      name: 'Enhanced Footer (6 columns)'
    },
    {
      file: 'snippets/shelzys-personalization.liquid',
      key: 'snippets/shelzys-personalization.liquid',
      name: 'Personalization UI (Mobile Optimized)'
    }
  ];

  let successCount = 0;
  for (const snippet of snippets) {
    console.log(`📄 ${snippet.name}...`);
    try {
      const content = readFile(snippet.file);
      if (await putAsset(liveTheme.id, snippet.key, content)) {
        console.log('   ✅ Deployed');
        successCount++;
      } else {
        console.log('   ❌ Failed');
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
    await sleep(300);
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: Create Wedding Timeline Page
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Wedding Timeline Page');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Create a page template for the wedding timeline
  const weddingTimelineTemplate = `{%- comment -%}
  Shelzy's Designs - Wedding Timeline Page Template
{%- endcomment -%}

{{ page.content }}
`;

  try {
    if (await putAsset(liveTheme.id, 'templates/page.wedding-timeline.liquid', weddingTimelineTemplate)) {
      console.log('✅ Created page template: page.wedding-timeline');
    }
  } catch (e) {
    console.log(`   ⚠️ Could not create template: ${e.message}`);
  }

  // Check if page exists, create if not
  console.log('');
  console.log('📄 Checking for wedding-timeline page...');

  const pagesResponse = await apiRequest('GET', '/pages.json?handle=wedding-timeline');
  const weddingPage = pagesResponse.data.pages?.find(p => p.handle === 'wedding-timeline');

  if (!weddingPage) {
    console.log('   Creating wedding-timeline page...');
    try {
      const pageContent = readFile('pages/wedding-timeline.html');
      const createPageResponse = await apiRequest('POST', '/pages.json', {
        page: {
          title: 'When to Order Your Wedding Bottles & Favors',
          handle: 'wedding-timeline',
          body_html: pageContent,
          template_suffix: 'wedding-timeline',
          published: true
        }
      });
      if (createPageResponse.status === 201) {
        console.log('   ✅ Wedding timeline page created');
      } else {
        console.log(`   ⚠️ Page creation returned status ${createPageResponse.status}`);
      }
    } catch (e) {
      console.log(`   ⚠️ Could not create page: ${e.message}`);
    }
  } else {
    console.log('   ✅ Page already exists, updating content...');
    try {
      const pageContent = readFile('pages/wedding-timeline.html');
      await apiRequest('PUT', `/pages/${weddingPage.id}.json`, {
        page: {
          body_html: pageContent
        }
      });
      console.log('   ✅ Page content updated');
    } catch (e) {
      console.log(`   ⚠️ Could not update page: ${e.message}`);
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: Update Product Template
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: Product Template Integration');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let productTemplate = await getAsset(liveTheme.id, 'templates/product.liquid');

  if (productTemplate) {
    let modified = false;

    // Add breadcrumbs at the start
    if (!productTemplate.includes('shelzys-breadcrumbs')) {
      // Find the start of the main content
      const contentStart = productTemplate.indexOf('<div class="product');
      if (contentStart > -1) {
        productTemplate = productTemplate.slice(0, contentStart) +
          "{% render 'shelzys-breadcrumbs' %}\n" +
          productTemplate.slice(contentStart);
        console.log('   ✅ Added breadcrumbs');
        modified = true;
      }
    }

    // Add social proof badge before price/title area
    if (!productTemplate.includes('shelzys-social-proof-badge')) {
      if (productTemplate.includes('product__title') || productTemplate.includes('product-title')) {
        productTemplate = productTemplate.replace(
          /(<[^>]*class="[^"]*product[_-]?title[^"]*"[^>]*>)/i,
          "{% render 'shelzys-social-proof-badge', product: product %}\n$1"
        );
        console.log('   ✅ Added social proof badges');
        modified = true;
      }
    }

    // Add delivery estimator before add-to-cart
    if (!productTemplate.includes('shelzys-delivery-estimator')) {
      const atcPatterns = [
        "{% render 'shelzys-personalization'",
        "{%- render 'shelzys-personalization'",
        '<button type="submit" name="add"',
        '<button name="add"'
      ];

      for (const pattern of atcPatterns) {
        if (productTemplate.includes(pattern)) {
          productTemplate = productTemplate.replace(
            pattern,
            "{% render 'shelzys-delivery-estimator', product: product %}\n" + pattern
          );
          console.log('   ✅ Added delivery estimator');
          modified = true;
          break;
        }
      }
    }

    // Add proof process after personalization
    if (!productTemplate.includes('shelzys-proof-process')) {
      if (productTemplate.includes("{% render 'shelzys-personalization'")) {
        productTemplate = productTemplate.replace(
          /{% render 'shelzys-personalization'[^%]*%}/,
          "$&\n{% render 'shelzys-proof-process' %}"
        );
        console.log('   ✅ Added proof process explainer');
        modified = true;
      }
    }

    if (modified) {
      productTemplate = productTemplate.replace(/\n{3,}/g, '\n\n');
      if (await putAsset(liveTheme.id, 'templates/product.liquid', productTemplate)) {
        console.log('');
        console.log('   ✅ Product template updated');
      }
    } else {
      console.log('   ℹ️ No changes needed (components already present)');
    }
  } else {
    console.log('   ℹ️ JSON template detected (Shopify 2.0)');
    console.log('');
    console.log('   📝 Add these render tags to your product template:');
    console.log("      {% render 'shelzys-breadcrumbs' %}");
    console.log("      {% render 'shelzys-social-proof-badge', product: product %}");
    console.log("      {% render 'shelzys-delivery-estimator', product: product %}");
    console.log("      {% render 'shelzys-proof-process' %}");
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: Update Collection Template
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 4: Collection Template Integration');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let collectionTemplate = await getAsset(liveTheme.id, 'templates/collection.liquid');

  if (collectionTemplate && !collectionTemplate.includes('shelzys-breadcrumbs')) {
    const contentStart = collectionTemplate.indexOf('<div class="collection');
    if (contentStart > -1) {
      collectionTemplate = collectionTemplate.slice(0, contentStart) +
        "{% render 'shelzys-breadcrumbs' %}\n" +
        collectionTemplate.slice(contentStart);

      if (await putAsset(liveTheme.id, 'templates/collection.liquid', collectionTemplate)) {
        console.log('   ✅ Added breadcrumbs to collection template');
      }
    } else {
      console.log('   ℹ️ Could not find insertion point');
    }
  } else if (collectionTemplate) {
    console.log('   ℹ️ Breadcrumbs already present');
  } else {
    console.log('   ℹ️ JSON template detected - add breadcrumbs via Theme Customizer');
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ UX AUDIT DEPLOYMENT COMPLETE                               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📦 ${successCount}/${snippets.length} components deployed successfully`);
  console.log('');
  console.log('🎯 Key Features Deployed:');
  console.log('');
  console.log('   NAVIGATION');
  console.log('   • Best Sellers link with star icon');
  console.log('   • "Shop by Occasion" mega menu');
  console.log('   • Style filtering (Modern, Classic, Rustic, Boho)');
  console.log('   • Enhanced mobile menu with accordions');
  console.log('');
  console.log('   PRODUCT PAGES');
  console.log('   • Breadcrumb navigation');
  console.log('   • Social proof badges (orders, viewing, bestseller)');
  console.log('   • Delivery estimator with event date calculator');
  console.log('   • Proof approval process explainer');
  console.log('');
  console.log('   MOBILE');
  console.log('   • 375px optimized personalization');
  console.log('   • 44px minimum touch targets');
  console.log('   • iOS zoom prevention (16px inputs)');
  console.log('');
  console.log('   FOOTER');
  console.log('   • Shop by Occasion column');
  console.log('   • Popular Products column');
  console.log('   • Help & Info with turnaround link');
  console.log('');
  console.log('   SEO CONTENT');
  console.log('   • Wedding Order Timeline page');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
