#!/usr/bin/env node

/**
 * Quick fix for Shelzy's Designs - Fix missing snippet error
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-01';

if (!ACCESS_TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable');
  process.exit(1);
}

async function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('\n🔧 FIXING SHELZY\'S DESIGNS ERRORS\n');

  // Get theme
  console.log('📋 Finding theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');

  if (themesResponse.status !== 200) {
    console.error('❌ API Error:', JSON.stringify(themesResponse.data, null, 2));
    process.exit(1);
  }

  const theme = themesResponse.data.themes.find(t => t.role === 'main');
  console.log(`✅ Theme: "${theme.name}" (ID: ${theme.id})\n`);

  // Deploy missing snippet
  console.log('📄 Deploying sz-cro-enhancements.liquid...');
  const snippetPath = path.join(__dirname, '..', 'snippets', 'sz-cro-enhancements.liquid');
  const content = fs.readFileSync(snippetPath, 'utf8');

  const response = await apiRequest('PUT', `/themes/${theme.id}/assets.json`, {
    asset: {
      key: 'snippets/sz-cro-enhancements.liquid',
      value: content
    }
  });

  if (response.status === 200) {
    console.log('   ✅ Deployed!\n');
  } else {
    console.error('   ❌ Failed:', response.data);
  }

  // Now let's check what the actual header looks like
  console.log('📄 Checking theme header structure...');
  const headerResponse = await apiRequest('GET', `/themes/${theme.id}/assets.json?asset[key]=sections/header.liquid`);

  if (headerResponse.status === 200 && headerResponse.data.asset) {
    console.log('   Found sections/header.liquid');
    const headerContent = headerResponse.data.asset.value;

    // Check if it includes our navigation
    if (headerContent.includes('shelzys-nav-header')) {
      console.log('   ✅ Already includes shelzys-nav-header');
    } else {
      console.log('   ⚠️  Does NOT include shelzys-nav-header snippet');
      console.log('   📝 Header uses its own navigation code');
    }

    // Save for analysis
    fs.writeFileSync(path.join(__dirname, 'current-header.liquid'), headerContent);
    console.log('   💾 Saved to scripts/current-header.liquid for analysis\n');
  } else {
    console.log('   Checking layout/theme.liquid instead...');
    const layoutResponse = await apiRequest('GET', `/themes/${theme.id}/assets.json?asset[key]=layout/theme.liquid`);
    if (layoutResponse.status === 200 && layoutResponse.data.asset) {
      fs.writeFileSync(path.join(__dirname, 'current-theme-layout.liquid'), layoutResponse.data.asset.value);
      console.log('   💾 Saved layout to scripts/current-theme-layout.liquid\n');
    }
  }

  console.log('✅ Error fix deployed! Refresh your site.\n');
  console.log('🔗 https://shelzysdesigns.com\n');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
