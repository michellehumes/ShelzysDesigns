#!/usr/bin/env node

/**
 * Shelzy's Designs - Product & Collection Page Enhancements
 *
 * 1. Product page trust badges below Add to Cart
 * 2. Product size/capacity info
 * 3. Care instructions
 * 4. Collection page filters (occasion, color, price)
 * 5. About Sublimation page
 * 6. Product upsells section
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('Missing SHOPIFY_ACCESS_TOKEN environment variable');
  process.exit(1);
}

const API_VERSION = '2024-01';

async function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: '/admin/api/' + API_VERSION + endpoint,
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

async function putAsset(themeId, key, content) {
  const response = await apiRequest('PUT', '/themes/' + themeId + '/assets.json', {
    asset: { key, value: content }
  });
  return { success: response.status === 200 || response.status === 201, data: response.data };
}

async function getAsset(themeId, key) {
  const response = await apiRequest('GET', '/themes/' + themeId + '/assets.json?asset[key]=' + encodeURIComponent(key));
  if (response.status === 200) {
    return response.data.asset.value;
  }
  return null;
}

async function createPage(title, handle, bodyHtml) {
  const response = await apiRequest('POST', '/pages.json', {
    page: {
      title,
      handle,
      body_html: bodyHtml,
      published: true
    }
  });
  return { success: response.status === 200 || response.status === 201, data: response.data };
}

// ============================================================
// 1. Product Page Trust Badges
// ============================================================

function getProductTrustBadges() {
  return '{% comment %}Shelzy\'s - Product Page Trust Badges{% endcomment %}\n' +
'<div class="sz-product-trust">\n' +
'  <div class="trust-badges-row">\n' +
'    <div class="trust-badge">\n' +
'      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>\n' +
'        <polyline points="9 12 11 14 15 10"/>\n' +
'      </svg>\n' +
'      <span>Permanent Print</span>\n' +
'    </div>\n' +
'    <div class="trust-badge">\n' +
'      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>\n' +
'        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>\n' +
'      </svg>\n' +
'      <span>Secure Checkout</span>\n' +
'    </div>\n' +
'    <div class="trust-badge">\n' +
'      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'        <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2.81A2 2 0 0 1 20 8v8a2 2 0 0 1-2 2h-2"/>\n' +
'        <polyline points="15 3 18 6 15 9"/>\n' +
'        <line x1="18" y1="6" x2="9" y2="6"/>\n' +
'      </svg>\n' +
'      <span>5-7 Day Shipping</span>\n' +
'    </div>\n' +
'    <div class="trust-badge">\n' +
'      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>\n' +
'      </svg>\n' +
'      <span>Made with Love</span>\n' +
'    </div>\n' +
'  </div>\n' +
'  \n' +
'  <div class="trust-guarantee">\n' +
'    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">\n' +
'      <polyline points="20 6 9 17 4 12"/>\n' +
'    </svg>\n' +
'    <span>100% Satisfaction Guaranteed - Love it or we\'ll make it right</span>\n' +
'  </div>\n' +
'</div>\n' +
'\n' +
'<style>\n' +
'.sz-product-trust {\n' +
'  margin: 20px 0;\n' +
'  padding: 20px;\n' +
'  background: #fdf8f5;\n' +
'  border-radius: 12px;\n' +
'}\n' +
'\n' +
'.trust-badges-row {\n' +
'  display: grid;\n' +
'  grid-template-columns: repeat(4, 1fr);\n' +
'  gap: 15px;\n' +
'  margin-bottom: 15px;\n' +
'}\n' +
'\n' +
'.sz-product-trust .trust-badge {\n' +
'  display: flex;\n' +
'  flex-direction: column;\n' +
'  align-items: center;\n' +
'  gap: 8px;\n' +
'  text-align: center;\n' +
'}\n' +
'\n' +
'.sz-product-trust .trust-badge svg {\n' +
'  color: #d4a574;\n' +
'}\n' +
'\n' +
'.sz-product-trust .trust-badge span {\n' +
'  font-size: 12px;\n' +
'  color: #666;\n' +
'  font-weight: 500;\n' +
'}\n' +
'\n' +
'.trust-guarantee {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  gap: 8px;\n' +
'  padding-top: 15px;\n' +
'  border-top: 1px solid #e8e0d8;\n' +
'  font-size: 13px;\n' +
'  color: #444;\n' +
'}\n' +
'\n' +
'@media (max-width: 600px) {\n' +
'  .trust-badges-row {\n' +
'    grid-template-columns: repeat(2, 1fr);\n' +
'  }\n' +
'}\n' +
'</style>\n';
}

// ============================================================
// 2. Product Specs (Size, Capacity, Care)
// ============================================================

function getProductSpecs() {
  return '{% comment %}Shelzy\'s - Product Specifications{% endcomment %}\n' +
'<div class="sz-product-specs">\n' +
'  <div class="specs-toggle" onclick="toggleSpecs(this)">\n' +
'    <span>Product Details & Care</span>\n' +
'    <svg class="toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'      <polyline points="6 9 12 15 18 9"/>\n' +
'    </svg>\n' +
'  </div>\n' +
'  \n' +
'  <div class="specs-content">\n' +
'    <div class="specs-section">\n' +
'      <h4>Bottle Specifications</h4>\n' +
'      <ul>\n' +
'        <li><strong>Capacity:</strong> 20oz / 590ml</li>\n' +
'        <li><strong>Height:</strong> 10.5 inches</li>\n' +
'        <li><strong>Material:</strong> 18/8 Stainless Steel</li>\n' +
'        <li><strong>Insulation:</strong> Double-wall vacuum</li>\n' +
'        <li><strong>Keeps drinks cold:</strong> 24+ hours</li>\n' +
'        <li><strong>Keeps drinks hot:</strong> 12+ hours</li>\n' +
'      </ul>\n' +
'    </div>\n' +
'    \n' +
'    <div class="specs-section">\n' +
'      <h4>Sublimation Printing</h4>\n' +
'      <ul>\n' +
'        <li>Permanently infused into coating</li>\n' +
'        <li>Won\'t peel, crack, or fade</li>\n' +
'        <li>Smooth, professional finish</li>\n' +
'        <li>Vibrant, long-lasting colors</li>\n' +
'      </ul>\n' +
'    </div>\n' +
'    \n' +
'    <div class="specs-section">\n' +
'      <h4>Care Instructions</h4>\n' +
'      <ul>\n' +
'        <li><strong>Dishwasher safe</strong> (top rack recommended)</li>\n' +
'        <li>Hand wash for longest life</li>\n' +
'        <li>Do not microwave</li>\n' +
'        <li>Avoid abrasive scrubbers</li>\n' +
'        <li>Do not freeze</li>\n' +
'      </ul>\n' +
'    </div>\n' +
'  </div>\n' +
'</div>\n' +
'\n' +
'<style>\n' +
'.sz-product-specs {\n' +
'  margin: 20px 0;\n' +
'  border: 1px solid #e8e0d8;\n' +
'  border-radius: 12px;\n' +
'  overflow: hidden;\n' +
'}\n' +
'\n' +
'.specs-toggle {\n' +
'  display: flex;\n' +
'  justify-content: space-between;\n' +
'  align-items: center;\n' +
'  padding: 16px 20px;\n' +
'  background: #fff;\n' +
'  cursor: pointer;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  transition: background 0.2s;\n' +
'}\n' +
'\n' +
'.specs-toggle:hover {\n' +
'  background: #fdf8f5;\n' +
'}\n' +
'\n' +
'.toggle-icon {\n' +
'  transition: transform 0.3s;\n' +
'}\n' +
'\n' +
'.specs-toggle.active .toggle-icon {\n' +
'  transform: rotate(180deg);\n' +
'}\n' +
'\n' +
'.specs-content {\n' +
'  display: none;\n' +
'  padding: 0 20px 20px;\n' +
'  background: #fff;\n' +
'}\n' +
'\n' +
'.specs-toggle.active + .specs-content {\n' +
'  display: block;\n' +
'}\n' +
'\n' +
'.specs-section {\n' +
'  padding: 15px 0;\n' +
'  border-bottom: 1px solid #f0f0f0;\n' +
'}\n' +
'\n' +
'.specs-section:last-child {\n' +
'  border-bottom: none;\n' +
'}\n' +
'\n' +
'.specs-section h4 {\n' +
'  font-size: 14px;\n' +
'  font-weight: 600;\n' +
'  color: #d4a574;\n' +
'  margin-bottom: 10px;\n' +
'  text-transform: uppercase;\n' +
'  letter-spacing: 0.5px;\n' +
'}\n' +
'\n' +
'.specs-section ul {\n' +
'  list-style: none;\n' +
'  padding: 0;\n' +
'  margin: 0;\n' +
'}\n' +
'\n' +
'.specs-section li {\n' +
'  font-size: 14px;\n' +
'  color: #555;\n' +
'  padding: 4px 0;\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 8px;\n' +
'}\n' +
'\n' +
'.specs-section li:before {\n' +
'  content: "";\n' +
'  width: 4px;\n' +
'  height: 4px;\n' +
'  background: #d4a574;\n' +
'  border-radius: 50%;\n' +
'  flex-shrink: 0;\n' +
'}\n' +
'</style>\n' +
'\n' +
'<script>\n' +
'function toggleSpecs(el) {\n' +
'  el.classList.toggle("active");\n' +
'}\n' +
'</script>\n';
}

// ============================================================
// 3. Collection Page Filters
// ============================================================

function getCollectionFilters() {
  return '{% comment %}Shelzy\'s - Collection Page Filters{% endcomment %}\n' +
'<div class="sz-collection-filters">\n' +
'  <div class="filters-header">\n' +
'    <span class="filters-title">Filter By</span>\n' +
'    <button class="filters-clear" onclick="clearAllFilters()">Clear All</button>\n' +
'  </div>\n' +
'  \n' +
'  <div class="filter-group">\n' +
'    <div class="filter-label" onclick="toggleFilter(this)">Occasion <span class="filter-arrow">+</span></div>\n' +
'    <div class="filter-options">\n' +
'      <label><input type="checkbox" data-filter="occasion" value="bride"> Bride</label>\n' +
'      <label><input type="checkbox" data-filter="occasion" value="bridesmaid"> Bridesmaid</label>\n' +
'      <label><input type="checkbox" data-filter="occasion" value="maid-of-honor"> Maid of Honor</label>\n' +
'      <label><input type="checkbox" data-filter="occasion" value="groom"> Groom</label>\n' +
'      <label><input type="checkbox" data-filter="occasion" value="groomsmen"> Groomsmen</label>\n' +
'      <label><input type="checkbox" data-filter="occasion" value="mother"> Mother of Bride/Groom</label>\n' +
'      <label><input type="checkbox" data-filter="occasion" value="bachelorette"> Bachelorette</label>\n' +
'    </div>\n' +
'  </div>\n' +
'  \n' +
'  <div class="filter-group">\n' +
'    <div class="filter-label" onclick="toggleFilter(this)">Style <span class="filter-arrow">+</span></div>\n' +
'    <div class="filter-options">\n' +
'      <label><input type="checkbox" data-filter="style" value="elegant"> Elegant</label>\n' +
'      <label><input type="checkbox" data-filter="style" value="floral"> Floral</label>\n' +
'      <label><input type="checkbox" data-filter="style" value="minimalist"> Minimalist</label>\n' +
'      <label><input type="checkbox" data-filter="style" value="boho"> Boho</label>\n' +
'      <label><input type="checkbox" data-filter="style" value="glam"> Glam</label>\n' +
'      <label><input type="checkbox" data-filter="style" value="rustic"> Rustic</label>\n' +
'    </div>\n' +
'  </div>\n' +
'  \n' +
'  <div class="filter-group">\n' +
'    <div class="filter-label" onclick="toggleFilter(this)">Price <span class="filter-arrow">+</span></div>\n' +
'    <div class="filter-options">\n' +
'      <label><input type="radio" name="price" data-filter="price" value="0-25"> Under $25</label>\n' +
'      <label><input type="radio" name="price" data-filter="price" value="25-50"> $25 - $50</label>\n' +
'      <label><input type="radio" name="price" data-filter="price" value="50-100"> $50 - $100</label>\n' +
'      <label><input type="radio" name="price" data-filter="price" value="100+"> $100+</label>\n' +
'    </div>\n' +
'  </div>\n' +
'  \n' +
'  <div class="filter-group">\n' +
'    <div class="filter-label" onclick="toggleFilter(this)">Set Size <span class="filter-arrow">+</span></div>\n' +
'    <div class="filter-options">\n' +
'      <label><input type="checkbox" data-filter="size" value="single"> Single Bottle</label>\n' +
'      <label><input type="checkbox" data-filter="size" value="set-3"> Set of 3</label>\n' +
'      <label><input type="checkbox" data-filter="size" value="set-5"> Set of 5</label>\n' +
'      <label><input type="checkbox" data-filter="size" value="set-10"> Set of 10</label>\n' +
'    </div>\n' +
'  </div>\n' +
'</div>\n' +
'\n' +
'<style>\n' +
'.sz-collection-filters {\n' +
'  background: #fff;\n' +
'  border: 1px solid #e8e0d8;\n' +
'  border-radius: 12px;\n' +
'  padding: 20px;\n' +
'  margin-bottom: 30px;\n' +
'}\n' +
'\n' +
'.filters-header {\n' +
'  display: flex;\n' +
'  justify-content: space-between;\n' +
'  align-items: center;\n' +
'  margin-bottom: 20px;\n' +
'  padding-bottom: 15px;\n' +
'  border-bottom: 1px solid #f0f0f0;\n' +
'}\n' +
'\n' +
'.filters-title {\n' +
'  font-size: 18px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'}\n' +
'\n' +
'.filters-clear {\n' +
'  background: none;\n' +
'  border: none;\n' +
'  color: #d4a574;\n' +
'  font-size: 14px;\n' +
'  cursor: pointer;\n' +
'  text-decoration: underline;\n' +
'}\n' +
'\n' +
'.filter-group {\n' +
'  border-bottom: 1px solid #f0f0f0;\n' +
'}\n' +
'\n' +
'.filter-group:last-child {\n' +
'  border-bottom: none;\n' +
'}\n' +
'\n' +
'.filter-label {\n' +
'  display: flex;\n' +
'  justify-content: space-between;\n' +
'  align-items: center;\n' +
'  padding: 15px 0;\n' +
'  font-weight: 500;\n' +
'  color: #2d2d2d;\n' +
'  cursor: pointer;\n' +
'}\n' +
'\n' +
'.filter-arrow {\n' +
'  font-size: 18px;\n' +
'  color: #999;\n' +
'  transition: transform 0.2s;\n' +
'}\n' +
'\n' +
'.filter-label.active .filter-arrow {\n' +
'  content: "-";\n' +
'}\n' +
'\n' +
'.filter-options {\n' +
'  display: none;\n' +
'  padding: 0 0 15px;\n' +
'}\n' +
'\n' +
'.filter-label.active + .filter-options {\n' +
'  display: block;\n' +
'}\n' +
'\n' +
'.filter-options label {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 10px;\n' +
'  padding: 8px 0;\n' +
'  font-size: 14px;\n' +
'  color: #555;\n' +
'  cursor: pointer;\n' +
'}\n' +
'\n' +
'.filter-options label:hover {\n' +
'  color: #d4a574;\n' +
'}\n' +
'\n' +
'.filter-options input[type="checkbox"],\n' +
'.filter-options input[type="radio"] {\n' +
'  width: 18px;\n' +
'  height: 18px;\n' +
'  accent-color: #d4a574;\n' +
'}\n' +
'\n' +
'/* Mobile filter toggle */\n' +
'@media (max-width: 768px) {\n' +
'  .sz-collection-filters {\n' +
'    position: fixed;\n' +
'    top: 0;\n' +
'    left: -100%;\n' +
'    width: 85%;\n' +
'    max-width: 320px;\n' +
'    height: 100vh;\n' +
'    z-index: 1000;\n' +
'    border-radius: 0;\n' +
'    overflow-y: auto;\n' +
'    transition: left 0.3s ease;\n' +
'  }\n' +
'  \n' +
'  .sz-collection-filters.active {\n' +
'    left: 0;\n' +
'  }\n' +
'}\n' +
'</style>\n' +
'\n' +
'<script>\n' +
'function toggleFilter(el) {\n' +
'  el.classList.toggle("active");\n' +
'  var arrow = el.querySelector(".filter-arrow");\n' +
'  arrow.textContent = el.classList.contains("active") ? "-" : "+";\n' +
'}\n' +
'\n' +
'function clearAllFilters() {\n' +
'  var inputs = document.querySelectorAll(".sz-collection-filters input");\n' +
'  inputs.forEach(function(input) {\n' +
'    input.checked = false;\n' +
'  });\n' +
'  applyFilters();\n' +
'}\n' +
'\n' +
'function applyFilters() {\n' +
'  // Get all checked filters\n' +
'  var filters = {};\n' +
'  var inputs = document.querySelectorAll(".sz-collection-filters input:checked");\n' +
'  inputs.forEach(function(input) {\n' +
'    var type = input.dataset.filter;\n' +
'    if (!filters[type]) filters[type] = [];\n' +
'    filters[type].push(input.value);\n' +
'  });\n' +
'  \n' +
'  // Apply to products (basic tag-based filtering)\n' +
'  var products = document.querySelectorAll(".grid-product, .product-card");\n' +
'  products.forEach(function(product) {\n' +
'    var show = true;\n' +
'    var tags = (product.dataset.tags || "").toLowerCase();\n' +
'    var price = parseFloat(product.dataset.price || 0);\n' +
'    \n' +
'    // Check occasion filter\n' +
'    if (filters.occasion && filters.occasion.length) {\n' +
'      var hasOccasion = filters.occasion.some(function(o) {\n' +
'        return tags.includes(o);\n' +
'      });\n' +
'      if (!hasOccasion) show = false;\n' +
'    }\n' +
'    \n' +
'    // Check style filter\n' +
'    if (filters.style && filters.style.length) {\n' +
'      var hasStyle = filters.style.some(function(s) {\n' +
'        return tags.includes(s);\n' +
'      });\n' +
'      if (!hasStyle) show = false;\n' +
'    }\n' +
'    \n' +
'    // Check price filter\n' +
'    if (filters.price && filters.price.length) {\n' +
'      var priceRange = filters.price[0];\n' +
'      var inRange = false;\n' +
'      if (priceRange === "0-25" && price < 25) inRange = true;\n' +
'      if (priceRange === "25-50" && price >= 25 && price < 50) inRange = true;\n' +
'      if (priceRange === "50-100" && price >= 50 && price < 100) inRange = true;\n' +
'      if (priceRange === "100+" && price >= 100) inRange = true;\n' +
'      if (!inRange) show = false;\n' +
'    }\n' +
'    \n' +
'    product.style.display = show ? "" : "none";\n' +
'  });\n' +
'}\n' +
'\n' +
'// Add event listeners\n' +
'document.addEventListener("DOMContentLoaded", function() {\n' +
'  var inputs = document.querySelectorAll(".sz-collection-filters input");\n' +
'  inputs.forEach(function(input) {\n' +
'    input.addEventListener("change", applyFilters);\n' +
'  });\n' +
'});\n' +
'</script>\n';
}

