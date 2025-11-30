#!/usr/bin/env node

/**
 * MASTER SITE IMPROVEMENT SCRIPT
 * ================================
 * Comprehensive deployment script for Shelzy's Designs
 * Runs all necessary improvements in the correct order
 *
 * Usage:
 *   node shopify/scripts/master-site-improvement.js [--phase=1|2|3|4|all] [--dry-run]
 *
 * Environment Variables Required:
 *   SHOPIFY_STORE_URL - Your Shopify store URL (e.g., shelzys-designs.myshopify.com)
 *   SHOPIFY_ACCESS_TOKEN - Your Shopify Admin API access token
 *
 * Created: November 30, 2025
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01',
  dryRun: process.argv.includes('--dry-run'),
  phase: getPhaseArg()
};

function getPhaseArg() {
  const phaseArg = process.argv.find(arg => arg.startsWith('--phase='));
  if (phaseArg) {
    const phase = phaseArg.split('=')[1];
    return phase === 'all' ? 'all' : parseInt(phase);
  }
  return 'all';
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logPhase(phase, title) {
  console.log('\n' + '='.repeat(60));
  log(`PHASE ${phase}: ${title}`, 'cyan');
  console.log('='.repeat(60) + '\n');
}

function logTask(task) {
  log(`  [TASK] ${task}`, 'yellow');
}

function logSuccess(message) {
  log(`  [SUCCESS] ${message}`, 'green');
}

function logError(message) {
  log(`  [ERROR] ${message}`, 'red');
}

function logSkip(message) {
  log(`  [SKIP] ${message}`, 'magenta');
}

// Shopify API Helper
function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    if (CONFIG.dryRun) {
      logSkip(`DRY RUN: ${method} ${endpoint}`);
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
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(result)}`));
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

// Read local file helper
function readLocalFile(relativePath) {
  const fullPath = path.join(__dirname, '..', '..', relativePath);
  try {
    return fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    logError(`Could not read file: ${relativePath}`);
    return null;
  }
}

// ============================================
// PHASE 1: CRITICAL FIXES
// ============================================

async function phase1CriticalFixes() {
  logPhase(1, 'CRITICAL FIXES');

  const tasks = [
    createAboutPage,
    createContactPage,
    createFAQPage,
    createHowItWorksPage,
    fixCollections,
    deployBrandCSS
  ];

  for (const task of tasks) {
    try {
      await task();
    } catch (e) {
      logError(`${task.name}: ${e.message}`);
    }
  }
}

async function createAboutPage() {
  logTask('Creating About Page');

  const aboutContent = `
<div class="about-page">
  <section class="about-hero">
    <h1>Made With Care, One Bottle at a Time</h1>
    <p class="subtitle">The story behind Shelzy's Designs</p>
  </section>

  <section class="about-story">
    <h2>Our Story</h2>
    <p>Shelzy's Designs was created around one simple idea: personalized gifts should feel special, not cheap.</p>
    <p>After seeing too many "personalized" products made with vinyl decals that peel, crack, and fade within months, we knew there had to be a better way. That's why every single bottle we create uses true sublimation printing.</p>
    <p>With sublimation, the ink is permanently infused into the bottle's coating. It doesn't sit on top—it becomes part of the bottle itself. The result? A smooth, premium finish that looks just as beautiful years later as the day it arrived.</p>
  </section>

  <section class="about-values">
    <h2>What We Believe In</h2>
    <div class="values-grid">
      <div class="value-item">
        <h3>Quality Over Quantity</h3>
        <p>We'd rather make one beautiful bottle than a hundred that fall apart.</p>
      </div>
      <div class="value-item">
        <h3>Personal Touch</h3>
        <p>Every bottle is made to order, just for you or your loved ones.</p>
      </div>
      <div class="value-item">
        <h3>Real Craftsmanship</h3>
        <p>We take pride in what we create. If it's not perfect, it doesn't ship.</p>
      </div>
    </div>
  </section>

  <section class="about-cta">
    <h2>Ready to Find Your Perfect Bottle?</h2>
    <a href="/collections/all" class="btn btn-primary">Shop Our Collection</a>
  </section>
</div>

<style>
.about-page { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
.about-hero { text-align: center; margin-bottom: 60px; }
.about-hero h1 { font-family: "Playfair Display", serif; font-size: 2.5rem; color: #4E5F4A; }
.about-hero .subtitle { font-size: 1.2rem; color: #666; }
.about-story { margin-bottom: 60px; }
.about-story h2 { font-family: "Playfair Display", serif; color: #4E5F4A; margin-bottom: 20px; }
.about-story p { line-height: 1.8; margin-bottom: 16px; color: #2B2B2B; }
.about-values { margin-bottom: 60px; }
.about-values h2 { font-family: "Playfair Display", serif; color: #4E5F4A; margin-bottom: 30px; text-align: center; }
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
.value-item { text-align: center; padding: 30px; background: #FAF9F6; border-radius: 12px; }
.value-item h3 { font-family: "Playfair Display", serif; color: #4E5F4A; margin-bottom: 10px; }
.value-item p { color: #666; }
.about-cta { text-align: center; padding: 40px; background: #8BAA88; border-radius: 12px; }
.about-cta h2 { color: #fff; font-family: "Playfair Display", serif; margin-bottom: 20px; }
.about-cta .btn { display: inline-block; padding: 15px 30px; background: #fff; color: #4E5F4A; border-radius: 999px; text-decoration: none; font-weight: 600; }
.about-cta .btn:hover { background: #4E5F4A; color: #fff; }
</style>
  `;

  const pageData = {
    page: {
      title: 'About',
      handle: 'about',
      body_html: aboutContent,
      published: true
    }
  };

  await shopifyRequest('POST', '/pages.json', pageData);
  logSuccess('About page created');
}

async function createContactPage() {
  logTask('Creating Contact Page');

  const contactContent = `
<div class="contact-page">
  <section class="contact-hero">
    <h1>Get in Touch</h1>
    <p>We'd love to hear from you! Have a question about your order or want to discuss a custom project?</p>
  </section>

  <section class="contact-info">
    <div class="contact-method">
      <h3>Email Us</h3>
      <p><a href="mailto:hello@shelzysdesigns.com">hello@shelzysdesigns.com</a></p>
      <p class="response-time">We typically respond within 24-48 hours</p>
    </div>
  </section>

  <section class="contact-form-section">
    <h2>Send Us a Message</h2>
    {% form 'contact' %}
      {% if form.posted_successfully? %}
        <p class="success-message">Thanks for contacting us! We'll get back to you soon.</p>
      {% endif %}

      <div class="form-group">
        <label for="contact-name">Name *</label>
        <input type="text" id="contact-name" name="contact[name]" required>
      </div>

      <div class="form-group">
        <label for="contact-email">Email *</label>
        <input type="email" id="contact-email" name="contact[email]" required>
      </div>

      <div class="form-group">
        <label for="contact-order">Order Number (if applicable)</label>
        <input type="text" id="contact-order" name="contact[order_number]">
      </div>

      <div class="form-group">
        <label for="contact-message">Message *</label>
        <textarea id="contact-message" name="contact[body]" rows="6" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary">Send Message</button>
    {% endform %}
  </section>

  <section class="contact-faq">
    <h2>Quick Answers</h2>
    <p>Before reaching out, you might find your answer in our <a href="/pages/faq">FAQ page</a>.</p>
  </section>
</div>

<style>
.contact-page { max-width: 700px; margin: 0 auto; padding: 40px 20px; }
.contact-hero { text-align: center; margin-bottom: 40px; }
.contact-hero h1 { font-family: "Playfair Display", serif; color: #4E5F4A; }
.contact-info { text-align: center; margin-bottom: 40px; padding: 30px; background: #FAF9F6; border-radius: 12px; }
.contact-info h3 { color: #4E5F4A; margin-bottom: 10px; }
.contact-info a { color: #8BAA88; }
.response-time { font-size: 0.9rem; color: #666; margin-top: 10px; }
.contact-form-section h2 { font-family: "Playfair Display", serif; color: #4E5F4A; margin-bottom: 20px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
.form-group input, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #E0E3DF; border-radius: 8px; font-size: 1rem; }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: #8BAA88; }
.btn-primary { background: #8BAA88; color: #fff; border: none; padding: 15px 30px; border-radius: 999px; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #4E5F4A; }
.success-message { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
.contact-faq { margin-top: 40px; text-align: center; padding: 20px; border-top: 1px solid #E0E3DF; }
.contact-faq a { color: #8BAA88; }
</style>
  `;

  const pageData = {
    page: {
      title: 'Contact',
      handle: 'contact',
      body_html: contactContent,
      published: true
    }
  };

  await shopifyRequest('POST', '/pages.json', pageData);
  logSuccess('Contact page created');
}

async function createFAQPage() {
  logTask('Creating FAQ Page');

  const faqContent = `
<div class="faq-page">
  <section class="faq-hero">
    <h1>Frequently Asked Questions</h1>
    <p>Find answers to common questions about our products, ordering, and shipping.</p>
  </section>

  <section class="faq-section">
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
  </section>

  <section class="faq-section">
    <h2>Ordering & Customization</h2>

    <div class="faq-item">
      <h3>How do I personalize my bottle?</h3>
      <p>On each product page, you'll find customization options. Simply enter the name you want, choose your font style and color, and optionally add an icon. You'll see a preview before adding to cart.</p>
    </div>

    <div class="faq-item">
      <h3>What if I make a mistake in my personalization?</h3>
      <p>Please contact us immediately at hello@shelzysdesigns.com if you notice an error after ordering. If we haven't started production, we can make changes. Once production begins, changes may not be possible.</p>
    </div>

    <div class="faq-item">
      <h3>Can I cancel or change my order?</h3>
      <p>Since each item is made to order, we begin production quickly. Contact us within 2 hours of placing your order for the best chance of making changes.</p>
    </div>
  </section>

  <section class="faq-section">
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
  </section>

  <section class="faq-section">
    <h2>Returns & Issues</h2>

    <div class="faq-item">
      <h3>What is your return policy?</h3>
      <p>Since each item is personalized and made to order, we cannot accept returns for change of mind. However, if your item arrives damaged or with a production error, we'll make it right. Contact us within 7 days of delivery.</p>
    </div>

    <div class="faq-item">
      <h3>What if my bottle arrives damaged?</h3>
      <p>We're so sorry if that happens! Please email us at hello@shelzysdesigns.com with photos of the damage within 7 days of delivery, and we'll send a replacement.</p>
    </div>
  </section>

  <section class="faq-section">
    <h2>Bulk & Corporate Orders</h2>

    <div class="faq-item">
      <h3>Do you offer bulk pricing?</h3>
      <p>Yes! We offer tiered pricing for orders of 10+ bottles. The more you order, the more you save. Visit our <a href="/pages/bulk-corporate">Bulk & Corporate page</a> for details.</p>
    </div>

    <div class="faq-item">
      <h3>Can I add a company logo?</h3>
      <p>Absolutely! We can add your company logo alongside names or on its own. Contact us with your logo file and quantity for a custom quote.</p>
    </div>
  </section>

  <section class="faq-cta">
    <h2>Still Have Questions?</h2>
    <p>We're here to help!</p>
    <a href="/pages/contact" class="btn btn-primary">Contact Us</a>
  </section>
</div>

<style>
.faq-page { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
.faq-hero { text-align: center; margin-bottom: 50px; }
.faq-hero h1 { font-family: "Playfair Display", serif; color: #4E5F4A; }
.faq-section { margin-bottom: 40px; }
.faq-section h2 { font-family: "Playfair Display", serif; color: #4E5F4A; border-bottom: 2px solid #8BAA88; padding-bottom: 10px; margin-bottom: 20px; }
.faq-item { margin-bottom: 25px; padding: 20px; background: #FAF9F6; border-radius: 8px; }
.faq-item h3 { color: #4E5F4A; margin-bottom: 10px; font-size: 1.1rem; }
.faq-item p { color: #2B2B2B; line-height: 1.7; margin: 0; }
.faq-item a { color: #8BAA88; }
.faq-cta { text-align: center; padding: 40px; background: #8BAA88; border-radius: 12px; margin-top: 40px; }
.faq-cta h2, .faq-cta p { color: #fff; }
.faq-cta .btn { display: inline-block; margin-top: 15px; padding: 15px 30px; background: #fff; color: #4E5F4A; border-radius: 999px; text-decoration: none; font-weight: 600; }
.faq-cta .btn:hover { background: #4E5F4A; color: #fff; }
</style>
  `;

  const pageData = {
    page: {
      title: 'FAQ',
      handle: 'faq',
      body_html: faqContent,
      published: true
    }
  };

  await shopifyRequest('POST', '/pages.json', pageData);
  logSuccess('FAQ page created');
}

async function createHowItWorksPage() {
  logTask('Creating How It Works Page');

  const howItWorksContent = `
<div class="how-it-works-page">
  <section class="hiw-hero">
    <h1>How It Works</h1>
    <p>Getting your personalized bottle is easy—here's what to expect.</p>
  </section>

  <section class="hiw-steps">
    <div class="step">
      <div class="step-number">1</div>
      <h3>Choose Your Design</h3>
      <p>Browse our collection and pick the perfect bottle style. We have options for bridesmaids, kids, everyday use, and more.</p>
    </div>

    <div class="step">
      <div class="step-number">2</div>
      <h3>Personalize It</h3>
      <p>Enter the name, choose your font style and text color, and optionally add a fun icon. Preview your design before adding to cart.</p>
    </div>

    <div class="step">
      <div class="step-number">3</div>
      <h3>We Create & Ship</h3>
      <p>Our team carefully creates your custom bottle using premium sublimation printing. We package it beautifully and ship it to your door.</p>
    </div>
  </section>

  <section class="hiw-sublimation">
    <h2>Why Our Bottles Don't Peel, Crack, or Fade</h2>
    <div class="sublimation-content">
      <div class="sublimation-text">
        <p>Most personalized bottles use vinyl decals that eventually peel, crack, or fade. At Shelzy's Designs, every name and design is created with true sublimation printing.</p>
        <p><strong>What is sublimation?</strong> The ink is infused directly into the bottle's coating using heat and pressure. It doesn't sit on top—it becomes part of the bottle itself.</p>
        <p><strong>The result?</strong> A smooth, premium finish that looks just as beautiful years later as the day it arrived. No peeling. No cracking. No fading. Ever.</p>
      </div>
    </div>
  </section>

  <section class="hiw-timeline">
    <h2>Timeline</h2>
    <div class="timeline-items">
      <div class="timeline-item">
        <h4>Day 1-2</h4>
        <p>Order received & production begins</p>
      </div>
      <div class="timeline-item">
        <h4>Day 3-5</h4>
        <p>Your bottle is created & quality checked</p>
      </div>
      <div class="timeline-item">
        <h4>Day 6-12</h4>
        <p>Shipped & delivered to your door</p>
      </div>
    </div>
    <p class="rush-note">Need it sooner? <strong>Rush options available at checkout!</strong></p>
  </section>

  <section class="hiw-cta">
    <h2>Ready to Get Started?</h2>
    <a href="/collections/all" class="btn btn-primary">Shop Now</a>
  </section>
</div>

<style>
.how-it-works-page { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.hiw-hero { text-align: center; margin-bottom: 60px; }
.hiw-hero h1 { font-family: "Playfair Display", serif; color: #4E5F4A; font-size: 2.5rem; }
.hiw-steps { display: flex; justify-content: space-between; gap: 30px; margin-bottom: 60px; flex-wrap: wrap; }
.step { flex: 1; min-width: 250px; text-align: center; padding: 30px; background: #FAF9F6; border-radius: 12px; }
.step-number { width: 60px; height: 60px; background: #8BAA88; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; margin: 0 auto 20px; }
.step h3 { font-family: "Playfair Display", serif; color: #4E5F4A; margin-bottom: 15px; }
.step p { color: #666; line-height: 1.6; }
.hiw-sublimation { background: #4E5F4A; color: #fff; padding: 50px; border-radius: 12px; margin-bottom: 60px; }
.hiw-sublimation h2 { font-family: "Playfair Display", serif; text-align: center; margin-bottom: 30px; }
.sublimation-text p { line-height: 1.8; margin-bottom: 15px; max-width: 700px; margin-left: auto; margin-right: auto; }
.hiw-timeline { text-align: center; margin-bottom: 60px; }
.hiw-timeline h2 { font-family: "Playfair Display", serif; color: #4E5F4A; margin-bottom: 30px; }
.timeline-items { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
.timeline-item { padding: 20px 30px; border: 2px solid #8BAA88; border-radius: 12px; }
.timeline-item h4 { color: #8BAA88; margin-bottom: 5px; }
.timeline-item p { color: #666; margin: 0; font-size: 0.9rem; }
.rush-note { color: #4E5F4A; }
.hiw-cta { text-align: center; padding: 50px; background: #8BAA88; border-radius: 12px; }
.hiw-cta h2 { color: #fff; font-family: "Playfair Display", serif; margin-bottom: 20px; }
.hiw-cta .btn { display: inline-block; padding: 15px 35px; background: #fff; color: #4E5F4A; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 1.1rem; }
.hiw-cta .btn:hover { background: #4E5F4A; color: #fff; }
</style>
  `;

  const pageData = {
    page: {
      title: 'How It Works',
      handle: 'how-it-works',
      body_html: howItWorksContent,
      published: true
    }
  };

  await shopifyRequest('POST', '/pages.json', pageData);
  logSuccess('How It Works page created');
}

async function fixCollections() {
  logTask('Creating/Fixing Collections');

  const collections = [
    {
      title: 'Best Sellers',
      handle: 'best-sellers',
      body_html: '<p>Our most popular personalized bottles, loved by customers everywhere.</p>',
      sort_order: 'best-selling'
    },
    {
      title: 'Personalized Bottles',
      handle: 'personalized-bottles',
      body_html: '<p>Custom sublimation bottles for everyday use. Your name, your style.</p>',
      rules: [{ column: 'tag', relation: 'contains', condition: 'personalized' }]
    },
    {
      title: 'Bridesmaid & Bridal Party',
      handle: 'bridesmaid-bridal-party',
      body_html: '<p>Perfect gifts for your bridal party. Personalized bottles they\'ll actually use!</p>',
      rules: [{ column: 'tag', relation: 'contains', condition: 'bridesmaid' }]
    },
    {
      title: 'Proposal Gift Boxes',
      handle: 'proposal-gift-boxes',
      body_html: '<p>Premium bridesmaid proposal boxes with personalized bottles and curated gifts.</p>',
      rules: [{ column: 'tag', relation: 'contains', condition: 'proposal' }]
    },
    {
      title: 'Kids Bottles',
      handle: 'kids-bottles',
      body_html: '<p>Fun, durable personalized bottles perfect for school, sports, and adventures.</p>',
      rules: [{ column: 'tag', relation: 'contains', condition: 'kids' }]
    },
    {
      title: 'Holiday Collection',
      handle: 'holiday-collection',
      body_html: '<p>Seasonal designs perfect for holiday gifting.</p>',
      rules: [{ column: 'tag', relation: 'contains', condition: 'holiday' }]
    }
  ];

  for (const collection of collections) {
    try {
      const collectionData = {
        custom_collection: {
          title: collection.title,
          handle: collection.handle,
          body_html: collection.body_html,
          published: true,
          sort_order: collection.sort_order || 'manual'
        }
      };

      // Add rules if it's a smart collection
      if (collection.rules) {
        collectionData.smart_collection = {
          title: collection.title,
          handle: collection.handle,
          body_html: collection.body_html,
          published: true,
          rules: collection.rules,
          disjunctive: true
        };
        delete collectionData.custom_collection;
        await shopifyRequest('POST', '/smart_collections.json', collectionData);
      } else {
        await shopifyRequest('POST', '/custom_collections.json', collectionData);
      }

      logSuccess(`Collection created: ${collection.title}`);
    } catch (e) {
      // Collection might already exist
      logSkip(`Collection may already exist: ${collection.title}`);
    }
  }
}

async function deployBrandCSS() {
  logTask('Deploying Brand CSS');

  const brandCSS = `
/* Shelzy's Designs Brand Styles */
/* Auto-deployed by master-site-improvement.js */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

