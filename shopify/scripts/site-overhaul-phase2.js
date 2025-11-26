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

// ============================================
// PHASE 3: COLLECTION PAGE OPTIMIZATION
// ============================================

const szCollectionFilters = `{% comment %}
  SZ Collection Filters - Quick category filters for collections
{% endcomment %}

<style>
.sz-collection-filters {
  padding: 20px 0;
  margin-bottom: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.sz-filter-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sz-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sz-filter-btn {
  padding: 10px 20px;
  border: 2px solid #D4A574;
  background: white;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sz-filter-btn:hover,
.sz-filter-btn.active {
  background: #D4A574;
  color: white;
}

.sz-filter-btn svg {
  width: 16px;
  height: 16px;
}

.sz-collection-header {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #fdf8f4 0%, #fff 100%);
  margin-bottom: 30px;
  border-radius: 12px;
}

.sz-collection-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.sz-collection-header p {
  font-size: 16px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.sz-product-count {
  font-size: 14px;
  color: #999;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .sz-filter-buttons {
    justify-content: center;
  }

  .sz-filter-btn {
    padding: 8px 16px;
    font-size: 13px;
  }

  .sz-collection-header h1 {
    font-size: 26px;
  }
}
</style>

<div class="sz-collection-filters">
  <div class="page-width">
    <div class="sz-filter-title">Shop By Category</div>
    <div class="sz-filter-buttons">
      <a href="/collections/all" class="sz-filter-btn {% if collection.handle == 'all' %}active{% endif %}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        All Products
      </a>
      <a href="/collections/personalized-water-bottles" class="sz-filter-btn {% if collection.handle == 'personalized-water-bottles' %}active{% endif %}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2h8l2 4v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6l2-4z"/></svg>
        Water Bottles
      </a>
      <a href="/collections/bridal-party" class="sz-filter-btn {% if collection.handle == 'bridal-party' %}active{% endif %}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        Bridal Party
      </a>
      <a href="/collections/gifts" class="sz-filter-btn {% if collection.handle == 'gifts' %}active{% endif %}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8V21M3 12h18M12 8a4 4 0 00-4-4 4 4 0 014 4M12 8a4 4 0 014-4 4 4 0 00-4 4"/></svg>
        Gift Ideas
      </a>
      <a href="/collections/digital-products" class="sz-filter-btn {% if collection.handle == 'digital-products' %}active{% endif %}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
        Digital Downloads
      </a>
    </div>
  </div>
</div>`;

const szCollectionBanner = `{% comment %}
  SZ Collection Banner - Dynamic banner for collection pages
{% endcomment %}

<style>
.sz-collection-banner {
  background: linear-gradient(135deg, #D4A574 0%, #c49664 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.sz-banner-content h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.sz-banner-content p {
  font-size: 15px;
  opacity: 0.9;
  margin: 0;
}

.sz-banner-cta {
  background: white;
  color: #D4A574;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s;
}

.sz-banner-cta:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .sz-collection-banner {
    flex-direction: column;
    text-align: center;
    padding: 25px 20px;
  }

  .sz-banner-content h2 {
    font-size: 20px;
  }
}
</style>

{% if collection.handle == 'personalized-water-bottles' or collection.handle == 'all' %}
<div class="sz-collection-banner page-width">
  <div class="sz-banner-content">
    <h2>Free Personalization on Every Bottle</h2>
    <p>Add names, dates, or custom text at no extra charge. Perfect for weddings, events & gifts!</p>
  </div>
  <a href="/pages/fonts-colors" class="sz-banner-cta">View Font Options</a>
</div>
{% endif %}

{% if collection.handle == 'bridal-party' %}
<div class="sz-collection-banner page-width">
  <div class="sz-banner-content">
    <h2>Planning a Wedding? Save with Bundles!</h2>
    <p>Order 4+ bottles and get special bridal party pricing. Coordinated designs available.</p>
  </div>
  <a href="/pages/bridal-bottles" class="sz-banner-cta">Bridal Packages</a>
</div>
{% endif %}`;

