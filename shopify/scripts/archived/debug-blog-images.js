#!/usr/bin/env node

/**
 * DEBUG BLOG IMAGES
 * Check what's happening with blog articles and try different image upload methods
 */

const https = require('https');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

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
        console.log(`[${method}] ${endpoint} - Status: ${res.statusCode}`);
        try {
          const result = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            console.log('Error response:', body.substring(0, 500));
            reject(new Error(`API Error ${res.statusCode}`));
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

// Small test image - 1x1 pink pixel PNG
const TINY_TEST_IMAGE = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function main() {
  console.log('\n=== DEBUG BLOG IMAGES ===\n');

  if (!CONFIG.accessToken) {
    console.log('ERROR: SHOPIFY_ACCESS_TOKEN not set!');
    process.exit(1);
  }

  try {
    // Get blogs
    console.log('1. Fetching blogs...');
    const blogsResult = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResult.blogs || [];
    console.log(`   Found ${blogs.length} blogs:`);
    blogs.forEach(b => console.log(`   - ${b.title} (handle: ${b.handle}, id: ${b.id})`));

    if (blogs.length === 0) {
      console.log('No blogs found!');
      return;
    }

    // Get articles from first blog
    const blog = blogs[0];
    console.log(`\n2. Fetching articles from "${blog.title}"...`);
    const articlesResult = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=50`);
    const articles = articlesResult.articles || [];
    console.log(`   Found ${articles.length} articles:`);

    articles.forEach(a => {
      const hasImage = a.image ? '✓ has image' : '✗ NO IMAGE';
      console.log(`   - ${a.title} (${hasImage})`);
      if (a.image) {
        console.log(`     Image: ${a.image.src}`);
      }
    });

    // Try to update first article without image
    const articleWithoutImage = articles.find(a => !a.image);
    if (articleWithoutImage) {
      console.log(`\n3. Attempting to add image to: "${articleWithoutImage.title}"`);

      // Method 1: Try with src URL
      console.log('\n   Method 1: Using external URL...');
      try {
        await shopifyRequest('PUT', `/blogs/${blog.id}/articles/${articleWithoutImage.id}.json`, {
          article: {
            id: articleWithoutImage.id,
            image: {
              src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80'
            }
          }
        });
        console.log('   SUCCESS with URL method!');
      } catch (e) {
        console.log(`   FAILED: ${e.message}`);
      }

      // Check if it worked
      const checkResult = await shopifyRequest('GET', `/blogs/${blog.id}/articles/${articleWithoutImage.id}.json`);
      if (checkResult.article?.image) {
        console.log('   Image now exists!');
      } else {
        console.log('   Still no image. Trying Method 2...');

        // Method 2: Try with base64 attachment
        console.log('\n   Method 2: Using base64 attachment...');
        try {
          await shopifyRequest('PUT', `/blogs/${blog.id}/articles/${articleWithoutImage.id}.json`, {
            article: {
              id: articleWithoutImage.id,
              image: {
                attachment: TINY_TEST_IMAGE,
                filename: 'test-image.png'
              }
            }
          });
          console.log('   SUCCESS with base64 method!');
        } catch (e) {
          console.log(`   FAILED: ${e.message}`);
        }
      }

      // Final check
      const finalCheck = await shopifyRequest('GET', `/blogs/${blog.id}/articles/${articleWithoutImage.id}.json`);
      console.log(`\n4. Final check for "${articleWithoutImage.title}":`);
      console.log(`   Has image: ${finalCheck.article?.image ? 'YES' : 'NO'}`);
      if (finalCheck.article?.image) {
        console.log(`   Image URL: ${finalCheck.article.image.src}`);
      }
    } else {
      console.log('\n3. All articles already have images!');
    }

    console.log('\n=== DEBUG COMPLETE ===\n');

  } catch (e) {
    console.log(`\nFATAL ERROR: ${e.message}`);
    process.exit(1);
  }
}

main();
