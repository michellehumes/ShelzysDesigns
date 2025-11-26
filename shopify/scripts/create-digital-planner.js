#!/usr/bin/env node

/**
 * Shelzy's Designs - Create Digital Wedding Planner Product
 *
 * Creates a digital download product on Shopify with:
 * - Product details and description
 * - No shipping required (digital product)
 * - Optional Fileflare integration for file attachment
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const FILEFLARE_TOKEN = process.env.FILEFLARE_TOKEN; // Optional
const ZIP_FILE_URL = process.env.ZIP_FILE_URL; // Optional - URL to your hosted file

if (!ACCESS_TOKEN) {
  console.error('Missing SHOPIFY_ACCESS_TOKEN environment variable');
  process.exit(1);
}

const API_VERSION = '2024-01';

function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
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

async function shopifyRequest(method, endpoint, data = null) {
  const options = {
    hostname: STORE_URL,
    port: 443,
    path: '/admin/api/' + API_VERSION + endpoint,
    method,
    headers: {
      'X-Shopify-Access-Token': ACCESS_TOKEN,
      'Content-Type': 'application/json'
    }
  };
  return httpsRequest(options, data);
}

async function fileflareRequest(method, endpoint, data = null) {
  const options = {
    hostname: 'app.digital-downloads.com',
    port: 443,
    path: '/api/v1' + endpoint,
    method,
    headers: {
      'Authorization': 'Bearer ' + FILEFLARE_TOKEN,
      'Content-Type': 'application/json'
    }
  };
  return httpsRequest(options, data);
}

// Product description HTML
const productDescription = `
<div class="digital-planner-description">
  <h3>Your Complete Wedding Planning Toolkit</h3>

  <p>Planning a wedding is exciting but overwhelming. Our <strong>Modern Wedding Planner Kit</strong> gives you everything you need to stay organized, on budget, and stress-free from engagement to "I do."</p>

  <h4>What's Included:</h4>
  <ul>
    <li><strong>Master Timeline</strong> - 12-month countdown checklist so you never miss a deadline</li>
    <li><strong>Budget Tracker</strong> - Track every expense, compare quotes, stay on budget</li>
    <li><strong>Guest List Manager</strong> - RSVPs, meal preferences, table assignments</li>
    <li><strong>Vendor Comparison Worksheets</strong> - Compare photographers, florists, caterers & more</li>
    <li><strong>Seating Chart Templates</strong> - Multiple layouts for any venue</li>
    <li><strong>Day-Of Timeline</strong> - Minute-by-minute schedule for your big day</li>
    <li><strong>Emergency Contact List</strong> - Keep all vendor info in one place</li>
    <li><strong>Bridal Party Info Sheets</strong> - Sizes, contact info, responsibilities</li>
    <li><strong>Honeymoon Packing List</strong> - Don't forget a thing!</li>
  </ul>

  <h4>Features:</h4>
  <ul>
    <li>Beautifully designed to match Shelzy's modern aesthetic</li>
    <li>Fully editable PDF - customize to your needs</li>
    <li>Canva templates included for easy editing</li>
    <li>Print at home or use digitally on any device</li>
    <li>Instant download - start planning immediately</li>
  </ul>

  <h4>How It Works:</h4>
  <ol>
    <li>Complete your purchase</li>
    <li>Receive instant download link via email</li>
    <li>Download your planning kit (ZIP file with PDFs + Canva links)</li>
    <li>Start planning your perfect day!</li>
  </ol>

  <p><em>This is a digital product. No physical item will be shipped. You'll receive a download link immediately after purchase.</em></p>
</div>

<style>
.digital-planner-description h3 {
  font-size: 24px;
  color: #2d2d2d;
  margin-bottom: 16px;
}
.digital-planner-description h4 {
  font-size: 18px;
  color: #d4a574;
  margin: 24px 0 12px;
}
.digital-planner-description ul, .digital-planner-description ol {
  margin: 0 0 16px 20px;
}
.digital-planner-description li {
  margin-bottom: 8px;
  line-height: 1.6;
}
.digital-planner-description p {
  line-height: 1.7;
  color: #555;
}
</style>
`;

async function main() {
  console.log('');
  console.log('========================================================');
  console.log('  SHELZY\'S - CREATE DIGITAL WEDDING PLANNER PRODUCT');
  console.log('========================================================');
  console.log('');

  // Step 1: Create the product on Shopify
  console.log('Step 1: Creating product on Shopify...');

  const productData = {
    product: {
      title: 'Modern Wedding Planner Kit - Digital Download',
      body_html: productDescription,
      vendor: "Shelzy's Designs",
      product_type: 'Digital Download',
      tags: 'digital, wedding planner, printable, checklist, budget tracker, instant download',
      variants: [
        {
          option1: 'Default',
          price: '15.00',
          compare_at_price: '24.99',
          requires_shipping: false,
          taxable: true,
          sku: 'WEDDING-PLANNER-KIT-2025',
          inventory_management: null,
          inventory_policy: 'continue'
        }
      ],
      options: [
        {
          name: 'Title',
          values: ['Default']
        }
      ],
      status: 'active'
    }
  };

  const createResponse = await shopifyRequest('POST', '/products.json', productData);

  if (createResponse.status === 201 || createResponse.status === 200) {
    const product = createResponse.data.product;
    console.log('   [OK] Product created!');
    console.log('   Product ID: ' + product.id);
    console.log('   Handle: ' + product.handle);
    console.log('   URL: https://shelzysdesigns.com/products/' + product.handle);

    // Step 2: Attach digital file via Fileflare (if configured)
    if (FILEFLARE_TOKEN && ZIP_FILE_URL) {
      console.log('');
      console.log('Step 2: Attaching digital file via Fileflare...');

      // Create URL asset
      const assetData = {
        filename: 'Modern Wedding Planner Kit',
        size: 'unknown',
        url: ZIP_FILE_URL
      };

      const assetResponse = await fileflareRequest('POST', '/assets/store', assetData);

      if (assetResponse.status === 200 || assetResponse.status === 201) {
        const assetId = assetResponse.data.data.id;
        console.log('   [OK] Asset created: ' + assetId);

        // Attach to product
        const attachData = {
          products: [String(product.id)]
        };

        const attachResponse = await fileflareRequest('POST', '/assets/' + assetId + '/attach', attachData);

        if (attachResponse.status === 200 || attachResponse.status === 201) {
          console.log('   [OK] File attached to product!');
        } else {
          console.log('   [WARN] Could not attach file: ' + JSON.stringify(attachResponse.data));
        }
      } else {
        console.log('   [WARN] Could not create asset: ' + JSON.stringify(assetResponse.data));
      }
    } else {
      console.log('');
      console.log('Step 2: Skipping file attachment (Fileflare not configured)');
      console.log('   To attach a file manually:');
      console.log('   1. Go to Shopify Admin > Products > Modern Wedding Planner Kit');
      console.log('   2. Click "More actions" > "Add digital file"');
      console.log('   3. Upload your ZIP/PDF file');
    }

    console.log('');
    console.log('========================================================');
    console.log('  PRODUCT CREATED SUCCESSFULLY!');
    console.log('========================================================');
    console.log('');
    console.log('Product Details:');
    console.log('  Title: ' + product.title);
    console.log('  Price: $' + product.variants[0].price);
    console.log('  Compare at: $' + (product.variants[0].compare_at_price || 'N/A'));
    console.log('  SKU: ' + product.variants[0].sku);
    console.log('');
    console.log('View product: https://shelzysdesigns.com/products/' + product.handle);
    console.log('Edit in admin: https://admin.shopify.com/store/shelzys-designs/products/' + product.id);
    console.log('');
    console.log('Next steps:');
    console.log('  1. Add a product image (mockup of the planner)');
    console.log('  2. Attach the digital file (if not done via Fileflare)');
    console.log('  3. Create a collection for digital products');
    console.log('');

  } else {
    console.log('   [FAIL] Could not create product');
    console.log('   Status: ' + createResponse.status);
    console.log('   Response: ' + JSON.stringify(createResponse.data, null, 2));
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
