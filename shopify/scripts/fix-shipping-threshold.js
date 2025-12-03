#!/usr/bin/env node

/**
 * Fix Free Shipping Threshold in Theme Settings
 * Searches ALL theme files and updates $50 references to $75
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!STORE_URL || !ACCESS_TOKEN) {
  console.error('Missing SHOPIFY_STORE_URL or SHOPIFY_ACCESS_TOKEN');
  process.exit(1);
}

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║   FIX FREE SHIPPING THRESHOLD ($50 → $75)              ║');
console.log('║   Comprehensive Theme Search                           ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      path: `/admin/api/2024-01${endpoint}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`API ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function getActiveTheme() {
  const { themes } = await shopifyRequest('GET', '/themes.json');
  return themes.find((t) => t.role === 'main');
}

async function getAllAssets(themeId) {
  const { assets } = await shopifyRequest('GET', `/themes/${themeId}/assets.json`);
  return assets;
}

async function getAsset(themeId, key) {
  try {
    const { asset } = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return asset;
  } catch (e) {
    return null;
  }
}

async function updateAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value },
  });
}

function replaceShippingThreshold(content) {
  let updated = content;

  // All variations of $50 shipping references
  const replacements = [
    [/\$50\+/g, '$75+'],
    [/\$50 \+/g, '$75+'],
    [/Over \$50/gi, 'Over $75'],
    [/over \$50/gi, 'over $75'],
    [/Free Shipping \$50/gi, 'Free Shipping $75'],
    [/free shipping \$50/gi, 'free shipping $75'],
    [/FREE SHIPPING \$50/gi, 'FREE SHIPPING $75'],
    [/shipping \$50/gi, 'shipping $75'],
    [/\$50 or more/gi, '$75 or more'],
    [/\$50 and up/gi, '$75 and up'],
    [/\$50 and over/gi, '$75 and over'],
    [/"text":\s*"([^"]*)\$50([^"]*)"/g, '"text": "$1$75$2"'],
    [/'text':\s*'([^']*)\$50([^']*)'/g, "'text': '$1$75$2'"],
  ];

  for (const [pattern, replacement] of replacements) {
    updated = updated.replace(pattern, replacement);
  }

  return updated;
}

async function fixThemeSettings() {
  console.log('🔍 Finding active theme...');
  const theme = await getActiveTheme();
  console.log(`   Found: ${theme.name} (ID: ${theme.id})\n`);

  console.log('📋 Getting list of all theme files...');
  const allAssets = await getAllAssets(theme.id);
  console.log(`   Found ${allAssets.length} files\n`);

  let updatedCount = 0;
  let filesWithMatches = [];

  // First pass: find all files containing $50
  console.log('🔎 Searching all files for $50 references...\n');

  for (const assetInfo of allAssets) {
    // Skip binary files
    if (assetInfo.content_type && !assetInfo.content_type.includes('text') &&
        !assetInfo.key.endsWith('.liquid') && !assetInfo.key.endsWith('.json') &&
        !assetInfo.key.endsWith('.js') && !assetInfo.key.endsWith('.css')) {
      continue;
    }

    // Only check text-based files
    if (!assetInfo.key.match(/\.(liquid|json|js|css|html|svg)$/)) {
      continue;
    }

    const asset = await getAsset(theme.id, assetInfo.key);
    if (!asset || !asset.value) continue;

    if (asset.value.includes('$50')) {
      filesWithMatches.push(assetInfo.key);
      console.log(`   📄 Found $50 in: ${assetInfo.key}`);
    }
  }

  if (filesWithMatches.length === 0) {
    console.log('   No files found with $50 references.\n');
    console.log('════════════════════════════════════════════════════════');
    console.log('The $50 text might be in the Theme Customizer settings.');
    console.log('');
    console.log('To fix manually:');
    console.log('1. Go to Shopify Admin → Online Store → Themes');
    console.log('2. Click "Customize" on your live theme');
    console.log('3. Look for "Announcement bar" section');
    console.log('4. Edit the text to change $50 to $75');
    console.log('5. Click Save');
    console.log('════════════════════════════════════════════════════════\n');
    return;
  }

  console.log(`\n✏️  Updating ${filesWithMatches.length} file(s)...\n`);

  // Second pass: update all files with matches
  for (const key of filesWithMatches) {
    const asset = await getAsset(theme.id, key);
    if (!asset || !asset.value) continue;

    const newValue = replaceShippingThreshold(asset.value);

    if (newValue !== asset.value) {
      try {
        await updateAsset(theme.id, key, newValue);
        console.log(`   ✅ Updated: ${key}`);
        updatedCount++;
      } catch (e) {
        console.log(`   ❌ Error updating ${key}: ${e.message}`);
      }
    }
  }

  console.log('\n════════════════════════════════════════════════════════');
  console.log(`✅ Complete! Updated ${updatedCount} file(s).`);
  console.log('');
  console.log('Please refresh your site to see the changes.');
  console.log('════════════════════════════════════════════════════════\n');
}

fixThemeSettings().catch((err) => {
  console.error('FATAL ERROR:', err.message);
  process.exit(1);
});
