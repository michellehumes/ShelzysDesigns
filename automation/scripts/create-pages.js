/**
 * Create/Update Pages
 * Fixes: Contact page, shipping policy content
 */

import { shopifyRequest, getPages } from './api-client.js';

const PAGES_TO_CREATE = [
  {
    title: 'Contact Us',
    handle: 'contact',
    body_html: `<h2>We'd Love to Hear From You</h2>

<p>Have a question about personalization, bulk orders, or rush shipping? We're here to help!</p>

<h3>Quick Answers</h3>
<p>Check our <a href="/pages/faq">FAQ page</a> for immediate answers to common questions about ordering, shipping, and customization.</p>

<h3>Get in Touch</h3>
<p><strong>Email:</strong> hello@shelzysdesigns.com<br>
<strong>Response Time:</strong> Within 24 hours (usually much faster!)</p>

<h3>Bulk & Corporate Orders</h3>
<p>Planning an event or need 10+ bottles? We offer volume discounts! Email us with:</p>
<ul>
<li>Number of bottles needed</li>
<li>Event date (if applicable)</li>
<li>Any logo or special design requirements</li>
</ul>

<h3>Rush Orders</h3>
<p>Need it fast? Contact us BEFORE ordering to confirm rush availability. We offer 48-hour processing for time-sensitive orders.</p>`,
    published: true,
  },
  {
    title: 'Shipping Information',
    handle: 'shipping',
    body_html: `<h2>Shipping Information</h2>

<h3>Processing Time</h3>
<p>Every bottle is custom-made just for you. Please allow <strong>3-5 business days</strong> for us to create your personalized order.</p>

<h3>Shipping Time</h3>
<p>Once your order ships, delivery typically takes <strong>3-7 business days</strong> depending on your location. You'll receive a tracking number via email as soon as your order is on its way.</p>

<h3>Free Shipping</h3>
<p>Orders of <strong>$50 or more</strong> ship FREE within the continental United States.</p>

<h3>Rush Orders</h3>
<p>Need it faster? We offer 48-hour rush processing for time-sensitive orders. Please contact us <strong>BEFORE</strong> placing your order to confirm availability.</p>
<p>Email: <a href="mailto:hello@shelzysdesigns.com">hello@shelzysdesigns.com</a></p>

<h3>Tracking Your Order</h3>
<p>Once your order ships, you'll receive an email with tracking information. You can also log into your account to view order status.</p>

<h3>Shipping Carriers</h3>
<p>We ship via USPS and UPS. Carrier selection is based on package size and destination for optimal delivery time.</p>

<h3>International Shipping</h3>
<p>We currently ship within the United States only. For international inquiries, please contact us and we'll do our best to accommodate your request.</p>

<h3>Order Issues</h3>
<p>If your package is lost, damaged, or significantly delayed, please contact us within 14 days of the expected delivery date. We'll work with you to resolve the issue promptly.</p>`,
    published: true,
  },
  {
    title: 'Why Sublimation',
    handle: 'why-sublimation',
    body_html: `<h1>Why Our Bottles Don't Peel, Crack, or Fade</h1>

<p>Most personalized water bottles use <strong>vinyl decals</strong>—essentially stickers applied to the surface. They look nice at first, but over time:</p>
<ul>
<li>❌ Edges start to peel</li>
<li>❌ Colors fade with washing</li>
<li>❌ Cracks appear in the design</li>
<li>❌ Raised edges trap dirt and bacteria</li>
</ul>

<h2>Sublimation is Different</h2>

<p>At Shelzy's Designs, we use <strong>true sublimation printing</strong>. Here's how it works:</p>

<ol>
<li>Your design is printed on special sublimation paper using high-quality inks</li>
<li>The paper is wrapped around the bottle and placed in a heat press</li>
<li>Under high heat and pressure, the ink transforms into a gas</li>
<li>The gas penetrates the bottle's coating and bonds at a molecular level</li>
<li>When cooled, the ink becomes a permanent part of the bottle</li>
</ol>

<h2>The Result</h2>
<ul>
<li>✅ <strong>Completely smooth finish</strong> – no raised edges</li>
<li>✅ <strong>Won't peel</strong> – there's nothing to peel off</li>
<li>✅ <strong>Won't crack</strong> – the ink is part of the coating</li>
<li>✅ <strong>Won't fade</strong> – designed to last for years</li>
<li>✅ <strong>Dishwasher friendly</strong> – though hand wash extends life</li>
<li>✅ <strong>Hygienic</strong> – no edges for bacteria to hide</li>
</ul>

<p>Your personalization doesn't sit ON the bottle—it becomes PART of the bottle.</p>

<p>That's why our customers say their bottles look just as beautiful a year later as the day they arrived.</p>

<p><a href="/collections/all" class="btn">Shop Sublimation Bottles</a></p>`,
    published: true,
  },
];

async function createPages() {
  console.log('📄 Creating/Updating Pages...\n');

  // Get existing pages
  const existingPages = await getPages();
  const existingByHandle = {};
  existingPages.forEach(p => {
    existingByHandle[p.handle] = p;
  });

  for (const page of PAGES_TO_CREATE) {
    const existing = existingByHandle[page.handle];

    try {
      if (existing) {
        // Update existing page
        const result = await shopifyRequest(`/pages/${existing.id}.json`, {
          method: 'PUT',
          body: JSON.stringify({ page }),
        });
        console.log(`✅ Updated page: ${page.title}`);
        console.log(`   URL: /pages/${page.handle}`);
      } else {
        // Create new page
        const result = await shopifyRequest('/pages.json', {
          method: 'POST',
          body: JSON.stringify({ page }),
        });
        console.log(`✅ Created page: ${page.title}`);
        console.log(`   URL: /pages/${result.page.handle}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create/update "${page.title}":`, error.message);
    }
  }

  console.log('\n✨ Pages setup complete!\n');
}

createPages().catch(console.error);
