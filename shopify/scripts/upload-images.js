#!/usr/bin/env node

/**
 * UPLOAD THEME IMAGES TO SHOPIFY
 * ==============================
 * Uploads all images from assets/ folder to Shopify theme
 *
 * Usage:
 *   node shopify/scripts/upload-images.js
 *
 * Environment Variables Required:
 *   SHOPIFY_STORE_URL - Your Shopify store URL
 *   SHOPIFY_ACCESS_TOKEN - Your Shopify Admin API access token
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

// Colors for console
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function log(msg, color = 'reset') {
  console.log(`${c[color]}${msg}${c.reset}`);
}

// Shopify API request helper
function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    if (!CONFIG.accessToken) {
      reject(new Error('SHOPIFY_ACCESS_TOKEN not set'));
      return;
    }

    const options = {
      hostname: CONFIG.storeUrl,
      port: 443,
      path: `/admin/api/${CONFIG.apiVersion}${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': CONFIG.accessToken
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(result)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Get active theme
async function getActiveTheme() {
  const themes = await shopifyRequest('GET', '/themes.json');
  return themes.themes.find(t => t.role === 'main');
}

// Upload asset to theme
async function uploadAsset(themeId, key, attachment) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: {
      key,
      attachment  // base64 encoded
    }
  });
}

// Check if asset exists
async function assetExists(themeId, key) {
  try {
    await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return true;
  } catch (e) {
    return false;
  }
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function
async function uploadImages() {
  log('\n========================================', 'cyan');
  log('   UPLOAD THEME IMAGES TO SHOPIFY', 'cyan');
  log('========================================\n', 'cyan');

  // Validate environment
  if (!CONFIG.accessToken) {
    log('ERROR: SHOPIFY_ACCESS_TOKEN not set', 'red');
    log('Please set environment variable or add to .env file', 'yellow');
    process.exit(1);
  }

  try {
    // Get active theme
    log('Finding active theme...', 'yellow');
    const theme = await getActiveTheme();
    if (!theme) {
      log('ERROR: No active theme found', 'red');
      process.exit(1);
    }
    log(`Found theme: ${theme.name} (ID: ${theme.id})`, 'green');

    // Find all image files in assets folder
    const assetsDir = path.join(__dirname, '../../assets');
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];

    const files = fs.readdirSync(assetsDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    log(`\nFound ${files.length} image files to upload`, 'cyan');

    // Upload each image
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const file of files) {
      const key = `assets/${file}`;
      const filePath = path.join(assetsDir, file);

      try {
        // Check if already exists
        const exists = await assetExists(theme.id, key);
        if (exists) {
          log(`  [SKIP] ${file} - already exists`, 'dim');
          skipped++;
          continue;
        }

        // Read file and convert to base64
        const fileData = fs.readFileSync(filePath);
        const base64 = fileData.toString('base64');

        // Upload to Shopify
        log(`  [UPLOAD] ${file}...`, 'yellow');
        await uploadAsset(theme.id, key, base64);
        log(`  [OK] ${file}`, 'green');
        uploaded++;

        // Rate limiting - Shopify allows 2 requests per second for assets
        await delay(600);

      } catch (e) {
        log(`  [FAIL] ${file}: ${e.message}`, 'red');
        failed++;
      }
    }

    // Summary
    log('\n========================================', 'cyan');
    log('             SUMMARY', 'cyan');
    log('========================================', 'cyan');
    log(`  Uploaded: ${uploaded}`, 'green');
    log(`  Skipped:  ${skipped}`, 'yellow');
    log(`  Failed:   ${failed}`, failed > 0 ? 'red' : 'dim');
    log('========================================\n', 'cyan');

    if (failed > 0) {
      process.exit(1);
    }

  } catch (e) {
    log(`\nFATAL ERROR: ${e.message}`, 'red');
    process.exit(1);
  }
}

// Run
uploadImages();
