const https = require('https');

const SHOP = 'shelzysdesigns.myshopify.com';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

function shopifyRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SHOP,
      port: 443,
      path: `/admin/api/2024-01${path}`,
      method: method,
      headers: {
        'X-Shopify-Access-Token': TOKEN,
        'Content-Type': 'application/json'
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

// ============================================
// ABOUT PAGE CONTENT
// ============================================
const aboutPageHtml = `
<h2>Our Story</h2>
<p>Every celebration deserves a personal touch. At Shelzy's Designs, we believe the little details make the biggest memories—which is why we create premium personalized water bottles that turn everyday hydration into something special.</p>
<p>Whether you're a bride gifting your besties, a company celebrating your team, or simply someone who loves a custom touch, our bottles are designed to make every sip meaningful.</p>

<hr>

<h2>Why Shelzy's?</h2>

<h3>Premium Quality</h3>
<p>Our double-walled stainless steel bottles keep drinks cold for 24 hours and hot for 12. Each bottle features vibrant, fade-resistant sublimation printing that won't peel, crack, or wash away.</p>

<h3>Truly Personal</h3>
<p>Your name. Your colors. Your style. We don't do cookie-cutter—every bottle is crafted to your exact specifications with care and attention to detail.</p>

<h3>Made for Moments</h3>
<p>From bridal parties to corporate events, baby showers to team gifts—we help you celebrate life's milestones with something they'll actually use (and love).</p>

<hr>

<h2>Our Promise</h2>
<ul>
  <li><strong>5-7 Day Delivery</strong> — Fast turnaround without sacrificing quality</li>
  <li><strong>Satisfaction Guaranteed</strong> — Love it or we'll make it right</li>
  <li><strong>Small Batch Care</strong> — Each order crafted with attention to detail</li>
</ul>

<hr>

<h2>Let's Create Something Beautiful</h2>
<p>Ready to design your perfect bottle? <a href="/collections/all">Shop Now</a> or <a href="/pages/contact-us">Contact Us</a> with any questions.</p>
<p>Thank you for supporting a small business that puts heart into every order.</p>
<p><em>— The Shelzy's Designs Team</em></p>
`;

// ============================================
// FAQ PAGE CONTENT
// ============================================
const faqPageHtml = `
<h2>Frequently Asked Questions</h2>

<h3>ORDERING & PERSONALIZATION</h3>

<p><strong>How do I personalize my bottle?</strong><br>
Simply select your bottle style, choose your design options, and enter your custom text in the personalization field. You'll see exactly what you're getting before checkout.</p>

<p><strong>What fonts and colors are available?</strong><br>
We offer a variety of elegant fonts perfect for names, initials, and titles. Color options vary by design—check each product page for available choices.</p>

<p><strong>Can I see a proof before you make my bottle?</strong><br>
For standard orders, what you see in the product preview is what you'll receive. For bulk orders (10+), contact us for a complimentary digital proof.</p>

<p><strong>What if I make a spelling mistake in my order?</strong><br>
Please double-check your personalization before submitting! Once production begins, we cannot make changes. If we make an error, we'll replace it at no cost.</p>

<p><strong>Can I change or cancel my order?</strong><br>
Contact us within 2 hours of placing your order. After that, production may have already started on your personalized item.</p>

<hr>

<h3>SHIPPING & DELIVERY</h3>

<p><strong>How long does shipping take?</strong><br>
Most orders ship within 5-7 business days. This includes production time for your personalized item plus shipping transit.</p>

<p><strong>Do you offer expedited shipping?</strong><br>
Yes! Rush options are available at checkout for time-sensitive orders like weddings or events.</p>

<p><strong>Do you ship internationally?</strong><br>
Currently, we ship within the United States. International shipping coming soon!</p>

<p><strong>How do I track my order?</strong><br>
You'll receive a tracking number via email once your order ships. Check your spam folder if you don't see it within 5-7 business days.</p>

<hr>

<h3>PRODUCT INFORMATION</h3>

<p><strong>What are your bottles made of?</strong><br>
Premium double-walled stainless steel with BPA-free construction. Built to last and safe for everyday use.</p>

<p><strong>How long do they keep drinks cold/hot?</strong><br>
Cold drinks stay cold for up to 24 hours. Hot drinks stay warm for up to 12 hours.</p>

<p><strong>Are the bottles dishwasher safe?</strong><br>
We recommend hand washing to preserve the personalized design. The exterior print is durable but hand washing extends its life.</p>

<p><strong>Will the design fade or peel?</strong><br>
No! We use sublimation printing, which infuses the design into the bottle coating. It won't peel, crack, or fade with normal use.</p>

<p><strong>What sizes are available?</strong><br>
Check each product page for available sizes. Most bottles range from 17oz to 32oz.</p>

<hr>

<h3>RETURNS & ISSUES</h3>

<p><strong>Can I return a personalized item?</strong><br>
Due to the custom nature of our products, we cannot accept returns for buyer's remorse. However, we stand behind our quality 100%.</p>

<p><strong>What if my bottle arrives damaged?</strong><br>
Contact us within 14 days with photos of the damage. We'll send a replacement at no cost.</p>

<p><strong>What if there's a quality issue with my order?</strong><br>
We want you to love your bottle! If there's a defect or quality issue, reach out with photos and we'll make it right.</p>

<hr>

<h3>BULK & SPECIAL ORDERS</h3>

<p><strong>Do you offer bulk discounts?</strong><br>
Yes! Orders of 10+ bottles qualify for volume pricing. <a href="/pages/contact-us">Contact us</a> for a custom quote.</p>

<p><strong>Can you do corporate logos or custom designs?</strong><br>
Absolutely! We work with businesses for branded merchandise, team gifts, and corporate events. Reach out for details.</p>

<p><strong>How far in advance should I order for an event?</strong><br>
We recommend ordering at least 2-3 weeks before your event to allow for production and shipping. Rush orders available for tighter timelines.</p>

<hr>

<p>Still have questions? <a href="/pages/contact-us">Contact us</a> — we're happy to help!</p>
`;

// ============================================
// SHIPPING POLICY CONTENT
// ============================================
const shippingPolicyHtml = `
<h2>Shipping Policy</h2>

<h3>Processing Time</h3>
<p>All orders are custom-made just for you! Please allow <strong>3-5 business days</strong> for production of your personalized item before shipping.</p>

<h3>Shipping Time</h3>
<p>Once your order ships, delivery typically takes <strong>2-5 business days</strong> depending on your location.</p>

<p><strong>Total Delivery Time: 5-7 business days</strong></p>

<h3>Shipping Rates</h3>
<ul>
  <li><strong>FREE SHIPPING</strong> on orders $50+</li>
  <li><strong>Standard Shipping:</strong> $5.99 for orders under $50</li>
  <li><strong>Expedited Options:</strong> Available at checkout for rush orders</li>
</ul>

<h3>Order Tracking</h3>
<p>You'll receive a shipping confirmation email with tracking information once your order ships. If you don't see it, please check your spam folder.</p>

<h3>Shipping Destinations</h3>
<p>We currently ship within the <strong>United States</strong> only. International shipping coming soon!</p>

<h3>Questions?</h3>
<p>If you have questions about your shipment, please <a href="/pages/contact-us">contact us</a> and we'll be happy to help.</p>
`;

// ============================================
// REFUND POLICY CONTENT
// ============================================
const refundPolicyHtml = `
<h2>Return & Refund Policy</h2>

<p>Due to the personalized nature of our products, we cannot accept returns for buyer's remorse or change of mind. Each bottle is custom-made specifically for you!</p>

<p>However, we stand behind our quality 100% and want you to love your purchase.</p>

<h3>We Will Replace or Refund If:</h3>
<ul>
  <li><strong>Defective Item:</strong> Manufacturing defect or quality issue — full replacement or refund</li>
  <li><strong>Damaged in Shipping:</strong> Item arrives broken or damaged — full replacement (photo required)</li>
  <li><strong>Our Mistake:</strong> Spelling error or wrong design on our part — full replacement at no cost</li>
</ul>

<h3>Customer Errors</h3>
<p>If there's a spelling mistake or wrong name due to information you provided, we're sorry but we cannot offer a refund. However, we'll offer a <strong>20% discount</strong> on a corrected reorder.</p>

<h3>How to Report an Issue</h3>
<p>Contact us within <strong>14 days of delivery</strong> with:</p>
<ul>
  <li>Your order number</li>
  <li>Photos of the issue</li>
  <li>Brief description of the problem</li>
</ul>

<p>Email us at <a href="/pages/contact-us">our contact page</a> and we'll respond within 24-48 hours.</p>

<h3>Our Promise</h3>
<p>We want every customer to be thrilled with their Shelzy's Designs purchase. If something isn't right, we'll work with you to make it right!</p>
`;

async function updatePages() {
  console.log('\n📄 Updating Shelzy\'s Designs Pages...\n');

  try {
    // Get all pages
    const pagesData = await shopifyRequest('GET', '/pages.json');
    const pages = pagesData.pages;

    let aboutPage = pages.find(p => p.handle === 'about-us' || p.title.toLowerCase().includes('about'));
    let faqPage = pages.find(p => p.handle === 'faq' || p.title.toLowerCase().includes('faq'));

    // Update or create About page
    if (aboutPage) {
      await shopifyRequest('PUT', `/pages/${aboutPage.id}.json`, {
        page: { id: aboutPage.id, body_html: aboutPageHtml }
      });
      console.log('✅ About page updated');
    } else {
      await shopifyRequest('POST', '/pages.json', {
        page: { title: 'About Us', body_html: aboutPageHtml, published: true }
      });
      console.log('✅ About page created');
    }

    // Update or create FAQ page
    if (faqPage) {
      await shopifyRequest('PUT', `/pages/${faqPage.id}.json`, {
        page: { id: faqPage.id, body_html: faqPageHtml }
      });
      console.log('✅ FAQ page updated');
    } else {
      await shopifyRequest('POST', '/pages.json', {
        page: { title: 'FAQ', body_html: faqPageHtml, published: true }
      });
      console.log('✅ FAQ page created');
    }

    console.log('\n✅ Pages updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Add "FAQ" to your navigation menu');
    console.log('   2. Review pages at:');
    console.log('      • shelzysdesigns.com/pages/about-us');
    console.log('      • shelzysdesigns.com/pages/faq');
    console.log('\n💡 To update policies, go to Shopify Admin → Settings → Policies');
    console.log('   and paste the shipping/refund content manually.\n');

  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n❌ API access failed. Please update pages manually in Shopify Admin.');
  }
}

updatePages();
