#!/usr/bin/env node

/**
 * EMBED BLOG IMAGES
 * =================
 * Adds images directly into blog post HTML content
 * This bypasses the Shopify image API issues
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
  section: (msg) => console.log(`\n\x1b[35m${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}\x1b[0m\n`)
};

// Blog images mapped by handle - using reliable Unsplash URLs
const BLOG_IMAGES = {
  'best-bridesmaid-gift-ideas-2025': {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    alt: 'Bridesmaids celebrating together'
  },
  'wedding-planning-essentials-checklist': {
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    alt: 'Wedding planning essentials'
  },
  'best-kids-water-bottles-school-2025': {
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    alt: 'Kids at school'
  },
  'how-to-plan-perfect-bridal-shower': {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
    alt: 'Bridal shower celebration'
  },
  'personalized-gifts-that-get-used': {
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80',
    alt: 'Beautiful gift boxes'
  },
  'vinyl-vs-sublimation-difference': {
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80',
    alt: 'Water bottle comparison'
  },
  'sublimation-vs-vinyl-why-products-peel': {
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80',
    alt: 'Sublimation vs vinyl comparison'
  },
  'corporate-gift-ideas-employees-love': {
    url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80',
    alt: 'Corporate team gifts'
  },
  'bachelorette-party-planning-guide': {
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    alt: 'Bachelorette party celebration'
  },
  'hydration-benefits-science-backed': {
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80',
    alt: 'Healthy hydration'
  },
  'holiday-gift-guide-personalized-gifts-2025': {
    url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=1200&q=80',
    alt: 'Holiday gifts'
  },
  'bridal-shower-ideas-party-favors': {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
    alt: 'Bridal shower party'
  },
  'meal-prep-beginners-guide': {
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
    alt: 'Healthy meal prep'
  },
  'teacher-appreciation-gift-ideas': {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80',
    alt: 'Teacher appreciation'
  },
  'sustainable-living-simple-swaps': {
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
    alt: 'Sustainable living'
  }
};

const DEFAULT_IMAGE = {
  url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80',
  alt: 'Personalized water bottle'
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

// Create featured image HTML
function createFeaturedImageHtml(imageData) {
  return `<div class="blog-featured-image" style="margin-bottom: 30px; text-align: center;">
  <img src="${imageData.url}" alt="${imageData.alt}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" loading="lazy">
</div>

`;
}

// Check if article already has an embedded image at the start
function hasEmbeddedImage(bodyHtml) {
  if (!bodyHtml) return false;
  const trimmed = bodyHtml.trim();
  return trimmed.startsWith('<div class="blog-featured-image"') ||
         trimmed.startsWith('<img') ||
         trimmed.includes('blog-featured-image');
}

async function main() {
  log.section('EMBEDDING IMAGES INTO BLOG POSTS');

  if (!CONFIG.accessToken) {
    log.error('SHOPIFY_ACCESS_TOKEN not set!');
    process.exit(1);
  }

  try {
    // Get all blogs
    log.info('Fetching blogs...');
    const blogsResult = await shopifyRequest('GET', '/blogs.json');
    const blogs = blogsResult.blogs || [];
    log.info(`Found ${blogs.length} blogs`);

    let totalUpdated = 0;

    for (const blog of blogs) {
      log.info(`\nProcessing blog: ${blog.title}`);

      // Get all articles
      const articlesResult = await shopifyRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
      const articles = articlesResult.articles || [];
      log.info(`Found ${articles.length} articles`);

      for (const article of articles) {
        // Check if already has embedded image
        if (hasEmbeddedImage(article.body_html)) {
          log.info(`✓ ${article.title} - already has embedded image`);
          continue;
        }

        // Get image for this article
        const imageData = BLOG_IMAGES[article.handle] || DEFAULT_IMAGE;

        // Create new body with image at top
        const imageHtml = createFeaturedImageHtml(imageData);
        const newBodyHtml = imageHtml + (article.body_html || '');

        log.info(`Adding image to: ${article.title}`);

        try {
          await shopifyRequest('PUT', `/blogs/${blog.id}/articles/${article.id}.json`, {
            article: {
              id: article.id,
              body_html: newBodyHtml
            }
          });
          log.success(`Added image to: ${article.title}`);
          totalUpdated++;
        } catch (e) {
          log.error(`Failed: ${e.message}`);
        }

        await delay(500); // Rate limiting
      }
    }

    log.section('COMPLETE');
    log.success(`Updated ${totalUpdated} articles with embedded images`);
    console.log('\nRefresh your blog to see the images!');

  } catch (e) {
    log.error(`Fatal error: ${e.message}`);
    process.exit(1);
  }
}

main();
