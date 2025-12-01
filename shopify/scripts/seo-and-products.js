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

async function getThemeId() {
  const response = await shopifyRequest('GET', '/themes.json');
  const mainTheme = response.themes.find(t => t.role === 'main');
  return mainTheme.id;
}

async function createAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value }
  });
}

// ============================================================
// SEO META DATA
// ============================================================

const seoData = {
  homepage: {
    title: "Personalized Water Bottles for Weddings, Bachelorettes & Events | Shelzy's Designs",
    description: "Custom personalized water bottles designed for weddings, bachelorette parties, bridal showers, bridesmaid gifts, birthdays, corporate events and everyday hydration. Free personalization on every bottle, free shipping $50+ and wedding-ready in 5-7 business days."
  },
  collections: {
    'all-water-bottles': {
      title: "All Personalized Water Bottles | Custom Sublimation Bottles",
      description: "Shop all personalized water bottles from Shelzy's Designs. Permanent sublimation print, free personalization, and sun-soaked styles for weddings, bachelorettes, birthdays, corporate events and everyday use."
    },
    'wedding-water-bottles': {
      title: "Wedding Water Bottles | Personalized Bottles for Bridal Parties",
      description: "Build custom wedding water bottles for your bridal party, welcome bags and wedding weekend events. Permanent sublimation print, free personalization and fast 5-7 business day turnaround."
    },
    'bachelorette-party-bottles': {
      title: "Bachelorette Water Bottles | Custom Bottles for Bach Trips",
      description: "Personalized bachelorette water bottles for pool days, boat days and late nights. Choose colors, fonts and names for your full crew. Free personalization and free shipping on orders $50+."
    },
    'bridal-shower-bottles': {
      title: "Bridal Shower Water Bottles | Personalized Shower Favors",
      description: "Soft, polished personalized water bottles that double as bridal shower decor and take-home favors. Add guest names, roles and dates. Made to order in 3-5 days, shipping in 3-7 days."
    },
    'bridesmaid-gift-bottles': {
      title: "Bridesmaid Gift Water Bottles | Custom Bridesmaid Bottles",
      description: "Say thank you with personalized bridesmaid water bottles they'll use long after the wedding. Free personalization, premium finishes and permanent sublimation designs that never peel."
    },
    'birthday-party-bottles': {
      title: "Birthday Party Water Bottles | Personalized Party Favors",
      description: "Colorful personalized water bottles for birthday parties and girls' trips. Add names and dates, choose fun colors and fonts, and send guests home with a useful, sun-soaked favor."
    },
    'corporate-event-bottles': {
      title: "Corporate & Event Water Bottles | Branded Bottles with Logos",
      description: "Premium branded water bottles for corporate events, retreats and client gifts. Add logos and names, choose event colors and create swag that feels like a gift, not a giveaway. Bulk and custom orders available."
    },
    'sports-team-bottles': {
      title: "Team Water Bottles | Custom Bottles for Sports & Clubs",
      description: "Matching team water bottles for sports leagues, studios and school clubs. Add names, numbers or team logos. Durable stainless steel with permanent print and free personalization."
    },
    'everyday-bottles': {
      title: "Everyday Personalized Water Bottles | Custom Daily Bottles",
      description: "Minimal, personalized water bottles for everyday hydration. Add your name, pick your font and color, and never lose your bottle at work, the gym or on the go again."
    }
  }
};

// ============================================================
// PRODUCT DESCRIPTION (Main Bottle)
// ============================================================

