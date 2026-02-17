#!/usr/bin/env node

/**
 * Shelzy's Designs - Update Blog Post Authors
 *
 * Updates all blog posts to have author "Shelzy Perkins"
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const API_VERSION = '2024-01';

async function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📝 UPDATE BLOG POST AUTHORS TO "Shelzy Perkins"               ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Step 1: Get all blogs
  console.log('📋 Finding all blogs...');
  const blogsResponse = await apiRequest('GET', '/blogs.json');

  if (blogsResponse.status !== 200) {
    console.error('❌ Failed to fetch blogs:', blogsResponse.data);
    process.exit(1);
  }

  const blogs = blogsResponse.data.blogs;
  console.log(`   Found ${blogs.length} blog(s)`);
  console.log('');

  let totalUpdated = 0;

  // Step 2: For each blog, get all articles and update author
  for (const blog of blogs) {
    console.log(`📖 Blog: "${blog.title}" (ID: ${blog.id})`);

    // Get all articles in this blog
    const articlesResponse = await apiRequest('GET', `/blogs/${blog.id}/articles.json?limit=250`);

    if (articlesResponse.status !== 200) {
      console.log(`   ❌ Failed to fetch articles`);
      continue;
    }

    const articles = articlesResponse.data.articles;
    console.log(`   Found ${articles.length} article(s)`);

    for (const article of articles) {
      console.log(`   📄 "${article.title}"`);
      console.log(`      Current author: ${article.author || 'Not set'}`);

      // Update author to "Shelzy Perkins"
      if (article.author !== 'Shelzy Perkins') {
        const updateResponse = await apiRequest('PUT', `/blogs/${blog.id}/articles/${article.id}.json`, {
          article: {
            id: article.id,
            author: 'Shelzy Perkins'
          }
        });

        if (updateResponse.status === 200) {
          console.log(`      ✅ Updated to "Shelzy Perkins"`);
          totalUpdated++;
        } else {
          console.log(`      ❌ Failed to update: ${JSON.stringify(updateResponse.data?.errors || updateResponse.data)}`);
        }

        // Rate limiting
        await sleep(300);
      } else {
        console.log(`      ✓ Already set to "Shelzy Perkins"`);
      }
    }

    console.log('');
  }

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ BLOG AUTHOR UPDATE COMPLETE                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`   Total articles updated: ${totalUpdated}`);
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