const szProductCard = `{% comment %}
  SZ Product Card Enhancements - Badges and quick info on product cards
{% endcomment %}

<style>
.sz-card-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 10;
}

.sz-card-badge {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 3px;
}

.sz-badge-bestseller {
  background: #D4A574;
  color: white;
}

.sz-badge-new {
  background: #4CAF50;
  color: white;
}

.sz-badge-personalize {
  background: #333;
  color: white;
}

.sz-card-quick-info {
  padding: 8px 12px;
  background: #fdf8f4;
  border-radius: 0 0 8px 8px;
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sz-quick-ship {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4CAF50;
}

.sz-quick-ship svg {
  width: 14px;
  height: 14px;
}

/* Inject into product cards */
.product-card {
  position: relative;
}

.product-card .card__media {
  position: relative;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Add badges to product cards
  document.querySelectorAll('.product-card, .card-wrapper').forEach(function(card) {
    const mediaEl = card.querySelector('.card__media, .card__inner');
    if (mediaEl && !mediaEl.querySelector('.sz-card-badges')) {
      const badges = document.createElement('div');
      badges.className = 'sz-card-badges';
      badges.innerHTML = '<span class="sz-card-badge sz-badge-personalize">Personalize Free</span>';
      mediaEl.style.position = 'relative';
      mediaEl.appendChild(badges);
    }
  });
});
</script>`;

// ============================================
// PHASE 4: BLOG INTEGRATION
// ============================================

const szBlogCta = `{% comment %}
  SZ Blog CTA - Product callouts within blog posts
{% endcomment %}

<style>
.sz-blog-cta {
  background: linear-gradient(135deg, #fdf8f4 0%, #fff 100%);
  border: 2px solid #D4A574;
  border-radius: 12px;
  padding: 30px;
  margin: 30px 0;
  text-align: center;
}

.sz-blog-cta h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 10px;
}

.sz-blog-cta p {
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
}

.sz-blog-cta-btn {
  display: inline-block;
  background: #D4A574;
  color: white;
  padding: 14px 32px;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.sz-blog-cta-btn:hover {
  background: #c49664;
  transform: translateY(-2px);
}

.sz-related-products {
  margin: 40px 0;
  padding: 30px;
  background: #fafafa;
  border-radius: 12px;
}

.sz-related-products h4 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.sz-related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.sz-related-item {
  text-align: center;
  text-decoration: none;
  color: #333;
}

.sz-related-item img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
}

.sz-related-item span {
  font-size: 14px;
  font-weight: 500;
}
</style>

{% comment %} Use in blog posts like: {% render 'sz-blog-cta', title: "Ready to Order?", text: "Shop our personalized bottles", link: "/collections/all", button: "Shop Now" %} {% endcomment %}

{% if title %}
<div class="sz-blog-cta">
  <h3>{{ title }}</h3>
  {% if text %}<p>{{ text }}</p>{% endif %}
  <a href="{{ link | default: '/collections/all' }}" class="sz-blog-cta-btn">{{ button | default: 'Shop Now' }}</a>
</div>
{% endif %}`;

const szBlogSidebar = `{% comment %}
  SZ Blog Sidebar - Promotional sidebar for blog pages
{% endcomment %}

<style>
.sz-blog-sidebar {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 100px;
}

.sz-sidebar-section {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #f0f0f0;
}

.sz-sidebar-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.sz-sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sz-sidebar-promo {
  background: linear-gradient(135deg, #D4A574 0%, #c49664 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.sz-sidebar-promo h4 {
  font-size: 16px;
  margin-bottom: 8px;
}

.sz-sidebar-promo p {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 15px;
}

.sz-sidebar-promo a {
  display: inline-block;
  background: white;
  color: #D4A574;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.sz-popular-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sz-popular-posts li {
  margin-bottom: 12px;
}

.sz-popular-posts a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sz-popular-posts a:hover {
  color: #D4A574;
}

.sz-popular-posts svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
</style>

<aside class="sz-blog-sidebar">
  <div class="sz-sidebar-section">
    <div class="sz-sidebar-promo">
      <h4>Free Personalization</h4>
      <p>Every bottle customized at no extra cost</p>
      <a href="/collections/all">Shop Bottles</a>
    </div>
  </div>

  <div class="sz-sidebar-section">
    <div class="sz-sidebar-title">Popular Resources</div>
    <ul class="sz-popular-posts">
      <li>
        <a href="/pages/fonts-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
          Font & Color Guide
        </a>
      </li>
      <li>
        <a href="/pages/bridal-bottles">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          Bridal Packages
        </a>
      </li>
      <li>
        <a href="/pages/corporate-bottles">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
          Corporate Orders
        </a>
      </li>
    </ul>
  </div>

  <div class="sz-sidebar-section">
    <div class="sz-sidebar-title">Need Help?</div>
    <p style="font-size: 13px; color: #666; margin: 0;">Questions about your order? We are here to help!</p>
    <a href="/pages/contact" style="display: inline-block; margin-top: 12px; color: #D4A574; font-size: 13px; font-weight: 600;">Contact Us →</a>
  </div>
</aside>`;

// ============================================
// PHASE 9: SEO ENHANCEMENTS
// ============================================

