#!/usr/bin/env node

/**
 * Upload product image to Shopify
 * Usage: node upload-product-image.js <image_path> <product_id>
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('Missing SHOPIFY_ACCESS_TOKEN');
  process.exit(1);
}

const imagePath = process.argv[2] || path.join(process.env.HOME, 'Desktop/ShelzysDesigns/bd9acee0-943c-4865-b0e7-90688d28f08e.png');
const productId = process.argv[3] || '14959320990064'; // Digital Planner product ID

if (!fs.existsSync(imagePath)) {
  console.error('Image not found: ' + imagePath);
  process.exit(1);
}

const API_VERSION = '2024-01';

async function uploadImage() {
  console.log('');
  console.log('Uploading image to product...');
  console.log('Image: ' + imagePath);
  console.log('Product ID: ' + productId);
  console.log('');

  // Read image and convert to base64
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const filename = path.basename(imagePath);

  const imageData = {
    image: {
      attachment: base64Image,
      filename: filename,
      position: 1
    }
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(imageData);

    const options = {
      hostname: STORE_URL,
      port: 443,
      path: '/admin/api/' + API_VERSION + '/products/' + productId + '/images.json',
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('[OK] Image uploaded successfully!');
            console.log('Image ID: ' + data.image.id);
            console.log('URL: ' + data.image.src);
            resolve(data);
          } else {
            console.log('[FAIL] Status: ' + res.statusCode);
            console.log(JSON.stringify(data, null, 2));
            reject(new Error('Upload failed'));
          }
        } catch (e) {
          console.log('[FAIL] ' + body);
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

uploadImage()
  .then(() => {
    console.log('');
    console.log('View product: https://shelzysdesigns.com/products/modern-wedding-planner-kit-digital-download');
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
