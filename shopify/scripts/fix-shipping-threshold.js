#!/usr/bin/env node

/**
 * Fix Free Shipping Threshold in Theme Settings
 * Updates all $50 references to $75 in the live theme
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

async function fixThemeSettings() {
  console.log('🔍 Finding active theme...');
  const theme = await getActiveTheme();
  console.log(`   Found: ${theme.name} (ID: ${theme.id})\n`);

  // Files that commonly contain announcement bar text
  const filesToCheck = [
    'config/settings_data.json',
    'sections/announcement-bar.liquid',
    'sections/header.liquid',
    'snippets/announcement-bar.liquid',
    'layout/theme.liquid',
  ];

  let updatedCount = 0;

  for (const fileKey of filesToCheck) {
    console.log(`📄 Checking ${fileKey}...`);
    const asset = await getAsset(theme.id, fileKey);

    if (!asset || !asset.value) {
      console.log('   (not found or empty)\n');
      continue;
    }

    // Check for $50 references
    const patterns = [
      /\$50\+/g,
      /\$50 /g,
      /Over \$50/gi,
      /over \$50/gi,
      /"50"/g,  // JSON number values
    ];

    let newValue = asset.value;
    let hasChanges = false;

    // Replace $50+ with $75+
    if (newValue.includes('$50')) {
      newValue = newValue.replace(/\$50\+/g, '$75+');
      newValue = newValue.replace(/\$50 /g, '$75 ');
      newValue = newValue.replace(/Over \$50/gi, 'Over $75');
      newValue = newValue.replace(/free shipping \$50/gi, 'free shipping $75');
      hasChanges = true;
    }

    // Also check for "50" as a standalone value in JSON (common in settings)
    if (fileKey.includes('.json') && newValue.includes('"50"')) {
      // Be careful - only replace if it's clearly a shipping threshold context
      // This is a simple heuristic
      newValue = newValue.replace(/"free_shipping_threshold":\s*"50"/g, '"free_shipping_threshold": "75"');
      newValue = newValue.replace(/"shipping_threshold":\s*"50"/g, '"shipping_threshold": "75"');
      newValue = newValue.replace(/"threshold":\s*50/g, '"threshold": 75');
      hasChanges = true;
    }

    if (hasChanges && newValue !== asset.value) {
      console.log('   ✏️  Found $50 references, updating...');
      try {
        await updateAsset(theme.id, fileKey, newValue);
        console.log('   ✅ Updated!\n');
        updatedCount++;
      } catch (e) {
        console.log(`   ❌ Error: ${e.message}\n`);
      }
    } else {
      console.log('   (no $50 references found)\n');
    }
  }

  // Also update metafields if they exist
  console.log('📄 Checking theme settings for announcement text...');
  const settingsAsset = await getAsset(theme.id, 'config/settings_data.json');

  if (settingsAsset && settingsAsset.value) {
    let settings = settingsAsset.value;
    const original = settings;

    // Common patterns in theme settings
    settings = settings.replace(/Free Shipping Over \$50/g, 'Free Shipping Over $75');
    settings = settings.replace(/Free shipping over \$50/g, 'Free shipping over $75');
    settings = settings.replace(/FREE SHIPPING.*?\$50/g, (match) => match.replace('$50', '$75'));
    settings = settings.replace(/free shipping \$50\+/gi, 'free shipping $75+');
    settings = settings.replace(/Free shipping \$50\+/g, 'Free shipping $75+');

    if (settings !== original) {
      console.log('   ✏️  Updating settings_data.json with $75 threshold...');
      await updateAsset(theme.id, 'config/settings_data.json', settings);
      console.log('   ✅ Updated!\n');
      updatedCount++;
    }
  }

  console.log('════════════════════════════════════════════════════════');
  console.log(`✅ Complete! Updated ${updatedCount} file(s).`);
  console.log('');
  console.log('Please refresh your site to see the changes.');
  console.log('If $50 still shows, check Theme Customizer → Announcement Bar');
  console.log('════════════════════════════════════════════════════════\n');
}

fixThemeSettings().catch((err) => {
  console.error('FATAL ERROR:', err.message);
  process.exit(1);
});
