#!/usr/bin/env node

/**
 * Shelzy's Designs - Remove Blog Completely
 * 
 * This script:
 * 1. Creates redirects for all blog URLs
 * 2. Deletes all blog posts
 * 3. Deletes the blog itself
 * 
 * Usage:
 *   export SHOPIFY_STORE_URL="shelzysdesigns.myshopify.com"
 *   export SHOPIFY_ACCESS_TOKEN="shpat_xxxxx"
 *   node remove-blog-completely.js
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-01';

if (!ACCESS_TOKEN || !STORE_URL) {
  console.error('❌ Missing credentials!\n');
  console.error('Run these commands first:');
  console.error('  export SHOPIFY_STORE_URL="shelzysdesigns.myshopify.com"');
  console.error('  export SHOPIFY_ACCESS_TOKEN="shpat_xxxxx"\n');
  console.error('To get your access token:');
  console.error('1. Go to Shopify Admin > Settings > Apps and sales channels');
  console.error('2. Click "Develop apps" > "Create an app"');
  console.error('3. Configure Admin API scopes: read_content, write_content, read_online_store_navigation, write_online_store_navigation');
  console.error('4. Install app and copy the Admin API access token');
  process.exit(1);
}

function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Blog URL to collection redirects
const REDIRECTS = [
  { path: '/blogs/news', target: '/collections/all' },
  { path: '/blogs/news/best-bridesmaid-gift-ideas-2025', target: '/collections/bridesmaid-bridal' },
  { path: '/blogs/news/what-to-put-in-a-bridesmaid-proposal-box-2025-guide', target: '/collections/proposal-gift-boxes' },
  { path: '/blogs/news/the-ultimate-bridesmaid-proposal-guide', target: '/collections/proposal-gift-boxes' },
  { path: '/blogs/news/how-to-ask-bridesmaids-proposal-ideas', target: '/collections/proposal-gift-boxes' },
  { path: '/blogs/news/best-kids-water-bottles-school-2025', target: '/products/kids-personalized-bottle' },
  { path: '/blogs/news/holiday-gift-guide-personalized-gifts-2025', target: '/collections/holiday' },
  { path: '/blogs/news/corporate-gift-ideas-employees-love', target: '/pages/bulk-corporate' },
  { path: '/blogs/news/sublimation-vs-vinyl-why-products-peel', target: '/pages/how-it-works' },
];

async function main() {
  console.log('🗑️  Shelzy\'s Designs - Remove Blog Completely\n');
  console.log(`Store: ${STORE_URL}\n`);

  // Step 1: Create redirects
  console.log('📍 Step 1: Creating redirects...');
  for (const redirect of REDIRECTS) {
    try {
      await apiRequest('POST', '/redirects.json', {
        redirect: { path: redirect.path, target: redirect.target }
      });
      console.log(`   ✅ ${redirect.path} → ${redirect.target}`);
      await sleep(500); // Rate limiting
    } catch (err) {
      console.log(`   ⚠️  ${redirect.path} (may already exist)`);
    }
  }

  // Step 2: Get all blogs
  console.log('\n📚 Step 2: Finding blogs...');
  const blogsResponse = await apiRequest('GET', '/blogs.json');
  const blogs = blogsResponse.blogs || [];
  console.log(`   Found ${blogs.length} blog(s)`);

  // Step 3: Delete all articles from each blog
  console.log('\n📝 Step 3: Deleting blog posts...');
  for (const blog of blogs) {
    console.log(`   Blog: ${blog.title} (ID: ${blog.id})`);
    
    // Get all articles
    const articlesResponse = await apiRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);
    const articles = articlesResponse.articles || [];
    console.log(`   Found ${articles.length} article(s)`);
    
    // Delete each article
    for (const article of articles) {
      try {
        await apiRequest('DELETE', `/blogs/${blog.id}/articles/${article.id}.json`);
        console.log(`   ✅ Deleted: ${article.title}`);
        await sleep(500);
      } catch (err) {
        console.log(`   ❌ Failed to delete: ${article.title}`);
      }
    }
  }

  // Step 4: Delete the blogs
  console.log('\n🗑️  Step 4: Deleting blogs...');
  for (const blog of blogs) {
    try {
      await apiRequest('DELETE', `/blogs/${blog.id}.json`);
      console.log(`   ✅ Deleted blog: ${blog.title}`);
    } catch (err) {
      console.log(`   ❌ Failed to delete blog: ${blog.title} - ${err.message}`);
    }
  }

  console.log('\n✅ Done! Blog has been removed.\n');
  console.log('Next steps:');
  console.log('1. Go to Shopify Admin > Online Store > Navigation');
  console.log('2. Remove any remaining blog links from menus');
}

main().catch(console.error);
