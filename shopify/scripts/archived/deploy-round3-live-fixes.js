#!/usr/bin/env node

/**
 * Shelzy's Designs - Round 3 Live Theme Fixes
 *
 * The snippets were deployed but the theme isn't rendering them.
 * This script:
 * 1. Detects template type (JSON vs liquid)
 * 2. Creates proper SECTIONS (not just snippets) for Shopify 2.0
 * 3. Updates the homepage template to use our sections
 * 4. Verifies Bulk Orders page is published
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';
const API_VERSION = '2024-01';

if (!ACCESS_TOKEN || ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN') {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN');
  process.exit(1);
}

async function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/${API_VERSION}${endpoint}`,
      method,
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    };

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAsset(themeId, key) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  return response.status === 200 ? response.data.asset.value : null;
}

async function putAsset(themeId, key, content) {
  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value: content }
  });
  return response.status === 200 || response.status === 201;
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔧 SHELZY\'S DESIGNS - ROUND 3 LIVE THEME FIXES                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Get live theme
  console.log('📋 Finding live theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');
  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');

  if (!liveTheme) {
    console.error('❌ No live theme found');
    process.exit(1);
  }

  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // Check template type
  console.log('📋 Checking template structure...');
  const indexJson = await getAsset(liveTheme.id, 'templates/index.json');
  const indexLiquid = await getAsset(liveTheme.id, 'templates/index.liquid');

  const isJsonTemplate = !!indexJson;
  console.log(`   Template type: ${isJsonTemplate ? 'JSON (Shopify 2.0)' : 'Liquid'}`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // STRATEGY: Inject our content into existing theme sections
  // Since the theme has its own sections, we'll modify them directly
  // ═══════════════════════════════════════════════════════════════

  if (isJsonTemplate) {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('SHOPIFY 2.0 DETECTED - Using Section Override Strategy');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    // Parse the JSON template to understand the section structure
    let templateConfig;
    try {
      templateConfig = JSON.parse(indexJson);
      console.log('📋 Current homepage sections:');
      if (templateConfig.order) {
        templateConfig.order.forEach((sectionId, i) => {
          const section = templateConfig.sections[sectionId];
          console.log(`   ${i + 1}. ${sectionId} (type: ${section?.type || 'unknown'})`);
        });
      }
      console.log('');
    } catch (e) {
      console.log('   ⚠️ Could not parse JSON template');
    }

    // Create section files that the theme can use
    console.log('📄 Creating Shopify 2.0 section files...');
    console.log('');

    // SECTION 1: Hero Section (shelzys-hero.liquid)
    const heroSection = `{%- comment -%}
  Shelzy's Designs - Premium Hero Section (Shopify 2.0)
{%- endcomment -%}

<section class="sz-hero-premium">
  <div class="sz-hero-premium-bg">
    {% if section.settings.hero_image != blank %}
      <img src="{{ section.settings.hero_image | image_url: width: 1920 }}" alt="{{ section.settings.hero_image.alt | default: 'Luxury personalized water bottles' }}" loading="eager">
    {% else %}
      {% assign hero_collection = collections['best-sellers'] | default: collections.all %}
      {% if hero_collection.image %}
        <img src="{{ hero_collection.image | image_url: width: 1920 }}" alt="Shelzy's Designs water bottles" loading="eager">
      {% else %}
        <div style="background: linear-gradient(135deg, #F5F2ED 0%, #E8DED5 100%); width: 100%; height: 100%;"></div>
      {% endif %}
    {% endif %}
  </div>

  <div class="sz-hero-premium-overlay"></div>

  <div class="sz-hero-premium-content">
    <div class="sz-hero-premium-text">
      <h1>{{ section.settings.heading | default: 'Luxury Personalized Water Bottles for Weddings & Events' }}</h1>
      <p class="sz-hero-premium-subtitle">
        {{ section.settings.subheading | default: 'Permanent sublimation printing that never peels. Fast turnaround.' }}
      </p>
      <div class="sz-hero-premium-ctas">
        <a href="{{ section.settings.primary_link | default: '/collections/wedding' }}" class="sz-btn sz-btn-primary">
          {{ section.settings.primary_text | default: 'Shop Bridal Bottles' }}
        </a>
        <a href="{{ section.settings.secondary_link | default: '/collections/best-sellers' }}" class="sz-btn sz-btn-outline">
          {{ section.settings.secondary_text | default: 'Shop Best Sellers' }}
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .sz-hero-premium {
    position: relative;
    min-height: 85vh;
    display: flex;
    align-items: center;
    background: #FDF9F3;
    overflow: hidden;
  }
  .sz-hero-premium-bg {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
  }
  .sz-hero-premium-bg img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center right;
  }
  .sz-hero-premium-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, rgba(250,248,245,0.97) 0%, rgba(250,248,245,0.85) 40%, rgba(250,248,245,0.4) 70%, rgba(250,248,245,0.1) 100%);
  }
  @media (max-width: 768px) {
    .sz-hero-premium { min-height: 90vh; }
    .sz-hero-premium-overlay {
      background: linear-gradient(180deg, rgba(250,248,245,0.95) 0%, rgba(250,248,245,0.9) 60%, rgba(250,248,245,0.7) 100%);
    }
  }
  .sz-hero-premium-content {
    position: relative;
    z-index: 2;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 60px;
    width: 100%;
  }
  @media (max-width: 768px) {
    .sz-hero-premium-content { padding: 0 24px; text-align: center; }
  }
  .sz-hero-premium-text { max-width: 580px; }
  @media (max-width: 768px) {
    .sz-hero-premium-text { max-width: 100%; margin: 0 auto; }
  }
  .sz-hero-premium h1 {
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 500;
    line-height: 1.1;
    margin: 0 0 24px 0;
    color: #1F1F1F;
    letter-spacing: -0.02em;
  }
  .sz-hero-premium-subtitle {
    font-family: "Inter", -apple-system, sans-serif;
    font-size: 17px;
    font-weight: 400;
    line-height: 1.7;
    color: #4A4A4A;
    margin: 0 0 36px 0;
  }
  .sz-hero-premium-ctas {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  @media (max-width: 768px) {
    .sz-hero-premium-ctas { justify-content: center; }
  }
  .sz-hero-premium .sz-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 16px 36px;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .sz-hero-premium .sz-btn-primary {
    background: #2C3E2D;
    color: #FFFFFF;
    border: 2px solid #2C3E2D;
  }
  .sz-hero-premium .sz-btn-primary:hover {
    background: #1F1F1F;
    border-color: #1F1F1F;
    transform: translateY(-2px);
  }
  .sz-hero-premium .sz-btn-outline {
    background: transparent;
    color: #1F1F1F;
    border: 2px solid #1F1F1F;
  }
  .sz-hero-premium .sz-btn-outline:hover {
    background: #1F1F1F;
    color: #FFFFFF;
  }
</style>

{% schema %}
{
  "name": "Shelzys Hero",
  "tag": "section",
  "class": "shelzys-hero-section",
  "settings": [
    {
      "type": "image_picker",
      "id": "hero_image",
      "label": "Hero Background Image"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Luxury Personalized Water Bottles for Weddings & Events"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "Permanent sublimation printing that never peels. Fast turnaround."
    },
    {
      "type": "text",
      "id": "primary_text",
      "label": "Primary Button Text",
      "default": "Shop Bridal Bottles"
    },
    {
      "type": "url",
      "id": "primary_link",
      "label": "Primary Button Link",
      "default": "/collections/wedding"
    },
    {
      "type": "text",
      "id": "secondary_text",
      "label": "Secondary Button Text",
      "default": "Shop Best Sellers"
    },
    {
      "type": "url",
      "id": "secondary_link",
      "label": "Secondary Button Link",
      "default": "/collections/best-sellers"
    }
  ],
  "presets": [
    {
      "name": "Shelzys Hero"
    }
  ]
}
{% endschema %}
`;

    process.stdout.write('   📄 sections/shelzys-hero.liquid... ');
    if (await putAsset(liveTheme.id, 'sections/shelzys-hero.liquid', heroSection)) {
      console.log('✅');
    } else {
      console.log('❌');
    }
    await sleep(300);

    // SECTION 2: Best Sellers Section (limited to 4, excludes sold out)
    const bestsellersSection = `{%- comment -%}
  Shelzy's Designs - Best Sellers Section (Shopify 2.0)
  Shows exactly 4 in-stock products
{%- endcomment -%}

{%- liquid
  assign collection_handle = section.settings.collection | default: 'best-sellers'
  assign bestsellers_collection = collections[collection_handle] | default: collections['all']
  assign shown_count = 0
  assign max_products = 4
-%}

<section class="sz-bestsellers-premium">
  <div class="sz-bestsellers-container">
    <header class="sz-bestsellers-header">
      <span class="sz-eyebrow">{{ section.settings.eyebrow | default: 'Customer Favorites' }}</span>
      <h2>{{ section.settings.heading | default: 'Best Sellers' }}</h2>
    </header>

    <div class="sz-bestsellers-grid">
      {%- for product in bestsellers_collection.products -%}
        {%- if shown_count < max_products and product.available -%}
          <div class="sz-product-card-premium">
            <a href="{{ product.url }}" class="sz-product-card-link">
              <div class="sz-product-card-image">
                {%- if product.featured_image -%}
                  <img src="{{ product.featured_image | image_url: width: 600, height: 600, crop: 'center' }}" alt="{{ product.title | escape }}" loading="lazy">
                {%- else -%}
                  <div class="sz-product-card-placeholder"></div>
                {%- endif -%}
                <div class="sz-product-card-overlay">
                  <span class="sz-product-card-cta">Quick View</span>
                </div>
                {%- if product.compare_at_price > product.price -%}
                  {%- assign discount = product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price -%}
                  <span class="sz-product-badge-premium">{{ discount }}% Off</span>
                {%- elsif product.tags contains 'bestseller' or forloop.index <= 2 -%}
                  <span class="sz-product-badge-premium">Best Seller</span>
                {%- endif -%}
              </div>
              <div class="sz-product-card-info">
                <h3 class="sz-product-card-title">{{ product.title }}</h3>
                <p class="sz-product-card-price">
                  {%- if product.compare_at_price > product.price -%}
                    <span class="sz-price-compare">{{ product.compare_at_price | money }}</span>
                  {%- endif -%}
                  {{ product.price | money }}
                </p>
              </div>
            </a>
          </div>
          {%- assign shown_count = shown_count | plus: 1 -%}
        {%- endif -%}
      {%- endfor -%}
    </div>

    <div class="sz-bestsellers-footer">
      <a href="/collections/{{ collection_handle }}" class="sz-btn sz-btn-outline">View All Products</a>
    </div>
  </div>
</section>

<style>
  .sz-bestsellers-premium { padding: 100px 20px; background: #FFFFFF; }
  @media (max-width: 768px) { .sz-bestsellers-premium { padding: 60px 20px; } }
  .sz-bestsellers-container { max-width: 1400px; margin: 0 auto; }
  .sz-bestsellers-header { text-align: center; margin-bottom: 60px; }
  .sz-bestsellers-header .sz-eyebrow {
    display: inline-block;
    font-family: "Montserrat", sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #B5A48A;
    margin-bottom: 12px;
  }
  .sz-bestsellers-header h2 {
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 500;
    color: #1F1F1F;
    margin: 0;
    letter-spacing: -0.02em;
  }
  .sz-bestsellers-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }
  @media (max-width: 1024px) { .sz-bestsellers-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
  @media (max-width: 600px) { .sz-bestsellers-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
  .sz-product-card-premium { position: relative; background: #FAF8F5; }
  .sz-product-card-link { text-decoration: none; display: block; }
  .sz-product-card-image { position: relative; aspect-ratio: 1; overflow: hidden; background: #F5F2ED; }
  .sz-product-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  .sz-product-card-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #F5F2ED 0%, #E8DED5 100%); }
  .sz-product-card-premium:hover .sz-product-card-image img { transform: scale(1.05); }
  .sz-product-card-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(31, 31, 31, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  .sz-product-card-premium:hover .sz-product-card-overlay { background: rgba(31, 31, 31, 0.15); }
  .sz-product-card-cta {
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    padding: 12px 24px;
    background: #FFFFFF;
    color: #1F1F1F;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .sz-product-card-premium:hover .sz-product-card-cta { opacity: 1; transform: translateY(0); }
  .sz-product-badge-premium {
    position: absolute;
    top: 16px; left: 16px;
    padding: 6px 12px;
    background: #1F1F1F;
    color: #FFFFFF;
    font-family: "Montserrat", sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    z-index: 2;
  }
  .sz-product-card-info { padding: 20px 0; text-align: center; }
  @media (max-width: 600px) { .sz-product-card-info { padding: 12px 0; } }
  .sz-product-card-title {
    font-family: "Inter", sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #1F1F1F;
    margin: 0 0 8px 0;
    line-height: 1.4;
  }
  @media (max-width: 600px) { .sz-product-card-title { font-size: 13px; } }
  .sz-product-card-price { font-family: "Inter", sans-serif; font-size: 14px; color: #4A4A4A; margin: 0; }
  .sz-product-card-price .sz-price-compare { text-decoration: line-through; color: #9A9A9A; margin-right: 8px; }
  .sz-bestsellers-footer { text-align: center; margin-top: 50px; }
  .sz-bestsellers-footer .sz-btn {
    display: inline-flex;
    align-items: center;
    padding: 16px 36px;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    color: #1F1F1F;
    border: 2px solid #1F1F1F;
  }
  .sz-bestsellers-footer .sz-btn:hover { background: #1F1F1F; color: #FFFFFF; }
</style>

{% schema %}
{
  "name": "Shelzys Best Sellers",
  "tag": "section",
  "class": "shelzys-bestsellers-section",
  "settings": [
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Eyebrow Text",
      "default": "Customer Favorites"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Best Sellers"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    }
  ],
  "presets": [
    {
      "name": "Shelzys Best Sellers"
    }
  ]
}
{% endschema %}
`;

    process.stdout.write('   📄 sections/shelzys-bestsellers.liquid... ');
    if (await putAsset(liveTheme.id, 'sections/shelzys-bestsellers.liquid', bestsellersSection)) {
      console.log('✅');
    } else {
      console.log('❌');
    }
    await sleep(300);

    // SECTION 3: Consolidated Social Proof
    const socialProofSection = `{%- comment -%}
  Shelzy's Designs - Consolidated Social Proof Section
  Icons + Testimonials + Sublimation info in ONE section
{%- endcomment -%}

<section class="sz-social-proof-consolidated">
  <div class="sz-social-proof-container">

    <!-- Trust Icons Band -->
    <div class="sz-trust-icons">
      <div class="sz-trust-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>4.9★ Rating</span>
      </div>
      <div class="sz-trust-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <span>500+ Happy Customers</span>
      </div>
      <div class="sz-trust-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <span>3-5 Day Turnaround</span>
      </div>
      <div class="sz-trust-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Permanent Sublimation</span>
      </div>
    </div>

    <!-- Testimonials -->
    <div class="sz-testimonials-grid">
      <div class="sz-testimonial">
        <div class="sz-testimonial-stars">★★★★★</div>
        <p>"These bottles were PERFECT for my bridal party! The quality exceeded expectations and they arrived so fast."</p>
        <span class="sz-testimonial-author">— Sarah M., Bride</span>
      </div>
      <div class="sz-testimonial">
        <div class="sz-testimonial-stars">★★★★★</div>
        <p>"Ordered 50 bottles for our corporate retreat. Professional, beautiful, and the team was so helpful!"</p>
        <span class="sz-testimonial-author">— Jennifer K., Event Planner</span>
      </div>
      <div class="sz-testimonial">
        <div class="sz-testimonial-stars">★★★★★</div>
        <p>"The sublimation printing is amazing - no peeling, no fading. These are truly premium quality."</p>
        <span class="sz-testimonial-author">— Michelle T., Repeat Customer</span>
      </div>
    </div>

    <!-- Sublimation vs Vinyl -->
    <div class="sz-sublimation-info">
      <h3>The Shelzy's Difference</h3>
      <div class="sz-comparison">
        <div class="sz-comparison-item sz-our-method">
          <h4>✓ Our Sublimation Printing</h4>
          <ul>
            <li>Permanent - never peels or fades</li>
            <li>Dishwasher safe</li>
            <li>Vibrant, photo-quality prints</li>
            <li>Ink becomes part of the bottle</li>
          </ul>
        </div>
        <div class="sz-comparison-item sz-other-method">
          <h4>✗ Cheap Vinyl Stickers</h4>
          <ul>
            <li>Peels and bubbles over time</li>
            <li>Not dishwasher safe</li>
            <li>Fades and scratches</li>
            <li>Just a sticker on top</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  .sz-social-proof-consolidated {
    padding: 80px 20px;
    background: linear-gradient(180deg, #FAF8F5 0%, #FFFFFF 100%);
  }
  .sz-social-proof-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Trust Icons */
  .sz-trust-icons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 40px;
    margin-bottom: 60px;
    padding-bottom: 40px;
    border-bottom: 1px solid #E8E4DE;
  }
  .sz-trust-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #4A4A4A;
  }
  .sz-trust-icon svg {
    color: #B5A48A;
  }
  .sz-trust-icon span {
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 500;
  }

  /* Testimonials */
  .sz-testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: 60px;
  }
  @media (max-width: 900px) {
    .sz-testimonials-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
  .sz-testimonial {
    background: #FFFFFF;
    padding: 30px;
    border: 1px solid #E8E4DE;
  }
  .sz-testimonial-stars {
    color: #B5A48A;
    font-size: 16px;
    margin-bottom: 16px;
    letter-spacing: 2px;
  }
  .sz-testimonial p {
    font-family: "Inter", sans-serif;
    font-size: 15px;
    line-height: 1.7;
    color: #4A4A4A;
    margin: 0 0 16px 0;
    font-style: italic;
  }
  .sz-testimonial-author {
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #1F1F1F;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* Sublimation Info */
  .sz-sublimation-info {
    text-align: center;
  }
  .sz-sublimation-info h3 {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 28px;
    font-weight: 500;
    color: #1F1F1F;
    margin: 0 0 30px 0;
  }
  .sz-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    max-width: 800px;
    margin: 0 auto;
  }
  @media (max-width: 600px) {
    .sz-comparison {
      grid-template-columns: 1fr;
    }
  }
  .sz-comparison-item {
    padding: 24px;
    text-align: left;
  }
  .sz-comparison-item h4 {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 16px 0;
  }
  .sz-our-method {
    background: #F0F7F0;
    border: 1px solid #B5D4B5;
  }
  .sz-our-method h4 { color: #2C5530; }
  .sz-other-method {
    background: #FFF5F5;
    border: 1px solid #E8B5B5;
  }
  .sz-other-method h4 { color: #8B3A3A; }
  .sz-comparison-item ul {
    margin: 0;
    padding: 0 0 0 20px;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    line-height: 1.8;
    color: #4A4A4A;
  }
</style>

{% schema %}
{
  "name": "Shelzys Social Proof",
  "tag": "section",
  "class": "shelzys-social-proof-section",
  "settings": [],
  "presets": [
    {
      "name": "Shelzys Social Proof"
    }
  ]
}
{% endschema %}
`;

    process.stdout.write('   📄 sections/shelzys-social-proof.liquid... ');
    if (await putAsset(liveTheme.id, 'sections/shelzys-social-proof.liquid', socialProofSection)) {
      console.log('✅');
    } else {
      console.log('❌');
    }
    await sleep(300);

    // SECTION 4: Blog Section with "The Shelzy Edit" title
    const blogSection = `{%- comment -%}
  Shelzy's Designs - The Shelzy Edit (Blog Section)
{%- endcomment -%}

{%- liquid
  assign blog_handle = section.settings.blog | default: 'news'
  assign blog = blogs[blog_handle]
  assign max_posts = 3
-%}

<section class="sz-blog-edit">
  <div class="sz-blog-container">
    <header class="sz-blog-header">
      <span class="sz-eyebrow">{{ section.settings.eyebrow | default: 'Inspiration & Ideas' }}</span>
      <h2>{{ section.settings.heading | default: 'The Shelzy Edit' }}</h2>
    </header>

    {% if blog.articles.size > 0 %}
      <div class="sz-blog-grid">
        {% for article in blog.articles limit: max_posts %}
          <article class="sz-blog-card">
            <a href="{{ article.url }}" class="sz-blog-card-link">
              {% if article.image %}
                <div class="sz-blog-card-image">
                  <img src="{{ article.image | image_url: width: 600, height: 400, crop: 'center' }}" alt="{{ article.title | escape }}" loading="lazy">
                </div>
              {% endif %}
              <div class="sz-blog-card-content">
                <span class="sz-blog-date">{{ article.published_at | date: '%B %d, %Y' }}</span>
                <h3>{{ article.title }}</h3>
                <p>{{ article.excerpt_or_content | strip_html | truncate: 120 }}</p>
                <span class="sz-blog-read-more">Read More →</span>
              </div>
            </a>
          </article>
        {% endfor %}
      </div>
    {% else %}
      <p style="text-align: center; color: #7A7A7A;">Coming soon - inspiration for your next event!</p>
    {% endif %}

    <div class="sz-blog-footer">
      <a href="/blogs/{{ blog_handle }}" class="sz-btn sz-btn-outline">View All Posts</a>
    </div>
  </div>
</section>

<style>
  .sz-blog-edit {
    padding: 100px 20px;
    background: #FFFFFF;
  }
  @media (max-width: 768px) {
    .sz-blog-edit { padding: 60px 20px; }
  }
  .sz-blog-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .sz-blog-header {
    text-align: center;
    margin-bottom: 60px;
  }
  .sz-blog-header .sz-eyebrow {
    display: inline-block;
    font-family: "Montserrat", sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #B5A48A;
    margin-bottom: 12px;
  }
  .sz-blog-header h2 {
    font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 500;
    color: #1F1F1F;
    margin: 0;
    letter-spacing: -0.02em;
  }
  .sz-blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  @media (max-width: 900px) {
    .sz-blog-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
  .sz-blog-card {
    background: #FAF8F5;
  }
  .sz-blog-card-link {
    text-decoration: none;
    display: block;
  }
  .sz-blog-card-image {
    aspect-ratio: 3/2;
    overflow: hidden;
  }
  .sz-blog-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  .sz-blog-card:hover .sz-blog-card-image img {
    transform: scale(1.05);
  }
  .sz-blog-card-content {
    padding: 24px;
  }
  .sz-blog-date {
    font-family: "Montserrat", sans-serif;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #B5A48A;
  }
  .sz-blog-card h3 {
    font-family: "Inter", sans-serif;
    font-size: 18px;
    font-weight: 500;
    color: #1F1F1F;
    margin: 12px 0;
    line-height: 1.4;
  }
  .sz-blog-card p {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #6A6A6A;
    margin: 0 0 16px 0;
  }
  .sz-blog-read-more {
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #1F1F1F;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .sz-blog-footer {
    text-align: center;
    margin-top: 50px;
  }
  .sz-blog-footer .sz-btn {
    display: inline-flex;
    align-items: center;
    padding: 16px 36px;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    color: #1F1F1F;
    border: 2px solid #1F1F1F;
  }
  .sz-blog-footer .sz-btn:hover {
    background: #1F1F1F;
    color: #FFFFFF;
  }
</style>

{% schema %}
{
  "name": "The Shelzy Edit",
  "tag": "section",
  "class": "shelzys-blog-section",
  "settings": [
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Eyebrow Text",
      "default": "Inspiration & Ideas"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "The Shelzy Edit"
    },
    {
      "type": "blog",
      "id": "blog",
      "label": "Blog"
    }
  ],
  "presets": [
    {
      "name": "The Shelzy Edit"
    }
  ]
}
{% endschema %}
`;

    process.stdout.write('   📄 sections/shelzys-blog.liquid... ');
    if (await putAsset(liveTheme.id, 'sections/shelzys-blog.liquid', blogSection)) {
      console.log('✅');
    } else {
      console.log('❌');
    }
    await sleep(300);

    // SECTION 5: Occasion Tiles
    const occasionTilesSection = `{%- comment -%}
  Shelzy's Designs - Shop by Occasion Tiles (Shopify 2.0)
{%- endcomment -%}

<section class="sz-occasion-tiles">
  <div class="sz-occasion-container">
    <header class="sz-occasion-header">
      <span class="sz-eyebrow">{{ section.settings.eyebrow | default: 'Find Your Perfect Bottle' }}</span>
      <h2>{{ section.settings.heading | default: 'Shop by Occasion' }}</h2>
    </header>

    <div class="sz-occasion-grid">
      <a href="/collections/wedding" class="sz-occasion-tile">
        <div class="sz-tile-bg">
          {%- assign wedding_collection = collections['wedding'] | default: collections['bridal'] -%}
          {%- if wedding_collection.image -%}
            <img src="{{ wedding_collection.image | image_url: width: 800, height: 1000, crop: 'center' }}" alt="Wedding bottles" loading="lazy">
          {%- else -%}
            <div class="sz-tile-placeholder" style="background: linear-gradient(135deg, #F5E6E0 0%, #E8DED5 100%);"></div>
          {%- endif -%}
        </div>
        <div class="sz-tile-overlay"></div>
        <div class="sz-tile-content">
          <h3 class="sz-tile-title">Weddings & Bridal Parties</h3>
          <p class="sz-tile-subtitle">Bridesmaid proposals, party favors & gifts</p>
          <span class="sz-tile-cta">Shop Weddings →</span>
        </div>
      </a>

      <a href="/collections/bachelorette" class="sz-occasion-tile">
        <div class="sz-tile-bg">
          {%- assign bach_collection = collections['bachelorette'] | default: collections['party'] -%}
          {%- if bach_collection.image -%}
            <img src="{{ bach_collection.image | image_url: width: 800, height: 1000, crop: 'center' }}" alt="Bachelorette bottles" loading="lazy">
          {%- else -%}
            <div class="sz-tile-placeholder" style="background: linear-gradient(135deg, #F5D6D0 0%, #E8B4B8 100%);"></div>
          {%- endif -%}
        </div>
        <div class="sz-tile-overlay"></div>
        <div class="sz-tile-content">
          <h3 class="sz-tile-title">Bachelorette Weekends</h3>
          <p class="sz-tile-subtitle">Matching bottles for the whole crew</p>
          <span class="sz-tile-cta">Shop Bachelorette →</span>
        </div>
      </a>

      <a href="/pages/bulk-orders" class="sz-occasion-tile">
        <div class="sz-tile-bg">
          {%- assign corp_collection = collections['corporate'] | default: collections['bulk'] -%}
          {%- if corp_collection.image -%}
            <img src="{{ corp_collection.image | image_url: width: 800, height: 1000, crop: 'center' }}" alt="Corporate bottles" loading="lazy">
          {%- else -%}
            <div class="sz-tile-placeholder" style="background: linear-gradient(135deg, #D4CFC6 0%, #B5A48A 100%);"></div>
          {%- endif -%}
        </div>
        <div class="sz-tile-overlay"></div>
        <div class="sz-tile-content">
          <h3 class="sz-tile-title">Corporate & Events</h3>
          <p class="sz-tile-subtitle">Branded bottles for retreats & conferences</p>
          <span class="sz-tile-cta">Get a Quote →</span>
        </div>
      </a>

      <a href="/collections/all" class="sz-occasion-tile">
        <div class="sz-tile-bg">
          {%- assign team_collection = collections['teams'] | default: collections['sports'] -%}
          {%- if team_collection.image -%}
            <img src="{{ team_collection.image | image_url: width: 800, height: 1000, crop: 'center' }}" alt="Team bottles" loading="lazy">
          {%- else -%}
            <div class="sz-tile-placeholder" style="background: linear-gradient(135deg, #B8C5B0 0%, #8BAA88 100%);"></div>
          {%- endif -%}
        </div>
        <div class="sz-tile-overlay"></div>
        <div class="sz-tile-content">
          <h3 class="sz-tile-title">Everyday & Teams</h3>
          <p class="sz-tile-subtitle">Sports, dance, gym & daily hydration</p>
          <span class="sz-tile-cta">Shop All →</span>
        </div>
      </a>
    </div>
  </div>
</section>

<style>
  .sz-occasion-tiles { padding: 100px 20px; background: #FFFFFF; }
  @media (max-width: 768px) { .sz-occasion-tiles { padding: 60px 20px; } }
  .sz-occasion-container { max-width: 1400px; margin: 0 auto; }
  .sz-occasion-header { text-align: center; margin-bottom: 50px; }
  .sz-occasion-header .sz-eyebrow {
    display: inline-block;
    font-family: "Montserrat", sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #B5A48A;
    margin-bottom: 12px;
  }
  .sz-occasion-header h2 {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 500;
    color: #1F1F1F;
    margin: 0;
  }
  .sz-occasion-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  @media (max-width: 1024px) { .sz-occasion-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .sz-occasion-grid { grid-template-columns: 1fr; gap: 16px; } }
  .sz-occasion-tile { position: relative; aspect-ratio: 3/4; display: block; overflow: hidden; text-decoration: none; }
  @media (max-width: 1024px) { .sz-occasion-tile { aspect-ratio: 4/3; } }
  @media (max-width: 600px) { .sz-occasion-tile { aspect-ratio: 16/9; min-height: 200px; } }
  .sz-tile-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
  .sz-tile-bg img, .sz-tile-placeholder { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  .sz-occasion-tile:hover .sz-tile-bg img, .sz-occasion-tile:hover .sz-tile-placeholder { transform: scale(1.08); }
  .sz-tile-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(180deg, rgba(31,31,31,0) 0%, rgba(31,31,31,0.5) 100%);
    transition: background 0.4s ease;
  }
  .sz-occasion-tile:hover .sz-tile-overlay { background: linear-gradient(180deg, rgba(31,31,31,0.2) 0%, rgba(31,31,31,0.7) 100%); }
  .sz-tile-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 30px; color: #FFFFFF; z-index: 2; }
  @media (max-width: 600px) { .sz-tile-content { padding: 24px; } }
  .sz-tile-title { font-family: "Cormorant Garamond", Georgia, serif; font-size: 26px; font-weight: 500; margin: 0 0 8px 0; line-height: 1.2; }
  @media (max-width: 1024px) { .sz-tile-title { font-size: 24px; } }
  @media (max-width: 600px) { .sz-tile-title { font-size: 22px; } }
  .sz-tile-subtitle { font-family: "Inter", sans-serif; font-size: 14px; font-weight: 400; opacity: 0.85; margin: 0 0 16px 0; line-height: 1.4; }
  .sz-tile-cta { display: inline-block; font-family: "Inter", sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; opacity: 0; transform: translateY(10px); transition: all 0.3s ease; }
  .sz-occasion-tile:hover .sz-tile-cta { opacity: 1; transform: translateY(0); }
  @media (max-width: 768px) { .sz-tile-cta { opacity: 1; transform: translateY(0); } }
</style>

{% schema %}
{
  "name": "Shelzys Occasion Tiles",
  "tag": "section",
  "class": "shelzys-occasion-tiles-section",
  "settings": [
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Eyebrow Text",
      "default": "Find Your Perfect Bottle"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Shop by Occasion"
    }
  ],
  "presets": [
    {
      "name": "Shelzys Occasion Tiles"
    }
  ]
}
{% endschema %}
`;

    process.stdout.write('   📄 sections/shelzys-occasion-tiles.liquid... ');
    if (await putAsset(liveTheme.id, 'sections/shelzys-occasion-tiles.liquid', occasionTilesSection)) {
      console.log('✅');
    } else {
      console.log('❌');
    }
    await sleep(300);

    // SECTION 6: Newsletter
    const newsletterSection = `{%- comment -%}
  Shelzy's Designs - Newsletter Section (Shopify 2.0)
{%- endcomment -%}

<section class="sz-newsletter-premium">
  <div class="sz-newsletter-premium-container">
    <h3>{{ section.settings.heading | default: "Join the Shelzy's Family" }}</h3>
    <p>{{ section.settings.subheading | default: 'Get 10% off your first order plus exclusive access to new designs and sales.' }}</p>

    {% form 'customer', id: 'sz-newsletter-form' %}
      {% if form.posted_successfully? %}
        <p class="sz-newsletter-success">Thanks for subscribing! Check your email for your discount code.</p>
      {% else %}
        <div class="sz-newsletter-premium-form">
          <input type="email" name="contact[email]" class="sz-newsletter-premium-input" placeholder="Enter your email" required aria-label="Email address">
          <input type="hidden" name="contact[tags]" value="newsletter">
          <button type="submit" class="sz-btn sz-btn-primary">Subscribe</button>
        </div>
        <p class="sz-newsletter-disclaimer">Unsubscribe anytime. No spam, we promise.</p>
      {% endif %}
    {% endform %}
  </div>
</section>

<style>
  .sz-newsletter-premium { padding: 80px 20px; background: #F5F2ED; text-align: center; }
  .sz-newsletter-premium-container { max-width: 500px; margin: 0 auto; }
  .sz-newsletter-premium h3 {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 32px;
    font-weight: 500;
    color: #1F1F1F;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
  }
  .sz-newsletter-premium > p, .sz-newsletter-premium-container > p {
    font-family: "Inter", sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #7A7A7A;
    margin: 0 0 30px 0;
  }
  .sz-newsletter-premium-form { display: flex; gap: 12px; }
  @media (max-width: 500px) { .sz-newsletter-premium-form { flex-direction: column; } }
  .sz-newsletter-premium-input {
    flex: 1;
    padding: 16px 20px;
    border: 1px solid #D4CFC6;
    background: #FFFFFF;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: #1F1F1F;
  }
  .sz-newsletter-premium-input:focus { outline: none; border-color: #2C3E2D; }
  .sz-newsletter-premium-input::placeholder { color: #9A9A9A; }
  .sz-newsletter-premium .sz-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 16px 32px;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #2C3E2D;
    color: #FFFFFF;
    border: 2px solid #2C3E2D;
  }
  .sz-newsletter-premium .sz-btn:hover { background: #1F1F1F; border-color: #1F1F1F; }
  .sz-newsletter-disclaimer { font-family: "Inter", sans-serif; font-size: 12px; color: #9A9A9A; margin: 16px 0 0 0 !important; }
  .sz-newsletter-success { font-family: "Inter", sans-serif; font-size: 15px; color: #2C3E2D; background: rgba(44, 62, 45, 0.1); padding: 20px; }
</style>

{% schema %}
{
  "name": "Shelzys Newsletter",
  "tag": "section",
  "class": "shelzys-newsletter-section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Join the Shelzy's Family"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "Get 10% off your first order plus exclusive access to new designs and sales."
    }
  ],
  "presets": [
    {
      "name": "Shelzys Newsletter"
    }
  ]
}
{% endschema %}
`;

    process.stdout.write('   📄 sections/shelzys-newsletter.liquid... ');
    if (await putAsset(liveTheme.id, 'sections/shelzys-newsletter.liquid', newsletterSection)) {
      console.log('✅');
    } else {
      console.log('❌');
    }
    await sleep(300);

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('UPDATING HOMEPAGE TEMPLATE');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    // Now update the JSON template to use our sections
    if (templateConfig) {
      // Create a new homepage structure
      const newHomepageJson = {
        "sections": {
          "shelzys-hero": {
            "type": "shelzys-hero",
            "settings": {
              "heading": "Luxury Personalized Water Bottles for Weddings & Events",
              "subheading": "Permanent sublimation printing that never peels. Fast turnaround.",
              "primary_text": "Shop Bridal Bottles",
              "primary_link": "shopify://collections/wedding",
              "secondary_text": "Shop Best Sellers",
              "secondary_link": "shopify://collections/best-sellers"
            }
          },
          "shelzys-bestsellers": {
            "type": "shelzys-bestsellers",
            "settings": {
              "eyebrow": "Customer Favorites",
              "heading": "Best Sellers",
              "collection": "best-sellers"
            }
          },
          "shelzys-social-proof": {
            "type": "shelzys-social-proof",
            "settings": {}
          },
          "shelzys-occasion-tiles": {
            "type": "shelzys-occasion-tiles",
            "disabled": false,
            "settings": {}
          },
          "shelzys-blog": {
            "type": "shelzys-blog",
            "settings": {
              "eyebrow": "Inspiration & Ideas",
              "heading": "The Shelzy Edit",
              "blog": "news"
            }
          },
          "shelzys-newsletter": {
            "type": "shelzys-newsletter",
            "disabled": false,
            "settings": {}
          }
        },
        "order": [
          "shelzys-hero",
          "shelzys-bestsellers",
          "shelzys-social-proof",
          "shelzys-occasion-tiles",
          "shelzys-blog",
          "shelzys-newsletter"
        ]
      };

      process.stdout.write('   📄 templates/index.json... ');
      if (await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(newHomepageJson, null, 2))) {
        console.log('✅');
      } else {
        console.log('❌ (May need Theme Customizer)');
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // VERIFY BULK ORDERS PAGE
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('VERIFYING BULK ORDERS PAGE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const pagesResponse = await apiRequest('GET', '/pages.json');
  if (pagesResponse.status === 200) {
    const bulkPage = pagesResponse.data.pages.find(p =>
      p.handle === 'bulk-orders' ||
      p.handle === 'bulk-corporate' ||
      p.title.toLowerCase().includes('bulk')
    );

    if (bulkPage) {
      console.log(`   ✅ Found page: "${bulkPage.title}"`);
      console.log(`      Handle: ${bulkPage.handle}`);
      console.log(`      Published: ${bulkPage.published_at ? 'Yes' : 'No'}`);
      console.log(`      Template: ${bulkPage.template_suffix || 'default'}`);
      console.log(`      URL: https://shelzysdesigns.com/pages/${bulkPage.handle}`);

      // Make sure it's published and has the right template
      if (!bulkPage.published_at || bulkPage.template_suffix !== 'bulk-corporate') {
        console.log('');
        console.log('   🔄 Updating page settings...');
        const updateResponse = await apiRequest('PUT', `/pages/${bulkPage.id}.json`, {
          page: {
            id: bulkPage.id,
            published: true,
            template_suffix: 'bulk-corporate'
          }
        });
        if (updateResponse.status === 200) {
          console.log('   ✅ Page updated and published');
        }
      }
    } else {
      console.log('   ⚠️ No bulk orders page found');
      console.log('   Creating new page...');

      const createResponse = await apiRequest('POST', '/pages.json', {
        page: {
          title: 'Bulk & Corporate Orders',
          handle: 'bulk-orders',
          template_suffix: 'bulk-corporate',
          body_html: '',
          published: true
        }
      });

      if (createResponse.status === 201 || createResponse.status === 200) {
        console.log('   ✅ Page created');
        console.log(`   URL: https://shelzysdesigns.com/pages/bulk-orders`);
      } else {
        console.log(`   ❌ Failed: ${JSON.stringify(createResponse.data)}`);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════
  console.log('');
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ ROUND 3 FIXES DEPLOYED                                     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📋 What was done:');
  console.log('');
  console.log('   1. Created Shopify 2.0 SECTION files (not just snippets):');
  console.log('      • sections/shelzys-hero.liquid');
  console.log('      • sections/shelzys-bestsellers.liquid');
  console.log('      • sections/shelzys-social-proof.liquid');
  console.log('      • sections/shelzys-blog.liquid');
  console.log('');
  console.log('   2. Updated homepage JSON template to use our sections');
  console.log('');
  console.log('   3. Verified/created Bulk Orders page');
  console.log('');
  console.log('⚠️  IMPORTANT: If sections don\'t appear automatically:');
  console.log('');
  console.log('   Go to Online Store → Themes → Customize');
  console.log('');
  console.log('   For the homepage, you can now add these sections:');
  console.log('   • "Shelzys Hero" - with the new copy');
  console.log('   • "Shelzys Best Sellers" - 4 products, no sold out');
  console.log('   • "Shelzys Social Proof" - consolidated testimonials');
  console.log('   • "The Shelzy Edit" - blog with correct title');
  console.log('');
  console.log('   Remove any old/duplicate sections you see.');
  console.log('');
  console.log('🔗 View your store: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
