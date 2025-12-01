#!/usr/bin/env node

/**
 * Shelzy's Designs - Create Bulk Orders Page
 *
 * Creates the Bulk Orders page with the correct template assignment
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const API_VERSION = '2024-01';

if (!ACCESS_TOKEN || ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN') {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN');
  process.exit(1);
}

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

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  📄 SHELZY\'S DESIGNS - CREATE BULK ORDERS PAGE                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Check if page already exists
  console.log('📋 Checking for existing Bulk Orders page...');
  const pagesResponse = await apiRequest('GET', '/pages.json');

  if (pagesResponse.status !== 200) {
    console.error('❌ Failed to fetch pages:', pagesResponse.data);
    process.exit(1);
  }

  const existingPage = pagesResponse.data.pages.find(p =>
    p.handle === 'bulk-orders' ||
    p.title.toLowerCase().includes('bulk') ||
    p.title.toLowerCase().includes('corporate')
  );

  if (existingPage) {
    console.log(`   Found existing page: "${existingPage.title}" (handle: ${existingPage.handle})`);
    console.log('');

    // Update existing page with the template
    console.log('📝 Updating page to use bulk-corporate template...');
    const updateResponse = await apiRequest('PUT', `/pages/${existingPage.id}.json`, {
      page: {
        id: existingPage.id,
        template_suffix: 'bulk-corporate'
      }
    });

    if (updateResponse.status === 200) {
      console.log('   ✅ Page updated successfully!');
      console.log('');
      console.log(`   📍 URL: https://shelzysdesigns.com/pages/${existingPage.handle}`);
    } else {
      console.log('   ❌ Failed to update:', updateResponse.data);
    }
  } else {
    // Create new page
    console.log('   No existing page found.');
    console.log('');
    console.log('📝 Creating new Bulk Orders page...');

    const createResponse = await apiRequest('POST', '/pages.json', {
      page: {
        title: 'Bulk & Corporate Orders',
        handle: 'bulk-orders',
        template_suffix: 'bulk-corporate',
        body_html: '', // Content comes from the template
        published: true
      }
    });

    if (createResponse.status === 201 || createResponse.status === 200) {
      const newPage = createResponse.data.page;
      console.log('   ✅ Page created successfully!');
      console.log('');
      console.log(`   📍 Title: ${newPage.title}`);
      console.log(`   📍 Handle: ${newPage.handle}`);
      console.log(`   📍 Template: page.bulk-corporate`);
      console.log(`   📍 URL: https://shelzysdesigns.com/pages/${newPage.handle}`);
    } else {
      console.log('   ❌ Failed to create page:', JSON.stringify(createResponse.data, null, 2));
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ BULK ORDERS PAGE SETUP COMPLETE                            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('🔗 View: https://shelzysdesigns.com/pages/bulk-orders');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
