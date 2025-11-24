#!/usr/bin/env node

/**
 * MASTER DEPLOYMENT SCRIPT
 * Deploys all improvements to Shopify store
 *
 * Usage:
 *   1. Copy .env.example to .env
 *   2. Add your Shopify credentials
 *   3. Run: node deploy-all.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config?.() || loadEnvManually();

function loadEnvManually() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  } catch (e) {
    // .env file doesn't exist
  }
}

const STORE_URL = process.env.SHOPIFY_STORE_URL;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-01';

// Validate credentials
if (!ACCESS_TOKEN || ACCESS_TOKEN.includes('your_token') || !STORE_URL) {
  console.error('❌ Missing Shopify credentials!');
  console.error('');
  console.error('Please create a .env file with:');
  console.error('  SHOPIFY_STORE_URL=shelzysdesigns.myshopify.com');
  console.error('  SHOPIFY_ACCESS_TOKEN=shpat_xxxxx');
  console.error('');
  console.error('Get your token from: Shopify Admin → Settings → Apps → Develop apps');
  process.exit(1);
}

console.log('🚀 SHELZY\'S DESIGNS - MASTER DEPLOYMENT');
console.log('=========================================\n');
console.log(`Store: ${STORE_URL}`);
console.log('');

// API Helper
function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method: method,
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

// Delay helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// DEPLOYMENT TASKS
// ============================================

// Task 1: Create/Update Pages
async function deployPages() {
  console.log('📄 DEPLOYING PAGES...\n');

  const pages = [
    {
      title: 'Bridesmaid Gift Guide',
      handle: 'bridesmaid-gift-guide',
      body_html: fs.readFileSync(path.join(__dirname, 'shopify/pages/bridesmaid-gift-guide.html'), 'utf8')
    },
    {
      title: 'Corporate Gift Solutions',
      handle: 'corporate-gifts',
      body_html: fs.readFileSync(path.join(__dirname, 'shopify/pages/corporate-gift-solutions.html'), 'utf8')
    }
  ];

  for (const page of pages) {
    console.log(`   Creating: ${page.title}`);

    // Check if page exists
    const existing = await apiRequest('GET', `/pages.json?handle=${page.handle}`);

    if (existing.data.pages && existing.data.pages.length > 0) {
      // Update existing
      const pageId = existing.data.pages[0].id;
      const result = await apiRequest('PUT', `/pages/${pageId}.json`, { page });
      if (result.status === 200) {
        console.log(`   ✅ Updated: ${page.title}`);
      } else {
        console.log(`   ❌ Failed to update: ${JSON.stringify(result.data.errors || result.data)}`);
      }
    } else {
      // Create new
      const result = await apiRequest('POST', '/pages.json', { page });
      if (result.status === 201) {
        console.log(`   ✅ Created: ${page.title}`);
      } else {
        console.log(`   ❌ Failed to create: ${JSON.stringify(result.data.errors || result.data)}`);
      }
    }

    await delay(500);
  }

  console.log('');
}

// Task 2: Deploy Blog Posts
async function deployBlogPosts() {
  console.log('📝 DEPLOYING BLOG POSTS...\n');

  // Get blog ID
  const blogsResponse = await apiRequest('GET', '/blogs.json');

  if (blogsResponse.status !== 200 || !blogsResponse.data.blogs?.length) {
    // Create a blog if none exists
    console.log('   Creating blog...');
    const createBlog = await apiRequest('POST', '/blogs.json', {
      blog: { title: 'News', commentable: 'no' }
    });
    if (createBlog.status !== 201) {
      console.log('   ❌ Could not create blog');
      return;
    }
  }

  const blogId = blogsResponse.data.blogs?.[0]?.id || (await apiRequest('GET', '/blogs.json')).data.blogs[0].id;
  console.log(`   Using blog ID: ${blogId}\n`);

  const posts = [
    {
      title: "12 Amazon Beauty Must-Haves Under $30 (2025)",
      handle: "amazon-beauty-must-haves-under-30",
      tags: "amazon beauty, skincare, beauty tools, viral beauty, affordable beauty",
      body_html: `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<p>TikTok has us adding everything to our Amazon carts—but which viral beauty products are actually worth it?</p>
<h2>1. Ice Roller for Face - $8-15</h2>
<p>Pop it in the freezer, then roll it on your face to depuff and wake up your skin.</p>
<p><a href="https://www.amazon.com/s?k=ice+roller+for+face&tag=shelzysdesigns-20" target="_blank">Shop Ice Rollers on Amazon</a></p>
<h2>2. Gua Sha Stone - $10-20</h2>
<p>Sculpts your jawline and promotes lymphatic drainage.</p>
<p><a href="https://www.amazon.com/s?k=gua+sha+stone&tag=shelzysdesigns-20" target="_blank">Shop Gua Sha on Amazon</a></p>
<h2>3. Hyaluronic Acid Serum - $12-25</h2>
<p>The secret to dewy "glass skin."</p>
<p><a href="https://www.amazon.com/s?k=hyaluronic+acid+serum&tag=shelzysdesigns-20" target="_blank">Shop Serums on Amazon</a></p>
<h2>4. LED Face Mask - $25-30</h2>
<p>Red light for wrinkles, blue light for acne.</p>
<p><a href="https://www.amazon.com/s?k=led+face+mask&tag=shelzysdesigns-20" target="_blank">Shop LED Masks on Amazon</a></p>
<h2>5. Scalp Massager - $6-12</h2>
<p>Transforms your shower routine and stimulates hair growth.</p>
<p><a href="https://www.amazon.com/s?k=scalp+massager+shampoo+brush&tag=shelzysdesigns-20" target="_blank">Shop Scalp Massagers on Amazon</a></p>
<hr>
<p><em>This post contains affiliate links. Thank you for supporting Shelzy's Designs!</em></p>`
    },
    {
      title: "15 Viral Amazon Organization Finds (2025)",
      handle: "viral-amazon-organization-finds-2025",
      tags: "organization, amazon finds, home organization, viral products",
      body_html: `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<p>These viral organization products actually live up to the hype!</p>
<h2>1. Clear Stackable Bins - $25-35</h2>
<p><a href="https://www.amazon.com/s?k=clear+stackable+bins+fridge&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>2. Under Sink Organizer - $20-40</h2>
<p><a href="https://www.amazon.com/s?k=under+sink+organizer&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>3. Rotating Makeup Organizer - $20-30</h2>
<p><a href="https://www.amazon.com/s?k=rotating+makeup+organizer&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>4. Drawer Dividers - $15-25</h2>
<p><a href="https://www.amazon.com/s?k=expandable+drawer+dividers&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>5. Lazy Susan Turntable - $15-20</h2>
<p><a href="https://www.amazon.com/s?k=lazy+susan+turntable&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<hr>
<p><em>Affiliate disclosure: Thank you for supporting Shelzy's Designs!</em></p>`
    },
    {
      title: "15 Work From Home Office Must-Haves (2025)",
      handle: "work-from-home-office-must-haves-amazon",
      tags: "home office, work from home, productivity, amazon finds",
      body_html: `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<h2>1. Laptop Stand - $20-35</h2>
<p><a href="https://www.amazon.com/s?k=laptop+stand+adjustable&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>2. Lumbar Support Pillow - $25-40</h2>
<p><a href="https://www.amazon.com/s?k=lumbar+support+pillow&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>3. LED Desk Lamp - $25-45</h2>
<p><a href="https://www.amazon.com/s?k=led+desk+lamp&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>4. Ring Light - $20-35</h2>
<p><a href="https://www.amazon.com/s?k=ring+light+desk&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>5. Blue Light Glasses - $15-25</h2>
<p><a href="https://www.amazon.com/s?k=blue+light+blocking+glasses&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<hr>
<p><em>Affiliate disclosure: Thank you for supporting Shelzy's Designs!</em></p>`
    },
    {
      title: "20 Amazon Travel Essentials (2025)",
      handle: "amazon-travel-essentials-2025",
      tags: "travel essentials, packing, amazon finds, vacation",
      body_html: `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<h2>1. Packing Cubes - $15-25</h2>
<p><a href="https://www.amazon.com/s?k=packing+cubes&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>2. Travel Jewelry Organizer - $15-25</h2>
<p><a href="https://www.amazon.com/s?k=travel+jewelry+organizer&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>3. Neck Pillow - $20-35</h2>
<p><a href="https://www.amazon.com/s?k=travel+neck+pillow&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>4. Portable Charger - $20-35</h2>
<p><a href="https://www.amazon.com/s?k=portable+charger&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>5. Compression Socks - $15-25</h2>
<p><a href="https://www.amazon.com/s?k=compression+socks+flying&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<hr>
<p><em>Affiliate disclosure: Thank you for supporting Shelzy's Designs!</em></p>`
    },
    {
      title: "15 Amazon Fitness & Wellness Finds (2025)",
      handle: "amazon-fitness-wellness-finds-2025",
      tags: "fitness, wellness, workout, self-care, amazon finds",
      body_html: `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<h2>1. Resistance Bands - $10-25</h2>
<p><a href="https://www.amazon.com/s?k=resistance+bands+set&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>2. Yoga Mat - $20-35</h2>
<p><a href="https://www.amazon.com/s?k=yoga+mat+thick&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>3. Foam Roller - $15-30</h2>
<p><a href="https://www.amazon.com/s?k=foam+roller&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>4. Massage Gun - $30-60</h2>
<p><a href="https://www.amazon.com/s?k=massage+gun&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>5. Fitness Tracker - $30-60</h2>
<p><a href="https://www.amazon.com/s?k=fitness+tracker&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<hr>
<p><em>Affiliate disclosure: Thank you for supporting Shelzy's Designs!</em></p>`
    },
    {
      title: "15 Amazon Dog Mom Essentials (2025)",
      handle: "amazon-dog-mom-essentials-2025",
      tags: "dog mom, pet essentials, amazon finds, dog products",
      body_html: `<p><em>Last Updated: November 2025 | This post contains affiliate links.</em></p>
<h2>1. Self-Cleaning Slicker Brush - $12-20</h2>
<p><a href="https://www.amazon.com/s?k=self+cleaning+slicker+brush&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>2. Paw Cleaner - $10-18</h2>
<p><a href="https://www.amazon.com/s?k=dog+paw+cleaner&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>3. No-Pull Harness - $20-35</h2>
<p><a href="https://www.amazon.com/s?k=no+pull+dog+harness&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>4. Portable Water Bottle - $12-20</h2>
<p><a href="https://www.amazon.com/s?k=portable+water+bottle+dogs&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<h2>5. Orthopedic Dog Bed - $30-60</h2>
<p><a href="https://www.amazon.com/s?k=orthopedic+dog+bed&tag=shelzysdesigns-20" target="_blank">Shop on Amazon</a></p>
<hr>
<p><em>Affiliate disclosure: Thank you for supporting Shelzy's Designs!</em></p>`
    }
  ];

  let published = 0;
  for (const post of posts) {
    console.log(`   Publishing: ${post.title}`);

    const result = await apiRequest('POST', `/blogs/${blogId}/articles.json`, {
      article: {
        title: post.title,
        handle: post.handle,
        body_html: post.body_html,
        tags: post.tags,
        published: true
      }
    });

    if (result.status === 201 || result.status === 200) {
      console.log(`   ✅ Published!`);
      published++;
    } else if (result.data.errors?.handle) {
      console.log(`   ⏭️  Already exists, skipping`);
    } else {
      console.log(`   ❌ Failed: ${JSON.stringify(result.data.errors || result.data)}`);
    }

    await delay(500);
  }

  console.log(`\n   Published ${published} new blog posts\n`);
}

// Task 3: Show Manual Steps
function showManualSteps() {
  console.log('📋 MANUAL STEPS REQUIRED:\n');
  console.log('   The following need to be done in Shopify Admin:\n');

  console.log('   1. THEME CUSTOMIZATION');
  console.log('      → Online Store → Themes → Customize');
  console.log('      → Add conversion-optimized-hero section to homepage');
  console.log('      → Add exit-intent-popup snippet to theme.liquid');
  console.log('      → Add schema-markup snippet to theme.liquid <head>\n');

  console.log('   2. INSTALL APPS');
  console.log('      → Klaviyo (email marketing) - FREE to start');
  console.log('      → Bold Product Options ($20/mo) - live preview');
  console.log('      → Judge.me (reviews) - FREE tier available\n');

  console.log('   3. ENABLE ABANDONED CART EMAILS');
  console.log('      → Settings → Checkout → Customer contact');
  console.log('      → Enable abandoned checkout emails\n');

  console.log('   4. NAVIGATION');
  console.log('      → Online Store → Navigation');
  console.log('      → Add "Gift Guide" → /pages/bridesmaid-gift-guide');
  console.log('      → Add "Corporate" → /pages/corporate-gifts\n');
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  try {
    // Deploy pages
    await deployPages();

    // Deploy blog posts
    await deployBlogPosts();

    // Show manual steps
    showManualSteps();

    console.log('=========================================');
    console.log('🎉 DEPLOYMENT COMPLETE!');
    console.log('=========================================\n');
    console.log('Next steps:');
    console.log('1. Review deployed pages at shelzysdesigns.com/pages/');
    console.log('2. Review blog posts at shelzysdesigns.com/blogs/news/');
    console.log('3. Complete manual steps listed above');
    console.log('4. Set up Klaviyo with email templates from /marketing/\n');

  } catch (error) {
    console.error('❌ Deployment error:', error.message);
    process.exit(1);
  }
}

main();
