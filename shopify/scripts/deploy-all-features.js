#!/usr/bin/env node

/**
 * Shelzy's Designs - Full Feature Deployment Script
 *
 * Deploys all conversion optimization features to the live Shopify theme:
 * - Brand CSS styling
 * - Email capture popup
 * - Free shipping progress bar
 * - Cart upsells
 * - Urgency elements
 *
 * Usage: node deploy-all-features.js
 *
 * Required environment variables:
 *   SHOPIFY_STORE_URL - Your store URL (e.g., shelzys-designs.myshopify.com)
 *   SHOPIFY_ACCESS_TOKEN - Your Admin API access token
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load from environment variables
const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
const API_VERSION = '2024-01';

// Check for required credentials
if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN' || STORE_URL === 'YOUR_STORE.myshopify.com') {
  console.error('❌ Missing credentials!');
  console.error('Set environment variables:');
  console.error('  export SHOPIFY_STORE_URL="your-store.myshopify.com"');
  console.error('  export SHOPIFY_ACCESS_TOKEN="shpat_xxxxx"');
  console.error('\nOr create a .env file with these values.');
  process.exit(1);
}

// Helper function to make API requests with retry logic
async function apiRequest(method, endpoint, data = null, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await makeRequest(method, endpoint, data);
      return result;
    } catch (error) {
      if (attempt === retries) throw error;
      console.log(`   ⏳ Retrying (attempt ${attempt + 1}/${retries})...`);
      await sleep(1000 * attempt); // Exponential backoff
    }
  }
}

function makeRequest(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method: method,
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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Read file contents
function readFileContent(filePath) {
  const absolutePath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

// Deploy a snippet to the theme
async function deploySnippet(themeId, snippetName, filePath, description) {
  console.log(`📄 Deploying ${description}...`);

  try {
    const content = readFileContent(filePath);
    const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
      asset: {
        key: `snippets/${snippetName}`,
        value: content
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log(`   ✅ ${snippetName} deployed successfully!`);
      return true;
    } else {
      console.log(`   ❌ Failed: ${JSON.stringify(response.data.errors || response.data)}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Deploy a CSS asset
async function deployCSSAsset(themeId, assetName, filePath, description) {
  console.log(`🎨 Deploying ${description}...`);

  try {
    const content = readFileContent(filePath);
    const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
      asset: {
        key: `assets/${assetName}`,
        value: content
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log(`   ✅ ${assetName} deployed successfully!`);
      return true;
    } else {
      console.log(`   ❌ Failed: ${JSON.stringify(response.data.errors || response.data)}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Update theme.liquid to include snippets
async function updateThemeLiquid(themeId) {
  console.log('\n📝 Updating theme.liquid with snippet includes...');

  const response = await apiRequest('GET', `/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`);

  if (response.status !== 200) {
    console.log('   ⚠️ Could not read theme.liquid');
    return false;
  }

  let themeLayout = response.data.asset.value;
  let modified = false;

  // Snippets to add before </head>
  const headSnippets = [
    { tag: "{% render 'shelzys-fonts' %}", name: 'fonts/CSS' }
  ];

  // Snippets to add before </body>
  const bodySnippets = [
    { tag: "{% render 'shelzys-email-popup' %}", name: 'email popup' }
  ];

  // Add head snippets
  for (const snippet of headSnippets) {
    if (!themeLayout.includes(snippet.tag) && !themeLayout.includes(snippet.tag.replace(/'/g, '"'))) {
      const headCloseIndex = themeLayout.indexOf('</head>');
      if (headCloseIndex !== -1) {
        themeLayout = themeLayout.slice(0, headCloseIndex) +
          `\n  ${snippet.tag}\n` +
          themeLayout.slice(headCloseIndex);
        console.log(`   ✅ Added ${snippet.name} include to <head>`);
        modified = true;
      }
    } else {
      console.log(`   ℹ️ ${snippet.name} already included in <head>`);
    }
  }

  // Add body snippets
  for (const snippet of bodySnippets) {
    if (!themeLayout.includes(snippet.tag) && !themeLayout.includes(snippet.tag.replace(/'/g, '"'))) {
      const bodyCloseIndex = themeLayout.indexOf('</body>');
      if (bodyCloseIndex !== -1) {
        themeLayout = themeLayout.slice(0, bodyCloseIndex) +
          `\n  ${snippet.tag}\n` +
          themeLayout.slice(bodyCloseIndex);
        console.log(`   ✅ Added ${snippet.name} include before </body>`);
        modified = true;
      }
    } else {
      console.log(`   ℹ️ ${snippet.name} already included before </body>`);
    }
  }

  // Save if modified
  if (modified) {
    const updateResponse = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
      asset: {
        key: 'layout/theme.liquid',
        value: themeLayout
      }
    });

    if (updateResponse.status === 200 || updateResponse.status === 201) {
      console.log('   ✅ theme.liquid updated successfully!');
      return true;
    } else {
      console.log(`   ❌ Failed to update theme.liquid: ${JSON.stringify(updateResponse.data.errors || updateResponse.data)}`);
      return false;
    }
  }

  return true;
}

// Main deployment function
async function main() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   🚀 Shelzy\'s Designs - Full Feature Deployment          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Store: ${STORE_URL}`);
  console.log('');

  // Step 1: Get the live theme
  console.log('📋 Fetching live theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');

  if (themesResponse.status !== 200 || !themesResponse.data.themes?.length) {
    console.error('❌ Could not fetch themes:', themesResponse.data);
    process.exit(1);
  }

  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');
  if (!liveTheme) {
    console.error('❌ Could not find live theme');
    process.exit(1);
  }

  console.log(`✅ Found live theme: "${liveTheme.name}" (ID: ${liveTheme.id})\n`);

  // Track deployment results
  const results = {
    success: [],
    failed: []
  };

  // Step 2: Deploy CSS Assets
  console.log('═══════════════════════════════════════════════════════════');
  console.log('PHASE 1: CSS Assets');
  console.log('═══════════════════════════════════════════════════════════\n');

  if (await deployCSSAsset(liveTheme.id, 'shelzys-brand-v2.css', 'assets/shelzys-brand.css', 'Brand CSS')) {
    results.success.push('Brand CSS');
  } else {
    results.failed.push('Brand CSS');
  }

  await sleep(500); // Rate limiting

  // Step 3: Deploy Snippets
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('PHASE 2: Liquid Snippets');
  console.log('═══════════════════════════════════════════════════════════\n');

  const snippets = [
    { name: 'shelzys-fonts.liquid', path: 'snippets/shelzys-fonts.liquid', desc: 'Fonts & CSS Loader' },
    { name: 'shelzys-email-popup.liquid', path: 'snippets/shelzys-email-popup.liquid', desc: 'Email Popup (10% off)' },
    { name: 'shelzys-free-shipping-bar.liquid', path: 'snippets/shelzys-free-shipping-bar.liquid', desc: 'Free Shipping Progress Bar' },
    { name: 'shelzys-cart-upsell.liquid', path: 'snippets/shelzys-cart-upsell.liquid', desc: 'Smart Cart Upsells' },
    { name: 'shelzys-urgency.liquid', path: 'snippets/shelzys-urgency.liquid', desc: 'Urgency Elements' }
  ];

  for (const snippet of snippets) {
    if (await deploySnippet(liveTheme.id, snippet.name, snippet.path, snippet.desc)) {
      results.success.push(snippet.desc);
    } else {
      results.failed.push(snippet.desc);
    }
    await sleep(500); // Rate limiting
  }

  // Step 4: Update theme.liquid
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('PHASE 3: Theme Integration');
  console.log('═══════════════════════════════════════════════════════════\n');

  await updateThemeLiquid(liveTheme.id);

  // Summary
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   📊 DEPLOYMENT SUMMARY                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  if (results.success.length > 0) {
    console.log('✅ Successfully deployed:');
    results.success.forEach(item => console.log(`   • ${item}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed to deploy:');
    results.failed.forEach(item => console.log(`   • ${item}`));
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 MANUAL STEPS REQUIRED:');
  console.log('');
  console.log('1. FREE SHIPPING BAR - Add to cart drawer/page:');
  console.log('   {% render \'shelzys-free-shipping-bar\' %}');
  console.log('');
  console.log('2. CART UPSELLS - Add to cart drawer after items:');
  console.log('   {% render \'shelzys-cart-upsell\' %}');
  console.log('');
  console.log('3. URGENCY ELEMENTS - Add to product pages:');
  console.log('   {% render \'shelzys-urgency\', product: product %}');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('🔍 Clear your browser cache and refresh your store.');
  console.log(`📍 View your store: https://shelzysdesigns.com`);
  console.log('');

  if (results.failed.length === 0) {
    console.log('🎉 All features deployed successfully!');
  } else {
    console.log(`⚠️ ${results.failed.length} feature(s) need attention.`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
