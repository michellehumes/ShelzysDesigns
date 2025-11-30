#!/usr/bin/env node

/**
 * IMAGE UPLOAD SCRIPT FOR SHELZY'S DESIGNS
 * =========================================
 * Uploads stock images to Shopify products and blog posts
 *
 * Usage:
 *   node shopify/scripts/upload-images.js
 *
 * Environment Variables:
 *   SHOPIFY_STORE_URL - Your Shopify store URL
 *   SHOPIFY_ACCESS_TOKEN - Admin API access token
 */

const https = require('https');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

// Royalty-free stock images for water bottles and related content
// Using Unsplash source URLs (free to use)
const STOCK_IMAGES = {
  // Water bottle images
  waterBottle: [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', // water bottle
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80', // water bottle lifestyle
    'https://images.unsplash.com/photo-1553531384-411a247ccd73?w=800&q=80', // reusable bottle
  ],
  // Bridesmaid/wedding images
  bridal: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', // bridesmaids
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80', // wedding party
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', // wedding celebration
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', // wedding gifts
  ],
  // Gift box images
  giftBox: [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80', // gift box
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80', // gift wrapping
    'https://images.unsplash.com/photo-1607469256872-48074e807b0d?w=800&q=80', // present
  ],
  // Kids/school images
  kids: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', // school supplies
    'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80', // kids school
    'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80', // backpack
  ],
  // Holiday images
  holiday: [
    'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&q=80', // holiday gifts
    'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80', // christmas
    'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80', // holiday decor
  ],
  // Blog post images
  blog: {
    'best-bridesmaid-gift-ideas-2025': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    'wedding-planning-essentials-checklist': 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    'best-kids-water-bottles-school-2025': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    'how-to-plan-perfect-bridal-shower': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
    'personalized-gifts-that-get-used': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80',
    'vinyl-vs-sublimation-difference': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80',
  }
};

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  section: (msg) => console.log(`\n\x1b[35m${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}\x1b[0m\n`)
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
        try {
          const result = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${body.substring(0, 300)}`));
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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all products
async function getProducts() {
  try {
    const response = await shopifyRequest('GET', '/products.json?limit=250');
    return response.products || [];
  } catch (e) {
    log.error(`Failed to get products: ${e.message}`);
    return [];
  }
}

// Get all blog articles
async function getBlogArticles() {
  try {
    const blogs = await shopifyRequest('GET', '/blogs.json');
    const articles = [];

    for (const blog of (blogs.blogs || [])) {
      const articlesResponse = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json`);
      for (const article of (articlesResponse.articles || [])) {
        articles.push({ ...article, blog_id: blog.id });
      }
    }

    return articles;
  } catch (e) {
    log.error(`Failed to get articles: ${e.message}`);
    return [];
  }
}

// Add image to product
async function addProductImage(productId, imageUrl, position = 1) {
  try {
    await shopifyRequest('POST', `/products/${productId}/images.json`, {
      image: {
        src: imageUrl,
        position: position
      }
    });
    return true;
  } catch (e) {
    log.error(`Failed to add image to product ${productId}: ${e.message}`);
    return false;
  }
}

// Update blog article with featured image
async function updateArticleImage(blogId, articleId, imageUrl) {
  try {
    await shopifyRequest('PUT', `/blogs/${blogId}/articles/${articleId}.json`, {
      article: {
        id: articleId,
        image: {
          src: imageUrl
        }
      }
    });
    return true;
  } catch (e) {
    log.error(`Failed to update article ${articleId}: ${e.message}`);
    return false;
  }
}

// Determine appropriate images based on product title/tags
function getImagesForProduct(product) {
  const title = (product.title || '').toLowerCase();
  const tags = (product.tags || '').toLowerCase();

  if (title.includes('kid') || tags.includes('kid')) {
    return STOCK_IMAGES.kids;
  } else if (title.includes('bridesmaid') || title.includes('bridal') || tags.includes('bridesmaid')) {
    return STOCK_IMAGES.bridal;
  } else if (title.includes('gift box') || title.includes('proposal')) {
    return STOCK_IMAGES.giftBox;
  } else if (title.includes('holiday') || tags.includes('holiday')) {
    return STOCK_IMAGES.holiday;
  } else {
    return STOCK_IMAGES.waterBottle;
  }
}

// Main function to upload images
async function uploadImages() {
  log.section('UPLOADING IMAGES TO SHOPIFY');

  // Get products without images
  log.info('Fetching products...');
  const products = await getProducts();
  log.info(`Found ${products.length} products`);

  let productsUpdated = 0;
  for (const product of products) {
    // Check if product has no images
    if (!product.images || product.images.length === 0) {
      log.info(`Adding images to: ${product.title}`);

      const images = getImagesForProduct(product);

      // Add up to 3 images
      for (let i = 0; i < Math.min(3, images.length); i++) {
        const success = await addProductImage(product.id, images[i], i + 1);
        if (success) {
          log.success(`Added image ${i + 1} to ${product.title}`);
        }
        await delay(500); // Rate limiting
      }
      productsUpdated++;
    } else {
      log.info(`${product.title} already has ${product.images.length} images`);
    }
  }

  log.info(`\nUpdated ${productsUpdated} products with images`);

  // Get blog articles without featured images
  log.section('UPDATING BLOG ARTICLE IMAGES');

  log.info('Fetching blog articles...');
  const articles = await getBlogArticles();
  log.info(`Found ${articles.length} articles`);

  let articlesUpdated = 0;
  for (const article of articles) {
    // Check if article needs a featured image
    if (!article.image) {
      const handle = article.handle;
      const imageUrl = STOCK_IMAGES.blog[handle];

      if (imageUrl) {
        log.info(`Adding featured image to: ${article.title}`);
        const success = await updateArticleImage(article.blog_id, article.id, imageUrl);
        if (success) {
          log.success(`Added featured image to ${article.title}`);
          articlesUpdated++;
        }
        await delay(500);
      } else {
        // Use a default blog image
        const defaultImage = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80';
        log.info(`Adding default image to: ${article.title}`);
        const success = await updateArticleImage(article.blog_id, article.id, defaultImage);
        if (success) {
          log.success(`Added default image to ${article.title}`);
          articlesUpdated++;
        }
        await delay(500);
      }
    } else {
      log.info(`${article.title} already has a featured image`);
    }
  }

  log.info(`\nUpdated ${articlesUpdated} articles with featured images`);

  // Summary
  log.section('IMAGE UPLOAD COMPLETE');
  console.log(`Products updated: ${productsUpdated}`);
  console.log(`Articles updated: ${articlesUpdated}`);
  console.log('\nNote: These are placeholder stock images.');
  console.log('For best results, replace with professional product photos.');
}

// Run
uploadImages().catch(e => {
  log.error(`Fatal error: ${e.message}`);
  process.exit(1);
});
