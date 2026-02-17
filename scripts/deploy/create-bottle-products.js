#!/usr/bin/env node

/**
 * CREATE BOTTLE PRODUCTS IN SHOPIFY
 * ==================================
 * Creates the 4 adult water bottle products in Shopify
 *
 * Usage:
 *   node shopify/scripts/create-bottle-products.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${c[color]}${msg}${c.reset}`);
}

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getActiveTheme() {
  const themes = await shopifyRequest('GET', '/themes.json');
  return themes.themes.find(t => t.role === 'main');
}

async function getAssetUrl(themeId, filename) {
  try {
    const result = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=assets/${filename}`);
    return result.asset ? result.asset.public_url : null;
  } catch (e) {
    return null;
  }
}

async function createProduct(productData, themeId) {
  // Build the product payload
  const product = {
    title: productData.title,
    body_html: productData.description.full,
    vendor: productData.vendor,
    product_type: productData.product_type,
    tags: productData.tags.join(', '),
    variants: [
      {
        price: productData.price,
        compare_at_price: productData.compare_at_price,
        sku: productData.sku,
        weight: parseFloat(productData.weight),
        weight_unit: productData.weight_unit,
        inventory_management: 'shopify',
        inventory_quantity: 100
      }
    ]
  };

  // Add images if we can get their URLs
  const images = [];
  for (const imgFile of productData.images || []) {
    const url = await getAssetUrl(themeId, imgFile);
    if (url) {
      images.push({ src: url });
    }
  }
  if (images.length > 0) {
    product.images = images;
  }

  return shopifyRequest('POST', '/products.json', { product });
}

async function main() {
  log('\n========================================', 'cyan');
  log('   CREATE BOTTLE PRODUCTS IN SHOPIFY', 'cyan');
  log('========================================\n', 'cyan');

  if (!CONFIG.accessToken) {
    log('ERROR: SHOPIFY_ACCESS_TOKEN not set', 'red');
    process.exit(1);
  }

  try {
    // Load product data
    const productsFile = path.join(__dirname, '../../products/adult-bottles.json');
    const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

    // Get theme for image URLs
    log('Finding active theme...', 'yellow');
    const theme = await getActiveTheme();
    log(`Found: ${theme.name}\n`, 'green');

    let created = 0;
    let failed = 0;

    for (const product of productsData.products) {
      log(`Creating: ${product.title}...`, 'yellow');

      try {
        const result = await createProduct(product, theme.id);
        log(`  ✓ Created (ID: ${result.product.id})`, 'green');
        created++;

        // Rate limiting
        await delay(1000);
      } catch (e) {
        if (e.message.includes('already exists') || e.message.includes('taken')) {
          log(`  ⚠ Already exists, skipping`, 'yellow');
        } else {
          log(`  ✗ Failed: ${e.message}`, 'red');
          failed++;
        }
      }
    }

    log('\n========================================', 'cyan');
    log('             SUMMARY', 'cyan');
    log('========================================', 'cyan');
    log(`  Created: ${created}`, 'green');
    log(`  Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    log('========================================\n', 'cyan');

  } catch (e) {
    log(`\nFATAL ERROR: ${e.message}`, 'red');
    process.exit(1);
  }
}

main();