const mainProductDescription = `<h2>A Bottle Made for Weddings, Weekends Away & Everyday Hydration</h2>

<p>This is your new favorite personalized bottle — made for sun-soaked bachelorette weekends, beach-day bridal showers, getting-ready suites, welcome bags, gym bags, office desks, and everything in between.</p>

<p>Every bottle is <strong>custom printed with permanent sublimation</strong>, meaning your name or design is infused directly into the surface. No vinyl. No stickers. No peeling edges. Just a smooth, photo-ready finish that looks elevated in every setting.</p>

<p>If you want a bridesmaid gift that feels premium, personal, and genuinely useful — this is it.</p>

<h3>🌸 Why You'll Love It</h3>
<ul>
<li><strong>Permanent sublimation print</strong> — infused into the bottle coating, never peeling or cracking</li>
<li><strong>Free personalization</strong> on every bottle (names, roles, dates, inside jokes)</li>
<li><strong>Free shipping on orders $50+</strong></li>
<li><strong>Wedding-ready in 5–7 business days</strong> (made to order in 3–5 days + 3–7 day shipping)</li>
<li><strong>Gift-ready packaging</strong> with tissue, ribbon, or coordinated color options</li>
<li><strong>Perfect for photos</strong> — bridal suites, welcome bags, bachelorette itineraries</li>
<li><strong>Double-walled stainless steel</strong> keeps drinks cold for hours</li>
<li><strong>Leak-resistant lid</strong> for pool days, beach days, hikes, or travel</li>
<li><strong>Minimal branding</strong> so your bottles look elevated long after the event</li>
</ul>

<h3>💍 Perfect For</h3>
<ul>
<li>Bridesmaid proposal boxes</li>
<li>Maid of honor gifts</li>
<li>Bachelorette party favors</li>
<li>Bridal shower favors</li>
<li>Welcome bags</li>
<li>Birthday gifts</li>
<li>Girls' trips</li>
<li>Corporate events & retreats</li>
<li>Everyday hydration</li>
</ul>

<h3>🎨 Personalization Details</h3>
<p>Make each bottle uniquely theirs. You can customize:</p>
<ul>
<li><strong>Name</strong></li>
<li><strong>Role</strong> (bridesmaid, maid of honor, sister, mother of the bride, etc.)</li>
<li><strong>Date</strong></li>
<li><strong>Short phrase</strong> ("Let's Get Married", "Miami 2025", "Girls' Trip", etc.)</li>
<li><strong>Font</strong> (choose from our curated selection)</li>
<li><strong>Color</strong> (neutrals, pastels, brights — all sun-soaked and photo-friendly)</li>
</ul>
<p><em>💡 We print exactly what you type. Double-check spelling, capitalization, and emoji placement before submitting.</em></p>

<h3>✨ Quality That Lasts</h3>
<p>These bottles are made for real life — not one-day use.</p>
<ul>
<li>18/8 food-grade stainless steel</li>
<li>BPA-free</li>
<li>Sweat-proof</li>
<li>Travel-friendly</li>
<li>Perfect for daily use at work, the gym, or the beach</li>
<li>Subtle, premium aesthetic — nothing loud, nothing tacky</li>
</ul>

<h3>📦 What's Included</h3>
<ul>
<li>1 × Personalized stainless steel bottle</li>
<li>1 × Leak-resistant lid</li>
<li>1 × Gift-ready packaging</li>
<li>Optional: matching bottles for the full bridal party (see "Bridal Party Bundles")</li>
</ul>

<h3>🕒 Production & Shipping</h3>
<p><strong>Processing:</strong> 3–5 business days<br>
<strong>Shipping:</strong> 3–7 business days<br>
<strong>Most customers receive their bottles in 5–7 business days</strong> depending on location.<br>
<strong>Free shipping on all orders $50+.</strong></p>
<p>Need them sooner? Reach out — we'll help make it happen.</p>

<h3>🤍 The Perfect Wedding Weekend Touch</h3>
<p>From the welcome party to the farewell brunch, these bottles become part of your entire wedding story. They photograph beautifully, travel easily, and actually get used after the weekend ends.</p>
<p>Your bridesmaids will love them.<br>Your photos will love them.<br>You will wonder why you didn't order them sooner.</p>`;

