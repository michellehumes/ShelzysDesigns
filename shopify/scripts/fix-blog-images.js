#!/usr/bin/env node

/**
 * FIX BLOG IMAGES
 * ================
 * Downloads images and uploads them to blog articles as base64
 * This bypasses issues with external URL rejection
 */

const https = require('https');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  section: (msg) => console.log(`\n\x1b[35m${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}\x1b[0m\n`)
};

// Blog images - using Unsplash with direct download URLs
const BLOG_IMAGES = {
  'best-bridesmaid-gift-ideas-2025': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'wedding-planning-essentials-checklist': 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
  'best-kids-water-bottles-school-2025': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  'how-to-plan-perfect-bridal-shower': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
  'personalized-gifts-that-get-used': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
  'vinyl-vs-sublimation-difference': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
  'sublimation-vs-vinyl-why-products-peel': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
  'corporate-gift-ideas-employees-love': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
  'bachelorette-party-planning-guide': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  'hydration-benefits-science-backed': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
  'holiday-gift-guide-personalized-gifts-2025': 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&q=80',
  'bridal-shower-ideas-party-favors': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
  'meal-prep-beginners-guide': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  'teacher-appreciation-gift-ideas': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  'sustainable-living-simple-swaps': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80';

// Download image and convert to base64
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const makeRequest = (requestUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }

      const parsedUrl = new URL(requestUrl);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ShopifyImageUploader/1.0)'
        }
      };

      https.get(options, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          makeRequest(res.headers.location, redirectCount + 1);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download: ${res.statusCode}`));
          return;
        }

        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString('base64');
          resolve(base64);
        });
        res.on('error', reject);
      }).on('error', reject);
    };

    makeRequest(url);
  });
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
            reject(new Error(`API Error ${res.statusCode}: ${body.substring(0, 500)}`));
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

async function getBlogs() {
  const result = await shopifyRequest('GET', '/blogs.json');
  return result.blogs || [];
}

async function getArticles(blogId) {
  const result = await shopifyRequest('GET', `/blogs/${blogId}/articles.json?limit=250`);
  return result.articles || [];
}

async function updateArticleWithBase64Image(blogId, articleId, base64Image) {
  return shopifyRequest('PUT', `/blogs/${blogId}/articles/${articleId}.json`, {
    article: {
      id: articleId,
      image: {
        attachment: base64Image
      }
    }
  });
}

async function main() {
  log.section('FIXING BLOG IMAGES');

  if (!CONFIG.accessToken) {
    log.error('SHOPIFY_ACCESS_TOKEN not set!');
    process.exit(1);
  }

  try {
    // Get all blogs
    log.info('Fetching blogs...');
    const blogs = await getBlogs();
    log.info(`Found ${blogs.length} blogs`);

    let totalUpdated = 0;

    for (const blog of blogs) {
      log.info(`\nProcessing blog: ${blog.title} (${blog.handle})`);

      const articles = await getArticles(blog.id);
      log.info(`Found ${articles.length} articles`);

      for (const article of articles) {
        // Check if article already has an image
        if (article.image) {
          log.info(`✓ ${article.title} - already has image`);
          continue;
        }

        // Get image URL for this article
        const imageUrl = BLOG_IMAGES[article.handle] || DEFAULT_IMAGE;
        log.info(`Downloading image for: ${article.title}`);

        try {
          // Download and convert to base64
          const base64Image = await downloadImage(imageUrl);
          log.info(`Downloaded image (${Math.round(base64Image.length / 1024)}KB)`);

          // Upload to Shopify
          log.info(`Uploading to article...`);
          await updateArticleWithBase64Image(blog.id, article.id, base64Image);
          log.success(`Added image to: ${article.title}`);
          totalUpdated++;

          await delay(1000); // Rate limiting
        } catch (e) {
          log.error(`Failed for ${article.title}: ${e.message}`);
        }
      }
    }

    log.section('COMPLETE');
    log.success(`Updated ${totalUpdated} articles with images`);

  } catch (e) {
    log.error(`Fatal error: ${e.message}`);
    process.exit(1);
  }
}

main();
