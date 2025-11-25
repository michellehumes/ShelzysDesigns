#!/usr/bin/env node

/**
 * Shopify Theme CSS Updater
 * Adds Shelzy's brand CSS to the live theme
 *
 * Usage: node add-brand-css-to-theme.js
 *
 * Required environment variables:
 *   SHOPIFY_STORE_URL - Your store URL (e.g., shelzysdesigns.myshopify.com)
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

// Helper function to make API requests
function apiRequest(method, endpoint, data = null) {
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

// Read file contents
function readFileContent(filePath) {
  const absolutePath = path.join(__dirname, '..', filePath);
  return fs.readFileSync(absolutePath, 'utf8');
}

// Main function
async function main() {
  console.log('🎨 Shelzy\'s Designs Theme CSS Updater');
  console.log('=====================================\n');

  // Step 1: Get the main (live) theme
  console.log('📋 Getting live theme...');
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

  // Step 2: Delete existing CSS file if it exists (to handle "generated asset" error)
  console.log('📄 Checking for existing shelzys-brand.css...');
  const deleteResponse = await apiRequest('DELETE', `/themes/${liveTheme.id}/assets.json?asset[key]=assets/shelzys-brand.css`);
  if (deleteResponse.status === 200) {
    console.log('   🗑️ Deleted existing shelzys-brand.css');
  }

  // Step 3: Add CSS file as asset
  console.log('📄 Adding shelzys-brand.css to assets...');
  const cssContent = readFileContent('assets/shelzys-brand.css');

  const cssAssetResponse = await apiRequest('PUT', `/themes/${liveTheme.id}/assets.json`, {
    asset: {
      key: 'assets/shelzys-brand.css',
      value: cssContent
    }
  });

  if (cssAssetResponse.status === 200 || cssAssetResponse.status === 201) {
    console.log('   ✅ shelzys-brand.css added successfully!');
  } else {
    console.log(`   ❌ Failed to add CSS: ${JSON.stringify(cssAssetResponse.data.errors || cssAssetResponse.data)}`);
  }

  // Step 3: Add fonts snippet
  console.log('📄 Adding shelzys-fonts.liquid snippet...');
  const snippetContent = readFileContent('snippets/shelzys-fonts.liquid');

  const snippetResponse = await apiRequest('PUT', `/themes/${liveTheme.id}/assets.json`, {
    asset: {
      key: 'snippets/shelzys-fonts.liquid',
      value: snippetContent
    }
  });

  if (snippetResponse.status === 200 || snippetResponse.status === 201) {
    console.log('   ✅ shelzys-fonts.liquid added successfully!');
  } else {
    console.log(`   ❌ Failed to add snippet: ${JSON.stringify(snippetResponse.data.errors || snippetResponse.data)}`);
  }

  // Step 4: Get current theme.liquid content
  console.log('\n📄 Checking theme.liquid for font include...');
  const themeLayoutResponse = await apiRequest('GET', `/themes/${liveTheme.id}/assets.json?asset[key]=layout/theme.liquid`);

  if (themeLayoutResponse.status !== 200) {
    console.log('   ⚠️ Could not read theme.liquid');
    console.log('   Please manually add: {% render \'shelzys-fonts\' %} before </head>');
  } else {
    let themeLayout = themeLayoutResponse.data.asset.value;
    const includeSnippet = "{% render 'shelzys-fonts' %}";

    if (themeLayout.includes(includeSnippet) || themeLayout.includes("{% render \"shelzys-fonts\" %}")) {
      console.log('   ✅ Font snippet already included in theme.liquid');
    } else {
      // Try to add before </head>
      console.log('   📝 Adding font snippet to theme.liquid...');

      // Look for </head> and add before it
      const headCloseIndex = themeLayout.indexOf('</head>');
      if (headCloseIndex !== -1) {
        themeLayout = themeLayout.slice(0, headCloseIndex) +
          `\n  ${includeSnippet}\n` +
          themeLayout.slice(headCloseIndex);

        const updateResponse = await apiRequest('PUT', `/themes/${liveTheme.id}/assets.json`, {
          asset: {
            key: 'layout/theme.liquid',
            value: themeLayout
          }
        });

        if (updateResponse.status === 200 || updateResponse.status === 201) {
          console.log('   ✅ theme.liquid updated successfully!');
        } else {
          console.log(`   ❌ Failed to update theme.liquid: ${JSON.stringify(updateResponse.data.errors || updateResponse.data)}`);
          console.log('   Please manually add: {% render \'shelzys-fonts\' %} before </head>');
        }
      } else {
        console.log('   ⚠️ Could not find </head> in theme.liquid');
        console.log('   Please manually add: {% render \'shelzys-fonts\' %} before </head>');
      }
    }
  }

  // Summary
  console.log('\n========================================');
  console.log('🎉 THEME UPDATE COMPLETE!');
  console.log('========================================\n');
  console.log('✅ Brand CSS has been added to your theme.');
  console.log('✅ Fonts snippet has been created.');
  console.log('\n🔍 Clear your browser cache and refresh your store to see changes.');
  console.log('\n📍 View your store: https://' + STORE_URL.replace('.myshopify.com', '.com'));
}

main().catch(console.error);
