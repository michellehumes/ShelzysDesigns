#!/usr/bin/env node
/**
 * Shelzy's Designs - Site Audit Implementation
 * Implements all API-accessible changes from the comprehensive audit
 */

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Set SHOPIFY_ACCESS_TOKEN environment variable');
  process.exit(1);
}

const API_BASE = `https://${STORE_URL}/admin/api/2024-01`;

async function shopifyAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${response.status}: ${error}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ============================================================
// 1. UPDATE COLLECTIONS
// ============================================================

async function updateCollections() {
  console.log('\n📦 Updating Collections...\n');

  const collections = await shopifyAPI('/custom_collections.json');

  const updates = {
    'corporate': {
      title: 'Corporate Gifts',
      body_html: `<h2>Premium Personalized Bottles for Teams & Corporate Gifting</h2>

<p>Custom sublimation water bottles with your company logo and individual employee names. Unlike cheap vinyl promotional items, our permanent sublimation printing won't peel, crack, or fade at company events.</p>

<h3>Perfect For:</h3>
<ul>
  <li>Employee appreciation gifts</li>
  <li>Client thank-you gifts</li>
  <li>Team building events & retreats</li>
  <li>Trade shows & conferences</li>
  <li>Company wellness programs</li>
  <li>New hire welcome kits</li>
</ul>

<h3>Volume Discounts:</h3>
<ul>
  <li>10-24 bottles: 10% off</li>
  <li>25-49 bottles: 15% off</li>
  <li>50+ bottles: 20% off</li>
</ul>

<p><strong>Need a custom quote?</strong> Contact us at hello@shelzysdesigns.com</p>

<hr>

<h3>Frequently Asked Questions</h3>

<p><strong>Turnaround time:</strong> 5-7 business days for bulk orders (3-5 for rush orders)</p>
<p><strong>Free shipping:</strong> On all orders $50+</p>
<p><strong>What is sublimation?</strong> Permanent ink infusion into the bottle's coating - won't peel like vinyl decals</p>
<p><strong>Rush orders:</strong> Contact us before ordering to confirm availability</p>`,
    },
    'everyday': {
      title: 'Everyday Bottles',
      body_html: `<h2>Premium Personalized Bottles for Daily Hydration</h2>

<p>Whether you're heading to the gym, the office, or running errands—make it personal. Every bottle features permanent sublimation printing (not vinyl!) so your name won't peel, crack, or fade. Ever.</p>

<h3>Why Customers Love Our Everyday Bottles:</h3>
<ul>
  <li>✓ 20oz double-wall insulated stainless steel</li>
  <li>✓ Keeps drinks cold 24 hours / hot 12 hours</li>
  <li>✓ BPA-free and dishwasher friendly</li>
  <li>✓ Permanent sublimation printing</li>
  <li>✓ Ships in 3-5 business days</li>
</ul>

<p>Treat yourself to something special. You deserve a bottle that's truly yours.</p>

<hr>

<h3>Frequently Asked Questions</h3>

<p><strong>Turnaround time:</strong> 3-5 business days</p>
<p><strong>Free shipping:</strong> On all orders $50+</p>
<p><strong>What is sublimation?</strong> Permanent ink infusion - won't peel or fade like vinyl</p>
<p><strong>Rush orders:</strong> Available - contact us before ordering</p>`,
    },
    'weddings': {
      title: 'Bridal & Weddings',
      body_html: `<h2>Premium Personalized Bottles for Weddings & Bridal Parties</h2>

<p>From "Will you be my bridesmaid?" to "Thank you for standing by my side," our bridal collection is designed for every moment of your wedding journey. Each bottle is permanently personalized with sublimation so your bridal party will actually use and love their gift long after the big day.</p>

<h3>Perfect For:</h3>
<ul>
  <li>Bridesmaid proposals</li>
  <li>Bachelorette party weekends</li>
  <li>Getting-ready day</li>
  <li>Thank you gifts</li>
  <li>Bridal shower favors</li>
</ul>

<hr>

<h3>Frequently Asked Questions</h3>

<p><strong>Turnaround time:</strong> 3-5 business days (rush available)</p>
<p><strong>Free shipping:</strong> On all orders $50+</p>
<p><strong>What is sublimation?</strong> Permanent printing that won't peel, crack, or fade - perfect for photos!</p>
<p><strong>Wedding deadline?</strong> Contact us about rush processing for your wedding date</p>`,
    },
  };

  for (const collection of collections.custom_collections) {
    const handle = collection.handle;
    if (updates[handle]) {
      try {
        await shopifyAPI(`/custom_collections/${collection.id}.json`, {
          method: 'PUT',
          body: JSON.stringify({
            custom_collection: {
              id: collection.id,
              title: updates[handle].title,
              body_html: updates[handle].body_html,
            }
          }),
        });
        console.log(`✅ Updated: ${updates[handle].title}`);
      } catch (err) {
        console.error(`❌ Failed to update ${handle}:`, err.message);
      }
    }
  }
}

// ============================================================
// 2. CREATE/UPDATE PAGES
// ============================================================