// ============================================================
// 4. Product Upsells
// ============================================================

function getProductUpsells() {
  return '{% comment %}Shelzy\'s - Product Upsells{% endcomment %}\n' +
'<div class="sz-product-upsells">\n' +
'  <h3 class="upsells-title">Complete Your Bridal Party</h3>\n' +
'  <p class="upsells-subtitle">Matching bottles for your whole crew</p>\n' +
'  \n' +
'  <div class="upsells-grid">\n' +
'    {% assign related = product.collections.first.products | where: "available", true %}\n' +
'    {% for item in related limit: 4 %}\n' +
'      {% unless item.id == product.id %}\n' +
'        <a href="{{ item.url }}" class="upsell-card">\n' +
'          <div class="upsell-image">\n' +
'            <img src="{{ item.featured_image | img_url: \'medium\' }}" alt="{{ item.title }}" loading="lazy">\n' +
'          </div>\n' +
'          <div class="upsell-info">\n' +
'            <span class="upsell-title">{{ item.title | truncate: 40 }}</span>\n' +
'            <span class="upsell-price">{{ item.price | money }}</span>\n' +
'          </div>\n' +
'        </a>\n' +
'      {% endunless %}\n' +
'    {% endfor %}\n' +
'  </div>\n' +
'  \n' +
'  <a href="/collections/bridal-party-sets" class="upsells-cta">Shop All Bridal Sets</a>\n' +
'</div>\n' +
'\n' +
'<style>\n' +
'.sz-product-upsells {\n' +
'  margin: 40px 0;\n' +
'  padding: 40px;\n' +
'  background: #fdf8f5;\n' +
'  border-radius: 16px;\n' +
'  text-align: center;\n' +
'}\n' +
'\n' +
'.upsells-title {\n' +
'  font-size: 24px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  margin-bottom: 8px;\n' +
'}\n' +
'\n' +
'.upsells-subtitle {\n' +
'  font-size: 16px;\n' +
'  color: #666;\n' +
'  margin-bottom: 30px;\n' +
'}\n' +
'\n' +
'.upsells-grid {\n' +
'  display: grid;\n' +
'  grid-template-columns: repeat(4, 1fr);\n' +
'  gap: 20px;\n' +
'  margin-bottom: 30px;\n' +
'}\n' +
'\n' +
'.upsell-card {\n' +
'  background: white;\n' +
'  border-radius: 12px;\n' +
'  overflow: hidden;\n' +
'  text-decoration: none;\n' +
'  transition: transform 0.3s, box-shadow 0.3s;\n' +
'}\n' +
'\n' +
'.upsell-card:hover {\n' +
'  transform: translateY(-4px);\n' +
'  box-shadow: 0 8px 25px rgba(0,0,0,0.1);\n' +
'}\n' +
'\n' +
'.upsell-image {\n' +
'  aspect-ratio: 1;\n' +
'  overflow: hidden;\n' +
'}\n' +
'\n' +
'.upsell-image img {\n' +
'  width: 100%;\n' +
'  height: 100%;\n' +
'  object-fit: cover;\n' +
'  transition: transform 0.3s;\n' +
'}\n' +
'\n' +
'.upsell-card:hover .upsell-image img {\n' +
'  transform: scale(1.05);\n' +
'}\n' +
'\n' +
'.upsell-info {\n' +
'  padding: 15px;\n' +
'}\n' +
'\n' +
'.upsell-title {\n' +
'  display: block;\n' +
'  font-size: 14px;\n' +
'  color: #2d2d2d;\n' +
'  margin-bottom: 5px;\n' +
'}\n' +
'\n' +
'.upsell-price {\n' +
'  font-size: 16px;\n' +
'  font-weight: 600;\n' +
'  color: #d4a574;\n' +
'}\n' +
'\n' +
'.upsells-cta {\n' +
'  display: inline-block;\n' +
'  background: #2d2d2d;\n' +
'  color: white;\n' +
'  padding: 14px 32px;\n' +
'  border-radius: 25px;\n' +
'  text-decoration: none;\n' +
'  font-weight: 600;\n' +
'  transition: background 0.3s;\n' +
'}\n' +
'\n' +
'.upsells-cta:hover {\n' +
'  background: #d4a574;\n' +
'}\n' +
'\n' +
'@media (max-width: 768px) {\n' +
'  .upsells-grid {\n' +
'    grid-template-columns: repeat(2, 1fr);\n' +
'  }\n' +
'  \n' +
'  .sz-product-upsells {\n' +
'    padding: 30px 20px;\n' +
'  }\n' +
'}\n' +
'</style>\n';
}

