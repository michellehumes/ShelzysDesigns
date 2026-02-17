#!/usr/bin/env node

/**
 * PUBLISH ALL BLOG POSTS
 * ======================
 * Publishes a complete library of SEO-optimized blog posts with Amazon affiliate links
 *
 * Usage:
 *   node shopify/scripts/publish-all-blog-posts.js
 */

const https = require('https');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01',
  // Amazon Associates tracking ID - UPDATE THIS with your actual ID
  amazonTag: process.env.AMAZON_ASSOCIATE_TAG || 'shelzysdesigns-20'
};

const c = { reset: '\x1b[0m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' };
function log(msg, color = 'reset') { console.log(`${c[color]}${msg}${c.reset}`); }

function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    if (!CONFIG.accessToken) { reject(new Error('SHOPIFY_ACCESS_TOKEN not set')); return; }
    const options = {
      hostname: CONFIG.storeUrl, port: 443,
      path: `/admin/api/${CONFIG.apiVersion}${endpoint}`,
      method, headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': CONFIG.accessToken }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : {};
          res.statusCode >= 200 && res.statusCode < 300 ? resolve(result) : reject(new Error(`API ${res.statusCode}`));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Helper to create Amazon affiliate link
function amzLink(asin, text) {
  return `<a href="https://www.amazon.com/dp/${asin}?tag=${CONFIG.amazonTag}" target="_blank" rel="nofollow sponsored">${text}</a>`;
}

// Affiliate disclosure
const DISCLOSURE = `
<div style="background:#FAF9F6;padding:15px;border-radius:8px;margin-top:30px;font-size:14px;color:#666;">
<strong>Disclosure:</strong> This post contains affiliate links. If you make a purchase through these links, we may earn a small commission at no extra cost to you. This helps support our small business and allows us to continue creating helpful content!
</div>`;

// Common styles
const BLOG_STYLES = `
<style>
.blog-post{max-width:750px;margin:0 auto;line-height:1.8;color:#2B2B2B}
.blog-post h2{color:#4E5F4A;margin-top:35px;font-family:"Playfair Display",serif}
.blog-post h3{color:#4E5F4A;margin-top:25px}
.blog-post a{color:#8BAA88}
.blog-post ul,.blog-post ol{margin:15px 0;padding-left:25px}
.blog-post li{margin-bottom:10px}
.blog-post img{max-width:100%;border-radius:8px;margin:20px 0}
.product-callout{background:#FAF9F6;padding:25px;border-radius:12px;margin:25px 0;text-align:center}
.product-callout h4{margin:0 0 10px;color:#4E5F4A}
.product-callout a{display:inline-block;margin-top:10px;padding:12px 25px;background:#8BAA88;color:#fff;text-decoration:none;border-radius:999px;font-weight:600}
.product-callout a:hover{background:#4E5F4A}
</style>`;

// ============================================
// BLOG POSTS LIBRARY
// ============================================

const BLOG_POSTS = [
  // POST 1: Bridesmaid Gifts
  {
    title: "15 Best Bridesmaid Gift Ideas They'll Actually Love (2025)",
    handle: "best-bridesmaid-gift-ideas-2025",
    tags: "bridesmaid, gifts, wedding, bridal party",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Finding bridesmaid gifts that your squad will actually use (and not just throw in a drawer) can be challenging. After helping thousands of brides create the perfect bridesmaid gifts, we've compiled the ultimate list of gifts that get rave reviews.</p>

<h2>Top Personalized Gifts</h2>

<h3>1. Personalized Water Bottles</h3>
<p>A custom sublimation water bottle with their name is both practical and thoughtful. Unlike vinyl decals that peel off after a few months, sublimation printing is permanent—it literally becomes part of the bottle.</p>

<div class="product-callout">
<h4>Shop Bridesmaid Bottles</h4>
<p>Personalized 20oz insulated bottles with their names</p>
<a href="/collections/bridesmaid-bridal-party">View Collection</a>
</div>

<h3>2. Cozy Satin Robes</h3>
<p>Perfect for getting-ready photos on the big day and lazy Sundays after. ${amzLink('B07WGPW3CG', 'These highly-rated satin robes')} come in beautiful colors and photograph beautifully.</p>

<h3>3. Personalized Jewelry</h3>
<p>Initial necklaces or birthstone pieces make meaningful keepsakes. ${amzLink('B07K8RPFGH', 'This dainty initial necklace')} is a bestseller for bridesmaids.</p>

<h3>4. Bridesmaid Proposal Gift Boxes</h3>
<p>Go all-out with a curated gift box that includes a personalized bottle, candle, scrunchie, and proposal card. It's the ultimate way to pop the question!</p>

<div class="product-callout">
<h4>Bridesmaid Proposal Boxes</h4>
<p>Everything she needs to say "YES!" to being your bridesmaid</p>
<a href="/collections/proposal-gift-boxes">Shop Proposal Boxes</a>
</div>

<h2>Practical Gifts She'll Use Daily</h2>

<h3>5. Silk Pillowcases</h3>
<p>${amzLink('B07D35S8FG', 'Mulberry silk pillowcases')} are a luxurious gift that's good for her skin and hair. She'll think of you every night!</p>

<h3>6. Personalized Tote Bags</h3>
<p>Canvas totes with their name or wedding title ("Maid of Honor," "Bridesmaid") are perfect for the wedding day and everyday errands.</p>

<h3>7. Quality Makeup Bags</h3>
<p>${amzLink('B08DKV7GHM', 'These beautiful cosmetic bags')} are roomy enough for all essentials and come in gorgeous colors.</p>

<h2>Self-Care & Pampering</h2>

<h3>8. Spa Gift Sets</h3>
<p>${amzLink('B07H5G4NXD', 'This lavender spa set')} includes bath bombs, lotions, and candles—perfect for pre-wedding stress relief.</p>

<h3>9. Aromatherapy Candles</h3>
<p>High-quality candles like ${amzLink('B07WDKHM9R', 'these soy wax candles')} create the perfect relaxing atmosphere.</p>

<h3>10. Eye Masks for Sleep</h3>
<p>${amzLink('B07PRBMF57', 'Silk sleep masks')} are a small luxury that makes a big difference, especially during stressful wedding planning.</p>

<h2>For the Wedding Day</h2>

<h3>11. Getting Ready Champagne Flutes</h3>
<p>Personalized champagne flutes for the morning-of champagne toast. ${amzLink('B07N8FVMSG', 'These stemless options')} are practical and pretty.</p>

<h3>12. Emergency Wedding Day Kits</h3>
<p>${amzLink('B07WPKQ8CZ', 'This emergency kit')} has everything from stain remover to pain reliever—a thoughtful practical gift.</p>

<h3>13. Comfortable Reception Shoes</h3>
<p>${amzLink('B07XJW5YNB', 'Foldable ballet flats')} to save the day when heels become unbearable.</p>

<h2>Unique & Memorable</h2>

<h3>14. Custom Star Maps</h3>
<p>A print showing the night sky from a meaningful date—like when you met or your wedding date.</p>

<h3>15. Experience Gifts</h3>
<p>Treat everyone to a spa day, wine tasting, or cooking class together. The memories last forever!</p>

<h2>Gift Giving Tips</h2>
<ul>
<li><strong>Order early</strong> - Personalized items take time to create</li>
<li><strong>Consider their style</strong> - Match gifts to each bridesmaid's personality</li>
<li><strong>Quality over quantity</strong> - One meaningful gift beats several cheap ones</li>
<li><strong>Include a personal note</strong> - Tell them why they're special to you</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 2: Wedding Planning Essentials
  {
    title: "Ultimate Wedding Planning Essentials Checklist (Everything You Need)",
    handle: "wedding-planning-essentials-checklist",
    tags: "wedding, planning, checklist, bride",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Planning a wedding is exciting but overwhelming! Here's everything you need to stay organized and stress-free throughout the process.</p>

<h2>Organization Essentials</h2>

<h3>Wedding Planner Binder</h3>
<p>Keep everything in one place with ${amzLink('B07L3NWXYZ', 'this comprehensive wedding planner')}. It includes budget trackers, vendor contacts, timelines, and more.</p>

<h3>Budget Tracking App or Spreadsheet</h3>
<p>Know where every dollar goes. We recommend creating a detailed spreadsheet or using an app like Zola or The Knot.</p>

<h2>For the Bride</h2>

<h3>Personalized Water Bottle</h3>
<p>You'll need to stay hydrated during dress fittings, venue tours, and the big day itself. A custom bottle makes hydration feel special.</p>

<div class="product-callout">
<h4>Bride Water Bottles</h4>
<p>Custom "Bride" or "Mrs. [Name]" bottles</p>
<a href="/collections/personalized-bottles">Shop Now</a>
</div>

<h3>Getting-Ready Robe</h3>
<p>${amzLink('B08KTTXVB3', 'A beautiful white robe')} is essential for morning-of photos and getting hair and makeup done.</p>

<h3>Comfortable Planning Shoes</h3>
<p>You'll be on your feet a lot at venue visits. ${amzLink('B07ZHT8NVW', 'These stylish sneakers')} keep you comfortable.</p>

<h2>Day-Of Emergency Kit</h2>
<p>Build a kit with these must-haves:</p>
<ul>
<li>Sewing kit (${amzLink('B07C7PXHKS', 'this mini kit')} is perfect)</li>
<li>Stain remover pen</li>
<li>Clear nail polish (stops stocking runs)</li>
<li>Pain reliever</li>
<li>Tissues</li>
<li>Breath mints</li>
<li>Bobby pins and hair ties</li>
<li>Fashion tape</li>
<li>Phone charger</li>
<li>Snacks and water</li>
</ul>

<h2>For Your Bridal Party</h2>

<h3>Matching Robes</h3>
<p>${amzLink('B07WGPW3CG', 'Coordinating satin robes')} make for stunning getting-ready photos.</p>

<h3>Personalized Bottles for Everyone</h3>
<p>Keep your whole squad hydrated with matching personalized bottles.</p>

<div class="product-callout">
<h4>Bridal Party Set</h4>
<p>Matching bottles for the whole crew</p>
<a href="/collections/bridesmaid-bridal-party">Shop Sets</a>
</div>

<h2>Photography Must-Haves</h2>
<ul>
<li>Hangers for dress photos (${amzLink('B07D3MXNRS', 'personalized hangers')} photograph beautifully)</li>
<li>Ring box for ring shots</li>
<li>Good lighting for getting-ready space</li>
</ul>

<h2>Reception Comfort</h2>
<ul>
<li>${amzLink('B07XJW5YNB', 'Foldable flats')} for dancing</li>
<li>Pashminas for outdoor evening events</li>
<li>Touch-up makeup kit</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 3: Kids Water Bottles
  {
    title: "Best Kids Water Bottles for School 2025: Complete Buying Guide",
    handle: "best-kids-water-bottles-school-2025",
    tags: "kids, school, back to school, water bottles",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Finding the perfect water bottle for kids is harder than it sounds! It needs to be leak-proof, durable, easy to clean, and—most importantly—something they'll actually want to use. Here's our comprehensive guide.</p>

<h2>What to Look For in Kids' Water Bottles</h2>
<ul>
<li><strong>Leak-proof:</strong> Nothing ruins a backpack faster than a leaky bottle</li>
<li><strong>Durability:</strong> It WILL get dropped. Repeatedly.</li>
<li><strong>Easy to clean:</strong> Wide mouth = less mold</li>
<li><strong>Kid-friendly design:</strong> Fun colors or personalization</li>
<li><strong>Right size:</strong> Not too heavy when full</li>
</ul>

<h2>Best Overall: Personalized Sublimation Bottles</h2>
<p>Kids are way more likely to drink water when the bottle has their name on it! Our personalized kids bottles feature fun icons like dinosaurs, unicorns, rainbows, and sports themes.</p>

<div class="product-callout">
<h4>Personalized Kids Bottles</h4>
<p>Their name + their favorite design = a bottle they'll love</p>
<a href="/collections/kids-bottles">Shop Kids Collection</a>
</div>

<p><strong>Why we love them:</strong> Sublimation printing means the design never peels off (unlike vinyl stickers). Plus, the insulated design keeps water cold all day.</p>

<h2>Best Budget Option</h2>
<p>${amzLink('B07QXMND9Q', 'The Contigo Kids Water Bottle')} is an affordable, leak-proof option that comes in fun colors.</p>

<h2>Best Insulated Option</h2>
<p>${amzLink('B07Q33LRDQ', 'The Hydro Flask Kids')} keeps drinks cold for hours—perfect for sports and hot days.</p>

<h2>Best for Little Kids (Ages 3-5)</h2>
<p>${amzLink('B07D35HQ7N', 'CamelBak Eddy+ Kids')} has a spill-proof straw that's easy for tiny hands to use.</p>

<h2>Best for Sports</h2>
<p>${amzLink('B07ZQXWM8V', 'Under Armour Sideline Squeeze')} allows for quick hydration during practice without stopping.</p>

<h2>Cleaning Tips</h2>
<ul>
<li>Wash daily with warm soapy water</li>
<li>Use a bottle brush for deep cleaning</li>
<li>Let air dry completely before storing</li>
<li>Run through dishwasher weekly if dishwasher-safe</li>
</ul>

<h2>How Much Water Do Kids Need?</h2>
<ul>
<li><strong>Ages 4-8:</strong> About 5 cups (40 oz) per day</li>
<li><strong>Ages 9-13:</strong> About 7-8 cups (56-64 oz) per day</li>
<li><strong>Active kids:</strong> May need more during sports</li>
</ul>

<h2>Making Hydration Fun</h2>
<ul>
<li>Add fruit slices for natural flavor</li>
<li>Set hydration goals with rewards</li>
<li>Let them pick their own bottle design</li>
<li>Model good hydration habits yourself</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 4: Why Sublimation
  {
    title: "Sublimation vs Vinyl: Why Your Personalized Products Keep Peeling (And How to Avoid It)",
    handle: "sublimation-vs-vinyl-why-products-peel",
    tags: "sublimation, vinyl, education, quality",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Have you ever bought a "personalized" water bottle or tumbler only to have the design peel, crack, or fade within a few months? You're not alone. Let's talk about why this happens and how to avoid it.</p>

<h2>The Problem with Vinyl</h2>
<p>Most personalized products you see on Etsy and at craft fairs use vinyl decals. Vinyl is essentially a fancy sticker that's applied to the surface of the product.</p>

<h3>Why Vinyl Fails:</h3>
<ul>
<li><strong>It sits ON TOP of the surface</strong> - Not bonded to it</li>
<li><strong>Edges lift over time</strong> - From washing, handling, temperature changes</li>
<li><strong>Dishwasher damage</strong> - Heat and water break down the adhesive</li>
<li><strong>Sun exposure</strong> - UV rays fade the colors</li>
<li><strong>Peeling and cracking</strong> - Eventually, it all comes off</li>
</ul>

<h2>The Sublimation Difference</h2>
<p>Sublimation is a completely different process. Instead of applying something on top of the surface, the ink is actually INFUSED into the product's coating using heat and pressure.</p>

<h3>How Sublimation Works:</h3>
<ol>
<li>The design is printed on special transfer paper</li>
<li>Heat (around 400°F) and pressure are applied</li>
<li>The ink turns into a gas and penetrates the coating</li>
<li>As it cools, the ink becomes part of the product</li>
</ol>

<h3>Why Sublimation Lasts:</h3>
<ul>
<li><strong>The design is INSIDE the coating</strong> - Not sitting on top</li>
<li><strong>Nothing to peel</strong> - There's no edge to lift</li>
<li><strong>Dishwasher safe</strong> - The design won't wash off</li>
<li><strong>Fade resistant</strong> - Colors stay vibrant for years</li>
<li><strong>Smooth to the touch</strong> - You can't feel the design</li>
</ul>

<h2>Side-by-Side Comparison</h2>
<table style="width:100%;border-collapse:collapse;margin:20px 0;">
<tr style="background:#FAF9F6;"><th style="padding:10px;border:1px solid #ddd;">Feature</th><th style="padding:10px;border:1px solid #ddd;">Vinyl</th><th style="padding:10px;border:1px solid #ddd;">Sublimation</th></tr>
<tr><td style="padding:10px;border:1px solid #ddd;">Durability</td><td style="padding:10px;border:1px solid #ddd;">6-12 months</td><td style="padding:10px;border:1px solid #ddd;">Years</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;">Dishwasher Safe</td><td style="padding:10px;border:1px solid #ddd;">No</td><td style="padding:10px;border:1px solid #ddd;">Yes</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;">Feel</td><td style="padding:10px;border:1px solid #ddd;">Raised edges</td><td style="padding:10px;border:1px solid #ddd;">Smooth</td></tr>
<tr><td style="padding:10px;border:1px solid #ddd;">Peeling</td><td style="padding:10px;border:1px solid #ddd;">Eventually yes</td><td style="padding:10px;border:1px solid #ddd;">Never</td></tr>
</table>

<h2>How to Identify Sublimation Products</h2>
<ul>
<li>Run your finger over the design - if you can feel raised edges, it's vinyl</li>
<li>Look for "sublimation printed" in the description</li>
<li>Ask the seller directly about their process</li>
<li>Higher quality usually = higher price</li>
</ul>

<div class="product-callout">
<h4>Shop True Sublimation</h4>
<p>All our bottles use premium sublimation printing that lasts</p>
<a href="/collections/all">Browse Our Collection</a>
</div>

<h2>The Bottom Line</h2>
<p>Vinyl products are cheaper upfront, but you'll replace them more often. Sublimation products cost a bit more but last for years. For gifts and items you want to keep, always choose sublimation.</p>

${DISCLOSURE}
</article>`
  },

  // POST 5: Corporate Gifts
  {
    title: "Unique Corporate Gift Ideas That Employees Will Actually Use",
    handle: "corporate-gift-ideas-employees-love",
    tags: "corporate, gifts, business, branding",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Tired of giving the same boring corporate gifts that end up in desk drawers? Here are gift ideas that your team will actually appreciate and use daily.</p>

<h2>Why Good Corporate Gifts Matter</h2>
<ul>
<li>Boost employee morale and loyalty</li>
<li>Create brand ambassadors</li>
<li>Show genuine appreciation</li>
<li>Build team culture</li>
</ul>

<h2>Personalized Corporate Gifts</h2>

<h3>Custom Water Bottles</h3>
<p>Personalized bottles with each employee's name (plus your company logo) are practical, personal, and used daily. Much better than a generic tumbler!</p>

<div class="product-callout">
<h4>Bulk Corporate Bottles</h4>
<p>Company logo + individual names = the perfect blend</p>
<a href="/pages/bulk-corporate">Request Quote</a>
</div>

<h3>Premium Branded Apparel</h3>
<p>${amzLink('B08DT5WFGG', 'Quality hoodies')} or jackets with your logo that employees actually want to wear.</p>

<h2>Tech Gifts</h2>
<ul>
<li>${amzLink('B07W3S4TBL', 'Wireless charging pads')} with company branding</li>
<li>Quality earbuds</li>
<li>Laptop stands for remote workers</li>
</ul>

<h2>Wellness Gifts</h2>
<ul>
<li>${amzLink('B08DFPSV2V', 'Standing desk converters')}</li>
<li>Ergonomic accessories</li>
<li>Gym membership contributions</li>
<li>Meditation app subscriptions</li>
</ul>

<h2>Experience Gifts</h2>
<ul>
<li>Team cooking classes</li>
<li>Escape room adventures</li>
<li>Wine or coffee tastings</li>
<li>Extra PTO days (free and highly valued!)</li>
</ul>

<h2>Remote Worker Gifts</h2>
<p>With more employees working from home, consider:</p>
<ul>
<li>${amzLink('B089CM3VVB', 'Ring lights')} for video calls</li>
<li>Coffee or snack subscriptions</li>
<li>Desk organizers</li>
<li>Cozy blankets</li>
</ul>

<h2>Bulk Ordering Tips</h2>
<ul>
<li>Order 2-3 months ahead for personalized items</li>
<li>Ask about tiered pricing discounts</li>
<li>Get samples before placing large orders</li>
<li>Consider employee preferences (sizes, colors)</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 6: Bachelorette Party Guide
  {
    title: "Complete Bachelorette Party Planning Guide: Ideas, Tips & Essentials",
    handle: "bachelorette-party-planning-guide",
    tags: "bachelorette, wedding, party, bridal",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Planning the ultimate bachelorette party? Whether it's a wild weekend in Vegas or a cozy wine night at home, here's everything you need to make it unforgettable.</p>

<h2>Popular Bachelorette Party Themes</h2>
<ul>
<li><strong>Beach Babe:</strong> Tropical vibes, matching coverups, poolside cocktails</li>
<li><strong>Spa Weekend:</strong> Relaxation, facemasks, massages</li>
<li><strong>Wine Country:</strong> Vineyard tours, tastings, beautiful scenery</li>
<li><strong>Nashville/Austin:</strong> Live music, cowboy boots, line dancing</li>
<li><strong>Vegas:</strong> Classic party scene, shows, nightlife</li>
<li><strong>Cozy Night In:</strong> Pajamas, movies, face masks, wine</li>
</ul>

<h2>Must-Have Supplies</h2>

<h3>Matching Gear</h3>
<p>Nothing says "bachelorette party" like matching outfits! Consider:</p>
<ul>
<li>Personalized water bottles for the whole crew</li>
<li>${amzLink('B07T84QRFN', 'Matching sashes')}</li>
<li>${amzLink('B07WGPW3CG', 'Coordinating robes')}</li>
<li>Matching sunglasses or hats</li>
</ul>

<div class="product-callout">
<h4>Bachelorette Bottles</h4>
<p>Keep the crew hydrated in style</p>
<a href="/collections/bridesmaid-bridal-party">Shop Now</a>
</div>

<h3>Decorations</h3>
<ul>
<li>${amzLink('B07T84QRFN', 'Bride balloons and banners')}</li>
<li>Photo props</li>
<li>Rose gold everything</li>
</ul>

<h3>Games & Activities</h3>
<ul>
<li>${amzLink('B08DFGR9VW', 'Bachelorette party games')}</li>
<li>Scavenger hunt cards</li>
<li>"How well do you know the bride" quiz</li>
</ul>

<h2>Planning Timeline</h2>
<ul>
<li><strong>3-4 months out:</strong> Choose date, location, guest list</li>
<li><strong>2-3 months out:</strong> Book accommodations, transportation</li>
<li><strong>1 month out:</strong> Order supplies, plan activities</li>
<li><strong>1 week out:</strong> Confirm reservations, share itinerary</li>
</ul>

<h2>Budgeting Tips</h2>
<ul>
<li>Split big costs evenly (except the bride—she shouldn't pay)</li>
<li>Use Venmo or Splitwise to track expenses</li>
<li>Set expectations early about budget</li>
<li>Consider all-inclusive destinations</li>
</ul>

<h2>Day-Of Essentials Checklist</h2>
<ul>
<li>Water bottles (hungover bridesmaids need hydration!)</li>
<li>Pain reliever</li>
<li>Snacks</li>
<li>Phone chargers</li>
<li>Camera for photos</li>
<li>Emergency cash</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 7: Hydration Benefits
  {
    title: "Why Staying Hydrated Is Your Secret Weapon (Science-Backed Benefits)",
    handle: "hydration-benefits-science-backed",
    tags: "health, hydration, wellness, water",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>We all know we should drink more water, but do you know exactly WHY? Here's the science behind hydration and tips to actually make it happen.</p>

<h2>The Science of Hydration</h2>
<p>Your body is about 60% water. Every single cell, tissue, and organ needs water to function properly.</p>

<h2>Proven Benefits of Staying Hydrated</h2>

<h3>1. Better Brain Function</h3>
<p>Even mild dehydration (1-3% fluid loss) can impair mood, memory, and concentration. Studies show hydrated people perform better on cognitive tests.</p>

<h3>2. More Energy</h3>
<p>Fatigue is one of the first signs of dehydration. Proper hydration helps maintain energy levels throughout the day.</p>

<h3>3. Improved Physical Performance</h3>
<p>Athletes can lose 6-10% of their water weight through sweat. Even 2% dehydration can decrease strength and endurance.</p>

<h3>4. Healthier Skin</h3>
<p>Water helps maintain skin elasticity and can reduce the appearance of wrinkles over time.</p>

<h3>5. Better Digestion</h3>
<p>Water is essential for proper digestion and helps prevent constipation.</p>

<h3>6. Weight Management</h3>
<p>Drinking water before meals can increase feelings of fullness. Sometimes thirst is mistaken for hunger!</p>

<h2>How Much Water Do You Need?</h2>
<p>The old "8 glasses a day" rule isn't one-size-fits-all. General guidelines:</p>
<ul>
<li><strong>Women:</strong> About 11.5 cups (2.7 liters) daily</li>
<li><strong>Men:</strong> About 15.5 cups (3.7 liters) daily</li>
<li><strong>Active people:</strong> Add 1-2 cups per hour of exercise</li>
</ul>

<h2>Tips to Drink More Water</h2>

<h3>Make It Personal</h3>
<p>You're way more likely to use a water bottle you love! A personalized bottle with your name serves as a constant reminder.</p>

<div class="product-callout">
<h4>Get Your Personalized Bottle</h4>
<p>Make hydration feel special</p>
<a href="/collections/personalized-bottles">Shop Now</a>
</div>

<h3>Other Tips:</h3>
<ul>
<li>Set hourly reminders on your phone</li>
<li>Drink a glass first thing in the morning</li>
<li>Add fruit for natural flavor</li>
<li>Track your intake with an app</li>
<li>Keep a bottle at your desk always</li>
</ul>

<h2>Signs of Dehydration</h2>
<ul>
<li>Dark yellow urine</li>
<li>Headaches</li>
<li>Fatigue</li>
<li>Dizziness</li>
<li>Dry mouth and skin</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 8: Holiday Gift Guide
  {
    title: "2025 Holiday Gift Guide: Personalized Gifts That Wow",
    handle: "holiday-gift-guide-personalized-gifts-2025",
    tags: "holiday, christmas, gifts, personalized",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Looking for gifts that show you put in extra thought? Personalized gifts are always a hit. Here's our complete holiday gift guide organized by recipient.</p>

<h2>For Her</h2>

<h3>Personalized Water Bottles</h3>
<p>Stylish, practical, and thoughtful. Perfect for the woman who loves staying active and hydrated.</p>

<div class="product-callout">
<h4>Shop Women's Bottles</h4>
<p>Elegant designs with her name</p>
<a href="/collections/personalized-bottles">Browse Collection</a>
</div>

<h3>More Ideas for Her:</h3>
<ul>
<li>${amzLink('B07D35S8FG', 'Silk pillowcase set')}</li>
<li>${amzLink('B08KTTXVB3', 'Cozy personalized robe')}</li>
<li>Custom jewelry box</li>
</ul>

<h2>For Him</h2>
<ul>
<li>Personalized sports bottle</li>
<li>${amzLink('B07XQXV8KQ', 'Leather wallet with initials')}</li>
<li>${amzLink('B08DFPSV2V', 'Quality headphones')}</li>
</ul>

<h2>For Kids</h2>
<p>Kids LOVE seeing their name on things! Personalized water bottles are perfect for school.</p>

<div class="product-callout">
<h4>Kids Bottles</h4>
<p>Fun designs + their name = the perfect gift</p>
<a href="/collections/kids-bottles">Shop Kids Collection</a>
</div>

<h2>For Teachers</h2>
<ul>
<li>Personalized teacher water bottle</li>
<li>${amzLink('B07T84QRFN', 'Gift card holders')}</li>
<li>Desk organizers</li>
</ul>

<h2>For Coworkers</h2>
<ul>
<li>Personalized desk accessories</li>
<li>${amzLink('B089CM3VVB', 'Quality coffee mugs')}</li>
<li>Plant subscription</li>
</ul>

<h2>Stocking Stuffers</h2>
<ul>
<li>${amzLink('B07PRBMF57', 'Silk sleep masks')}</li>
<li>Lip balm sets</li>
<li>Phone accessories</li>
</ul>

<h2>Holiday Ordering Deadlines</h2>
<p><strong>Important!</strong> Personalized items take longer to create. Order by:</p>
<ul>
<li><strong>December 1:</strong> Safest for Christmas delivery</li>
<li><strong>December 10:</strong> Standard shipping cutoff</li>
<li><strong>December 15:</strong> Rush orders only</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 9: Bridal Shower Ideas
  {
    title: "Creative Bridal Shower Ideas and Party Favors That Guests Will Love",
    handle: "bridal-shower-ideas-party-favors",
    tags: "bridal shower, wedding, party, favors",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Planning a bridal shower that stands out? From themes to favors, here's everything you need to throw an unforgettable celebration.</p>

<h2>Trending Bridal Shower Themes</h2>

<h3>1. Garden Party</h3>
<p>Floral arrangements, outdoor setting, tea sandwiches, and champagne. Perfect for spring and summer.</p>

<h3>2. Brunch & Bubbly</h3>
<p>Mimosa bar, waffle station, elegant but relaxed. Great for any time of year.</p>

<h3>3. Spa Day</h3>
<p>DIY face masks, manicures, relaxation. Give everyone robes and slippers!</p>

<h3>4. Wine Tasting</h3>
<p>Visit a vineyard or create a tasting at home. Sophisticated and fun.</p>

<h3>5. Cooking Class</h3>
<p>Learn to make the bride's favorite cuisine together. Interactive and memorable.</p>

<h2>Decorations That Wow</h2>
<ul>
<li>Fresh flower installations</li>
<li>${amzLink('B07T84QRFN', 'Elegant balloon garlands')}</li>
<li>Custom signage with the bride's name</li>
<li>Photo display of the couple</li>
</ul>

<h2>Party Favor Ideas</h2>

<h3>Personalized Water Bottles</h3>
<p>Practical, pretty, and personalized! Guests will actually use these long after the party.</p>

<div class="product-callout">
<h4>Bridal Shower Favors</h4>
<p>Personalized bottles for every guest</p>
<a href="/collections/best-sellers">Shop Now</a>
</div>

<h3>More Favor Ideas:</h3>
<ul>
<li>${amzLink('B07WDKHM9R', 'Mini candles')}</li>
<li>Custom lip balms</li>
<li>Seed packets (for garden themes)</li>
<li>Mini champagne bottles</li>
</ul>

<h2>Games & Activities</h2>
<ul>
<li><strong>How Well Do You Know the Bride:</strong> Quiz about the bride</li>
<li><strong>Wedding Dress Game:</strong> Design a dress using toilet paper</li>
<li><strong>Ring Hunt:</strong> Hide plastic rings, finder wins a prize</li>
<li><strong>Advice Cards:</strong> Guests write marriage advice</li>
</ul>

<h2>Food & Drink Ideas</h2>
<ul>
<li>Champagne or mimosa bar</li>
<li>Themed finger foods</li>
<li>Custom cake or cupcakes</li>
<li>Signature cocktail named after the bride</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 10: Meal Prep Guide
  {
    title: "Meal Prep 101: Beginner's Guide to Saving Time and Money",
    handle: "meal-prep-beginners-guide",
    tags: "meal prep, health, cooking, lifestyle",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Meal prepping saves time, money, and stress. Here's everything you need to know to get started—even if you've never done it before.</p>

<h2>Why Meal Prep?</h2>
<ul>
<li><strong>Save time:</strong> Cook once, eat all week</li>
<li><strong>Save money:</strong> Fewer takeout orders and food waste</li>
<li><strong>Eat healthier:</strong> Control ingredients and portions</li>
<li><strong>Less stress:</strong> No daily "what's for dinner?" panic</li>
</ul>

<h2>Essential Meal Prep Supplies</h2>

<h3>Containers</h3>
<p>${amzLink('B07DFLTQNW', 'Glass meal prep containers')} are worth the investment—they don't stain, reheat evenly, and last for years.</p>

<h3>Quality Water Bottle</h3>
<p>Hydration is part of healthy eating! A personalized bottle reminds you to drink throughout the day.</p>

<div class="product-callout">
<h4>Stay Hydrated</h4>
<p>Pair your meal prep with proper hydration</p>
<a href="/collections/personalized-bottles">Shop Bottles</a>
</div>

<h3>More Essentials:</h3>
<ul>
<li>${amzLink('B07DFLTQNW', 'Sheet pans')} for batch cooking</li>
<li>Sharp knives</li>
<li>Cutting boards</li>
<li>Instant Pot or slow cooker</li>
</ul>

<h2>Beginner Meal Prep Steps</h2>

<h3>Step 1: Plan Your Meals</h3>
<p>Start simple with 3-4 recipes that share ingredients. Pick a protein, grain, and vegetable for each.</p>

<h3>Step 2: Make a Shopping List</h3>
<p>Check what you have, then list exactly what you need. Stick to the list!</p>

<h3>Step 3: Prep Day (Sunday works great)</h3>
<ol>
<li>Start with longest-cooking items (roasts, grains)</li>
<li>While those cook, chop vegetables</li>
<li>Cook proteins</li>
<li>Assemble containers</li>
</ol>

<h2>Easy Beginner Recipes</h2>
<ul>
<li>Sheet pan chicken and vegetables</li>
<li>Mason jar salads</li>
<li>Overnight oats</li>
<li>Grain bowls with versatile toppings</li>
</ul>

<h2>Storage Tips</h2>
<ul>
<li>Most meals last 3-4 days in the fridge</li>
<li>Freeze extras for next week</li>
<li>Keep sauces separate to prevent sogginess</li>
<li>Label containers with dates</li>
</ul>

<h2>Common Mistakes to Avoid</h2>
<ul>
<li>Prepping too many different meals</li>
<li>Not accounting for leftovers</li>
<li>Forgetting snacks</li>
<li>Not properly storing food</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 11: Teacher Appreciation
  {
    title: "Teacher Appreciation Gifts: Thoughtful Ideas They'll Actually Love",
    handle: "teacher-appreciation-gift-ideas",
    tags: "teacher, gifts, appreciation, school",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Teachers pour their hearts into our kids. Show your appreciation with gifts they'll actually use and love—not another "World's Best Teacher" mug (unless it's personalized!).</p>

<h2>What Teachers Really Want</h2>
<p>We asked teachers, and here's what they said:</p>
<ul>
<li>Practical items they use daily</li>
<li>Self-care products</li>
<li>Gift cards (yes, really!)</li>
<li>Personalized items that feel special</li>
</ul>

<h2>Top Teacher Gift Ideas</h2>

<h3>1. Personalized Water Bottles</h3>
<p>Teachers talk ALL DAY. They need to stay hydrated! A custom bottle with their name is both practical and personal.</p>

<div class="product-callout">
<h4>Teacher Bottles</h4>
<p>"Mrs. Smith" or "Best Teacher Ever" designs</p>
<a href="/collections/personalized-bottles">Shop Now</a>
</div>

<h3>2. Quality Pens</h3>
<p>${amzLink('B07DFLTQNW', 'These smooth-writing pens')} are grading essentials that teachers love.</p>

<h3>3. Classroom Supplies Fund</h3>
<p>Teachers spend their own money on supplies. An Amazon or Target gift card specifically for classroom use is always appreciated.</p>

<h3>4. Self-Care Items</h3>
<ul>
<li>${amzLink('B07H5G4NXD', 'Spa gift sets')}</li>
<li>Hand cream (all that hand sanitizer is rough!)</li>
<li>Nice candles for home</li>
</ul>

<h2>Gift Ideas by Budget</h2>

<h3>Under $15</h3>
<ul>
<li>Hand lotion set</li>
<li>Coffee gift card</li>
<li>Nice pens</li>
</ul>

<h3>$15-$30</h3>
<ul>
<li>Personalized water bottle</li>
<li>Desk organizer</li>
<li>Teacher planner</li>
</ul>

<h3>$30+</h3>
<ul>
<li>Spa gift basket</li>
<li>Nice tote bag</li>
<li>Larger gift cards</li>
</ul>

<h2>Class Gift Ideas</h2>
<p>Pooling money with other parents? Consider:</p>
<ul>
<li>Larger gift card to their favorite store</li>
<li>Class photo book with notes from each student</li>
<li>Subscription box (coffee, snacks, etc.)</li>
</ul>

<h2>What NOT to Give</h2>
<ul>
<li>Generic mugs (they have dozens)</li>
<li>Apple-themed everything</li>
<li>Homemade treats (allergies/preferences)</li>
<li>Strong perfumes</li>
</ul>

${DISCLOSURE}
</article>`
  },

  // POST 12: Sustainable Living
  {
    title: "Simple Sustainable Swaps for Everyday Life",
    handle: "sustainable-living-simple-swaps",
    tags: "sustainability, eco-friendly, lifestyle, environment",
    body_html: `
${BLOG_STYLES}
<article class="blog-post">
<p>Want to live more sustainably but don't know where to start? These simple swaps make a big impact without overwhelming lifestyle changes.</p>

<h2>Why Sustainability Matters</h2>
<p>Small changes add up. If everyone made a few sustainable swaps, we'd significantly reduce waste and environmental impact.</p>

<h2>Kitchen & Dining</h2>

<h3>Reusable Water Bottles</h3>
<p>The average American uses 156 plastic bottles per year. A quality reusable bottle eliminates all that waste.</p>

<div class="product-callout">
<h4>Ditch Single-Use Plastic</h4>
<p>A personalized bottle you love means you'll actually use it</p>
<a href="/collections/personalized-bottles">Shop Sustainable</a>
</div>

<h3>More Kitchen Swaps:</h3>
<ul>
<li>${amzLink('B07DFLTQNW', 'Beeswax wraps')} instead of plastic wrap</li>
<li>${amzLink('B07DFLTQNW', 'Silicone food bags')} instead of Ziplocs</li>
<li>Cloth napkins instead of paper</li>
<li>Reusable coffee cup</li>
</ul>

<h2>Bathroom</h2>
<ul>
<li>${amzLink('B07DFLTQNW', 'Bamboo toothbrush')}</li>
<li>Shampoo bars instead of bottles</li>
<li>${amzLink('B07DFLTQNW', 'Safety razors')} instead of disposables</li>
<li>Reusable cotton rounds</li>
</ul>

<h2>Shopping</h2>
<ul>
<li>Bring reusable bags (keep them in your car!)</li>
<li>Buy secondhand when possible</li>
<li>Choose products with less packaging</li>
<li>Support sustainable brands</li>
</ul>

<h2>Around the House</h2>
<ul>
<li>LED light bulbs</li>
<li>Programmable thermostat</li>
<li>Hang dry clothes when possible</li>
<li>Unplug electronics not in use</li>
</ul>

<h2>Start Small</h2>
<p>Don't try to change everything at once! Pick 2-3 swaps to start. Once those become habits, add more.</p>

<h2>The Impact</h2>
<p>One reusable water bottle can prevent:</p>
<ul>
<li>156+ plastic bottles per year</li>
<li>Approximately 52 lbs of CO2 emissions</li>
<li>Countless bottles in landfills and oceans</li>
</ul>

${DISCLOSURE}
</article>`
  }
];

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║     PUBLISH ALL BLOG POSTS - Shelzy\'s Designs         ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');

  if (!CONFIG.accessToken) {
    log('ERROR: SHOPIFY_ACCESS_TOKEN not set!', 'red');
    process.exit(1);
  }

  try {
    // Get or create blog
    log('Finding or creating blog...', 'cyan');
    const blogs = await shopifyRequest('GET', '/blogs.json');
    let blogId = blogs.blogs.find(b => b.handle === 'blog' || b.handle === 'news')?.id;

    if (!blogId) {
      const newBlog = await shopifyRequest('POST', '/blogs.json', {
        blog: { title: 'Blog', handle: 'blog' }
      });
      blogId = newBlog.blog.id;
      log(`Created new blog (ID: ${blogId})`, 'green');
    } else {
      log(`Using existing blog (ID: ${blogId})`, 'green');
    }

    // Publish all posts
    log(`\nPublishing ${BLOG_POSTS.length} blog posts...\n`, 'cyan');

    let published = 0;
    let skipped = 0;

    for (const post of BLOG_POSTS) {
      try {
        await shopifyRequest('POST', `/blogs/${blogId}/articles.json`, {
          article: {
            title: post.title,
            handle: post.handle,
            body_html: post.body_html,
            tags: post.tags,
            author: 'Shelzy\'s Designs',
            published: true
          }
        });
        log(`  ✓ ${post.title}`, 'green');
        published++;
      } catch (e) {
        if (e.message.includes('422') || e.message.includes('already')) {
          log(`  ○ ${post.title} (already exists)`, 'yellow');
          skipped++;
        } else {
          log(`  ✗ ${post.title}: ${e.message}`, 'red');
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n');
    log('╔════════════════════════════════════════════════════════╗', 'green');
    log('║              BLOG PUBLISHING COMPLETE!                 ║', 'green');
    log('╚════════════════════════════════════════════════════════╝', 'green');
    console.log('\n');
    log(`Published: ${published}`, 'green');
    log(`Skipped (existing): ${skipped}`, 'yellow');
    log(`Total posts: ${BLOG_POSTS.length}`, 'cyan');
    console.log('\n');
    log('NEXT STEPS:', 'yellow');
    log('1. Update Amazon affiliate links with your actual tag', 'reset');
    log('2. Add featured images to each post', 'reset');
    log('3. Share posts on social media', 'reset');
    log('4. Set up Pinterest pins for each post', 'reset');
    console.log('\n');

  } catch (e) {
    log(`\nFATAL ERROR: ${e.message}`, 'red');
    process.exit(1);
  }
}

main();