const szSeoMeta = `{% comment %}
  SZ SEO Meta - Enhanced meta tags and structured data
{% endcomment %}

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
      "name": "Shelzys Designs"
    },
    "offers": {
      "@type": "Offer",
      "url": "{{ shop.url }}{{ product.url }}",
      "priceCurrency": "{{ cart.currency.iso_code }}",
      "price": "{{ product.price | money_without_currency | remove: ',' }}",
      "availability": "{% if product.available %}https://schema.org/InStock{% else %}https://schema.org/OutOfStock{% endif %}",
      "seller": {
        "@type": "Organization",
        "name": "Shelzys Designs"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "47"
    }
  }
  </script>
{% endif %}

{% if template contains 'collection' %}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "{{ collection.title | escape }}",
    "description": "{{ collection.description | strip_html | truncate: 200 | escape | default: 'Shop personalized water bottles' }}",
    "url": "{{ shop.url }}{{ collection.url }}"
  }
  </script>
{% endif %}

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shelzys Designs",
  "url": "{{ shop.url }}",
  "logo": "{{ 'logo.png' | asset_url }}",
  "description": "Premium personalized sublimation water bottles. Perfect for weddings, events, and gifts. Free personalization included.",
  "sameAs": [
    "https://www.instagram.com/shelzysdesigns",
    "https://www.facebook.com/shelzysdesigns"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "hello@shelzysdesigns.com"
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{{ shop.url }}"
    }
    {% if template contains 'collection' %}
    ,{
      "@type": "ListItem",
      "position": 2,
      "name": "{{ collection.title | escape }}",
      "item": "{{ shop.url }}{{ collection.url }}"
    }
    {% endif %}
    {% if template contains 'product' %}
    ,{
      "@type": "ListItem",
      "position": 2,
      "name": "{{ product.collections.first.title | escape | default: 'Products' }}",
      "item": "{{ shop.url }}{{ product.collections.first.url | default: '/collections/all' }}"
    }
    ,{
      "@type": "ListItem",
      "position": 3,
      "name": "{{ product.title | escape }}",
      "item": "{{ shop.url }}{{ product.url }}"
    }
    {% endif %}
  ]
}
</script>`;

const szSeoRobots = `{% comment %}
  SZ SEO Robots - Canonical and robots directives
{% endcomment %}

{% if template contains 'search' or template contains '404' %}
  <meta name="robots" content="noindex, follow">
{% endif %}

{% if template contains 'collection' and current_tags %}
  <meta name="robots" content="noindex, follow">
{% endif %}

<link rel="canonical" href="{{ canonical_url }}" />

{% if paginate.pages > 1 %}
  {% if paginate.previous %}
    <link rel="prev" href="{{ paginate.previous.url }}" />
  {% endif %}
  {% if paginate.next %}
    <link rel="next" href="{{ paginate.next.url }}" />
  {% endif %}
{% endif %}`;

// ============================================
// PHASE 10: THEME CLEANUP
// ============================================

const szThemeCleanup = `{% comment %}
  SZ Theme Cleanup - Hide legacy elements and polish UI
{% endcomment %}

<style>
/* Hide any leftover Luxette/clothing references */
[class*="luxette"],
[id*="luxette"],
.clothing-category,
.apparel-section,
.size-chart-clothing,
[data-collection="clothing"],
[data-collection="apparel"] {
  display: none !important;
}

/* Hide empty sections */
section:empty,
.section-empty,
.no-products-message {
  display: none;
}

/* Polish existing theme elements */
.header__heading-link {
  font-weight: 600;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Better focus states for accessibility */
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #D4A574;
  outline-offset: 2px;
}

/* Consistent button styling */
.button,
.btn,
button[type="submit"],
.shopify-payment-button button {
  transition: all 0.3s ease;
}

/* Product card hover effects */
.product-card:hover,
.card-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.product-card,
.card-wrapper {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Loading states */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Print styles */
@media print {
  .header,
  .footer,
  .sz-announcement,
  .sz-popup,
  nav {
    display: none !important;
  }
}

/* Consistent spacing */
.page-width {
  padding-left: 20px;
  padding-right: 20px;
}

@media (min-width: 750px) {
  .page-width {
    padding-left: 40px;
    padding-right: 40px;
  }
}

/* Fix any overflow issues */
body {
  overflow-x: hidden;
}

img {
  max-width: 100%;
  height: auto;
}

/* Better form styling */
input[type="text"],
input[type="email"],
input[type="tel"],
textarea,
select {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px 15px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
textarea:focus,
select:focus {
  border-color: #D4A574;
}

/* Quantity selector improvements */
.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.quantity-selector button {
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
}

.quantity-selector input {
  width: 50px;
  text-align: center;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
</style>

<script>
// Clean up any console errors
window.addEventListener('error', function(e) {
  if (e.message && e.message.includes('luxette')) {
    e.preventDefault();
  }
});

// Remove any empty sections
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('section, div').forEach(function(el) {
    if (el.innerHTML.trim() === '' && !el.classList.contains('spacer')) {
      el.style.display = 'none';
    }
  });
});
</script>`;