// ============================================================
// 5. About Sublimation Page
// ============================================================

function getAboutSublimationPageHTML() {
  return '<div class="sublimation-page">' +
'<style>' +
'.sublimation-page { max-width: 900px; margin: 0 auto; padding: 40px 20px; }' +
'.sublimation-hero { text-align: center; margin-bottom: 50px; }' +
'.sublimation-hero h1 { font-size: 42px; font-weight: 600; color: #2d2d2d; margin-bottom: 16px; }' +
'.sublimation-hero p { font-size: 20px; color: #666; max-width: 600px; margin: 0 auto; }' +
'.sublimation-section { margin-bottom: 50px; }' +
'.sublimation-section h2 { font-size: 28px; font-weight: 600; color: #2d2d2d; margin-bottom: 20px; }' +
'.sublimation-section p { font-size: 16px; color: #555; line-height: 1.8; margin-bottom: 16px; }' +
'.process-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }' +
'.process-step { background: #fdf8f5; padding: 30px 20px; border-radius: 16px; text-align: center; }' +
'.step-number { width: 50px; height: 50px; background: #d4a574; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; margin: 0 auto 15px; }' +
'.step-title { font-size: 16px; font-weight: 600; color: #2d2d2d; margin-bottom: 8px; }' +
'.step-desc { font-size: 14px; color: #666; }' +
'.comparison-table { width: 100%; border-collapse: collapse; margin: 30px 0; }' +
'.comparison-table th, .comparison-table td { padding: 15px; text-align: left; border-bottom: 1px solid #e8e0d8; }' +
'.comparison-table th { background: #2d2d2d; color: white; }' +
'.comparison-table tr:nth-child(even) { background: #fdf8f5; }' +
'.check { color: #4caf50; font-weight: bold; }' +
'.x { color: #e74c3c; }' +
'.benefits-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }' +
'.benefit-card { background: white; border: 1px solid #e8e0d8; padding: 25px; border-radius: 12px; }' +
'.benefit-card h3 { font-size: 18px; font-weight: 600; color: #d4a574; margin-bottom: 10px; }' +
'.benefit-card p { font-size: 14px; color: #555; margin: 0; }' +
'.cta-section { background: linear-gradient(135deg, #fdf8f5 0%, #fff5f0 100%); padding: 50px; border-radius: 20px; text-align: center; margin-top: 50px; }' +
'.cta-section h2 { font-size: 32px; font-weight: 600; color: #2d2d2d; margin-bottom: 16px; }' +
'.cta-section p { font-size: 18px; color: #666; margin-bottom: 30px; }' +
'.cta-button { display: inline-block; background: #d4a574; color: white; padding: 16px 40px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 16px; }' +
'.cta-button:hover { background: #c49a6c; }' +
'@media (max-width: 768px) { ' +
'.process-steps, .benefits-grid { grid-template-columns: 1fr; } ' +
'.sublimation-hero h1 { font-size: 32px; } ' +
'.cta-section { padding: 30px 20px; } ' +
'}' +
'</style>' +
'' +
'<div class="sublimation-hero">' +
'<h1>What is Sublimation Printing?</h1>' +
'<p>The secret behind our permanent, vibrant, dishwasher-safe water bottle designs</p>' +
'</div>' +
'' +
'<div class="sublimation-section">' +
'<h2>The Science Behind the Magic</h2>' +
'<p>Sublimation is a specialized printing process that uses heat and pressure to permanently infuse ink directly into the coating of your water bottle. Unlike traditional printing methods where ink sits on top of the surface, sublimation converts solid ink into a gas that penetrates and bonds with the bottle\'s polymer coating at a molecular level.</p>' +
'<p>The result? A design that\'s literally part of the bottle - not printed on it, but infused into it. This means your personalized design will never peel, crack, fade, or wash off, no matter how many times you use or wash your bottle.</p>' +
'</div>' +
'' +
'<div class="sublimation-section">' +
'<h2>Our 4-Step Process</h2>' +
'<div class="process-steps">' +
'<div class="process-step">' +
'<div class="step-number">1</div>' +
'<div class="step-title">Design</div>' +
'<div class="step-desc">Your personalization is carefully crafted with your chosen name, font, and colors</div>' +
'</div>' +
'<div class="process-step">' +
'<div class="step-number">2</div>' +
'<div class="step-title">Print</div>' +
'<div class="step-desc">We print your design onto special sublimation transfer paper with vibrant inks</div>' +
'</div>' +
'<div class="process-step">' +
'<div class="step-number">3</div>' +
'<div class="step-title">Heat Press</div>' +
'<div class="step-desc">Using precise heat (400°F) and pressure, the ink transforms into gas and infuses into the coating</div>' +
'</div>' +
'<div class="process-step">' +
'<div class="step-number">4</div>' +
'<div class="step-title">Cool & Inspect</div>' +
'<div class="step-desc">Each bottle is cooled, inspected for quality, and packaged with care</div>' +
'</div>' +
'</div>' +
'</div>' +
'' +
'<div class="sublimation-section">' +
'<h2>Sublimation vs. Other Printing Methods</h2>' +
'<table class="comparison-table">' +
'<tr><th>Feature</th><th>Sublimation</th><th>Vinyl</th><th>Screen Print</th></tr>' +
'<tr><td>Durability</td><td class="check">★★★★★</td><td>★★★☆☆</td><td>★★★☆☆</td></tr>' +
'<tr><td>Dishwasher Safe</td><td class="check">✓ Yes</td><td class="x">✗ No</td><td class="x">✗ No</td></tr>' +
'<tr><td>Peels or Cracks</td><td class="check">✓ Never</td><td class="x">✗ Over time</td><td class="x">✗ Over time</td></tr>' +
'<tr><td>Color Vibrancy</td><td class="check">Excellent</td><td>Good</td><td>Good</td></tr>' +
'<tr><td>Smooth Finish</td><td class="check">✓ Yes</td><td class="x">✗ Raised edges</td><td class="check">✓ Yes</td></tr>' +
'<tr><td>Full-Wrap Designs</td><td class="check">✓ Yes</td><td class="x">✗ Limited</td><td class="x">✗ Limited</td></tr>' +
'</table>' +
'</div>' +
'' +
'<div class="sublimation-section">' +
'<h2>Why Brides Love Sublimation</h2>' +
'<div class="benefits-grid">' +
'<div class="benefit-card">' +
'<h3>Lasts Forever</h3>' +
'<p>Your wedding party gifts will look as beautiful 10 years from now as they do on your wedding day. They\'re keepsakes that truly last.</p>' +
'</div>' +
'<div class="benefit-card">' +
'<h3>Worry-Free Use</h3>' +
'<p>Toss them in the dishwasher, take them to the gym, use them daily. The design stays perfect through it all.</p>' +
'</div>' +
'<div class="benefit-card">' +
'<h3>Photo-Quality Detail</h3>' +
'<p>Sublimation captures intricate details and gradients beautifully - perfect for elegant floral designs and delicate scripts.</p>' +
'</div>' +
'<div class="benefit-card">' +
'<h3>Smooth & Seamless</h3>' +
'<p>No raised edges or textures - just a smooth, professional finish that feels as good as it looks.</p>' +
'</div>' +
'</div>' +
'</div>' +
'' +
'<div class="cta-section">' +
'<h2>Ready to Create Your Perfect Bottles?</h2>' +
'<p>Every bottle is handcrafted with love and shipped within 5-7 business days</p>' +
'<a href="/collections/bridal-party-sets" class="cta-button">Shop Bridal Sets</a>' +
'</div>' +
'' +
'</div>';
}