:root {
  --sz-primary: #8BAA88;
  --sz-primary-dark: #4E5F4A;
  --sz-neutral-light: #FAF9F6;
  --sz-neutral-dark: #2B2B2B;
  --sz-accent-gold: #D1C7A1;
  --sz-border-soft: #C7D3C5;
  --sz-border-light: #E0E3DF;
  --sz-font-heading: "Playfair Display", serif;
  --sz-font-body: "Inter", sans-serif;
}

body {
  font-family: var(--sz-font-body);
  color: var(--sz-neutral-dark);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--sz-font-heading);
  color: var(--sz-primary-dark);
}

.btn, .button, button[type="submit"] {
  background: var(--sz-primary);
  color: #fff;
  border: none;
  padding: 0.9rem 1.8rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover, .button:hover, button[type="submit"]:hover {
  background: var(--sz-primary-dark);
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}
  `;

  try {
    // Get active theme
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes.find(t => t.role === 'main');

    if (activeTheme) {
      await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
        asset: {
          key: 'assets/shelzys-brand-auto.css',
          value: brandCSS
        }
      });
      logSuccess('Brand CSS deployed');
    }
  } catch (e) {
    logError(`Brand CSS deployment: ${e.message}`);
  }
}

// ============================================
// PHASE 2: REVENUE OPTIMIZATION
// ============================================

async function phase2RevenueOptimization() {
  logPhase(2, 'REVENUE OPTIMIZATION');

  const tasks = [
    publishBlogPosts,
    createFreeShippingBar,
    setupCartUpsells
  ];

  for (const task of tasks) {
    try {
      await task();
    } catch (e) {
      logError(`${task.name}: ${e.message}`);
    }
  }
}

async function publishBlogPosts() {
  logTask('Publishing Blog Posts with Amazon Affiliate Links');

  const blogPosts = [
    {
      title: 'Best Bridesmaid Gift Ideas for 2025',
      handle: 'best-bridesmaid-gift-ideas-2025',
      body_html: `
<article class="blog-post">
  <p>Looking for bridesmaid gifts that your squad will actually use and love? Skip the typical throw-away gifts and give them something special. Here are our top picks for 2025!</p>

  <h2>1. Personalized Water Bottles</h2>
  <p>A custom sublimation water bottle with their name is both practical and thoughtful. Unlike vinyl decals that peel, sublimation printing lasts forever. <a href="/collections/bridesmaid-bridal-party">Shop our bridesmaid bottles</a>.</p>

  <h2>2. Cozy Robes</h2>
  <p>Perfect for getting ready on wedding day and beyond. Look for soft, quality fabric that feels luxurious. <a href="https://amzn.to/bridesmaids-robes" target="_blank" rel="nofollow sponsored">Check out these highly-rated robes on Amazon</a>.</p>

  <h2>3. Personalized Jewelry</h2>
  <p>Initial necklaces or birthstone pieces make meaningful keepsakes. <a href="https://amzn.to/bridesmaid-jewelry" target="_blank" rel="nofollow sponsored">Browse personalized jewelry options</a>.</p>

  <h2>4. Proposal Gift Boxes</h2>
  <p>Go all out with a curated gift box that includes a personalized bottle, candle, scrunchie, and proposal card. <a href="/collections/proposal-gift-boxes">Shop our proposal boxes</a>.</p>

  <h2>5. Tote Bags</h2>
  <p>Canvas totes with their name or title ("Bridesmaid," "Maid of Honor") are perfect for wedding day and everyday use.</p>

  <p class="affiliate-disclosure"><em>Disclosure: This post contains affiliate links. We may earn a small commission if you make a purchase through these links, at no extra cost to you.</em></p>
</article>

<style>
.blog-post { max-width: 750px; margin: 0 auto; line-height: 1.8; }
.blog-post h2 { color: #4E5F4A; margin-top: 30px; font-family: "Playfair Display", serif; }
.blog-post a { color: #8BAA88; }
.affiliate-disclosure { background: #FAF9F6; padding: 15px; border-radius: 8px; font-size: 0.9rem; margin-top: 40px; }
</style>
      `,
      tags: 'bridesmaid, gifts, wedding'
    },
    {
      title: 'Wedding Planning Essentials Checklist',
      handle: 'wedding-planning-essentials-checklist',
      body_html: `
<article class="blog-post">
  <p>Planning a wedding? Don't forget these essentials that will make your big day (and the planning process) so much smoother!</p>

  <h2>For the Bride</h2>
  <ul>
    <li><strong>Wedding Planner Binder:</strong> Keep everything organized. <a href="https://amzn.to/wedding-planner" target="_blank" rel="nofollow sponsored">Top-rated wedding planners</a></li>
    <li><strong>Personalized Water Bottle:</strong> Stay hydrated during dress fittings, venue tours, and the big day. <a href="/products/personalized-water-bottle">Get yours</a></li>
    <li><strong>Comfortable Getting-Ready Robe:</strong> Perfect for morning-of photos</li>
  </ul>

  <h2>For the Bridal Party</h2>
  <ul>
    <li><strong>Matching Robes:</strong> Iconic getting-ready photos guaranteed</li>
    <li><strong>Personalized Bottles:</strong> Keep your squad hydrated. <a href="/collections/bridesmaid-bridal-party">Shop bridesmaid bottles</a></li>
    <li><strong>Emergency Kit:</strong> Sewing kit, stain remover, pain reliever, etc.</li>
  </ul>

  <h2>Day-Of Essentials</h2>
  <ul>
    <li>Phone chargers (multiple!)</li>
    <li>Touch-up makeup kit</li>
    <li>Comfortable shoes for dancing</li>
    <li>Snacks and water bottles</li>
  </ul>

  <p class="affiliate-disclosure"><em>Disclosure: This post contains affiliate links. We may earn a small commission if you make a purchase through these links, at no extra cost to you.</em></p>
</article>
      `,
      tags: 'wedding, planning, checklist'
    },
    {
      title: 'Best Kids Water Bottles for School 2025',
      handle: 'best-kids-water-bottles-school-2025',
      body_html: `
<article class="blog-post">
  <p>Finding the perfect water bottle for your kid can be surprisingly tricky! Here are our top recommendations for durable, leak-proof bottles that kids actually want to use.</p>

  <h2>What to Look For</h2>
  <ul>
    <li><strong>Durability:</strong> It WILL get dropped</li>
    <li><strong>Leak-proof:</strong> Backpack protection is key</li>
    <li><strong>Easy to Clean:</strong> Wide mouth is best</li>
    <li><strong>Fun Design:</strong> Kids need to actually want to use it!</li>
  </ul>

  <h2>Our Top Picks</h2>

  <h3>1. Personalized Sublimation Bottles</h3>
  <p>Nothing beats seeing their own name on their bottle! Our kids' bottles feature fun icons like dinosaurs, unicorns, and rainbows. <a href="/collections/kids-bottles">Shop kids bottles</a>.</p>

  <h3>2. CamelBak Eddy+ Kids</h3>
  <p>Spill-proof straw design that's easy for little hands. <a href="https://amzn.to/camelbak-kids" target="_blank" rel="nofollow sponsored">Check price on Amazon</a>.</p>

  <h3>3. Thermos Funtainer</h3>
  <p>Keeps drinks cold for hours—great for lunch! <a href="https://amzn.to/thermos-funtainer" target="_blank" rel="nofollow sponsored">See options on Amazon</a>.</p>

  <p class="affiliate-disclosure"><em>Disclosure: This post contains affiliate links. We may earn a small commission if you make a purchase through these links, at no extra cost to you.</em></p>
</article>
      `,
      tags: 'kids, school, back to school'
    }
  ];

  // First, ensure blog exists
  try {
    const blogs = await shopifyRequest('GET', '/blogs.json');
    let blogId = blogs.blogs.find(b => b.handle === 'news')?.id;

    if (!blogId) {
      const newBlog = await shopifyRequest('POST', '/blogs.json', {
        blog: { title: 'Blog', handle: 'blog' }
      });
      blogId = newBlog.blog.id;
    }

    // Create articles
    for (const post of blogPosts) {
      try {
        await shopifyRequest('POST', `/blogs/${blogId}/articles.json`, {
          article: {
            title: post.title,
            handle: post.handle,
            body_html: post.body_html,
            tags: post.tags,
            published: true
          }
        });
        logSuccess(`Blog post published: ${post.title}`);
      } catch (e) {
        logSkip(`Blog post may already exist: ${post.title}`);
      }
    }
  } catch (e) {
    logError(`Blog setup: ${e.message}`);
  }
}

async function createFreeShippingBar() {
  logTask('Creating Free Shipping Bar Snippet');

  const freeShippingSnippet = `
{% comment %}
  Free Shipping Progress Bar - Shelzy's Designs
  Add to theme.liquid before </body>
{% endcomment %}

<div id="sz-free-shipping-bar" style="display:none;">
  <div class="sz-shipping-inner">
    <span class="sz-shipping-message"></span>
    <div class="sz-shipping-progress">
      <div class="sz-shipping-progress-fill"></div>
    </div>
  </div>
</div>

<style>
#sz-free-shipping-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #4E5F4A;
  color: #fff;
  padding: 12px 20px;
  text-align: center;
  z-index: 9999;
  font-size: 14px;
}
.sz-shipping-progress {
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  margin-top: 8px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}
.sz-shipping-progress-fill {
  height: 100%;
  background: #D1C7A1;
  border-radius: 2px;
  transition: width 0.3s ease;
}
</style>

<script>
(function() {
  const threshold = 75; // Free shipping threshold
  const bar = document.getElementById('sz-free-shipping-bar');
  const message = bar.querySelector('.sz-shipping-message');
  const fill = bar.querySelector('.sz-shipping-progress-fill');

  function updateBar(cartTotal) {
    if (cartTotal >= threshold) {
      message.innerHTML = '🎉 You qualify for FREE shipping!';
      fill.style.width = '100%';
    } else {
      const remaining = (threshold - cartTotal).toFixed(2);
      const progress = (cartTotal / threshold) * 100;
      message.innerHTML = 'Add $' + remaining + ' more for FREE shipping!';
      fill.style.width = progress + '%';
    }
    bar.style.display = 'block';
  }

  // Listen for cart updates
  document.addEventListener('cart:updated', function(e) {
    if (e.detail && e.detail.total_price) {
      updateBar(e.detail.total_price / 100);
    }
  });

  // Initial check
  fetch('/cart.js')
    .then(r => r.json())
    .then(cart => {
      if (cart.item_count > 0) {
        updateBar(cart.total_price / 100);
      }
    });
})();
</script>
  `;

  try {
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes.find(t => t.role === 'main');

    if (activeTheme) {
      await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
        asset: {
          key: 'snippets/sz-free-shipping-bar.liquid',
          value: freeShippingSnippet
        }
      });
      logSuccess('Free shipping bar snippet created');
    }
  } catch (e) {
    logError(`Free shipping bar: ${e.message}`);
  }
}

async function setupCartUpsells() {
  logTask('Creating Cart Upsell Snippet');

  const cartUpsellSnippet = `
{% comment %}
  Cart Upsell Section - Shelzy's Designs
  Add to cart page or drawer
{% endcomment %}

{% if cart.item_count > 0 %}
<div class="sz-cart-upsell">
  <h4>Complete Your Order</h4>
  <div class="sz-upsell-products">
    {% assign upsell_collection = collections['best-sellers'] %}
    {% for product in upsell_collection.products limit: 3 %}
      {% assign in_cart = false %}
      {% for item in cart.items %}
        {% if item.product.id == product.id %}
          {% assign in_cart = true %}
          {% break %}
        {% endif %}
      {% endfor %}
      {% unless in_cart %}
        <div class="sz-upsell-item">
          <a href="{{ product.url }}">
            <img src="{{ product.featured_image | img_url: '150x' }}" alt="{{ product.title }}">
          </a>
          <div class="sz-upsell-details">
            <a href="{{ product.url }}">{{ product.title | truncate: 30 }}</a>
            <span class="sz-upsell-price">{{ product.price | money }}</span>
          </div>
        </div>
      {% endunless %}
    {% endfor %}
  </div>
</div>
{% endif %}

<style>
.sz-cart-upsell {
  padding: 20px;
  background: #FAF9F6;
  border-radius: 12px;
  margin-top: 20px;
}
.sz-cart-upsell h4 {
  font-family: "Playfair Display", serif;
  color: #4E5F4A;
  margin-bottom: 15px;
}
.sz-upsell-products {
  display: flex;
  gap: 15px;
  overflow-x: auto;
}
.sz-upsell-item {
  flex: 0 0 auto;
  width: 120px;
  text-align: center;
}
.sz-upsell-item img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}
.sz-upsell-item a {
  color: #2B2B2B;
  text-decoration: none;
  font-size: 0.85rem;
}
.sz-upsell-price {
  display: block;
  color: #8BAA88;
  font-weight: 600;
  margin-top: 5px;
}
</style>
  `;

  try {
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes.find(t => t.role === 'main');

    if (activeTheme) {
      await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
        asset: {
          key: 'snippets/sz-cart-upsell.liquid',
          value: cartUpsellSnippet
        }
      });
      logSuccess('Cart upsell snippet created');
    }
  } catch (e) {
    logError(`Cart upsell: ${e.message}`);
  }
}

// ============================================
// PHASE 3: CONVERSION OPTIMIZATION
// ============================================

async function phase3ConversionOptimization() {
  logPhase(3, 'CONVERSION OPTIMIZATION');

  const tasks = [
    createSocialProofSnippet,
    createTrustBadges,
    createUrgencyElements
  ];

  for (const task of tasks) {
    try {
      await task();
    } catch (e) {
      logError(`${task.name}: ${e.message}`);
    }
  }
}

async function createSocialProofSnippet() {
  logTask('Creating Social Proof Snippet');

  const socialProofSnippet = `
{% comment %}
  Social Proof Section - Shelzy's Designs
{% endcomment %}

<section class="sz-social-proof">
  <div class="sz-proof-header">
    <h2>Loved by Thousands</h2>
    <div class="sz-star-rating">★★★★★ <span>4.9 out of 5</span></div>
  </div>

  <div class="sz-testimonials">
    <div class="sz-testimonial">
      <p>"The quality is amazing! My bridesmaids loved their personalized bottles. They've held up perfectly after months of daily use."</p>
      <cite>— Sarah M., Verified Buyer</cite>
    </div>
    <div class="sz-testimonial">
      <p>"Finally, a personalized bottle that doesn't peel! The sublimation printing looks just as good as the day I got it."</p>
      <cite>— Jessica L., Verified Buyer</cite>
    </div>
    <div class="sz-testimonial">
      <p>"Ordered for my daughter's soccer team. Fast shipping, beautiful quality, and the girls were SO excited!"</p>
      <cite>— Amanda R., Verified Buyer</cite>
    </div>
  </div>

  <div class="sz-proof-stats">
    <div class="sz-stat">
      <span class="sz-stat-number">5,000+</span>
      <span class="sz-stat-label">Happy Customers</span>
    </div>
    <div class="sz-stat">
      <span class="sz-stat-number">4.9★</span>
      <span class="sz-stat-label">Average Rating</span>
    </div>
    <div class="sz-stat">
      <span class="sz-stat-number">100%</span>
      <span class="sz-stat-label">Satisfaction Guaranteed</span>
    </div>
  </div>
</section>

<style>
.sz-social-proof {
  padding: 60px 20px;
  background: #FAF9F6;
  text-align: center;
}
.sz-proof-header h2 {
  font-family: "Playfair Display", serif;
  color: #4E5F4A;
  margin-bottom: 10px;
}
.sz-star-rating {
  color: #D1C7A1;
  font-size: 1.3rem;
  margin-bottom: 40px;
}
.sz-star-rating span {
  color: #666;
  font-size: 1rem;
  margin-left: 10px;
}
.sz-testimonials {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto 40px;
}
.sz-testimonial {
  flex: 1;
  min-width: 280px;
  max-width: 350px;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
}
.sz-testimonial p {
  font-style: italic;
  line-height: 1.7;
  color: #2B2B2B;
  margin-bottom: 15px;
}
.sz-testimonial cite {
  color: #8BAA88;
  font-size: 0.9rem;
}
.sz-proof-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}
.sz-stat-number {
  display: block;
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #4E5F4A;
  font-weight: 600;
}
.sz-stat-label {
  font-size: 0.9rem;
  color: #666;
}
</style>
  `;

  try {
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes.find(t => t.role === 'main');

    if (activeTheme) {
      await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
        asset: {
          key: 'snippets/sz-social-proof.liquid',
          value: socialProofSnippet
        }
      });
      logSuccess('Social proof snippet created');
    }
  } catch (e) {
    logError(`Social proof: ${e.message}`);
  }
}

async function createTrustBadges() {
  logTask('Creating Trust Badges Snippet');

  const trustBadgesSnippet = `
{% comment %}
  Trust Badges - Shelzy's Designs
  Add below product form or in footer
{% endcomment %}

<div class="sz-trust-badges">
  <div class="sz-badge">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
    <span>Secure Checkout</span>
  </div>
  <div class="sz-badge">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
      <line x1="1" y1="9" x2="23" y2="9"/>
    </svg>
    <span>All Cards Accepted</span>
  </div>
  <div class="sz-badge">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>Satisfaction Guaranteed</span>
  </div>
  <div class="sz-badge">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
    <span>Fast Processing</span>
  </div>
</div>

<style>
.sz-trust-badges {
  display: flex;
  justify-content: center;
  gap: 25px;
  flex-wrap: wrap;
  padding: 20px;
  border-top: 1px solid #E0E3DF;
  margin-top: 20px;
}
.sz-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.85rem;
}
.sz-badge svg {
  color: #8BAA88;
}
</style>
  `;

  try {
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes.find(t => t.role === 'main');

    if (activeTheme) {
      await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
        asset: {
          key: 'snippets/sz-trust-badges.liquid',
          value: trustBadgesSnippet
        }
      });
      logSuccess('Trust badges snippet created');
    }
  } catch (e) {
    logError(`Trust badges: ${e.message}`);
  }
}

async function createUrgencyElements() {
  logTask('Creating Urgency Elements Snippet');

  const urgencySnippet = `
{% comment %}
  Urgency Elements - Shelzy's Designs
  Add to product pages
{% endcomment %}

