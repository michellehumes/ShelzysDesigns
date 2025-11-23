/**
 * Create Missing Collections
 * Fixes: /collections/corporate and /collections/everyday 404 errors
 */

import { shopifyRequest, getCollections, getProducts } from './api-client.js';

const COLLECTIONS_TO_CREATE = [
  {
    title: 'Corporate & Bulk Orders',
    handle: 'corporate',
    body_html: `<p>Custom sublimation water bottles for teams, events, and corporate gifting. Unlike cheap vinyl that peels and fades, our permanent sublimation printing infuses your logo and names directly into each bottle.</p>

<p><strong>Perfect for:</strong></p>
<ul>
<li>Employee appreciation gifts</li>
<li>Client thank-you gifts</li>
<li>Team building events</li>
<li>Trade shows & conferences</li>
<li>Company wellness programs</li>
<li>New hire welcome kits</li>
</ul>

<p><strong>Volume discounts available:</strong></p>
<ul>
<li>10-24 bottles: 10% off</li>
<li>25-49 bottles: 15% off</li>
<li>50+ bottles: 20% off</li>
</ul>

<p>Need a custom quote? Contact us at hello@shelzysdesigns.com</p>`,
    sort_order: 'best-selling',
    published: true,
    // Products to add (will match by title keywords)
    productKeywords: ['corporate', 'bulk', 'event', '10', '25'],
  },
  {
    title: 'Everyday Bottles',
    handle: 'everyday',
    body_html: `<p>Premium personalized water bottles for daily hydration. Whether you're heading to the gym, the office, or running errands—make it personal.</p>

<p>Every bottle features permanent sublimation printing (not vinyl!) so your name won't peel, crack, or fade. Ever.</p>

<p><strong>Why customers love our everyday bottles:</strong></p>
<ul>
<li>✓ 20oz double-wall insulated stainless steel</li>
<li>✓ Keeps drinks cold 24 hours / hot 12 hours</li>
<li>✓ BPA-free and dishwasher friendly</li>
<li>✓ Permanent sublimation printing</li>
<li>✓ Ships in 5-7 business days</li>
</ul>

<p>Treat yourself to something special. You deserve a bottle that's truly yours.</p>`,
    sort_order: 'best-selling',
    published: true,
    productKeywords: ['stainless', 'personalized', 'premium', 'gift box'],
  },
];

async function createCollections() {
  console.log('🏷️  Creating Collections...\n');

  // Get existing collections
  const existingCollections = await getCollections();
  const existingHandles = existingCollections.map(c => c.handle);

  // Get all products for adding to collections
  const allProducts = await getProducts();

  for (const collection of COLLECTIONS_TO_CREATE) {
    const { productKeywords, ...collectionData } = collection;

    // Check if collection already exists
    if (existingHandles.includes(collection.handle)) {
      console.log(`⏭️  Collection "${collection.title}" already exists, skipping...`);
      continue;
    }

    try {
      // Create the collection
      const result = await shopifyRequest('/custom_collections.json', {
        method: 'POST',
        body: JSON.stringify({ custom_collection: collectionData }),
      });

      const newCollection = result.custom_collection;
      console.log(`✅ Created collection: ${newCollection.title}`);
      console.log(`   URL: /collections/${newCollection.handle}`);

      // Add products to collection
      const matchingProducts = allProducts.filter(product =>
        productKeywords.some(keyword =>
          product.title.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      if (matchingProducts.length > 0) {
        console.log(`   Adding ${matchingProducts.length} products...`);

        for (const product of matchingProducts) {
          try {
            await shopifyRequest('/collects.json', {
              method: 'POST',
              body: JSON.stringify({
                collect: {
                  product_id: product.id,
                  collection_id: newCollection.id,
                },
              }),
            });
            console.log(`   ✓ Added: ${product.title}`);
          } catch (err) {
            // Product might already be in collection
            console.log(`   ⚠️ Could not add: ${product.title}`);
          }
        }
      }

      console.log('');
    } catch (error) {
      console.error(`❌ Failed to create "${collection.title}":`, error.message);
    }
  }

  console.log('✨ Collections setup complete!\n');
}

createCollections().catch(console.error);