// ============================================================
// Product Page Loader
// ============================================================

function getProductEnhancementsLoader() {
  return '{% comment %}Shelzy\'s - Product Page Enhancements Loader{% endcomment %}\n' +
'{% if template contains \'product\' %}\n' +
'  {% render \'sz-product-trust-badges\' %}\n' +
'  {% render \'sz-product-specs\' %}\n' +
'  {% render \'sz-product-upsells\' %}\n' +
'{% endif %}\n' +
'\n' +
'{% if template contains \'collection\' %}\n' +
'  {% render \'sz-collection-filters\' %}\n' +
'{% endif %}\n';
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('');
  console.log('========================================================');
  console.log('  SHELZY\'S - PRODUCT & COLLECTION ENHANCEMENTS');
  console.log('========================================================');
  console.log('');

  const themesResponse = await apiRequest('GET', '/themes.json');
  if (!themesResponse.data?.themes) {
    console.error('Failed to fetch themes');
    process.exit(1);
  }

  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');
  console.log('Theme: "' + liveTheme.name + '" (ID: ' + liveTheme.id + ')');
  console.log('');

  // 1. Product Trust Badges
  console.log('1. Creating product trust badges...');
  const trustResult = await putAsset(liveTheme.id, 'snippets/sz-product-trust-badges.liquid', getProductTrustBadges());
  console.log(trustResult.success ? '   [OK] Product trust badges created' : '   [FAIL] Trust badges');

  // 2. Product Specs
  console.log('2. Creating product specifications...');
  const specsResult = await putAsset(liveTheme.id, 'snippets/sz-product-specs.liquid', getProductSpecs());
  console.log(specsResult.success ? '   [OK] Product specs created' : '   [FAIL] Product specs');

  // 3. Collection Filters
  console.log('3. Creating collection filters...');
  const filtersResult = await putAsset(liveTheme.id, 'snippets/sz-collection-filters.liquid', getCollectionFilters());
  console.log(filtersResult.success ? '   [OK] Collection filters created' : '   [FAIL] Collection filters');

  // 4. Product Upsells
  console.log('4. Creating product upsells...');
  const upsellsResult = await putAsset(liveTheme.id, 'snippets/sz-product-upsells.liquid', getProductUpsells());
  console.log(upsellsResult.success ? '   [OK] Product upsells created' : '   [FAIL] Product upsells');

  // 5. About Sublimation Page
  console.log('5. Creating About Sublimation page...');
  const pageResult = await createPage(
    'About Sublimation Printing',
    'about-sublimation',
    getAboutSublimationPageHTML()
  );
  if (pageResult.success) {
    console.log('   [OK] About Sublimation page created');
  } else if (pageResult.data?.errors?.handle?.[0]?.includes('already')) {
    console.log('   [OK] About Sublimation page already exists');
  } else {
    console.log('   [WARN] Could not create page: ' + JSON.stringify(pageResult.data?.errors || pageResult.data));
  }

  // 6. Loader snippet
  console.log('6. Creating enhancements loader...');
  const loaderResult = await putAsset(liveTheme.id, 'snippets/sz-product-enhancements.liquid', getProductEnhancementsLoader());
  console.log(loaderResult.success ? '   [OK] Enhancements loader created' : '   [FAIL] Loader');

  // 7. Inject into theme.liquid
  console.log('7. Injecting into theme.liquid...');
  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid) {
    if (!themeLiquid.includes('sz-product-enhancements')) {
      themeLiquid = themeLiquid.replace('</body>', "{% render 'sz-product-enhancements' %}\n</body>");
      const result = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
      console.log(result.success ? '   [OK] Injected into theme.liquid' : '   [FAIL] Could not update theme.liquid');
    } else {
      console.log('   [OK] Already injected');
    }
  }

  console.log('');
  console.log('========================================================');
  console.log('  ENHANCEMENTS COMPLETE');
  console.log('========================================================');
  console.log('');
  console.log('Created:');
  console.log('  - Product trust badges (below Add to Cart)');
  console.log('  - Product specs accordion (size, capacity, care)');
  console.log('  - Collection page filters (occasion, style, price, size)');
  console.log('  - Product upsells section');
  console.log('  - About Sublimation page (/pages/about-sublimation)');
  console.log('');
  console.log('Note: To display these on product pages, add to your');
  console.log('product template after the Add to Cart button:');
  console.log('  {% render \'sz-product-trust-badges\' %}');
  console.log('  {% render \'sz-product-specs\' %}');
  console.log('');
  console.log('View at: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