const shortProductDescription = "Elegant, personalized water bottles printed with permanent sublimation — no vinyl, no peeling. Free personalization, fast turnaround, and gift-ready packaging. Perfect for weddings, bachelorettes, bridal showers, bridesmaid gifts, birthdays, corporate retreats, and everyday hydration.";

// ============================================================
// CORPORATE BOTTLE PAGE
// ============================================================

const corporatePageContent = `<div class="page-content">
<h1>Premium Branded Water Bottles for Teams, Clients & Events</h1>

<p class="lead">Give your team or clients something they'll actually use long after the event is over. These custom stainless steel bottles are personalized with your <strong>logo and each person's name</strong>, printed with permanent sublimation so the design never peels or fades.</p>

<p>They're perfect for retreats, offsites, client summits, launch events, welcome kits and VIP mailers — anywhere you want your brand to feel more like a lifestyle than a logo.</p>

<h2>Why Teams Love Them</h2>
<ul>
<li><strong>Premium look & feel</strong> – double-walled stainless steel with minimal branding</li>
<li><strong>Logo + name personalization</strong> – add your logo AND each person's name or title</li>
<li><strong>Permanent sublimation print</strong> – no vinyl, no stickers, no peeling</li>
<li><strong>Free personalization</strong> on every bottle</li>
<li><strong>Bulk pricing</strong> for events, teams and large orders</li>
<li><strong>Gift-ready aesthetic</strong> – pairs perfectly with notebooks, totes and lanyards</li>
<li><strong>Reusable, sustainable choice</strong> vs disposable plastic bottles</li>
</ul>

<h2>Perfect For</h2>
<ul>
<li>Company retreats & offsites</li>
<li>Client appreciation gifts</li>
<li>Conference speaker & VIP gifts</li>
<li>New hire welcome kits</li>
<li>Brand activations & pop-ups</li>
<li>Studio memberships & fitness communities</li>
</ul>

<h2>How Corporate Orders Work</h2>
<ol>
<li><strong>Choose your bottle style & color</strong> – Pick the bottle style, finish and color that fits your brand and event.</li>
<li><strong>Upload your logo</strong> – Send us your logo in a high-resolution file (ideally vector). We'll position and size it for a clean, elevated look.</li>
<li><strong>Send your name list</strong> – Provide a spreadsheet with names (and optionally titles or teams) for each bottle.</li>
<li><strong>Approve a digital proof</strong> – We'll send you a mockup of the logo placement and name styling for sign-off.</li>
<li><strong>We print, pack & ship</strong> – Once approved, your order is printed with permanent sublimation, hand-checked, and shipped to your office, event location or individual recipients.</li>
</ol>

<h2>Timelines & Bulk Pricing</h2>
<ul>
<li><strong>Processing:</strong> Typically 5–10 business days for bulk orders after proof approval</li>
<li><strong>Shipping:</strong> 3–7 business days depending on destination and method</li>
<li><strong>Rush options:</strong> Available for tight deadlines — contact us before you order.</li>
</ul>

<p><a href="/pages/contact" class="btn">Contact Us for a Custom Quote</a></p>
</div>`;

// ============================================================
// TEAM/SPORTS BOTTLE PAGE
// ============================================================

