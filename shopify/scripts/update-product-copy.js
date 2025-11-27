const https = require('https');

const SHOPIFY_STORE = 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

function shopifyRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOPIFY_STORE,
      port: 443,
      path: `/admin/api/2024-01${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// New product description HTML
const newProductDescription = `<h3>Why You'll Love It</h3>
<ul>
  <li>Permanent sublimation print — infused into the bottle coating, never peeling or cracking</li>
  <li>Free personalization on every bottle (names, roles, dates, inside jokes)</li>
  <li>Free shipping on orders $50+</li>
  <li>Most orders arrive in <strong>5–7 business days</strong></li>
  <li>Gift-ready packaging with tissue, ribbon, or coordinated color options</li>
  <li>Perfect for photos — bridal suites, welcome bags, bachelorette itineraries</li>
  <li>Double-walled stainless steel keeps drinks cold for hours</li>
  <li>Leak-resistant lid for pool days, beach days, hikes, or travel</li>
  <li>Minimal branding so your bottles look elevated long after the event</li>
</ul>

<h3>Production & Shipping</h3>
<ul>
  <li>Processing: <strong>2–4 business days</strong></li>
  <li>Shipping: <strong>3–5 business days</strong></li>
  <li>Most customers receive their bottles in <strong>5–7 business days</strong>, depending on location.</li>
  <li>Free shipping on all orders <strong>$50+</strong>.</li>
</ul>
<p>Need them sooner? Reach out — we'll help make it happen.</p>

<h3>Personalization</h3>
<p>Enter the exact name you want printed. We'll sublimate it permanently onto the bottle — no vinyl, no stickers, no peeling.</p>

<h3>Specifications</h3>
<ul>
  <li>20oz capacity</li>
  <li>Double-walled stainless steel</li>
  <li>Leak-resistant lid</li>
  <li>BPA-free</li>
  <li>Hand wash recommended</li>
</ul>

<p><strong>Order today for estimated delivery in 5–7 business days.</strong></p>`;

async function main() {
  console.log('================================================================');
  console.log('  UPDATING PRODUCT LISTING COPY');
  console.log('================================================================\n');

  try {
    // Search for the product
    console.log('--- Searching for product ---\n');

    const searchResponse = await shopifyRequest('GET', '/products.json?limit=250');
    const products = searchResponse.products || [];

    // Find products to update
    const targetProducts = products.filter(p => {
      const titleLower = p.title.toLowerCase();
      return titleLower.includes('personalized') &&
             (titleLower.includes('water bottle') || titleLower.includes('stainless'));
    });

    console.log(`Found ${targetProducts.length} personalized bottle product(s)\n`);

    for (const product of targetProducts) {
      console.log(`📦 Updating: "${product.title}"`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Handle: ${product.handle}`);

      // Update the product description
      await shopifyRequest('PUT', `/products/${product.id}.json`, {
        product: {
          id: product.id,
          body_html: newProductDescription
        }
      });

      console.log(`   ✓ Updated product description\n`);
    }

    // Summary
    console.log('================================================================');
    console.log('  PRODUCT COPY UPDATED!');
    console.log('================================================================');

    console.log('\n📝 CHANGES MADE:');
    console.log('  • "Why You\'ll Love It" - 9 benefit bullets');
    console.log('  • "Production & Shipping" - 5-7 day timeline');
    console.log('  • "Personalization" section added');
    console.log('  • "Specifications" section added');
    console.log('  • Delivery estimate: 5-7 business days');

    console.log('\n📋 MANUAL STEPS (Theme Customizer):');
    console.log('  1. Go to Online Store > Themes > Customize');
    console.log('  2. Open a product page template');
    console.log('  3. Find the "Name" input field settings');
    console.log('  4. Update:');
    console.log('     - Label: "Name to Print"');
    console.log('     - Placeholder: "Michelle"');
    console.log('     - Helper: "Enter the exact name you want printed"');
    console.log('  5. Find the trust/shipping badges block');
    console.log('  6. Update bullets to:');
    console.log('     - "Free shipping on orders $50+"');
    console.log('     - "Made to order in the USA"');
    console.log('     - "In stock and ready to personalize"');
    console.log('  7. Update "Shipping information" collapsible tab content');

    console.log('\n✅ Check your product pages to see the updates!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