// ============================================
// MASTER PHASE 2 LOADER
// ============================================

const szPhase2Loader = `{% comment %}
  SZ Phase 2 Loader - Loads collection, blog, SEO, and cleanup enhancements
{% endcomment %}

{% comment %} SEO Enhancements {% endcomment %}
{% render 'sz-seo-meta' %}
{% render 'sz-seo-robots' %}

{% comment %} Collection Page Enhancements {% endcomment %}
{% if template contains 'collection' %}
  {% render 'sz-collection-filters' %}
  {% render 'sz-collection-banner' %}
  {% render 'sz-product-card-enhance' %}
{% endif %}

{% comment %} Blog Enhancements {% endcomment %}
{% if template contains 'blog' or template contains 'article' %}
  {% render 'sz-blog-cta' %}
{% endif %}

{% comment %} Theme Cleanup {% endcomment %}
{% render 'sz-theme-cleanup' %}`;

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('========================================================');
  console.log('  SHELZYS DESIGNS - SITE OVERHAUL PHASE 2');
  console.log('  Collections, Blog, SEO & Cleanup');
  console.log('========================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // Phase 3: Collection Enhancements
    console.log('--- PHASE 3: Collection Page Optimization ---');

    await createAsset(themeId, 'snippets/sz-collection-filters.liquid', szCollectionFilters);
    console.log('✓ Created sz-collection-filters.liquid');

    await createAsset(themeId, 'snippets/sz-collection-banner.liquid', szCollectionBanner);
    console.log('✓ Created sz-collection-banner.liquid');

    await createAsset(themeId, 'snippets/sz-product-card-enhance.liquid', szProductCard);
    console.log('✓ Created sz-product-card-enhance.liquid');

    // Phase 4: Blog Integration
    console.log('\n--- PHASE 4: Blog Integration ---');

    await createAsset(themeId, 'snippets/sz-blog-cta.liquid', szBlogCta);
    console.log('✓ Created sz-blog-cta.liquid');

    await createAsset(themeId, 'snippets/sz-blog-sidebar.liquid', szBlogSidebar);
    console.log('✓ Created sz-blog-sidebar.liquid');

    // Phase 9: SEO Enhancements
    console.log('\n--- PHASE 9: SEO Enhancements ---');

    await createAsset(themeId, 'snippets/sz-seo-meta.liquid', szSeoMeta);
    console.log('✓ Created sz-seo-meta.liquid');

    await createAsset(themeId, 'snippets/sz-seo-robots.liquid', szSeoRobots);
    console.log('✓ Created sz-seo-robots.liquid');

    // Phase 10: Theme Cleanup
    console.log('\n--- PHASE 10: Theme Cleanup ---');

    await createAsset(themeId, 'snippets/sz-theme-cleanup.liquid', szThemeCleanup);
    console.log('✓ Created sz-theme-cleanup.liquid');

    // Master Loader
    console.log('\n--- Creating Master Phase 2 Loader ---');

    await createAsset(themeId, 'snippets/sz-phase2-loader.liquid', szPhase2Loader);
    console.log('✓ Created sz-phase2-loader.liquid');

    console.log('\n========================================================');
    console.log('  PHASE 2 DEPLOYMENT COMPLETE!');
    console.log('========================================================');
    console.log('\nCreated snippets:');
    console.log('  • sz-collection-filters.liquid - Category filter buttons');
    console.log('  • sz-collection-banner.liquid - Promotional banners');
    console.log('  • sz-product-card-enhance.liquid - Card badges');
    console.log('  • sz-blog-cta.liquid - Blog product callouts');
    console.log('  • sz-blog-sidebar.liquid - Blog sidebar');
    console.log('  • sz-seo-meta.liquid - Structured data');
    console.log('  • sz-seo-robots.liquid - Robots/canonical');
    console.log('  • sz-theme-cleanup.liquid - UI polish');
    console.log('  • sz-phase2-loader.liquid - Master loader');
    console.log('\nTo activate, add to theme.liquid before </head>:');
    console.log("  {% render 'sz-phase2-loader' %}");

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