async function createPages() {
  console.log('\n📄 Creating/Updating Pages...\n');

  const pages = await shopifyAPI('/pages.json');
  const existingHandles = pages.pages.map(p => p.handle);

  const pagesToCreate = [
    {
      title: 'Bulk Orders',
      handle: 'bulk-orders',
      body_html: `<h1>Bulk & Corporate Orders</h1>

<p>Need 10+ personalized bottles? We offer volume discounts and can add your company logo plus individual names.</p>

<h2>Volume Discounts</h2>
<ul>
  <li><strong>10-24 bottles:</strong> 10% off retail price</li>
  <li><strong>25-49 bottles:</strong> 15% off retail price</li>
  <li><strong>50+ bottles:</strong> 20% off retail price</li>
</ul>

<h2>Perfect For</h2>
<ul>
  <li>Corporate employee appreciation</li>
  <li>Client thank-you gifts</li>
  <li>Team retreats & conferences</li>
  <li>Sports teams & leagues</li>
  <li>School groups & fundraisers</li>
  <li>Wedding parties (10+ people)</li>
</ul>

<h2>How It Works</h2>
<ol>
  <li>Email us at hello@shelzysdesigns.com with:
    <ul>
      <li>Quantity needed</li>
      <li>Event date (if applicable)</li>
      <li>Logo file (if adding company branding)</li>
      <li>List of names for personalization</li>
    </ul>
  </li>
  <li>We'll send you a custom quote and mockup</li>
  <li>Once approved, we'll process your bulk order</li>
  <li>Production time: 5-7 business days (rush available)</li>
</ol>

<h2>Turnaround & Shipping</h2>
<p><strong>Standard:</strong> 5-7 business days production + 3-7 days shipping<br>
<strong>Rush:</strong> 48-72 hour production available (contact us first)<br>
<strong>Shipping:</strong> Free on all orders $50+</p>

<h2>Get a Quote</h2>
<p>Email us at <a href="mailto:hello@shelzysdesigns.com">hello@shelzysdesigns.com</a> or use our contact form with your bulk order details.</p>`,
      published: true,
    },
    {
      title: 'Gift Guide',
      handle: 'gift-guide',
      body_html: `<h1>Personalized Water Bottle Gift Guide</h1>

<p>Not sure which bottle to choose? We've made it easy with our curated gift guide for every occasion.</p>

<h2>For Weddings & Bachelorettes</h2>
<p><strong>Best for:</strong> Bridesmaids, bachelorette parties, getting-ready day</p>
<ul>
  <li><a href="/collections/weddings">Bridal Party Set of 3</a> - Perfect trio for MOH + bridesmaids</li>
  <li><a href="/collections/weddings">Bachelorette Party Set of 6</a> - Weekend trip essentials</li>
  <li><a href="/products/premium-personalized-water-bottle-with-gift-box-luxury-bridesmaid-gift">Premium Gift Box Bottle</a> - Luxury proposal gift</li>
</ul>

<h2>For Corporate & Teams</h2>
<p><strong>Best for:</strong> Employee gifts, client appreciation, team events</p>
<ul>
  <li><a href="/collections/corporate">Corporate Bulk Set of 25</a> - Team gifting with logo</li>
  <li><a href="/collections/corporate">Event Set of 10</a> - Perfect for retreats</li>
</ul>

<h2>For Everyday & Personal Use</h2>
<p><strong>Best for:</strong> Treating yourself, birthday gifts, everyday hydration</p>
<ul>
  <li><a href="/collections/everyday">Personalized Stainless Steel Bottle</a> - Classic everyday bottle</li>
  <li><a href="/collections/everyday">Premium Bottle with Gift Box</a> - Elevated personal gift</li>
</ul>

<h2>Gift-Giving Tips</h2>
<ul>
  <li>✓ Order 7-10 days before needed date for standard shipping</li>
  <li>✓ Use recipient's full name or nickname they prefer</li>
  <li>✓ Choose colors that match their style or event theme</li>
  <li>✓ Contact us for rush orders with tight deadlines</li>
</ul>

<p><a href="/collections/all" class="button">Shop All Bottles</a></p>`,
      published: true,
    },
  ];

  for (const page of pagesToCreate) {
    if (existingHandles.includes(page.handle)) {
      console.log(`⏭️  Page exists: ${page.title}`);
      continue;
    }

    try {
      await shopifyAPI('/pages.json', {
        method: 'POST',
        body: JSON.stringify({ page }),
      });
      console.log(`✅ Created: ${page.title}`);
    } catch (err) {
      console.error(`❌ Failed: ${page.title}:`, err.message);
    }
  }
}

// ============================================================
// 3. ADD PRODUCT TAGS
// ============================================================

async function addProductTags() {
  console.log('\n🏷️  Adding Product Tags...\n');

  const products = await shopifyAPI('/products.json?limit=250');

  const tagMap = {
    'bridal': ['bridal', 'bridesmaid', 'wedding'],
    'bachelorette': ['bachelorette', 'bach'],
    'corporate': ['corporate', 'bulk', 'event'],
    'everyday': ['stainless steel', 'everyday', 'personalized water bottle'],
  };

  for (const product of products.products) {
    const titleLower = product.title.toLowerCase();
    const newTags = new Set(product.tags.split(',').map(t => t.trim()).filter(Boolean));

    // Add relevant tags
    for (const [tag, keywords] of Object.entries(tagMap)) {
      if (keywords.some(kw => titleLower.includes(kw))) {
        newTags.add(tag.charAt(0).toUpperCase() + tag.slice(1));
      }
    }

    // Skip if no new tags
    if ([...newTags].join(', ') === product.tags) continue;

    try {
      await shopifyAPI(`/products/${product.id}.json`, {
        method: 'PUT',
        body: JSON.stringify({
          product: {
            id: product.id,
            tags: [...newTags].join(', '),
          }
        }),
      });
      console.log(`✅ Tagged: ${product.title}`);
    } catch (err) {
      console.error(`❌ Failed: ${product.title}`);
    }
  }
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     SHELZY\'S DESIGNS - AUDIT IMPLEMENTATION               ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    await updateCollections();
    await createPages();
    await addProductTags();

    console.log('\n✨ API Changes Complete!\n');
    console.log('Next: Manual theme changes required (see THEME_CHANGES.md)');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