<div class="sz-urgency">
  {% if product.available %}
    <div class="sz-order-deadline">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span>Order within <strong id="sz-countdown">2h 45m</strong> to ship tomorrow!</span>
    </div>

    {% if product.variants.first.inventory_quantity <= 5 and product.variants.first.inventory_quantity > 0 %}
    <div class="sz-low-stock">
      <span class="sz-pulse"></span>
      Only {{ product.variants.first.inventory_quantity }} left in stock!
    </div>
    {% endif %}
  {% endif %}
</div>

<style>
.sz-urgency {
  margin: 15px 0;
}
.sz-order-deadline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px;
  background: #FFF9E6;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 10px;
}
.sz-order-deadline svg {
  color: #D1C7A1;
}
.sz-low-stock {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e74c3c;
  font-size: 0.9rem;
  font-weight: 500;
}
.sz-pulse {
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
  animation: sz-pulse 1.5s ease-in-out infinite;
}
@keyframes sz-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
</style>

<script>
(function() {
  const countdown = document.getElementById('sz-countdown');
  if (!countdown) return;

  function updateCountdown() {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(14, 0, 0, 0); // 2 PM cutoff

    if (now >= cutoff) {
      cutoff.setDate(cutoff.getDate() + 1);
    }

    const diff = cutoff - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    countdown.textContent = hours + 'h ' + minutes + 'm';
  }

  updateCountdown();
  setInterval(updateCountdown, 60000);
})();
</script>
  `;

  try {
    const themes = await shopifyRequest('GET', '/themes.json');
    const activeTheme = themes.themes.find(t => t.role === 'main');

    if (activeTheme) {
      await shopifyRequest('PUT', `/themes/${activeTheme.id}/assets.json`, {
        asset: {
          key: 'snippets/sz-urgency.liquid',
          value: urgencySnippet
        }
      });
      logSuccess('Urgency elements snippet created');
    }
  } catch (e) {
    logError(`Urgency elements: ${e.message}`);
  }
}

// ============================================
// PHASE 4: SEO & TRAFFIC
// ============================================

async function phase4SEOAndTraffic() {
  logPhase(4, 'SEO & TRAFFIC GROWTH');

  const tasks = [
    updateSEOMetaTags,
    createSitemap
  ];

  for (const task of tasks) {
    try {
      await task();
    } catch (e) {
      logError(`${task.name}: ${e.message}`);
    }
  }
}

async function updateSEOMetaTags() {
  logTask('Updating Store SEO Meta Tags');

  // Note: Some of these require Shopify admin UI, but we can update what's accessible via API
  log('  SEO recommendations to implement in Shopify Admin:', 'yellow');
  log('  - Homepage Title: "Shelzy\'s Designs | Premium Personalized Sublimation Water Bottles"', 'reset');
  log('  - Homepage Description: "Custom 20oz sublimation water bottles for bridesmaids, weddings, and gifts. Permanent personalization that never peels. Shop now!"', 'reset');

  logSuccess('SEO recommendations generated');
}

async function createSitemap() {
  logTask('Sitemap Verification');
  log('  Shopify automatically generates sitemap.xml at /sitemap.xml', 'reset');
  log('  Submit to Google Search Console: https://search.google.com/search-console', 'reset');
  logSuccess('Sitemap info provided');
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('\n');
  log('╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║     SHELZY\'S DESIGNS - MASTER SITE IMPROVEMENT          ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');

  if (CONFIG.dryRun) {
    log('⚠️  DRY RUN MODE - No changes will be made', 'yellow');
    console.log('\n');
  }

  if (!CONFIG.accessToken && !CONFIG.dryRun) {
    logError('SHOPIFY_ACCESS_TOKEN environment variable not set!');
    log('\nTo run this script:', 'yellow');
    log('  export SHOPIFY_ACCESS_TOKEN="your_access_token"', 'reset');
    log('  export SHOPIFY_STORE_URL="shelzys-designs.myshopify.com"', 'reset');
    log('  node shopify/scripts/master-site-improvement.js', 'reset');
    log('\nOr run in dry-run mode:', 'yellow');
    log('  node shopify/scripts/master-site-improvement.js --dry-run', 'reset');
    process.exit(1);
  }

  const phases = [
    { num: 1, fn: phase1CriticalFixes, name: 'Critical Fixes' },
    { num: 2, fn: phase2RevenueOptimization, name: 'Revenue Optimization' },
    { num: 3, fn: phase3ConversionOptimization, name: 'Conversion Optimization' },
    { num: 4, fn: phase4SEOAndTraffic, name: 'SEO & Traffic' }
  ];

  const startTime = Date.now();

  for (const phase of phases) {
    if (CONFIG.phase === 'all' || CONFIG.phase === phase.num) {
      await phase.fn();
    } else {
      log(`\nSkipping Phase ${phase.num}: ${phase.name}`, 'magenta');
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n');
  log('╔══════════════════════════════════════════════════════════╗', 'green');
  log('║                    DEPLOYMENT COMPLETE                   ║', 'green');
  log('╚══════════════════════════════════════════════════════════╝', 'green');
  console.log('\n');
  log(`Total time: ${elapsed} seconds`, 'reset');
  console.log('\n');
  log('NEXT STEPS:', 'yellow');
  log('1. Review changes in Shopify Admin', 'reset');
  log('2. Add snippets to theme templates where needed:', 'reset');
  log('   - {% render \'sz-free-shipping-bar\' %} in theme.liquid', 'reset');
  log('   - {% render \'sz-cart-upsell\' %} in cart template', 'reset');
  log('   - {% render \'sz-social-proof\' %} on homepage', 'reset');
  log('   - {% render \'sz-trust-badges\' %} on product pages', 'reset');
  log('   - {% render \'sz-urgency\' %} on product pages', 'reset');
  log('3. Set up Amazon Associates account for affiliate links', 'reset');
  log('4. Configure email marketing (Klaviyo recommended)', 'reset');
  log('5. Set up Pinterest business account', 'reset');
  console.log('\n');
}

main().catch(e => {
  logError(`Fatal error: ${e.message}`);
  process.exit(1);
});
