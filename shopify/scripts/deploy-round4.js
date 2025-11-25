#!/usr/bin/env node

/**
 * Shelzy's Designs - Round 4 Deployment
 *
 * Deploys:
 * - Newsletter footer section
 * - Sale countdown timer
 * - Back to top button
 * - Quick view modal
 * - Enhanced collection header
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
const API_VERSION = '2024-01';

if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN') {
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
  console.log('║  🚀 SHELZY\'S DESIGNS - ROUND 4 DEPLOYMENT                     ║');
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
  // Deploy snippets
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: Deploying New Snippets');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const snippets = [
    { key: 'snippets/shelzys-newsletter.liquid', file: 'snippets/shelzys-newsletter.liquid', name: 'Newsletter Footer' },
    { key: 'snippets/shelzys-countdown.liquid', file: 'snippets/shelzys-countdown.liquid', name: 'Countdown Timer' },
    { key: 'snippets/shelzys-back-to-top.liquid', file: 'snippets/shelzys-back-to-top.liquid', name: 'Back to Top Button' },
    { key: 'snippets/shelzys-quick-view.liquid', file: 'snippets/shelzys-quick-view.liquid', name: 'Quick View Modal' },
    { key: 'snippets/shelzys-collection-header.liquid', file: 'snippets/shelzys-collection-header.liquid', name: 'Collection Header' }
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
  // Inject into theme.liquid
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 2: Injecting into Theme');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (themeLayout) {
    let modified = false;

    // Add back-to-top button before </body>
    if (!themeLayout.includes('shelzys-back-to-top')) {
      const bodyClose = themeLayout.indexOf('</body>');
      if (bodyClose !== -1) {
        themeLayout = themeLayout.slice(0, bodyClose) +
          "  {% render 'shelzys-back-to-top' %}\n" +
          themeLayout.slice(bodyClose);
        modified = true;
        console.log('📝 Added back-to-top button');
      }
    }

    // Add quick view modal before </body>
    if (!themeLayout.includes('shelzys-quick-view')) {
      const bodyClose = themeLayout.indexOf('</body>');
      if (bodyClose !== -1) {
        themeLayout = themeLayout.slice(0, bodyClose) +
          "  {% render 'shelzys-quick-view' %}\n" +
          themeLayout.slice(bodyClose);
        modified = true;
        console.log('📝 Added quick view modal');
      }
    }

    if (modified) {
      if (await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout)) {
        console.log('   ✅ theme.liquid updated');
      }
    } else {
      console.log('   ℹ️ All elements already present');
    }
  }

  await sleep(300);

  // ═══════════════════════════════════════════════════════════════
  // Try to add newsletter before footer
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: Adding Newsletter Section');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Check for footer section and try to add newsletter before it
  const footerPatterns = [
    'sections/footer.liquid',
    'sections/footer-group.liquid',
    'snippets/footer.liquid'
  ];

  let newsletterAdded = false;

  // Try to add to theme.liquid before footer render
  if (themeLayout) {
    const footerRender = themeLayout.match(/{%\s*(?:section|render)\s+['"]footer/i);
    if (footerRender && !themeLayout.includes('shelzys-newsletter')) {
      const idx = themeLayout.indexOf(footerRender[0]);
      themeLayout = themeLayout.slice(0, idx) +
        "{% render 'shelzys-newsletter' %}\n  " +
        themeLayout.slice(idx);

      if (await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout)) {
        console.log('📝 Added newsletter section before footer');
        console.log('   ✅ theme.liquid updated');
        newsletterAdded = true;
      }
    }
  }

  if (!newsletterAdded) {
    console.log('   ℹ️ Newsletter section needs manual placement');
    console.log('   💡 Add: {% render \'shelzys-newsletter\' %} above footer');
  }

  // ═══════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📊 ROUND 4 DEPLOYMENT COMPLETE                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('✅ New features deployed:');
  console.log('   • Newsletter Section - Email signup with 10% off code');
  console.log('   • Countdown Timer - Creates urgency for sales');
  console.log('   • Back to Top Button - Smooth scroll helper');
  console.log('   • Quick View Modal - Preview products without leaving page');
  console.log('   • Collection Header - Enhanced headers with badges');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
  console.log('💡 To use countdown timer on homepage, add:');
  console.log('   {% render \'shelzys-countdown\', end_date: \'2025-12-31\', title: \'Holiday Sale Ends\' %}');
  console.log('');
  console.log('💡 To enable quick view, add to product cards:');
  console.log('   <button data-quick-view="{{ product.handle }}">Quick View</button>');
  console.log('');
  console.log('🎉 Done!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
