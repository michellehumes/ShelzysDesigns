#!/usr/bin/env node

/**
 * Shelzy's Designs - Fix Bulk Orders Page
 *
 * Diagnoses and fixes the Bulk Orders page issue:
 * 1. Lists ALL pages to find the actual handle
 * 2. Ensures the page is published
 * 3. Fixes the handle if needed
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

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔍 BULK ORDERS PAGE DIAGNOSTIC & FIX                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Step 1: Get ALL pages
  console.log('📋 STEP 1: Listing ALL pages in your store...');
  console.log('');

  const pagesResponse = await apiRequest('GET', '/pages.json?limit=250');

  if (pagesResponse.status !== 200) {
    console.error('❌ Failed to fetch pages:', pagesResponse.data);
    process.exit(1);
  }

  const pages = pagesResponse.data.pages;
  console.log(`   Found ${pages.length} pages total:`);
  console.log('');
  console.log('   ┌─────────────────────────────────────────────────────────────────┐');
  console.log('   │ ID          │ Handle                │ Title                     │');
  console.log('   ├─────────────────────────────────────────────────────────────────┤');

  pages.forEach(page => {
    const id = String(page.id).padEnd(11);
    const handle = (page.handle || 'N/A').substring(0, 21).padEnd(21);
    const title = (page.title || 'N/A').substring(0, 25).padEnd(25);
    const published = page.published_at ? '✅' : '❌';
    console.log(`   │ ${id} │ ${handle} │ ${title} │ ${published}`);
  });
  console.log('   └─────────────────────────────────────────────────────────────────┘');
  console.log('');

  // Step 2: Find bulk-related pages
  console.log('📋 STEP 2: Looking for bulk/corporate related pages...');
  console.log('');

  const bulkRelated = pages.filter(p =>
    p.handle?.toLowerCase().includes('bulk') ||
    p.handle?.toLowerCase().includes('corporate') ||
    p.handle?.toLowerCase().includes('wholesale') ||
    p.title?.toLowerCase().includes('bulk') ||
    p.title?.toLowerCase().includes('corporate') ||
    p.title?.toLowerCase().includes('wholesale')
  );

  if (bulkRelated.length === 0) {
    console.log('   ⚠️  No bulk/corporate pages found!');
    console.log('');
    console.log('   Creating new Bulk Orders page...');

    const createResponse = await apiRequest('POST', '/pages.json', {
      page: {
        title: 'Bulk & Corporate Orders',
        handle: 'bulk-orders',
        body_html: '',
        template_suffix: 'bulk-corporate',
        published: true
      }
    });

    if (createResponse.status === 201 || createResponse.status === 200) {
      const newPage = createResponse.data.page;
      console.log('   ✅ Page created!');
      console.log(`      ID: ${newPage.id}`);
      console.log(`      Handle: ${newPage.handle}`);
      console.log(`      URL: https://shelzysdesigns.com/pages/${newPage.handle}`);
    } else {
      console.log('   ❌ Failed to create page:', JSON.stringify(createResponse.data, null, 2));
    }
  } else {
    console.log(`   Found ${bulkRelated.length} related page(s):`);
    console.log('');

    for (const page of bulkRelated) {
      console.log(`   📄 "${page.title}"`);
      console.log(`      ID: ${page.id}`);
      console.log(`      Handle: ${page.handle}`);
      console.log(`      Published: ${page.published_at ? 'Yes ✅' : 'No ❌'}`);
      console.log(`      Template: ${page.template_suffix || 'default'}`);
      console.log(`      URL: https://shelzysdesigns.com/pages/${page.handle}`);
      console.log('');

      // Fix issues
      const needsFix =
        page.handle !== 'bulk-orders' ||
        !page.published_at ||
        page.template_suffix !== 'bulk-corporate';

      if (needsFix) {
        console.log('   🔧 Fixing issues...');

        const updateData = {
          page: {
            id: page.id,
            published: true
          }
        };

        // Only change handle if it's wrong
        if (page.handle !== 'bulk-orders') {
          updateData.page.handle = 'bulk-orders';
          console.log(`      - Changing handle from "${page.handle}" to "bulk-orders"`);
        }

        // Set template
        if (page.template_suffix !== 'bulk-corporate') {
          updateData.page.template_suffix = 'bulk-corporate';
          console.log(`      - Setting template to "bulk-corporate"`);
        }

        // Ensure published
        if (!page.published_at) {
          console.log(`      - Publishing page`);
        }

        const updateResponse = await apiRequest('PUT', `/pages/${page.id}.json`, updateData);

        if (updateResponse.status === 200) {
          const updated = updateResponse.data.page;
          console.log('');
          console.log('   ✅ Page fixed!');
          console.log(`      New URL: https://shelzysdesigns.com/pages/${updated.handle}`);
        } else {
          console.log('   ❌ Failed to update:', JSON.stringify(updateResponse.data, null, 2));
        }
      } else {
        console.log('   ✅ Page looks correct!');
      }
    }
  }

  // Step 3: Verify the page is accessible
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 STEP 3: Final verification...');
  console.log('');

  // Re-fetch to confirm
  const verifyResponse = await apiRequest('GET', '/pages.json?handle=bulk-orders');

  if (verifyResponse.status === 200 && verifyResponse.data.pages.length > 0) {
    const page = verifyResponse.data.pages[0];
    console.log('   ✅ "bulk-orders" page exists');
    console.log(`      Published: ${page.published_at ? 'Yes' : 'No'}`);
    console.log(`      Template: ${page.template_suffix || 'default'}`);
    console.log('');
    console.log('   🔗 Public URL: https://shelzysdesigns.com/pages/bulk-orders');
  } else {
    console.log('   ⚠️  No page with handle "bulk-orders" found after fixes.');
    console.log('      This might mean the handle was already taken or there was an API error.');
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ DIAGNOSTIC COMPLETE                                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('If the page still shows 404, check:');
  console.log('  1. Clear your browser cache or try incognito');
  console.log('  2. Wait 1-2 minutes for Shopify CDN to update');
  console.log('  3. Check Online Store → Pages in Shopify Admin');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