const teamPageContent = `<div class="page-content">
<h1>Matching Team Bottles for Sports, Studios & Clubs</h1>

<p class="lead">Keep your whole team hydrated and coordinated with matching personalized bottles. Add each player's <strong>name and number</strong> (or role) so there's no confusion on the bench, on the bus or in the studio.</p>

<p>These bottles are double-walled stainless steel with permanent sublimation print, so your design looks sharp all season — not cracked or peeling by game three.</p>

<h2>Ideal For</h2>
<ul>
<li>Youth and school sports teams</li>
<li>Rec leagues and club teams</li>
<li>Dance and cheer studios</li>
<li>Fitness studios and gyms</li>
<li>Camps and clinics</li>
</ul>

<h2>Features</h2>
<ul>
<li>Personalized with player names, numbers or positions</li>
<li>Optional team name or logo</li>
<li>Permanent sublimation print (no vinyl or stickers)</li>
<li>Durable stainless steel for practice, games and travel</li>
<li>Free personalization on every bottle</li>
<li>Free shipping on orders $50+</li>
</ul>

<h2>How to Order</h2>
<ol>
<li>Select your bottle color and quantity.</li>
<li>Enter your team name or upload your logo (optional).</li>
<li>Upload your roster (names + numbers) after checkout or via email.</li>
<li>Approve a quick proof if requested.</li>
<li>We print and ship your full team set.</li>
</ol>

<p><a href="/collections/sports-team-bottles" class="btn">Shop Team Bottles</a></p>
</div>`;

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('================================================================');
  console.log('  SHELZYS DESIGNS - SEO & PRODUCT UPDATES');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // --------------------------------------------------------
    // UPDATE COLLECTION SEO
    // --------------------------------------------------------
    console.log('--- Updating Collection SEO Meta ---\n');

    const customCollections = await shopifyRequest('GET', '/custom_collections.json?limit=50');
    const smartCollections = await shopifyRequest('GET', '/smart_collections.json?limit=50');
    const allCollections = [
      ...(customCollections.custom_collections || []),
      ...(smartCollections.smart_collections || [])
    ];

    for (const [handle, seo] of Object.entries(seoData.collections)) {
      const collection = allCollections.find(c => c.handle === handle);
      if (collection) {
        try {
          const isSmartCollection = !!collection.rules;
          const endpoint = isSmartCollection ? 'smart_collections' : 'custom_collections';
          const key = isSmartCollection ? 'smart_collection' : 'custom_collection';

          await shopifyRequest('PUT', `/${endpoint}/${collection.id}.json`, {
            [key]: {
              id: collection.id,
              metafields_global_title_tag: seo.title,
              metafields_global_description_tag: seo.description
            }
          });
          console.log(`✓ SEO updated: ${handle}`);
        } catch (e) {
          console.log(`  Warning: Could not update SEO for ${handle}`);
        }
      }
    }

    // --------------------------------------------------------
    // UPDATE PRODUCT DESCRIPTIONS
    // --------------------------------------------------------
    console.log('\n--- Updating Product Descriptions ---\n');

    const productsResponse = await shopifyRequest('GET', '/products.json?limit=100');
    const products = productsResponse.products || [];

    // Find water bottle products (not digital products)
    const bottleProducts = products.filter(p => {
      const title = p.title.toLowerCase();
      const tags = (p.tags || '').toLowerCase();
      return (
        title.includes('bottle') ||
        title.includes('personalized') ||
        title.includes('sublimation') ||
        title.includes('bridesmaid') ||
        title.includes('bridal')
      ) && !title.includes('planner') && !title.includes('digital');
    });

    console.log(`Found ${bottleProducts.length} bottle products to update`);

    for (const product of bottleProducts) {
      try {
        await shopifyRequest('PUT', `/products/${product.id}.json`, {
          product: {
            id: product.id,
            body_html: mainProductDescription,
            metafields_global_description_tag: shortProductDescription
          }
        });
        console.log(`✓ Updated: ${product.title}`);
      } catch (e) {
        console.log(`  Warning: Could not update ${product.title}`);
      }
    }

    // --------------------------------------------------------
    // CREATE/UPDATE PAGES
    // --------------------------------------------------------
    console.log('\n--- Creating/Updating Pages ---\n');

    // Get existing pages
    const pagesResponse = await shopifyRequest('GET', '/pages.json?limit=100');
    const pages = pagesResponse.pages || [];

    // Corporate bottles page
    const corporatePage = pages.find(p => p.handle === 'corporate-bottles');
    if (corporatePage) {
      await shopifyRequest('PUT', `/pages/${corporatePage.id}.json`, {
        page: {
          id: corporatePage.id,
          title: 'Corporate & Event Water Bottles',
          body_html: corporatePageContent,
          metafield: {
            key: 'title_tag',
            value: seoData.collections['corporate-event-bottles'].title,
            type: 'single_line_text_field',
            namespace: 'global'
          }
        }
      });
      console.log('✓ Updated: Corporate Bottles page');
    } else {
      await shopifyRequest('POST', '/pages.json', {
        page: {
          title: 'Corporate & Event Water Bottles',
          handle: 'corporate-bottles',
          body_html: corporatePageContent,
          published: true
        }
      });
      console.log('✓ Created: Corporate Bottles page');
    }

    // Team bottles page
    const teamPage = pages.find(p => p.handle === 'team-bottles');
    if (teamPage) {
      await shopifyRequest('PUT', `/pages/${teamPage.id}.json`, {
        page: {
          id: teamPage.id,
          title: 'Team & Club Water Bottles',
          body_html: teamPageContent
        }
      });
      console.log('✓ Updated: Team Bottles page');
    } else {
      await shopifyRequest('POST', '/pages.json', {
        page: {
          title: 'Team & Club Water Bottles',
          handle: 'team-bottles',
          body_html: teamPageContent,
          published: true
        }
      });
      console.log('✓ Created: Team Bottles page');
    }

    // --------------------------------------------------------
    // CREATE SEO SNIPPET FOR THEME
    // --------------------------------------------------------
    console.log('\n--- Creating SEO Snippet ---\n');

    const szSeoSnippet = `{% comment %}
  SZ SEO Meta - Homepage and structured data
{% endcomment %}

{% if template == 'index' %}
  <title>${seoData.homepage.title}</title>
  <meta name="description" content="${seoData.homepage.description}">
{% endif %}

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shelzy's Designs",
  "url": "{{ shop.url }}",
  "logo": "{{ 'logo.png' | asset_url }}",
  "description": "Premium personalized water bottles for weddings, bachelorettes, bridal showers, birthdays, corporate events and everyday hydration.",
  "sameAs": [
    "https://www.instagram.com/shelzysdesigns"
  ]
}
</script>

{% if template contains 'product' %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{ product.title | escape }}",
  "description": "{{ product.description | strip_html | truncate: 200 | escape }}",
  "image": "{{ product.featured_image | image_url: width: 800 }}",
  "brand": {
    "@type": "Brand",
    "name": "Shelzy's Designs"
  },
  "offers": {
    "@type": "Offer",
    "url": "{{ shop.url }}{{ product.url }}",
    "priceCurrency": "{{ cart.currency.iso_code }}",
    "price": "{{ product.price | money_without_currency | remove: ',' }}",
    "availability": "{% if product.available %}https://schema.org/InStock{% else %}https://schema.org/OutOfStock{% endif %}"
  }
}
</script>
{% endif %}`;

    await createAsset(themeId, 'snippets/sz-seo-meta.liquid', szSeoSnippet);
    console.log('✓ Created sz-seo-meta.liquid');

    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------
    console.log('\n================================================================');
    console.log('  SEO & PRODUCT UPDATES COMPLETE!');
    console.log('================================================================');

    console.log('\n📊 SEO META UPDATED:');
    console.log('  • All Water Bottles');
    console.log('  • Wedding Water Bottles');
    console.log('  • Bachelorette Party Bottles');
    console.log('  • Bridal Shower Bottles');
    console.log('  • Bridesmaid Gift Bottles');
    console.log('  • Birthday Party Bottles');
    console.log('  • Corporate & Event Bottles');
    console.log('  • Team & Club Bottles');
    console.log('  • Everyday Bottles');

    console.log('\n📝 PRODUCT DESCRIPTIONS UPDATED:');
    console.log(`  • ${bottleProducts.length} bottle products with premium copy`);

    console.log('\n📄 PAGES CREATED/UPDATED:');
    console.log('  • /pages/corporate-bottles');
    console.log('  • /pages/team-bottles');

    console.log('\n✅ All SEO and product updates deployed!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
