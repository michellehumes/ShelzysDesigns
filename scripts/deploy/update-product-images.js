#!/usr/bin/env node

/**
 * UPDATE PRODUCT IMAGES
 * =====================
 * Updates best seller product images with lifestyle photos from theme assets
 *
 * Usage:
 *   node shopify/scripts/update-product-images.js
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

// Image assignments based on product keywords
const imageAssignments = [
  { keywords: ['bride', 'bridal', 'wedding'], images: ['flatlay-bride-pink.png', 'product-elegant-bridal.png', 'lifestyle-bridal-intimate.webp'] },
  { keywords: ['bridesmaid'], images: ['flatlay-bridesmaid-gold.webp', 'gallery-beach-lineup.png', 'lifestyle-bridal-brunch.webp'] },
  { keywords: ['bachelorette', 'bach'], images: ['lifestyle-bachelorette.webp', 'gallery-beach-party-combo.png', 'lifestyle-friends-couch.png'] },
  { keywords: ['kid', 'child', 'sport', 'team'], images: ['product-studio-colorful.png', 'product-single-blue.png'] },
  { keywords: ['holiday', 'christmas', 'xmas'], images: ['seasonal-christmas.png', 'seasonal-christmas-family.png'] },
  { keywords: ['new year', 'celebration'], images: ['seasonal-new-years.png', 'seasonal-celebration-gold.png'] },
  { keywords: ['proposal', 'box'], images: ['bridesmaid-proposal-box.webp', 'flatlay-bride-gray.webp'] },
  { keywords: ['couple', 'his', 'her'], images: ['lifestyle-couple-outdoor.webp', 'lifestyle-couple-park.png', 'lifestyle-couple-pool.png'] },
];

// Default images for products that don't match any keyword
const defaultImages = ['product-studio-colorful.png', 'hero-bridal-party-5.webp', 'product-hand-holding.png'];

function getImagesForProduct(title) {
  const titleLower = title.toLowerCase();

  for (const assignment of imageAssignments) {
    if (assignment.keywords.some(keyword => titleLower.includes(keyword))) {
      return assignment.images;
    }
  }

  return defaultImages;
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

async function addImageToProduct(productId, imageUrl, position = 1) {
  return shopifyRequest('POST', `/products/${productId}/images.json`, {
    image: {
      src: imageUrl,
      position: position
    }
  });
}

async function getBestSellersCollection() {
  // Try to find best-sellers collection
  const collections = await shopifyRequest('GET', '/custom_collections.json');
  let bestSellers = collections.custom_collections.find(c =>
    c.handle === 'best-sellers' ||
    c.title.toLowerCase().includes('best seller')
  );

  if (!bestSellers) {
    // Try smart collections
    const smartCollections = await shopifyRequest('GET', '/smart_collections.json');
    bestSellers = smartCollections.smart_collections.find(c =>
      c.handle === 'best-sellers' ||
      c.title.toLowerCase().includes('best seller')
    );
  }

  return bestSellers;
}

async function getProductsInCollection(collectionId) {
  const result = await shopifyRequest('GET', `/collections/${collectionId}/products.json?limit=50`);
  return result.products || [];
}

async function getAllProducts() {
  const result = await shopifyRequest('GET', '/products.json?limit=50');
  return result.products || [];
}

async function main() {
  log('\n========================================', 'cyan');
  log('   UPDATE PRODUCT IMAGES', 'cyan');
  log('========================================\n', 'cyan');

  if (!CONFIG.accessToken) {
    log('ERROR: SHOPIFY_ACCESS_TOKEN not set', 'red');
    process.exit(1);
  }

  try {
    // Get active theme for asset URLs
    log('Finding active theme...', 'yellow');
    const theme = await getActiveTheme();
    if (!theme) {
      log('ERROR: No active theme found', 'red');
      process.exit(1);
    }
    log(`Found theme: ${theme.name}`, 'green');

    // Try to get best sellers collection
    log('\nLooking for Best Sellers collection...', 'yellow');
    const bestSellers = await getBestSellersCollection();

    let products;
    if (bestSellers) {
      log(`Found: ${bestSellers.title}`, 'green');
      products = await getProductsInCollection(bestSellers.id);
    } else {
      log('Best Sellers collection not found, using all products', 'yellow');
      products = await getAllProducts();
    }

    log(`\nFound ${products.length} products to update\n`, 'cyan');

    let updated = 0;
    let failed = 0;

    for (const product of products) {
      const imagesToAdd = getImagesForProduct(product.title);
      log(`\nProduct: ${product.title}`, 'cyan');
      log(`  Assigning images: ${imagesToAdd.join(', ')}`, 'yellow');

      for (let i = 0; i < imagesToAdd.length; i++) {
        const filename = imagesToAdd[i];
        try {
          // Get the public URL for this asset
          const assetUrl = await getAssetUrl(theme.id, filename);

          if (!assetUrl) {
            log(`  [SKIP] ${filename} - asset not found`, 'yellow');
            continue;
          }

          // Add image to product
          await addImageToProduct(product.id, assetUrl, i + 1);
          log(`  [OK] Added ${filename}`, 'green');
          updated++;

          // Rate limiting
          await delay(500);
        } catch (e) {
          log(`  [FAIL] ${filename}: ${e.message}`, 'red');
          failed++;
        }
      }
    }

    log('\n========================================', 'cyan');
    log('             SUMMARY', 'cyan');
    log('========================================', 'cyan');
    log(`  Images added: ${updated}`, 'green');
    log(`  Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    log('========================================\n', 'cyan');

  } catch (e) {
    log(`\nFATAL ERROR: ${e.message}`, 'red');
    process.exit(1);
  }
}

main();
