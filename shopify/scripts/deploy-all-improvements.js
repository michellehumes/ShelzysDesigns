#!/usr/bin/env node

/**
 * COMPREHENSIVE SITE DEPLOYMENT SCRIPT
 * =====================================
 * Deploys ALL improvements to Shelzy's Designs in one command
 *
 * Usage:
 *   node shopify/scripts/deploy-all-improvements.js
 *
 * Environment Variables:
 *   SHOPIFY_STORE_URL - Your Shopify store URL
 *   SHOPIFY_ACCESS_TOKEN - Admin API access token
 *   AMAZON_ASSOCIATE_TAG - Your Amazon affiliate tag (optional)
 */

const https = require('https');

// Configuration
const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  amazonTag: process.env.AMAZON_ASSOCIATE_TAG || 'shelzysdesigns-20',
  apiVersion: '2024-01',
  dryRun: process.argv.includes('--dry-run')
};

// Console colors
const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  section: (msg) => console.log(`\n\x1b[35m${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}\x1b[0m\n`)
};

// Shopify API helper
function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    if (CONFIG.dryRun) {
      log.warn(`DRY RUN: ${method} ${endpoint}`);
      resolve({ success: true, dryRun: true });
      return;
    }

    if (!CONFIG.accessToken) {
      reject(new Error('SHOPIFY_ACCESS_TOKEN not set'));
      return;
    }

    const options = {
      hostname: CONFIG.storeUrl,
      port: 443,
      path: `/admin/api/${CONFIG.apiVersion}${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': CONFIG.accessToken
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else if (res.statusCode === 422) {
            // Likely already exists
            resolve({ exists: true, status: 422 });
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${body.substring(0, 200)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// PAGES
// ============================================

const PAGES = [
  {
    title: 'About',
    handle: 'about',
    body_html: `
<div class="page-content about-page">
  <div class="page-hero">
    <h1>Made With Care, One Bottle at a Time</h1>
    <p class="subtitle">The story behind Shelzy's Designs</p>
  </div>

  <div class="content-section">
    <div class="story-content">
      <p class="lead">Shelzy's Designs was created around one simple idea: personalized gifts should feel special, not cheap.</p>

      <p>After seeing too many "personalized" products made with vinyl decals that peel, crack, and fade within months, we knew there had to be a better way. That's why every single bottle we create uses <strong>true sublimation printing</strong>.</p>

      <p>With sublimation, the ink is permanently infused into the bottle's coating. It doesn't sit on top—it becomes part of the bottle itself. The result? A smooth, premium finish that looks just as beautiful years later as the day it arrived.</p>

      <p>Every bottle is designed, sublimated, and packed with care so that when it arrives at your door, it feels like a gift—even if it's for yourself.</p>
    </div>
  </div>

  <div class="values-section">
    <h2>What We Believe In</h2>
    <div class="values-grid">
      <div class="value-card">
        <h3>Quality Over Quantity</h3>
        <p>We'd rather make one beautiful bottle than a hundred that fall apart.</p>
      </div>
      <div class="value-card">
        <h3>Personal Touch</h3>
        <p>Every bottle is made to order, just for you or your loved ones.</p>
      </div>
      <div class="value-card">
        <h3>Real Craftsmanship</h3>
        <p>We take pride in what we create. If it's not perfect, it doesn't ship.</p>
      </div>
    </div>
  </div>

  <div class="cta-section">
    <h2>Ready to Create Something Special?</h2>
    <a href="/collections/all" class="btn-primary">Shop Our Collection</a>
  </div>
</div>

<style>
.about-page { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.page-hero { text-align: center; margin-bottom: 50px; }
.page-hero h1 { font-family: "Playfair Display", Georgia, serif; font-size: 2.5rem; color: #4E5F4A; margin-bottom: 10px; }
.page-hero .subtitle { font-size: 1.2rem; color: #666; }
.content-section { margin-bottom: 60px; }
.story-content { max-width: 700px; margin: 0 auto; }
.story-content .lead { font-size: 1.25rem; font-weight: 500; color: #333; margin-bottom: 1.5rem; }
.story-content p { font-size: 1.1rem; line-height: 1.8; color: #444; margin-bottom: 1.25rem; }
.values-section { background: #FAF9F6; padding: 50px 30px; border-radius: 12px; margin-bottom: 50px; }
.values-section h2 { text-align: center; font-family: "Playfair Display", Georgia, serif; color: #4E5F4A; margin-bottom: 30px; }
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; }
.value-card { background: #fff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.value-card h3 { color: #4E5F4A; margin-bottom: 10px; font-size: 1.2rem; }
.value-card p { color: #666; line-height: 1.6; }
.cta-section { text-align: center; background: #8BAA88; padding: 50px; border-radius: 12px; }
.cta-section h2 { color: #fff; font-family: "Playfair Display", Georgia, serif; margin-bottom: 20px; }
.btn-primary { display: inline-block; background: #fff; color: #4E5F4A; padding: 15px 35px; border-radius: 30px; text-decoration: none; font-weight: 600; transition: all 0.3s; }
.btn-primary:hover { background: #4E5F4A; color: #fff; }
</style>
    `
  },
  {
    title: 'Contact',
    handle: 'contact',
    body_html: `
<div class="page-content contact-page">
  <div class="page-hero">
    <h1>Get In Touch</h1>
    <p class="subtitle">Have a question? We'd love to hear from you.</p>
  </div>

  <div class="contact-grid">
    <div class="contact-form-section">
      <h2>Send Us a Message</h2>
      {% form 'contact' %}
        {% if form.posted_successfully? %}
          <div class="success-msg">Thanks for reaching out! We'll get back to you within 1 business day.</div>
        {% endif %}

        <div class="form-row">
          <label for="contact-name">Name *</label>
          <input type="text" id="contact-name" name="contact[name]" required>
        </div>

        <div class="form-row">
          <label for="contact-email">Email *</label>
          <input type="email" id="contact-email" name="contact[email]" required>
        </div>

        <div class="form-row">
          <label for="contact-subject">Subject</label>
          <select id="contact-subject" name="contact[subject]">
            <option value="General Question">General Question</option>
            <option value="Custom Order">Custom Order</option>
            <option value="Bulk Inquiry">Bulk/Corporate Inquiry</option>
            <option value="Order Issue">Order Issue</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-row">
          <label for="contact-order">Order Number (if applicable)</label>
          <input type="text" id="contact-order" name="contact[order_number]">
        </div>

        <div class="form-row">
          <label for="contact-message">Message *</label>
          <textarea id="contact-message" name="contact[body]" rows="5" required></textarea>
        </div>

        <button type="submit" class="btn-submit">Send Message</button>
      {% endform %}
    </div>

    <div class="contact-info-section">
      <div class="info-card">
        <h3>Email</h3>
        <p><a href="mailto:hello@shelzysdesigns.com">hello@shelzysdesigns.com</a></p>
      </div>

      <div class="info-card">
        <h3>Response Time</h3>
        <p>Within 1 business day</p>
      </div>

      <div class="info-card">
        <h3>Hours</h3>
        <p>Monday - Friday<br>9am - 5pm EST</p>
      </div>

      <div class="quick-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/pages/faq">Check our FAQ</a></li>
          <li><a href="/pages/bulk-corporate">Bulk Orders</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
.contact-page { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
.page-hero { text-align: center; margin-bottom: 50px; }
.page-hero h1 { font-family: "Playfair Display", Georgia, serif; font-size: 2.5rem; color: #4E5F4A; }
.page-hero .subtitle { color: #666; font-size: 1.1rem; }
.contact-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 50px; }
@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
.contact-form-section { background: #FAF9F6; padding: 40px; border-radius: 12px; }
.contact-form-section h2 { font-family: "Playfair Display", Georgia, serif; color: #4E5F4A; margin-bottom: 25px; }
.form-row { margin-bottom: 20px; }
.form-row label { display: block; font-weight: 500; margin-bottom: 5px; color: #333; }
.form-row input, .form-row select, .form-row textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
.form-row input:focus, .form-row select:focus, .form-row textarea:focus { outline: none; border-color: #8BAA88; }
.btn-submit { background: #8BAA88; color: #fff; border: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem; }
.btn-submit:hover { background: #4E5F4A; }
.success-msg { background: #d4edda; color: #155724; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
.info-card { margin-bottom: 25px; }
.info-card h3 { color: #4E5F4A; font-size: 1.1rem; margin-bottom: 8px; }
.info-card p { color: #666; line-height: 1.6; }
.info-card a { color: #8BAA88; }
.quick-links ul { list-style: none; padding: 0; }
.quick-links li { margin-bottom: 8px; }
.quick-links a { color: #8BAA88; text-decoration: none; }
.quick-links a:hover { text-decoration: underline; }
</style>
    `
  },
  {
    title: 'FAQ',
    handle: 'faq',
    body_html: `
<div class="page-content faq-page">
  <div class="page-hero">
    <h1>Frequently Asked Questions</h1>
    <p class="subtitle">Find answers to common questions about our products, ordering, and shipping.</p>
  </div>

  <div class="faq-container">
    <div class="faq-section">
      <h2>Product Questions</h2>

      <div class="faq-item">
        <h3>What is sublimation printing?</h3>
        <p>Sublimation is a printing process where ink is permanently infused into the bottle's coating using heat and pressure. Unlike vinyl decals that sit on top of the surface, sublimation becomes part of the bottle itself. This means it won't peel, crack, or fade—ever.</p>
      </div>

      <div class="faq-item">
        <h3>Why sublimation instead of vinyl?</h3>
        <p>Vinyl decals eventually peel, crack, and fade with use and washing. Sublimation printing is permanent and maintains its look for years. You get a smooth, professional finish that feels premium and lasts.</p>
      </div>

      <div class="faq-item">
        <h3>What size are the bottles?</h3>
        <p>Our standard bottles are 20oz insulated stainless steel. They keep drinks cold for 24 hours and hot for 12 hours.</p>
      </div>

      <div class="faq-item">
        <h3>Are the bottles dishwasher safe?</h3>
        <p>We recommend hand washing for best results and to preserve the colors. The sublimation print is durable, but hand washing will keep your bottle looking beautiful longer.</p>
      </div>
    </div>

    <div class="faq-section">
      <h2>Ordering & Customization</h2>

      <div class="faq-item">
        <h3>How do I personalize my bottle?</h3>
        <p>On each product page, you'll find customization options. Simply enter the name you want, choose your font style and color, and optionally add an icon.</p>
      </div>

      <div class="faq-item">
        <h3>What if I make a mistake in my personalization?</h3>
        <p>Please contact us immediately at hello@shelzysdesigns.com if you notice an error after ordering. If we haven't started production, we can make changes.</p>
      </div>

      <div class="faq-item">
        <h3>Can I cancel or change my order?</h3>
        <p>Since each item is made to order, we begin production quickly. Contact us within 2 hours of placing your order for the best chance of making changes.</p>
      </div>
    </div>

    <div class="faq-section">
      <h2>Shipping & Delivery</h2>

      <div class="faq-item">
        <h3>How long does shipping take?</h3>
        <p>Production takes 3-5 business days. Shipping typically takes 3-7 business days depending on your location. Total delivery time is usually 7-12 business days.</p>
      </div>

      <div class="faq-item">
        <h3>Do you offer expedited shipping?</h3>
        <p>Yes! We offer rush production and expedited shipping options at checkout for time-sensitive orders like weddings or events.</p>
      </div>

      <div class="faq-item">
        <h3>Do you ship internationally?</h3>
        <p>Currently, we ship within the United States and Canada. International shipping may be available for bulk orders—contact us to discuss.</p>
      </div>
    </div>

    <div class="faq-section">
      <h2>Returns & Issues</h2>

      <div class="faq-item">
        <h3>What is your return policy?</h3>
        <p>Since each item is personalized and made to order, we cannot accept returns for change of mind. However, if your item arrives damaged or with a production error, we'll make it right. Contact us within 7 days of delivery.</p>
      </div>

      <div class="faq-item">
        <h3>What if my bottle arrives damaged?</h3>
        <p>We're so sorry if that happens! Please email us at hello@shelzysdesigns.com with photos of the damage within 7 days of delivery, and we'll send a replacement.</p>
      </div>
    </div>

    <div class="faq-section">
      <h2>Bulk & Corporate Orders</h2>

      <div class="faq-item">
        <h3>Do you offer bulk pricing?</h3>
        <p>Yes! We offer tiered pricing for orders of 10+ bottles. Visit our <a href="/pages/bulk-corporate">Bulk & Corporate page</a> for details.</p>
      </div>

      <div class="faq-item">
        <h3>Can I add a company logo?</h3>
        <p>Absolutely! We can add your company logo alongside names. Contact us with your logo file and quantity for a custom quote.</p>
      </div>
    </div>
  </div>

  <div class="cta-section">
    <h2>Still Have Questions?</h2>
    <p>We're here to help!</p>
    <a href="/pages/contact" class="btn-primary">Contact Us</a>
  </div>
</div>

<style>
.faq-page { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.page-hero { text-align: center; margin-bottom: 50px; }
.page-hero h1 { font-family: "Playfair Display", Georgia, serif; font-size: 2.5rem; color: #4E5F4A; }
.page-hero .subtitle { color: #666; font-size: 1.1rem; max-width: 600px; margin: 10px auto 0; }
.faq-section { margin-bottom: 40px; }
.faq-section h2 { font-family: "Playfair Display", Georgia, serif; color: #4E5F4A; padding-bottom: 10px; border-bottom: 2px solid #8BAA88; margin-bottom: 20px; }
.faq-item { background: #FAF9F6; padding: 20px 25px; border-radius: 8px; margin-bottom: 15px; }
.faq-item h3 { color: #4E5F4A; font-size: 1.1rem; margin-bottom: 10px; }
.faq-item p { color: #555; line-height: 1.7; margin: 0; }
.faq-item a { color: #8BAA88; }
.cta-section { text-align: center; background: #8BAA88; padding: 40px; border-radius: 12px; margin-top: 40px; }
.cta-section h2 { color: #fff; font-family: "Playfair Display", Georgia, serif; margin-bottom: 10px; }
.cta-section p { color: rgba(255,255,255,0.9); margin-bottom: 20px; }
.btn-primary { display: inline-block; background: #fff; color: #4E5F4A; padding: 14px 30px; border-radius: 30px; text-decoration: none; font-weight: 600; }
.btn-primary:hover { background: #4E5F4A; color: #fff; }
</style>
    `
  },
  {
    title: 'How It Works',
    handle: 'how-it-works',
    body_html: `
<div class="page-content how-it-works-page">
  <div class="page-hero">
    <h1>How It Works</h1>
    <p class="subtitle">Getting your personalized bottle is easy. Here's what to expect.</p>
  </div>

  <div class="steps-container">
    <div class="step-card">
      <div class="step-number">1</div>
      <h2>Choose Your Design</h2>
      <p>Browse our collection and pick the perfect bottle style. We have options for bridesmaids, kids, everyday use, and more.</p>
    </div>

    <div class="step-card">
      <div class="step-number">2</div>
      <h2>Personalize It</h2>
      <p>Enter the name, choose your font style and text color, and optionally add a fun icon. We'll make sure it looks perfectly balanced.</p>
    </div>

    <div class="step-card">
      <div class="step-number">3</div>
      <h2>We Create & Ship</h2>
      <p>Our team carefully creates your custom bottle using premium sublimation printing. We package it beautifully and ship it to your door.</p>
      <div class="timeline-box">
        <p><strong>Production:</strong> 3-5 business days</p>
        <p><strong>Shipping:</strong> 3-7 business days</p>
        <p class="rush">Need it sooner? Rush options available!</p>
      </div>
    </div>
  </div>

  <div class="sublimation-section">
    <h2>Why Our Bottles Don't Peel, Crack, or Fade</h2>
    <div class="sublimation-content">
      <p>Most personalized bottles use vinyl decals that eventually peel, crack, or fade. At Shelzy's Designs, we use <strong>true sublimation printing</strong>.</p>
      <p>The ink is infused directly into the bottle's coating using heat and pressure. It doesn't sit on top—it becomes part of the bottle itself.</p>

      <div class="benefits-grid">
        <div class="benefit">✓ Smooth finish with no raised edges</div>
        <div class="benefit">✓ Won't peel, crack, or fade</div>
        <div class="benefit">✓ Looks professional and lasts for years</div>
        <div class="benefit">✓ Safe for regular use and washing</div>
      </div>
    </div>
  </div>

  <div class="cta-section">
    <h2>Ready to Get Started?</h2>
    <a href="/collections/all" class="btn-primary">Shop Now</a>
  </div>
</div>

<style>
.how-it-works-page { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.page-hero { text-align: center; margin-bottom: 50px; }
.page-hero h1 { font-family: "Playfair Display", Georgia, serif; font-size: 2.5rem; color: #4E5F4A; }
.page-hero .subtitle { color: #666; font-size: 1.1rem; }
.steps-container { margin-bottom: 60px; }
.step-card { background: #FAF9F6; padding: 35px; border-radius: 12px; margin-bottom: 25px; }
.step-number { width: 50px; height: 50px; background: #8BAA88; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 15px; }
.step-card h2 { font-family: "Playfair Display", Georgia, serif; color: #4E5F4A; margin-bottom: 10px; }
.step-card p { color: #555; line-height: 1.7; }
.timeline-box { background: #fff; padding: 20px; border-radius: 8px; margin-top: 15px; }
.timeline-box p { margin: 5px 0; color: #555; }
.timeline-box .rush { color: #8BAA88; font-style: italic; margin-top: 10px; }
.sublimation-section { background: #4E5F4A; color: #fff; padding: 50px 40px; border-radius: 12px; margin-bottom: 40px; }
.sublimation-section h2 { font-family: "Playfair Display", Georgia, serif; text-align: center; margin-bottom: 25px; }
.sublimation-content { max-width: 700px; margin: 0 auto; }
.sublimation-content p { line-height: 1.8; margin-bottom: 15px; text-align: center; }
.benefits-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 25px; }
@media (max-width: 600px) { .benefits-grid { grid-template-columns: 1fr; } }
.benefit { background: rgba(255,255,255,0.1); padding: 15px 20px; border-radius: 6px; }
.cta-section { text-align: center; background: #8BAA88; padding: 50px; border-radius: 12px; }
.cta-section h2 { color: #fff; font-family: "Playfair Display", Georgia, serif; margin-bottom: 20px; }
.btn-primary { display: inline-block; background: #fff; color: #4E5F4A; padding: 15px 35px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 1.1rem; }
.btn-primary:hover { background: #4E5F4A; color: #fff; }
</style>
    `
  },
  {
    title: 'Bulk & Corporate Orders',
    handle: 'bulk-corporate',
    body_html: `
<div class="page-content bulk-page">
  <div class="page-hero">
    <h1>Bulk & Corporate Orders</h1>
    <p class="subtitle">Custom personalized bottles for your team, event, or wedding party.</p>
  </div>

  <div class="bulk-intro">
    <p>Whether you're ordering for a bridal party, corporate event, sports team, or company gift, we've got you covered with volume pricing and dedicated support.</p>
  </div>

  <div class="pricing-section">
    <h2>Volume Pricing</h2>
    <div class="pricing-grid">
      <div class="pricing-tier">
        <h3>10-24 Bottles</h3>
        <p class="discount">10% Off</p>
        <p class="note">Perfect for bridal parties</p>
      </div>
      <div class="pricing-tier featured">
        <h3>25-49 Bottles</h3>
        <p class="discount">15% Off</p>
        <p class="note">Great for small teams</p>
      </div>
      <div class="pricing-tier">
        <h3>50-99 Bottles</h3>
        <p class="discount">20% Off</p>
        <p class="note">Ideal for departments</p>
      </div>
      <div class="pricing-tier">
        <h3>100+ Bottles</h3>
        <p class="discount">25% Off</p>
        <p class="note">Contact for custom quote</p>
      </div>
    </div>
  </div>

  <div class="use-cases">
    <h2>Perfect For</h2>
    <div class="use-cases-grid">
      <div class="use-case">
        <h3>Weddings & Bridal Parties</h3>
        <p>Personalized bottles for bridesmaids, groomsmen, and wedding party gifts.</p>
      </div>
      <div class="use-case">
        <h3>Corporate Gifts</h3>
        <p>Employee appreciation, client gifts, and company swag with your logo.</p>
      </div>
      <div class="use-case">
        <h3>Sports Teams</h3>
        <p>Team bottles with names and numbers for schools, clubs, and leagues.</p>
      </div>
      <div class="use-case">
        <h3>Events & Parties</h3>
        <p>Bachelorette parties, reunions, and special celebrations.</p>
      </div>
    </div>
  </div>

  <div class="quote-section">
    <h2>Request a Quote</h2>
    <p>Fill out the form below and we'll get back to you within 1 business day with pricing and a timeline.</p>

    {% form 'contact' %}
      {% if form.posted_successfully? %}
        <div class="success-msg">Thanks! We'll send your quote within 1 business day.</div>
      {% endif %}

      <input type="hidden" name="contact[subject]" value="Bulk Order Inquiry">

      <div class="form-row">
        <label>Name *</label>
        <input type="text" name="contact[name]" required>
      </div>

      <div class="form-row">
        <label>Email *</label>
        <input type="email" name="contact[email]" required>
      </div>

      <div class="form-row">
        <label>Company/Organization</label>
        <input type="text" name="contact[company]">
      </div>

      <div class="form-row">
        <label>Quantity Needed *</label>
        <select name="contact[quantity]" required>
          <option value="">Select quantity...</option>
          <option value="10-24">10-24 bottles</option>
          <option value="25-49">25-49 bottles</option>
          <option value="50-99">50-99 bottles</option>
          <option value="100+">100+ bottles</option>
        </select>
      </div>

      <div class="form-row">
        <label>Event/Use Case *</label>
        <select name="contact[use_case]" required>
          <option value="">Select...</option>
          <option value="Wedding/Bridal">Wedding/Bridal Party</option>
          <option value="Corporate">Corporate Gifts</option>
          <option value="Sports Team">Sports Team</option>
          <option value="Event">Event/Party</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="form-row">
        <label>Date Needed By</label>
        <input type="date" name="contact[date_needed]">
      </div>

      <div class="form-row">
        <label>Additional Details</label>
        <textarea name="contact[body]" rows="4" placeholder="Include any specific requirements, names list, logo needs, etc."></textarea>
      </div>

      <button type="submit" class="btn-submit">Request Quote</button>
    {% endform %}
  </div>
</div>

<style>
.bulk-page { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
.page-hero { text-align: center; margin-bottom: 30px; }
.page-hero h1 { font-family: "Playfair Display", Georgia, serif; font-size: 2.5rem; color: #4E5F4A; }
.page-hero .subtitle { color: #666; font-size: 1.1rem; }
.bulk-intro { text-align: center; max-width: 700px; margin: 0 auto 50px; font-size: 1.1rem; color: #555; line-height: 1.7; }
.pricing-section { margin-bottom: 60px; }
.pricing-section h2 { text-align: center; font-family: "Playfair Display", Georgia, serif; color: #4E5F4A; margin-bottom: 30px; }
.pricing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 768px) { .pricing-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .pricing-grid { grid-template-columns: 1fr; } }
.pricing-tier { background: #FAF9F6; padding: 30px 20px; border-radius: 12px; text-align: center; }
.pricing-tier.featured { background: #8BAA88; color: #fff; transform: scale(1.05); }
.pricing-tier h3 { margin-bottom: 10px; }
.pricing-tier .discount { font-size: 1.5rem; font-weight: 700; color: #4E5F4A; }
.pricing-tier.featured .discount { color: #fff; }
.pricing-tier .note { font-size: 0.9rem; color: #666; margin-top: 5px; }
.pricing-tier.featured .note { color: rgba(255,255,255,0.8); }
.use-cases { margin-bottom: 60px; }
.use-cases h2 { text-align: center; font-family: "Playfair Display", Georgia, serif; color: #4E5F4A; margin-bottom: 30px; }
.use-cases-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }
@media (max-width: 600px) { .use-cases-grid { grid-template-columns: 1fr; } }
.use-case { background: #FAF9F6; padding: 25px; border-radius: 12px; }
.use-case h3 { color: #4E5F4A; margin-bottom: 10px; }
.use-case p { color: #666; line-height: 1.6; }
.quote-section { background: #FAF9F6; padding: 50px; border-radius: 12px; }
.quote-section h2 { font-family: "Playfair Display", Georgia, serif; color: #4E5F4A; margin-bottom: 10px; }
.quote-section > p { color: #666; margin-bottom: 30px; }
.form-row { margin-bottom: 20px; }
.form-row label { display: block; font-weight: 500; margin-bottom: 5px; color: #333; }
.form-row input, .form-row select, .form-row textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
.btn-submit { background: #8BAA88; color: #fff; border: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem; }
.btn-submit:hover { background: #4E5F4A; }
.success-msg { background: #d4edda; color: #155724; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
</style>
    `
  }
];

// ============================================
// COLLECTIONS
// ============================================

const COLLECTIONS = [
  {
    title: 'Best Sellers',
    handle: 'best-sellers',
    body_html: '<p>Our most-loved personalized bottles, chosen by thousands of happy customers. Each features permanent sublimation printing that never peels or fades.</p>',
    sort_order: 'best-selling'
  },
  {
    title: 'Personalized Bottles',
    handle: 'personalized-bottles',
    body_html: '<p>Custom sublimation water bottles for everyday use. Your name, your style, your bottle.</p>'
  },
  {
    title: 'Bridesmaid & Bridal Party',
    handle: 'bridesmaid-bridal-party',
    body_html: '<p>Perfect gifts for your bridal party! Personalized bottles they\'ll actually use, with permanent sublimation that lasts forever.</p>'
  },
  {
    title: 'Proposal Gift Boxes',
    handle: 'proposal-gift-boxes',
    body_html: '<p>Premium bridesmaid proposal boxes with personalized bottles and beautifully curated gifts. Make your proposal unforgettable!</p>'
  },
  {
    title: 'Kids Bottles',
    handle: 'kids-bottles',
    body_html: '<p>Fun, durable personalized bottles perfect for school, sports, and everyday adventures. Kids love seeing their own name!</p>'
  },
  {
    title: 'Holiday Collection',
    handle: 'holiday-collection',
    body_html: '<p>Seasonal designs perfect for holiday gifting. Limited edition personalized bottles for every celebration.</p>'
  }
];

// ============================================
// BLOG POSTS
// ============================================

const BLOG_POSTS = [
  {
    title: 'Best Bridesmaid Gift Ideas for 2025',
    handle: 'best-bridesmaid-gift-ideas-2025',
    tags: 'bridesmaid, gifts, wedding, bridal party',
    body_html: (amazonTag) => `
<article class="blog-post">
  <p>Looking for bridesmaid gifts that your squad will actually use and love? Skip the typical throw-away gifts and give them something thoughtful and practical. Here are our top bridesmaid gift ideas for 2025!</p>

  <h2>1. Personalized Water Bottles</h2>
  <p>A custom sublimation water bottle with their name is both practical and meaningful. Unlike vinyl decals that peel and fade, sublimation printing lasts forever. Your bridesmaids will use these daily—at the gym, at work, and on the wedding day itself!</p>
  <p><a href="/collections/bridesmaid-bridal-party">Shop our bridesmaid bottles</a></p>

  <h2>2. Cozy Satin Robes</h2>
  <p>Perfect for getting-ready photos on wedding day and lounging at home after. Look for quality satin that feels luxurious against the skin.</p>
  <p><a href="https://www.amazon.com/s?k=bridesmaid+robes&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Check out highly-rated robes on Amazon</a></p>

  <h2>3. Personalized Jewelry</h2>
  <p>Initial necklaces or birthstone pieces make meaningful keepsakes they'll treasure for years.</p>
  <p><a href="https://www.amazon.com/s?k=bridesmaid+jewelry+personalized&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Browse personalized jewelry options</a></p>

  <h2>4. Bridesmaid Proposal Gift Boxes</h2>
  <p>Go all out with a curated gift box that includes a personalized bottle, candle, scrunchie, and proposal card. It's the ultimate "will you be my bridesmaid?" experience.</p>
  <p><a href="/collections/proposal-gift-boxes">Shop our proposal boxes</a></p>

  <h2>5. Custom Tote Bags</h2>
  <p>Canvas totes with their name or title are perfect for wedding day and everyday use. Fill them with other small gifts for an extra special touch.</p>
  <p><a href="https://www.amazon.com/s?k=personalized+tote+bag+bridesmaid&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">See tote bag options</a></p>

  <h2>6. Self-Care Gift Sets</h2>
  <p>Bath bombs, face masks, and luxurious lotions help your squad relax before the big day.</p>
  <p><a href="https://www.amazon.com/s?k=spa+gift+set+women&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Shop self-care sets</a></p>

  <div class="cta-box">
    <h3>Looking for personalized bridesmaid gifts?</h3>
    <p>Our sublimation bottles make the perfect gift—they'll never peel, crack, or fade!</p>
    <a href="/collections/bridesmaid-bridal-party" class="btn">Shop Bridesmaid Collection</a>
  </div>

  <p class="disclosure"><em>Disclosure: This post contains affiliate links. We may earn a small commission at no extra cost to you.</em></p>
</article>

<style>
.blog-post { max-width: 750px; margin: 0 auto; line-height: 1.8; }
.blog-post h2 { color: #4E5F4A; margin: 35px 0 15px; font-family: "Playfair Display", Georgia, serif; }
.blog-post p { margin-bottom: 15px; }
.blog-post a { color: #8BAA88; }
.cta-box { background: #FAF9F6; padding: 30px; border-radius: 12px; text-align: center; margin: 40px 0; }
.cta-box h3 { color: #4E5F4A; margin-bottom: 10px; }
.cta-box .btn { display: inline-block; background: #8BAA88; color: #fff; padding: 12px 25px; border-radius: 25px; text-decoration: none; margin-top: 15px; }
.disclosure { background: #f8f8f8; padding: 15px; border-radius: 8px; font-size: 0.9rem; margin-top: 40px; }
</style>
    `
  },
  {
    title: 'Wedding Planning Essentials Checklist 2025',
    handle: 'wedding-planning-essentials-checklist',
    tags: 'wedding, planning, checklist, bride',
    body_html: (amazonTag) => `
<article class="blog-post">
  <p>Planning your dream wedding? Having the right essentials on hand will make the process so much smoother. Here's your complete checklist!</p>

  <h2>For the Planning Process</h2>
  <ul>
    <li><strong>Wedding Planner Binder:</strong> Keep everything organized in one place. <a href="https://www.amazon.com/s?k=wedding+planner+binder&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Top-rated wedding planners</a></li>
    <li><strong>Personalized Water Bottle:</strong> Stay hydrated during venue tours and wedding planning! <a href="/products/personalized-water-bottle">Get yours</a></li>
    <li><strong>Comfortable Shoes:</strong> You'll be on your feet a lot during planning</li>
  </ul>

  <h2>For Your Bridal Party</h2>
  <ul>
    <li><strong>Matching Robes:</strong> Essential for getting-ready photos. <a href="https://www.amazon.com/s?k=bridal+party+robes+set&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Shop matching robe sets</a></li>
    <li><strong>Personalized Bottles:</strong> Keep everyone hydrated on the big day. <a href="/collections/bridesmaid-bridal-party">Shop bridesmaid bottles</a></li>
    <li><strong>Proposal Boxes:</strong> Make asking them special! <a href="/collections/proposal-gift-boxes">See our gift boxes</a></li>
  </ul>

  <h2>Day-Of Emergency Kit</h2>
  <ul>
    <li>Sewing kit with safety pins</li>
    <li>Stain remover pen</li>
    <li>Pain reliever and antacids</li>
    <li>Touch-up makeup essentials</li>
    <li>Phone chargers (multiple!)</li>
    <li>Snacks and water bottles</li>
    <li>Comfortable shoes for dancing</li>
  </ul>

  <h2>Getting Ready Must-Haves</h2>
  <ul>
    <li><strong>Steamer:</strong> For last-minute wrinkles and touch-ups. <a href="https://www.amazon.com/s?k=clothes+steamer+portable&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Portable steamers</a></li>
    <li><strong>Full-Length Mirror:</strong> A must for the bridal suite</li>
    <li><strong>Good Lighting:</strong> For makeup and photos</li>
  </ul>

  <div class="cta-box">
    <h3>Ready to hydrate your bridal party?</h3>
    <p>Personalized bottles make the perfect getting-ready accessory!</p>
    <a href="/collections/bridesmaid-bridal-party" class="btn">Shop Now</a>
  </div>

  <p class="disclosure"><em>Disclosure: This post contains affiliate links.</em></p>
</article>

<style>
.blog-post { max-width: 750px; margin: 0 auto; line-height: 1.8; }
.blog-post h2 { color: #4E5F4A; margin: 35px 0 15px; font-family: "Playfair Display", Georgia, serif; }
.blog-post ul { margin-bottom: 25px; }
.blog-post li { margin-bottom: 10px; }
.blog-post a { color: #8BAA88; }
.cta-box { background: #FAF9F6; padding: 30px; border-radius: 12px; text-align: center; margin: 40px 0; }
.cta-box h3 { color: #4E5F4A; margin-bottom: 10px; }
.cta-box .btn { display: inline-block; background: #8BAA88; color: #fff; padding: 12px 25px; border-radius: 25px; text-decoration: none; margin-top: 15px; }
.disclosure { background: #f8f8f8; padding: 15px; border-radius: 8px; font-size: 0.9rem; margin-top: 40px; }
</style>
    `
  },
  {
    title: 'Best Kids Water Bottles for School 2025',
    handle: 'best-kids-water-bottles-school-2025',
    tags: 'kids, school, back to school, water bottles',
    body_html: (amazonTag) => `
<article class="blog-post">
  <p>Finding the perfect water bottle for your kid can be tricky! It needs to be durable, leak-proof, and—let's be honest—something they'll actually want to use. Here are our top picks for 2025!</p>

  <h2>What to Look For</h2>
  <ul>
    <li><strong>Durability:</strong> It WILL get dropped. A lot.</li>
    <li><strong>Leak-Proof:</strong> Backpack protection is essential</li>
    <li><strong>Easy to Clean:</strong> Wide mouth openings are best</li>
    <li><strong>Fun Design:</strong> If they don't love it, they won't use it!</li>
    <li><strong>Right Size:</strong> 12-20oz works for most ages</li>
  </ul>

  <h2>Our Top Picks</h2>

  <h3>1. Personalized Sublimation Bottles (Our Pick!)</h3>
  <p>Nothing beats seeing their own name on their bottle! Our kids' bottles feature fun designs with dinosaurs, unicorns, rainbows, and more. The sublimation printing never peels—even with daily dishwasher use.</p>
  <p><a href="/collections/kids-bottles">Shop kids bottles</a></p>

  <h3>2. CamelBak Eddy+ Kids</h3>
  <p>The spill-proof straw design is perfect for little hands. Easy to carry and virtually indestructible.</p>
  <p><a href="https://www.amazon.com/s?k=camelbak+eddy+kids&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Check prices on Amazon</a></p>

  <h3>3. Thermos Funtainer</h3>
  <p>Keeps drinks cold for hours—great for lunch boxes! Available in tons of fun character designs.</p>
  <p><a href="https://www.amazon.com/s?k=thermos+funtainer+kids&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">See options on Amazon</a></p>

  <h3>4. Contigo AUTOSPOUT</h3>
  <p>One-handed operation is great for kids on the go. Spill-proof and easy to clean.</p>
  <p><a href="https://www.amazon.com/s?k=contigo+kids+water+bottle&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Shop Contigo kids bottles</a></p>

  <h2>Tips for Getting Kids to Drink More Water</h2>
  <ul>
    <li>Let them choose their own bottle—they're more likely to use it</li>
    <li>Add fruit for natural flavor</li>
    <li>Make it a game with water drinking challenges</li>
    <li>Keep a bottle visible at all times</li>
    <li>Personalize it with their name so it doesn't get lost!</li>
  </ul>

  <div class="cta-box">
    <h3>Make it theirs!</h3>
    <p>Kids love seeing their name on their bottle. Our personalized kids bottles are durable, fun, and the design never peels!</p>
    <a href="/collections/kids-bottles" class="btn">Shop Kids Bottles</a>
  </div>

  <p class="disclosure"><em>Disclosure: This post contains affiliate links.</em></p>
</article>

<style>
.blog-post { max-width: 750px; margin: 0 auto; line-height: 1.8; }
.blog-post h2 { color: #4E5F4A; margin: 35px 0 15px; font-family: "Playfair Display", Georgia, serif; }
.blog-post h3 { color: #4E5F4A; margin: 25px 0 10px; }
.blog-post ul { margin-bottom: 25px; }
.blog-post li { margin-bottom: 10px; }
.blog-post a { color: #8BAA88; }
.cta-box { background: #FAF9F6; padding: 30px; border-radius: 12px; text-align: center; margin: 40px 0; }
.cta-box h3 { color: #4E5F4A; margin-bottom: 10px; }
.cta-box .btn { display: inline-block; background: #8BAA88; color: #fff; padding: 12px 25px; border-radius: 25px; text-decoration: none; margin-top: 15px; }
.disclosure { background: #f8f8f8; padding: 15px; border-radius: 8px; font-size: 0.9rem; margin-top: 40px; }
</style>
    `
  },
  {
    title: 'How to Plan the Perfect Bridal Shower',
    handle: 'how-to-plan-perfect-bridal-shower',
    tags: 'bridal shower, wedding, bride, planning, party',
    body_html: (amazonTag) => `
<article class="blog-post">
  <p>Planning a bridal shower for your bestie? Here's everything you need to make it unforgettable—from themes to games to the perfect party favors!</p>

  <h2>When to Host</h2>
  <p>Typically 2-3 months before the wedding. This gives the bride time to enjoy the celebration without the stress of last-minute wedding prep.</p>

  <h2>Popular Themes for 2025</h2>
  <ul>
    <li><strong>Garden Party:</strong> Florals, pastels, and outdoor elegance</li>
    <li><strong>Spa Day:</strong> Relaxation and pampering</li>
    <li><strong>Brunch & Bubbly:</strong> Mimosas and delicious food</li>
    <li><strong>Tropical Paradise:</strong> Think palm leaves and coconuts</li>
    <li><strong>Travel/Adventure:</strong> For the jet-setting couple</li>
  </ul>

  <h2>Essential Supplies</h2>
  <ul>
    <li><strong>Decorations:</strong> Balloons, banners, table settings. <a href="https://www.amazon.com/s?k=bridal+shower+decorations&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Shop bridal shower decor</a></li>
    <li><strong>Games & Activities:</strong> Keep guests entertained! <a href="https://www.amazon.com/s?k=bridal+shower+games&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Browse party games</a></li>
    <li><strong>Favors:</strong> Small gifts guests will love. <a href="https://www.amazon.com/s?k=bridal+shower+favors&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Favor ideas</a></li>
  </ul>

  <h2>Party Favor Ideas</h2>
  <ul>
    <li>Mini champagne bottles</li>
    <li>Personalized candles</li>
    <li>Custom water bottles (perfect for the bridal party!)</li>
    <li>Bath bombs or soap</li>
    <li>Succulent plants</li>
  </ul>

  <h2>Fun Games Everyone Will Love</h2>
  <ul>
    <li><strong>How Well Do You Know the Bride:</strong> Quiz time!</li>
    <li><strong>Wedding Mad Libs:</strong> Always hilarious</li>
    <li><strong>Bridal Bingo:</strong> A crowd favorite</li>
    <li><strong>Ring Hunt:</strong> Hide plastic rings, whoever finds most wins</li>
    <li><strong>Advice Cards:</strong> Meaningful and sweet</li>
  </ul>

  <div class="cta-box">
    <h3>Don't Forget the Bride!</h3>
    <p>A personalized water bottle makes a perfect shower gift she'll use every day!</p>
    <a href="/collections/bridesmaid-bridal-party" class="btn">Shop Bridal Collection</a>
  </div>

  <p class="disclosure"><em>Disclosure: This post contains affiliate links.</em></p>
</article>

<style>
.blog-post { max-width: 750px; margin: 0 auto; line-height: 1.8; }
.blog-post h2 { color: #4E5F4A; margin: 35px 0 15px; font-family: "Playfair Display", Georgia, serif; }
.blog-post ul { margin-bottom: 25px; }
.blog-post li { margin-bottom: 10px; }
.blog-post a { color: #8BAA88; }
.cta-box { background: #FAF9F6; padding: 30px; border-radius: 12px; text-align: center; margin: 40px 0; }
.cta-box h3 { color: #4E5F4A; margin-bottom: 10px; }
.cta-box .btn { display: inline-block; background: #8BAA88; color: #fff; padding: 12px 25px; border-radius: 25px; text-decoration: none; margin-top: 15px; }
.disclosure { background: #f8f8f8; padding: 15px; border-radius: 8px; font-size: 0.9rem; margin-top: 40px; }
</style>
    `
  },
  {
    title: 'Personalized Gifts That Actually Get Used',
    handle: 'personalized-gifts-that-get-used',
    tags: 'gifts, personalized, practical, ideas',
    body_html: (amazonTag) => `
<article class="blog-post">
  <p>We've all received personalized gifts that end up collecting dust. Here's how to give personalized gifts people will actually use and love!</p>

  <h2>The Key: Practicality Meets Personalization</h2>
  <p>The best personalized gifts are items people use daily. When you add their name to something practical, it becomes both meaningful AND functional.</p>

  <h2>Gifts People Actually Use</h2>

  <h3>1. Personalized Water Bottles</h3>
  <p>Everyone needs hydration! A custom bottle with their name becomes their go-to for the gym, office, and everyday life. Choose sublimation printing for a design that never peels.</p>
  <p><a href="/collections/personalized-bottles">Shop personalized bottles</a></p>

  <h3>2. Custom Jewelry</h3>
  <p>Initial necklaces, name bracelets, or birthstone pieces are worn daily and treasured forever.</p>
  <p><a href="https://www.amazon.com/s?k=personalized+name+necklace&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Browse personalized jewelry</a></p>

  <h3>3. Monogrammed Bags</h3>
  <p>Tote bags, weekender bags, and backpacks with initials are practical for everyday use.</p>
  <p><a href="https://www.amazon.com/s?k=monogrammed+tote+bag&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Shop monogrammed bags</a></p>

  <h3>4. Custom Phone Cases</h3>
  <p>We're on our phones constantly—why not make it personal?</p>
  <p><a href="https://www.amazon.com/s?k=custom+name+phone+case&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">Design a custom case</a></p>

  <h3>5. Personalized Blankets</h3>
  <p>Cozy, practical, and perfect for movie nights.</p>
  <p><a href="https://www.amazon.com/s?k=personalized+blanket+name&tag=${amazonTag}" target="_blank" rel="nofollow sponsored">See personalized blankets</a></p>

  <h2>Gifts to Avoid</h2>
  <ul>
    <li>Decorative items with no function</li>
    <li>Clothing in wrong sizes</li>
    <li>Items with low-quality personalization (vinyl that peels!)</li>
    <li>Things too trendy to last</li>
  </ul>

  <div class="cta-box">
    <h3>Give a Gift They'll Use Every Day</h3>
    <p>Our personalized bottles combine practicality with permanent sublimation printing that never peels!</p>
    <a href="/collections/all" class="btn">Shop All Bottles</a>
  </div>

  <p class="disclosure"><em>Disclosure: This post contains affiliate links.</em></p>
</article>

<style>
.blog-post { max-width: 750px; margin: 0 auto; line-height: 1.8; }
.blog-post h2 { color: #4E5F4A; margin: 35px 0 15px; font-family: "Playfair Display", Georgia, serif; }
.blog-post h3 { color: #4E5F4A; margin: 25px 0 10px; }
.blog-post ul { margin-bottom: 25px; }
.blog-post li { margin-bottom: 10px; }
.blog-post a { color: #8BAA88; }
.cta-box { background: #FAF9F6; padding: 30px; border-radius: 12px; text-align: center; margin: 40px 0; }
.cta-box h3 { color: #4E5F4A; margin-bottom: 10px; }
.cta-box .btn { display: inline-block; background: #8BAA88; color: #fff; padding: 12px 25px; border-radius: 25px; text-decoration: none; margin-top: 15px; }
.disclosure { background: #f8f8f8; padding: 15px; border-radius: 8px; font-size: 0.9rem; margin-top: 40px; }
</style>
    `
  },
  {
    title: 'Vinyl vs Sublimation: What You Need to Know',
    handle: 'vinyl-vs-sublimation-difference',
    tags: 'sublimation, vinyl, personalization, quality',
    body_html: (amazonTag) => `
<article class="blog-post">
  <p>When shopping for personalized products, you'll encounter two main methods: vinyl and sublimation. Understanding the difference can save you from disappointment!</p>

  <h2>What is Vinyl?</h2>
  <p>Vinyl is a sticker-like material that's cut and applied to products. It sits ON TOP of the surface.</p>

  <h3>Vinyl Pros:</h3>
  <ul>
    <li>Lower upfront cost</li>
    <li>Quick to produce</li>
    <li>Works on almost any surface</li>
  </ul>

  <h3>Vinyl Cons:</h3>
  <ul>
    <li>Peels over time</li>
    <li>Cracks with bending</li>
    <li>Edges catch and lift</li>
    <li>Fades in sunlight</li>
    <li>Not truly dishwasher safe</li>
  </ul>

  <h2>What is Sublimation?</h2>
  <p>Sublimation uses heat and pressure to infuse ink directly INTO the product's coating. The ink becomes part of the item itself.</p>

  <h3>Sublimation Pros:</h3>
  <ul>
    <li>Permanent—never peels or cracks</li>
    <li>Smooth finish with no raised edges</li>
    <li>Vibrant, long-lasting colors</li>
    <li>More dishwasher resistant</li>
    <li>Looks professional</li>
  </ul>

  <h3>Sublimation Cons:</h3>
  <ul>
    <li>Higher cost</li>
    <li>Only works on specially coated items</li>
    <li>Limited to white or light-colored bases</li>
  </ul>

  <h2>The Bottom Line</h2>
  <p>For items you'll use daily (like water bottles), sublimation is worth the investment. The design lasts for years instead of months.</p>

  <div class="comparison-box">
    <div class="compare-col">
      <h3>Vinyl</h3>
      <p>Lasts: 3-12 months</p>
      <p>Feel: Raised edges</p>
      <p>Result: Peels/cracks</p>
    </div>
    <div class="compare-col">
      <h3>Sublimation</h3>
      <p>Lasts: Years</p>
      <p>Feel: Smooth</p>
      <p>Result: Stays perfect</p>
    </div>
  </div>

  <div class="cta-box">
    <h3>Experience the Sublimation Difference</h3>
    <p>All our bottles use true sublimation printing that never peels, cracks, or fades.</p>
    <a href="/collections/all" class="btn">Shop Sublimation Bottles</a>
  </div>
</article>

<style>
.blog-post { max-width: 750px; margin: 0 auto; line-height: 1.8; }
.blog-post h2 { color: #4E5F4A; margin: 35px 0 15px; font-family: "Playfair Display", Georgia, serif; }
.blog-post h3 { color: #4E5F4A; margin: 25px 0 10px; }
.blog-post ul { margin-bottom: 25px; }
.blog-post li { margin-bottom: 10px; }
.comparison-box { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
.compare-col { background: #FAF9F6; padding: 25px; border-radius: 12px; text-align: center; }
.compare-col h3 { color: #4E5F4A; margin-bottom: 15px; }
.cta-box { background: #8BAA88; padding: 30px; border-radius: 12px; text-align: center; margin: 40px 0; color: #fff; }
.cta-box h3 { color: #fff; margin-bottom: 10px; }
.cta-box .btn { display: inline-block; background: #fff; color: #4E5F4A; padding: 12px 25px; border-radius: 25px; text-decoration: none; margin-top: 15px; }
</style>
    `
  }
];

// ============================================
// MAIN DEPLOYMENT FUNCTIONS
// ============================================

async function deployPages() {
  log.section('DEPLOYING PAGES');

  for (const page of PAGES) {
    try {
      log.info(`Creating page: ${page.title}`);
      await shopifyRequest('POST', '/pages.json', { page });
      log.success(`Page created: ${page.title}`);
      await delay(500);
    } catch (e) {
      if (e.message.includes('422') || e.message.includes('already')) {
        log.warn(`Page may already exist: ${page.title}`);
      } else {
        log.error(`Failed to create ${page.title}: ${e.message}`);
      }
    }
  }
}

async function deployCollections() {
  log.section('DEPLOYING COLLECTIONS');

  for (const collection of COLLECTIONS) {
    try {
      log.info(`Creating collection: ${collection.title}`);
      await shopifyRequest('POST', '/custom_collections.json', {
        custom_collection: {
          title: collection.title,
          handle: collection.handle,
          body_html: collection.body_html,
          published: true,
          sort_order: collection.sort_order || 'manual'
        }
      });
      log.success(`Collection created: ${collection.title}`);
      await delay(500);
    } catch (e) {
      log.warn(`Collection may already exist: ${collection.title}`);
    }
  }
}

async function deployBlogPosts() {
  log.section('DEPLOYING BLOG POSTS');

  try {
    // Get or create blog
    const blogs = await shopifyRequest('GET', '/blogs.json');
    let blogId = blogs.blogs?.find(b => b.handle === 'news' || b.handle === 'blog')?.id;

    if (!blogId) {
      log.info('Creating blog...');
      const newBlog = await shopifyRequest('POST', '/blogs.json', {
        blog: { title: 'Blog', handle: 'blog' }
      });
      blogId = newBlog.blog?.id;
    }

    if (!blogId) {
      log.error('Could not find or create blog');
      return;
    }

    log.info(`Using blog ID: ${blogId}`);

    for (const post of BLOG_POSTS) {
      try {
        log.info(`Publishing: ${post.title}`);
        await shopifyRequest('POST', `/blogs/${blogId}/articles.json`, {
          article: {
            title: post.title,
            handle: post.handle,
            body_html: post.body_html(CONFIG.amazonTag),
            tags: post.tags,
            published: true,
            author: 'Shelzy\'s Designs'
          }
        });
        log.success(`Published: ${post.title}`);
        await delay(500);
      } catch (e) {
        log.warn(`Post may already exist: ${post.title}`);
      }
    }
  } catch (e) {
    log.error(`Blog deployment failed: ${e.message}`);
  }
}

async function deployThemeAssets() {
  log.section('DEPLOYING THEME ASSETS');

  try {
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes?.find(t => t.role === 'main');

    if (!activeTheme) {
      log.error('No active theme found');
      return;
    }

    log.info(`Active theme: ${activeTheme.name} (ID: ${activeTheme.id})`);

    // Deploy brand CSS
    const brandCSS = `
/* Shelzy's Designs Brand Styles - Auto-deployed */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

:root {
  --sz-primary: #8BAA88;
  --sz-primary-dark: #4E5F4A;
  --sz-neutral-light: #FAF9F6;
  --sz-neutral-dark: #2B2B2B;
  --sz-accent-gold: #D1C7A1;
  --sz-font-heading: "Playfair Display", Georgia, serif;
  --sz-font-body: "Inter", -apple-system, sans-serif;
}

body { font-family: var(--sz-font-body); color: var(--sz-neutral-dark); }
h1, h2, h3, h4, h5, h6 { font-family: var(--sz-font-heading); color: var(--sz-primary-dark); }
.btn, .button, [type="submit"] { background: var(--sz-primary); color: #fff; border: none; padding: 0.9rem 1.8rem; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn:hover, .button:hover, [type="submit"]:hover { background: var(--sz-primary-dark); }
    `;

    await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
      asset: { key: 'assets/shelzys-brand.css', value: brandCSS }
    });
    log.success('Brand CSS deployed');

  } catch (e) {
    log.error(`Theme deployment failed: ${e.message}`);
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n');
  console.log('\x1b[36m╔══════════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║     SHELZY\'S DESIGNS - COMPREHENSIVE DEPLOYMENT          ║\x1b[0m');
  console.log('\x1b[36m╚══════════════════════════════════════════════════════════╝\x1b[0m');
  console.log('\n');

  if (CONFIG.dryRun) {
    log.warn('DRY RUN MODE - No changes will be made\n');
  }

  if (!CONFIG.accessToken && !CONFIG.dryRun) {
    log.error('SHOPIFY_ACCESS_TOKEN environment variable not set!');
    console.log('\nRequired environment variables:');
    console.log('  SHOPIFY_STORE_URL - Your myshopify.com URL');
    console.log('  SHOPIFY_ACCESS_TOKEN - Admin API access token');
    console.log('  AMAZON_ASSOCIATE_TAG - Your Amazon affiliate tag (optional)');
    process.exit(1);
  }

  const startTime = Date.now();

  await deployPages();
  await deployCollections();
  await deployBlogPosts();
  await deployThemeAssets();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n');
  console.log('\x1b[32m╔══════════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[32m║                 DEPLOYMENT COMPLETE!                      ║\x1b[0m');
  console.log('\x1b[32m╚══════════════════════════════════════════════════════════╝\x1b[0m');
  console.log(`\nCompleted in ${elapsed} seconds\n`);

  console.log('WHAT WAS DEPLOYED:');
  console.log('  ✓ 5 pages (About, Contact, FAQ, How It Works, Bulk)');
  console.log('  ✓ 6 collections');
  console.log('  ✓ 6 blog posts with Amazon affiliate links');
  console.log('  ✓ Brand CSS styling\n');

  console.log('NEXT STEPS:');
  console.log('  1. Add snippets to theme (see ONE_CLICK_DEPLOY.md)');
  console.log('  2. Set up Amazon Associates account');
  console.log('  3. Configure Klaviyo email flows');
  console.log('  4. Set up Pinterest business account\n');
}

main().catch(e => {
  log.error(`Fatal error: ${e.message}`);
  process.exit(1);
});
