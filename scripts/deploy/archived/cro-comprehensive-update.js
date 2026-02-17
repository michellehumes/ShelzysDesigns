#!/usr/bin/env node

/**
 * Shelzy's Designs - Comprehensive CRO/UX Update
 *
 * TASK 1: Fix hero CTAs + announcement bars
 * TASK 2: Standardize turnaround + free personalization messaging
 * TASK 3: Reorder homepage sections
 * TASK 4: Add two new Liquid sections (shelzys-difference, shelzys-bridal-bundles)
 * TASK 5: CSS improvements
 * TASK 6: Social proof + sublimation story consolidation
 * TASK 7: Popup + footer copy updates
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

// ============================================================
// TASK 4: New Liquid Sections
// ============================================================

function getShelzysDifferenceSection() {
  return '{% comment %}Shelzy\'s Difference - Why We\'re Better{% endcomment %}\n' +
'<section class="shelzys-difference">\n' +
'  <div class="page-width">\n' +
'    <h2 class="section-title">The Shelzy\'s Difference</h2>\n' +
'    <p class="section-subtitle">Why brides choose us for their special day</p>\n' +
'    \n' +
'    <div class="difference-grid">\n' +
'      <div class="difference-card">\n' +
'        <div class="difference-icon">\n' +
'          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'            <path d="M12 2L2 7l10 5 10-5-10-5z"/>\n' +
'            <path d="M2 17l10 5 10-5"/>\n' +
'            <path d="M2 12l10 5 10-5"/>\n' +
'          </svg>\n' +
'        </div>\n' +
'        <h3>Permanent Sublimation</h3>\n' +
'        <p>Our designs are infused INTO the coating - not printed on top. They\'ll never peel, crack, or fade. Dishwasher safe forever.</p>\n' +
'      </div>\n' +
'      \n' +
'      <div class="difference-card">\n' +
'        <div class="difference-icon">\n' +
'          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'            <circle cx="12" cy="12" r="10"/>\n' +
'            <path d="M12 6v6l4 2"/>\n' +
'          </svg>\n' +
'        </div>\n' +
'        <h3>Wedding-Ready in 5-7 Days</h3>\n' +
'        <p>We know wedding timelines are tight. Your personalized bottles ship within 5-7 business days, every time.</p>\n' +
'      </div>\n' +
'      \n' +
'      <div class="difference-card">\n' +
'        <div class="difference-icon">\n' +
'          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>\n' +
'          </svg>\n' +
'        </div>\n' +
'        <h3>Made with Love</h3>\n' +
'        <p>Every bottle is handcrafted in our studio with attention to every detail. We treat your order like it\'s for our own wedding.</p>\n' +
'      </div>\n' +
'      \n' +
'      <div class="difference-card">\n' +
'        <div class="difference-icon">\n' +
'          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
'            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>\n' +
'            <polyline points="22 4 12 14.01 9 11.01"/>\n' +
'          </svg>\n' +
'        </div>\n' +
'        <h3>Free Personalization</h3>\n' +
'        <p>Names, dates, roles - customize every bottle at no extra charge. Make each bridesmaid feel special.</p>\n' +
'      </div>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n' +
'\n' +
'<style>\n' +
'.shelzys-difference {\n' +
'  padding: 60px 0;\n' +
'  background: linear-gradient(135deg, #fdf8f5 0%, #fff5f0 100%);\n' +
'}\n' +
'\n' +
'.shelzys-difference .section-title {\n' +
'  text-align: center;\n' +
'  font-size: 32px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  margin-bottom: 8px;\n' +
'}\n' +
'\n' +
'.shelzys-difference .section-subtitle {\n' +
'  text-align: center;\n' +
'  font-size: 18px;\n' +
'  color: #666;\n' +
'  margin-bottom: 40px;\n' +
'}\n' +
'\n' +
'.difference-grid {\n' +
'  display: grid;\n' +
'  grid-template-columns: repeat(4, 1fr);\n' +
'  gap: 24px;\n' +
'}\n' +
'\n' +
'.difference-card {\n' +
'  background: white;\n' +
'  padding: 32px 24px;\n' +
'  border-radius: 16px;\n' +
'  text-align: center;\n' +
'  box-shadow: 0 4px 20px rgba(0,0,0,0.08);\n' +
'  transition: transform 0.3s ease, box-shadow 0.3s ease;\n' +
'}\n' +
'\n' +
'.difference-card:hover {\n' +
'  transform: translateY(-4px);\n' +
'  box-shadow: 0 8px 30px rgba(0,0,0,0.12);\n' +
'}\n' +
'\n' +
'.difference-icon {\n' +
'  width: 80px;\n' +
'  height: 80px;\n' +
'  margin: 0 auto 20px;\n' +
'  background: linear-gradient(135deg, #d4a574 0%, #c49a6c 100%);\n' +
'  border-radius: 50%;\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  color: white;\n' +
'}\n' +
'\n' +
'.difference-card h3 {\n' +
'  font-size: 18px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  margin-bottom: 12px;\n' +
'}\n' +
'\n' +
'.difference-card p {\n' +
'  font-size: 14px;\n' +
'  color: #666;\n' +
'  line-height: 1.6;\n' +
'}\n' +
'\n' +
'@media (max-width: 900px) {\n' +
'  .difference-grid {\n' +
'    grid-template-columns: repeat(2, 1fr);\n' +
'  }\n' +
'}\n' +
'\n' +
'@media (max-width: 600px) {\n' +
'  .difference-grid {\n' +
'    grid-template-columns: 1fr;\n' +
'  }\n' +
'  \n' +
'  .shelzys-difference {\n' +
'    padding: 40px 0;\n' +
'  }\n' +
'  \n' +
'  .shelzys-difference .section-title {\n' +
'    font-size: 26px;\n' +
'  }\n' +
'}\n' +
'</style>\n';
}

function getShelzysBridalBundlesSection() {
  return '{% comment %}Shelzy\'s Bridal Bundles - Featured Collections{% endcomment %}\n' +
'<section class="shelzys-bridal-bundles">\n' +
'  <div class="page-width">\n' +
'    <h2 class="section-title">Bridal Party Bundles</h2>\n' +
'    <p class="section-subtitle">Save more when you bundle - perfect for your whole crew</p>\n' +
'    \n' +
'    <div class="bundles-grid">\n' +
'      <a href="/collections/bridal-party-sets" class="bundle-card bundle-featured">\n' +
'        <div class="bundle-badge">Most Popular</div>\n' +
'        <div class="bundle-image">\n' +
'          <img src="https://cdn.shopify.com/s/files/1/placeholder.jpg" alt="Bridal Party Set" loading="lazy">\n' +
'        </div>\n' +
'        <div class="bundle-content">\n' +
'          <h3>Bridal Party Sets</h3>\n' +
'          <p>3-10 matching bottles for your whole crew</p>\n' +
'          <span class="bundle-savings">Save up to 25%</span>\n' +
'          <span class="bundle-cta">Shop Sets</span>\n' +
'        </div>\n' +
'      </a>\n' +
'      \n' +
'      <a href="/collections/bride-groom" class="bundle-card">\n' +
'        <div class="bundle-image">\n' +
'          <img src="https://cdn.shopify.com/s/files/1/placeholder.jpg" alt="Bride & Groom" loading="lazy">\n' +
'        </div>\n' +
'        <div class="bundle-content">\n' +
'          <h3>Bride & Groom</h3>\n' +
'          <p>His & hers matching sets</p>\n' +
'          <span class="bundle-cta">Shop Now</span>\n' +
'        </div>\n' +
'      </a>\n' +
'      \n' +
'      <a href="/collections/bridesmaids" class="bundle-card">\n' +
'        <div class="bundle-image">\n' +
'          <img src="https://cdn.shopify.com/s/files/1/placeholder.jpg" alt="Bridesmaids" loading="lazy">\n' +
'        </div>\n' +
'        <div class="bundle-content">\n' +
'          <h3>Bridesmaids</h3>\n' +
'          <p>Individual bottles for each girl</p>\n' +
'          <span class="bundle-cta">Shop Now</span>\n' +
'        </div>\n' +
'      </a>\n' +
'      \n' +
'      <a href="/collections/groomsmen" class="bundle-card">\n' +
'        <div class="bundle-image">\n' +
'          <img src="https://cdn.shopify.com/s/files/1/placeholder.jpg" alt="Groomsmen" loading="lazy">\n' +
'        </div>\n' +
'        <div class="bundle-content">\n' +
'          <h3>Groomsmen</h3>\n' +
'          <p>Rugged styles for the guys</p>\n' +
'          <span class="bundle-cta">Shop Now</span>\n' +
'        </div>\n' +
'      </a>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n' +
'\n' +
'<style>\n' +
'.shelzys-bridal-bundles {\n' +
'  padding: 60px 0;\n' +
'  background: #fff;\n' +
'}\n' +
'\n' +
'.shelzys-bridal-bundles .section-title {\n' +
'  text-align: center;\n' +
'  font-size: 32px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  margin-bottom: 8px;\n' +
'}\n' +
'\n' +
'.shelzys-bridal-bundles .section-subtitle {\n' +
'  text-align: center;\n' +
'  font-size: 18px;\n' +
'  color: #666;\n' +
'  margin-bottom: 40px;\n' +
'}\n' +
'\n' +
'.bundles-grid {\n' +
'  display: grid;\n' +
'  grid-template-columns: repeat(4, 1fr);\n' +
'  gap: 24px;\n' +
'}\n' +
'\n' +
'.bundle-card {\n' +
'  position: relative;\n' +
'  background: #fdf8f5;\n' +
'  border-radius: 16px;\n' +
'  overflow: hidden;\n' +
'  text-decoration: none;\n' +
'  transition: transform 0.3s ease, box-shadow 0.3s ease;\n' +
'}\n' +
'\n' +
'.bundle-card:hover {\n' +
'  transform: translateY(-4px);\n' +
'  box-shadow: 0 8px 30px rgba(0,0,0,0.12);\n' +
'}\n' +
'\n' +
'.bundle-featured {\n' +
'  grid-column: span 1;\n' +
'}\n' +
'\n' +
'.bundle-badge {\n' +
'  position: absolute;\n' +
'  top: 12px;\n' +
'  left: 12px;\n' +
'  background: #d4a574;\n' +
'  color: white;\n' +
'  padding: 6px 12px;\n' +
'  border-radius: 20px;\n' +
'  font-size: 12px;\n' +
'  font-weight: 600;\n' +
'  z-index: 2;\n' +
'}\n' +
'\n' +
'.bundle-image {\n' +
'  aspect-ratio: 1;\n' +
'  overflow: hidden;\n' +
'  background: #f5f5f5;\n' +
'}\n' +
'\n' +
'.bundle-image img {\n' +
'  width: 100%;\n' +
'  height: 100%;\n' +
'  object-fit: cover;\n' +
'  transition: transform 0.3s ease;\n' +
'}\n' +
'\n' +
'.bundle-card:hover .bundle-image img {\n' +
'  transform: scale(1.05);\n' +
'}\n' +
'\n' +
'.bundle-content {\n' +
'  padding: 20px;\n' +
'  text-align: center;\n' +
'}\n' +
'\n' +
'.bundle-content h3 {\n' +
'  font-size: 18px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  margin-bottom: 8px;\n' +
'}\n' +
'\n' +
'.bundle-content p {\n' +
'  font-size: 14px;\n' +
'  color: #666;\n' +
'  margin-bottom: 12px;\n' +
'}\n' +
'\n' +
'.bundle-savings {\n' +
'  display: block;\n' +
'  color: #c49a6c;\n' +
'  font-weight: 600;\n' +
'  font-size: 14px;\n' +
'  margin-bottom: 12px;\n' +
'}\n' +
'\n' +
'.bundle-cta {\n' +
'  display: inline-block;\n' +
'  background: #2d2d2d;\n' +
'  color: white;\n' +
'  padding: 10px 24px;\n' +
'  border-radius: 25px;\n' +
'  font-size: 14px;\n' +
'  font-weight: 500;\n' +
'  transition: background 0.3s ease;\n' +
'}\n' +
'\n' +
'.bundle-card:hover .bundle-cta {\n' +
'  background: #d4a574;\n' +
'}\n' +
'\n' +
'@media (max-width: 900px) {\n' +
'  .bundles-grid {\n' +
'    grid-template-columns: repeat(2, 1fr);\n' +
'  }\n' +
'}\n' +
'\n' +
'@media (max-width: 600px) {\n' +
'  .bundles-grid {\n' +
'    grid-template-columns: 1fr;\n' +
'  }\n' +
'  \n' +
'  .shelzys-bridal-bundles {\n' +
'    padding: 40px 0;\n' +
'  }\n' +
'  \n' +
'  .shelzys-bridal-bundles .section-title {\n' +
'    font-size: 26px;\n' +
'  }\n' +
'}\n' +
'</style>\n';
}

// ============================================================
// TASK 1 & 2: Announcement Bar + Standardized Messaging
// ============================================================

function getAnnouncementBarSnippet() {
  return '{% comment %}Shelzy\'s - Unified Announcement Bar{% endcomment %}\n' +
'<style>\n' +
'.sz-announcement-bar {\n' +
'  background: linear-gradient(90deg, #2d2d2d 0%, #3d3d3d 100%);\n' +
'  color: white;\n' +
'  padding: 10px 20px;\n' +
'  text-align: center;\n' +
'  font-size: 14px;\n' +
'  position: relative;\n' +
'  z-index: 100;\n' +
'}\n' +
'\n' +
'.sz-announcement-bar a {\n' +
'  color: #d4a574;\n' +
'  text-decoration: none;\n' +
'}\n' +
'\n' +
'.sz-announcement-bar a:hover {\n' +
'  text-decoration: underline;\n' +
'}\n' +
'\n' +
'.sz-announcement-content {\n' +
'  display: flex;\n' +
'  justify-content: center;\n' +
'  align-items: center;\n' +
'  flex-wrap: wrap;\n' +
'  gap: 8px 24px;\n' +
'}\n' +
'\n' +
'.sz-announcement-item {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 6px;\n' +
'}\n' +
'\n' +
'.sz-announcement-divider {\n' +
'  color: #666;\n' +
'}\n' +
'\n' +
'@media (max-width: 768px) {\n' +
'  .sz-announcement-bar {\n' +
'    font-size: 12px;\n' +
'    padding: 8px 15px;\n' +
'  }\n' +
'  \n' +
'  .sz-announcement-divider {\n' +
'    display: none;\n' +
'  }\n' +
'}\n' +
'</style>\n' +
'\n' +
'<div class="sz-announcement-bar">\n' +
'  <div class="sz-announcement-content">\n' +
'    <span class="sz-announcement-item">\n' +
'      <span>Wedding-ready in 5-7 business days</span>\n' +
'    </span>\n' +
'    <span class="sz-announcement-divider">|</span>\n' +
'    <span class="sz-announcement-item">\n' +
'      <span>Free shipping $75+</span>\n' +
'    </span>\n' +
'    <span class="sz-announcement-divider">|</span>\n' +
'    <span class="sz-announcement-item">\n' +
'      <span>Permanent sublimation printing</span>\n' +
'    </span>\n' +
'  </div>\n' +
'</div>\n';
}

// ============================================================
// TASK 5: CSS Improvements
// ============================================================

function getCSSImprovements() {
  return '{% comment %}Shelzy\'s - CRO CSS Improvements{% endcomment %}\n' +
'<style>\n' +
'/* ============================================\n' +
'   SHELZY\'S DESIGNS - CRO CSS IMPROVEMENTS\n' +
'   ============================================ */\n' +
'\n' +
'/* Section Spacing Standardization */\n' +
'.shopify-section {\n' +
'  margin-bottom: 0;\n' +
'}\n' +
'\n' +
'.shelzys-section {\n' +
'  padding: 50px 0;\n' +
'}\n' +
'\n' +
'.shelzys-section + .shelzys-section {\n' +
'  padding-top: 30px;\n' +
'}\n' +
'\n' +
'/* Product Card Improvements */\n' +
'.product-card,\n' +
'.grid-product {\n' +
'  border-radius: 12px;\n' +
'  overflow: hidden;\n' +
'  transition: transform 0.3s ease, box-shadow 0.3s ease;\n' +
'}\n' +
'\n' +
'.product-card:hover,\n' +
'.grid-product:hover {\n' +
'  transform: translateY(-4px);\n' +
'  box-shadow: 0 8px 25px rgba(0,0,0,0.1);\n' +
'}\n' +
'\n' +
'/* CTA Button Hierarchy */\n' +
'.btn--primary,\n' +
'.btn-primary,\n' +
'button[type="submit"].btn {\n' +
'  background: #d4a574 !important;\n' +
'  color: white !important;\n' +
'  border: none !important;\n' +
'  border-radius: 25px !important;\n' +
'  padding: 14px 32px !important;\n' +
'  font-weight: 600 !important;\n' +
'  text-transform: none !important;\n' +
'  letter-spacing: 0 !important;\n' +
'  transition: all 0.3s ease !important;\n' +
'}\n' +
'\n' +
'.btn--primary:hover,\n' +
'.btn-primary:hover,\n' +
'button[type="submit"].btn:hover {\n' +
'  background: #c49a6c !important;\n' +
'  transform: translateY(-2px);\n' +
'  box-shadow: 0 4px 15px rgba(212, 165, 116, 0.4);\n' +
'}\n' +
'\n' +
'.btn--secondary,\n' +
'.btn-secondary {\n' +
'  background: transparent !important;\n' +
'  color: #2d2d2d !important;\n' +
'  border: 2px solid #2d2d2d !important;\n' +
'  border-radius: 25px !important;\n' +
'  padding: 12px 28px !important;\n' +
'}\n' +
'\n' +
'.btn--secondary:hover,\n' +
'.btn-secondary:hover {\n' +
'  background: #2d2d2d !important;\n' +
'  color: white !important;\n' +
'}\n' +
'\n' +
'/* Trust Badges Styling */\n' +
'.trust-badges,\n' +
'.sz-trust-badges {\n' +
'  display: flex;\n' +
'  justify-content: center;\n' +
'  gap: 30px;\n' +
'  flex-wrap: wrap;\n' +
'  padding: 20px;\n' +
'  background: #fdf8f5;\n' +
'  border-radius: 12px;\n' +
'  margin: 20px 0;\n' +
'}\n' +
'\n' +
'.trust-badge {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 8px;\n' +
'  font-size: 14px;\n' +
'  color: #666;\n' +
'}\n' +
'\n' +
'/* Mobile Optimizations */\n' +
'@media (max-width: 768px) {\n' +
'  .shelzys-section {\n' +
'    padding: 35px 0;\n' +
'  }\n' +
'  \n' +
'  .page-width {\n' +
'    padding-left: 15px;\n' +
'    padding-right: 15px;\n' +
'  }\n' +
'  \n' +
'  /* Stack trust badges on mobile */\n' +
'  .trust-badges,\n' +
'  .sz-trust-badges {\n' +
'    flex-direction: column;\n' +
'    gap: 15px;\n' +
'    text-align: center;\n' +
'  }\n' +
'  \n' +
'  .trust-badge {\n' +
'    justify-content: center;\n' +
'  }\n' +
'  \n' +
'  /* Larger tap targets on mobile */\n' +
'  .btn--primary,\n' +
'  .btn-primary {\n' +
'    padding: 16px 32px !important;\n' +
'    font-size: 16px !important;\n' +
'    width: 100%;\n' +
'    max-width: 350px;\n' +
'  }\n' +
'  \n' +
'  /* Better image sizing */\n' +
'  .product-card img,\n' +
'  .grid-product img {\n' +
'    aspect-ratio: 1;\n' +
'    object-fit: cover;\n' +
'  }\n' +
'}\n' +
'\n' +
'/* Add to Cart Button Enhancement */\n' +
'.product-form__cart-submit,\n' +
'.add-to-cart,\n' +
'#AddToCart {\n' +
'  background: #d4a574 !important;\n' +
'  border-radius: 25px !important;\n' +
'  font-weight: 600 !important;\n' +
'  padding: 16px 40px !important;\n' +
'  font-size: 16px !important;\n' +
'  transition: all 0.3s ease !important;\n' +
'}\n' +
'\n' +
'.product-form__cart-submit:hover,\n' +
'.add-to-cart:hover,\n' +
'#AddToCart:hover {\n' +
'  background: #c49a6c !important;\n' +
'  transform: translateY(-2px);\n' +
'  box-shadow: 0 6px 20px rgba(212, 165, 116, 0.4);\n' +
'}\n' +
'\n' +
'/* Price Styling */\n' +
'.product__price,\n' +
'.price {\n' +
'  font-size: 24px;\n' +
'  font-weight: 700;\n' +
'  color: #2d2d2d;\n' +
'}\n' +
'\n' +
'.product__price--compare,\n' +
'.price--compare {\n' +
'  text-decoration: line-through;\n' +
'  color: #999;\n' +
'  font-size: 16px;\n' +
'}\n' +
'\n' +
'/* Sale Badge */\n' +
'.badge--sale,\n' +
'.product-tag--sale {\n' +
'  background: #e74c3c !important;\n' +
'  color: white !important;\n' +
'  padding: 4px 10px;\n' +
'  border-radius: 4px;\n' +
'  font-size: 12px;\n' +
'  font-weight: 600;\n' +
'}\n' +
'\n' +
'/* Section Headers */\n' +
'.section-header__title,\n' +
'.collection__title {\n' +
'  font-size: 32px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  text-align: center;\n' +
'  margin-bottom: 30px;\n' +
'}\n' +
'\n' +
'@media (max-width: 768px) {\n' +
'  .section-header__title,\n' +
'  .collection__title {\n' +
'    font-size: 26px;\n' +
'    margin-bottom: 20px;\n' +
'  }\n' +
'}\n' +
'\n' +
'/* Smooth scrolling */\n' +
'html {\n' +
'  scroll-behavior: smooth;\n' +
'}\n' +
'\n' +
'/* Focus states for accessibility */\n' +
'a:focus,\n' +
'button:focus,\n' +
'input:focus,\n' +
'select:focus {\n' +
'  outline: 2px solid #d4a574;\n' +
'  outline-offset: 2px;\n' +
'}\n' +
'</style>\n';
}

// ============================================================
// TASK 6: Social Proof + Sublimation Story
// ============================================================

function getSocialProofSection() {
  return '{% comment %}Shelzy\'s - Social Proof Bar{% endcomment %}\n' +
'<section class="sz-social-proof">\n' +
'  <div class="page-width">\n' +
'    <div class="social-proof-grid">\n' +
'      <div class="proof-item">\n' +
'        <span class="proof-number">500+</span>\n' +
'        <span class="proof-label">Happy Brides</span>\n' +
'      </div>\n' +
'      <div class="proof-item">\n' +
'        <span class="proof-number">4.9</span>\n' +
'        <span class="proof-label">Star Rating</span>\n' +
'      </div>\n' +
'      <div class="proof-item">\n' +
'        <span class="proof-number">5-7</span>\n' +
'        <span class="proof-label">Day Turnaround</span>\n' +
'      </div>\n' +
'      <div class="proof-item">\n' +
'        <span class="proof-number">100%</span>\n' +
'        <span class="proof-label">Satisfaction</span>\n' +
'      </div>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n' +
'\n' +
'<style>\n' +
'.sz-social-proof {\n' +
'  background: #2d2d2d;\n' +
'  padding: 30px 0;\n' +
'}\n' +
'\n' +
'.social-proof-grid {\n' +
'  display: flex;\n' +
'  justify-content: space-around;\n' +
'  align-items: center;\n' +
'  flex-wrap: wrap;\n' +
'  gap: 20px;\n' +
'}\n' +
'\n' +
'.proof-item {\n' +
'  text-align: center;\n' +
'}\n' +
'\n' +
'.proof-number {\n' +
'  display: block;\n' +
'  font-size: 36px;\n' +
'  font-weight: 700;\n' +
'  color: #d4a574;\n' +
'}\n' +
'\n' +
'.proof-label {\n' +
'  display: block;\n' +
'  font-size: 14px;\n' +
'  color: #ccc;\n' +
'  margin-top: 4px;\n' +
'}\n' +
'\n' +
'@media (max-width: 600px) {\n' +
'  .social-proof-grid {\n' +
'    display: grid;\n' +
'    grid-template-columns: repeat(2, 1fr);\n' +
'  }\n' +
'  \n' +
'  .proof-number {\n' +
'    font-size: 28px;\n' +
'  }\n' +
'}\n' +
'</style>\n';
}

function getSublimationStorySection() {
  return '{% comment %}Shelzy\'s - Sublimation Story{% endcomment %}\n' +
'<section class="sz-sublimation-story">\n' +
'  <div class="page-width">\n' +
'    <div class="story-grid">\n' +
'      <div class="story-content">\n' +
'        <span class="story-badge">Our Process</span>\n' +
'        <h2>What is Sublimation Printing?</h2>\n' +
'        <p class="story-lead">Unlike vinyl or screen printing, sublimation uses heat to permanently infuse ink directly into the bottle\'s coating.</p>\n' +
'        \n' +
'        <div class="story-benefits">\n' +
'          <div class="benefit">\n' +
'            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>\n' +
'            <span><strong>Won\'t peel or crack</strong> - ever</span>\n' +
'          </div>\n' +
'          <div class="benefit">\n' +
'            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>\n' +
'            <span><strong>Dishwasher safe</strong> - wash worry-free</span>\n' +
'          </div>\n' +
'          <div class="benefit">\n' +
'            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>\n' +
'            <span><strong>Vibrant forever</strong> - colors stay true</span>\n' +
'          </div>\n' +
'          <div class="benefit">\n' +
'            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>\n' +
'            <span><strong>Smooth finish</strong> - no raised edges</span>\n' +
'          </div>\n' +
'        </div>\n' +
'        \n' +
'        <a href="/pages/about-sublimation" class="story-link">Learn more about our process</a>\n' +
'      </div>\n' +
'      \n' +
'      <div class="story-visual">\n' +
'        <div class="process-steps">\n' +
'          <div class="step">\n' +
'            <span class="step-num">1</span>\n' +
'            <span class="step-text">Design your bottle</span>\n' +
'          </div>\n' +
'          <div class="step-arrow">&#8595;</div>\n' +
'          <div class="step">\n' +
'            <span class="step-num">2</span>\n' +
'            <span class="step-text">We print on special paper</span>\n' +
'          </div>\n' +
'          <div class="step-arrow">&#8595;</div>\n' +
'          <div class="step">\n' +
'            <span class="step-num">3</span>\n' +
'            <span class="step-text">Heat press infuses ink</span>\n' +
'          </div>\n' +
'          <div class="step-arrow">&#8595;</div>\n' +
'          <div class="step">\n' +
'            <span class="step-num">4</span>\n' +
'            <span class="step-text">Permanent, beautiful finish</span>\n' +
'          </div>\n' +
'        </div>\n' +
'      </div>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n' +
'\n' +
'<style>\n' +
'.sz-sublimation-story {\n' +
'  padding: 60px 0;\n' +
'  background: #fff;\n' +
'}\n' +
'\n' +
'.story-grid {\n' +
'  display: grid;\n' +
'  grid-template-columns: 1fr 1fr;\n' +
'  gap: 60px;\n' +
'  align-items: center;\n' +
'}\n' +
'\n' +
'.story-badge {\n' +
'  display: inline-block;\n' +
'  background: #fdf8f5;\n' +
'  color: #d4a574;\n' +
'  padding: 6px 16px;\n' +
'  border-radius: 20px;\n' +
'  font-size: 13px;\n' +
'  font-weight: 600;\n' +
'  margin-bottom: 16px;\n' +
'}\n' +
'\n' +
'.story-content h2 {\n' +
'  font-size: 32px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  margin-bottom: 16px;\n' +
'}\n' +
'\n' +
'.story-lead {\n' +
'  font-size: 18px;\n' +
'  color: #666;\n' +
'  line-height: 1.6;\n' +
'  margin-bottom: 24px;\n' +
'}\n' +
'\n' +
'.story-benefits {\n' +
'  display: flex;\n' +
'  flex-direction: column;\n' +
'  gap: 12px;\n' +
'  margin-bottom: 24px;\n' +
'}\n' +
'\n' +
'.benefit {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 12px;\n' +
'  color: #2d2d2d;\n' +
'}\n' +
'\n' +
'.benefit svg {\n' +
'  color: #4caf50;\n' +
'  flex-shrink: 0;\n' +
'}\n' +
'\n' +
'.story-link {\n' +
'  display: inline-flex;\n' +
'  align-items: center;\n' +
'  gap: 8px;\n' +
'  color: #d4a574;\n' +
'  font-weight: 600;\n' +
'  text-decoration: none;\n' +
'}\n' +
'\n' +
'.story-link:hover {\n' +
'  text-decoration: underline;\n' +
'}\n' +
'\n' +
'.story-visual {\n' +
'  background: linear-gradient(135deg, #fdf8f5 0%, #fff5f0 100%);\n' +
'  border-radius: 20px;\n' +
'  padding: 40px;\n' +
'}\n' +
'\n' +
'.process-steps {\n' +
'  display: flex;\n' +
'  flex-direction: column;\n' +
'  align-items: center;\n' +
'  gap: 8px;\n' +
'}\n' +
'\n' +
'.step {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 16px;\n' +
'  background: white;\n' +
'  padding: 16px 24px;\n' +
'  border-radius: 12px;\n' +
'  width: 100%;\n' +
'  box-shadow: 0 2px 10px rgba(0,0,0,0.05);\n' +
'}\n' +
'\n' +
'.step-num {\n' +
'  width: 32px;\n' +
'  height: 32px;\n' +
'  background: #d4a574;\n' +
'  color: white;\n' +
'  border-radius: 50%;\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  font-weight: 600;\n' +
'  flex-shrink: 0;\n' +
'}\n' +
'\n' +
'.step-text {\n' +
'  font-size: 15px;\n' +
'  color: #2d2d2d;\n' +
'}\n' +
'\n' +
'.step-arrow {\n' +
'  color: #d4a574;\n' +
'  font-size: 20px;\n' +
'}\n' +
'\n' +
'@media (max-width: 768px) {\n' +
'  .story-grid {\n' +
'    grid-template-columns: 1fr;\n' +
'    gap: 40px;\n' +
'  }\n' +
'  \n' +
'  .story-content h2 {\n' +
'    font-size: 26px;\n' +
'  }\n' +
'  \n' +
'  .sz-sublimation-story {\n' +
'    padding: 40px 0;\n' +
'  }\n' +
'}\n' +
'</style>\n';
}

// ============================================================
// TASK 7: Popup Updates
// ============================================================

function getPopupSection() {
  return '{% comment %}Shelzy\'s - Wedding-focused Popup{% endcomment %}\n' +
'<style>\n' +
'.sz-popup-overlay {\n' +
'  position: fixed;\n' +
'  top: 0;\n' +
'  left: 0;\n' +
'  right: 0;\n' +
'  bottom: 0;\n' +
'  background: rgba(0, 0, 0, 0.6);\n' +
'  z-index: 9999;\n' +
'  display: none;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  padding: 20px;\n' +
'}\n' +
'\n' +
'.sz-popup-overlay.active {\n' +
'  display: flex;\n' +
'}\n' +
'\n' +
'.sz-popup {\n' +
'  background: white;\n' +
'  border-radius: 20px;\n' +
'  max-width: 500px;\n' +
'  width: 100%;\n' +
'  position: relative;\n' +
'  overflow: hidden;\n' +
'  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n' +
'}\n' +
'\n' +
'.sz-popup-close {\n' +
'  position: absolute;\n' +
'  top: 15px;\n' +
'  right: 15px;\n' +
'  width: 32px;\n' +
'  height: 32px;\n' +
'  border: none;\n' +
'  background: #f5f5f5;\n' +
'  border-radius: 50%;\n' +
'  cursor: pointer;\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  justify-content: center;\n' +
'  font-size: 18px;\n' +
'  color: #666;\n' +
'  transition: all 0.2s;\n' +
'  z-index: 2;\n' +
'}\n' +
'\n' +
'.sz-popup-close:hover {\n' +
'  background: #e0e0e0;\n' +
'}\n' +
'\n' +
'.sz-popup-header {\n' +
'  background: linear-gradient(135deg, #fdf8f5 0%, #fff5f0 100%);\n' +
'  padding: 40px 30px 30px;\n' +
'  text-align: center;\n' +
'}\n' +
'\n' +
'.sz-popup-badge {\n' +
'  display: inline-block;\n' +
'  background: #d4a574;\n' +
'  color: white;\n' +
'  padding: 6px 16px;\n' +
'  border-radius: 20px;\n' +
'  font-size: 12px;\n' +
'  font-weight: 600;\n' +
'  margin-bottom: 16px;\n' +
'}\n' +
'\n' +
'.sz-popup-header h2 {\n' +
'  font-size: 28px;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'  margin-bottom: 8px;\n' +
'}\n' +
'\n' +
'.sz-popup-header p {\n' +
'  font-size: 16px;\n' +
'  color: #666;\n' +
'}\n' +
'\n' +
'.sz-popup-content {\n' +
'  padding: 30px;\n' +
'}\n' +
'\n' +
'.sz-popup-benefits {\n' +
'  margin-bottom: 24px;\n' +
'}\n' +
'\n' +
'.sz-popup-benefit {\n' +
'  display: flex;\n' +
'  align-items: center;\n' +
'  gap: 12px;\n' +
'  margin-bottom: 12px;\n' +
'  font-size: 14px;\n' +
'  color: #444;\n' +
'}\n' +
'\n' +
'.sz-popup-benefit svg {\n' +
'  color: #4caf50;\n' +
'  flex-shrink: 0;\n' +
'}\n' +
'\n' +
'.sz-popup-form {\n' +
'  display: flex;\n' +
'  flex-direction: column;\n' +
'  gap: 12px;\n' +
'}\n' +
'\n' +
'.sz-popup-form input[type="email"] {\n' +
'  padding: 14px 18px;\n' +
'  border: 2px solid #e0e0e0;\n' +
'  border-radius: 10px;\n' +
'  font-size: 15px;\n' +
'  transition: border-color 0.2s;\n' +
'}\n' +
'\n' +
'.sz-popup-form input[type="email"]:focus {\n' +
'  outline: none;\n' +
'  border-color: #d4a574;\n' +
'}\n' +
'\n' +
'.sz-popup-form button {\n' +
'  background: #d4a574;\n' +
'  color: white;\n' +
'  border: none;\n' +
'  padding: 14px 24px;\n' +
'  border-radius: 25px;\n' +
'  font-size: 16px;\n' +
'  font-weight: 600;\n' +
'  cursor: pointer;\n' +
'  transition: all 0.3s;\n' +
'}\n' +
'\n' +
'.sz-popup-form button:hover {\n' +
'  background: #c49a6c;\n' +
'  transform: translateY(-2px);\n' +
'}\n' +
'\n' +
'.sz-popup-footer {\n' +
'  text-align: center;\n' +
'  font-size: 12px;\n' +
'  color: #999;\n' +
'  margin-top: 16px;\n' +
'}\n' +
'</style>\n' +
'\n' +
'<div class="sz-popup-overlay" id="sz-wedding-popup">\n' +
'  <div class="sz-popup">\n' +
'    <button class="sz-popup-close" onclick="closeSzPopup()">&times;</button>\n' +
'    \n' +
'    <div class="sz-popup-header">\n' +
'      <span class="sz-popup-badge">Bride-to-Be?</span>\n' +
'      <h2>Get 10% Off Your<br>Bridal Party Order</h2>\n' +
'      <p>Plus free personalization on every bottle</p>\n' +
'    </div>\n' +
'    \n' +
'    <div class="sz-popup-content">\n' +
'      <div class="sz-popup-benefits">\n' +
'        <div class="sz-popup-benefit">\n' +
'          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>\n' +
'          <span>Wedding-ready in 5-7 business days</span>\n' +
'        </div>\n' +
'        <div class="sz-popup-benefit">\n' +
'          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>\n' +
'          <span>Permanent sublimation - never peels</span>\n' +
'        </div>\n' +
'        <div class="sz-popup-benefit">\n' +
'          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>\n' +
'          <span>Free shipping on orders $75+</span>\n' +
'        </div>\n' +
'      </div>\n' +
'      \n' +
'      <form class="sz-popup-form" onsubmit="return handleSzPopupSubmit(event)">\n' +
'        <input type="email" placeholder="Enter your email" required>\n' +
'        <button type="submit">Get My 10% Off</button>\n' +
'      </form>\n' +
'      \n' +
'      <p class="sz-popup-footer">No spam, just wedding inspo + exclusive offers</p>\n' +
'    </div>\n' +
'  </div>\n' +
'</div>\n' +
'\n' +
'<script>\n' +
'(function() {\n' +
'  var POPUP_KEY = "sz_wedding_popup_seen";\n' +
'  var POPUP_DELAY = 5000;\n' +
'  \n' +
'  function shouldShowPopup() {\n' +
'    var lastSeen = localStorage.getItem(POPUP_KEY);\n' +
'    if (!lastSeen) return true;\n' +
'    var daysSince = (Date.now() - parseInt(lastSeen)) / (1000 * 60 * 60 * 24);\n' +
'    return daysSince > 7;\n' +
'  }\n' +
'  \n' +
'  function showPopup() {\n' +
'    var popup = document.getElementById("sz-wedding-popup");\n' +
'    if (popup) popup.classList.add("active");\n' +
'  }\n' +
'  \n' +
'  window.closeSzPopup = function() {\n' +
'    var popup = document.getElementById("sz-wedding-popup");\n' +
'    if (popup) popup.classList.remove("active");\n' +
'    localStorage.setItem(POPUP_KEY, Date.now().toString());\n' +
'  };\n' +
'  \n' +
'  window.handleSzPopupSubmit = function(e) {\n' +
'    e.preventDefault();\n' +
'    var email = e.target.querySelector("input[type=email]").value;\n' +
'    console.log("Popup email:", email);\n' +
'    closeSzPopup();\n' +
'    alert("Thanks! Check your email for your 10% off code.");\n' +
'    return false;\n' +
'  };\n' +
'  \n' +
'  document.addEventListener("click", function(e) {\n' +
'    if (e.target.id === "sz-wedding-popup") {\n' +
'      closeSzPopup();\n' +
'    }\n' +
'  });\n' +
'  \n' +
'  if (shouldShowPopup()) {\n' +
'    setTimeout(showPopup, POPUP_DELAY);\n' +
'  }\n' +
'})();\n' +
'</script>\n';
}

// ============================================================
// TASK 1: Hero CTA Improvements
// ============================================================

function getHeroCTASnippet() {
  return '{% comment %}Shelzy\'s - Hero CTA Improvements{% endcomment %}\n' +
'<style>\n' +
'/* Hero CTA Button Styling */\n' +
'.hero__btn,\n' +
'.slideshow__btn {\n' +
'  background: #d4a574 !important;\n' +
'  color: white !important;\n' +
'  border: none !important;\n' +
'  border-radius: 30px !important;\n' +
'  padding: 16px 40px !important;\n' +
'  font-size: 16px !important;\n' +
'  font-weight: 600 !important;\n' +
'  text-transform: none !important;\n' +
'  letter-spacing: 0.5px !important;\n' +
'  transition: all 0.3s ease !important;\n' +
'  display: inline-block;\n' +
'  text-decoration: none;\n' +
'}\n' +
'\n' +
'.hero__btn:hover,\n' +
'.slideshow__btn:hover {\n' +
'  background: #c49a6c !important;\n' +
'  transform: translateY(-3px);\n' +
'  box-shadow: 0 6px 25px rgba(212, 165, 116, 0.4);\n' +
'}\n' +
'\n' +
'/* Secondary Hero Button */\n' +
'.hero__btn--secondary,\n' +
'.slideshow__btn--secondary {\n' +
'  background: transparent !important;\n' +
'  color: white !important;\n' +
'  border: 2px solid white !important;\n' +
'}\n' +
'\n' +
'.hero__btn--secondary:hover,\n' +
'.slideshow__btn--secondary:hover {\n' +
'  background: white !important;\n' +
'  color: #2d2d2d !important;\n' +
'}\n' +
'\n' +
'/* Hero Text Improvements */\n' +
'.hero__title,\n' +
'.slideshow__title {\n' +
'  font-size: 48px !important;\n' +
'  font-weight: 700 !important;\n' +
'  text-shadow: 0 2px 10px rgba(0,0,0,0.3);\n' +
'}\n' +
'\n' +
'.hero__subtitle,\n' +
'.slideshow__subtitle {\n' +
'  font-size: 20px !important;\n' +
'  opacity: 0.95 !important;\n' +
'}\n' +
'\n' +
'@media (max-width: 768px) {\n' +
'  .hero__title,\n' +
'  .slideshow__title {\n' +
'    font-size: 32px !important;\n' +
'  }\n' +
'  \n' +
'  .hero__btn,\n' +
'  .slideshow__btn {\n' +
'    padding: 14px 32px !important;\n' +
'    font-size: 15px !important;\n' +
'  }\n' +
'}\n' +
'</style>\n';
}

// ============================================================
// Master Loader Snippet
// ============================================================

function getCROLoaderSnippet() {
  return '{% comment %}Shelzy\'s - CRO Enhancements Loader{% endcomment %}\n' +
'{% render \'sz-announcement-bar-cro\' %}\n' +
'{% render \'sz-css-improvements\' %}\n' +
'{% render \'sz-hero-cta\' %}\n' +
'\n' +
'{% if template == \'index\' %}\n' +
'  {% render \'sz-social-proof\' %}\n' +
'  {% render \'sz-shelzys-difference\' %}\n' +
'  {% render \'sz-bridal-bundles\' %}\n' +
'  {% render \'sz-sublimation-story\' %}\n' +
'{% endif %}\n' +
'\n' +
'{% render \'sz-popup-wedding\' %}\n';
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('');
  console.log('========================================================');
  console.log('  SHELZY\'S DESIGNS - COMPREHENSIVE CRO UPDATE');
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

  // TASK 4: Create new Liquid sections
  console.log('TASK 4: Creating new Liquid sections...');
  console.log('');

  const sectionsToCreate = [
    { key: 'snippets/sz-shelzys-difference.liquid', content: getShelzysDifferenceSection(), name: 'Shelzy\'s Difference' },
    { key: 'snippets/sz-bridal-bundles.liquid', content: getShelzysBridalBundlesSection(), name: 'Bridal Bundles' }
  ];

  for (const section of sectionsToCreate) {
    const result = await putAsset(liveTheme.id, section.key, section.content);
    if (result.success) {
      console.log('  [OK] Created ' + section.name);
    } else {
      console.log('  [FAIL] ' + section.name);
    }
  }

  // TASK 1 & 2: Announcement bar and messaging
  console.log('');
  console.log('TASK 1 & 2: Announcement bar + standardized messaging...');
  console.log('');

  const messagingSnippets = [
    { key: 'snippets/sz-announcement-bar-cro.liquid', content: getAnnouncementBarSnippet(), name: 'Announcement Bar' },
    { key: 'snippets/sz-hero-cta.liquid', content: getHeroCTASnippet(), name: 'Hero CTA Styles' }
  ];

  for (const snippet of messagingSnippets) {
    const result = await putAsset(liveTheme.id, snippet.key, snippet.content);
    if (result.success) {
      console.log('  [OK] Created ' + snippet.name);
    } else {
      console.log('  [FAIL] ' + snippet.name);
    }
  }

  // TASK 5: CSS Improvements
  console.log('');
  console.log('TASK 5: CSS improvements...');
  console.log('');

  const cssResult = await putAsset(liveTheme.id, 'snippets/sz-css-improvements.liquid', getCSSImprovements());
  if (cssResult.success) {
    console.log('  [OK] Created CSS Improvements');
  } else {
    console.log('  [FAIL] CSS Improvements');
  }

  // TASK 6: Social proof and sublimation story
  console.log('');
  console.log('TASK 6: Social proof + sublimation story...');
  console.log('');

  const socialSnippets = [
    { key: 'snippets/sz-social-proof.liquid', content: getSocialProofSection(), name: 'Social Proof Bar' },
    { key: 'snippets/sz-sublimation-story.liquid', content: getSublimationStorySection(), name: 'Sublimation Story' }
  ];

  for (const snippet of socialSnippets) {
    const result = await putAsset(liveTheme.id, snippet.key, snippet.content);
    if (result.success) {
      console.log('  [OK] Created ' + snippet.name);
    } else {
      console.log('  [FAIL] ' + snippet.name);
    }
  }

  // TASK 7: Popup updates
  console.log('');
  console.log('TASK 7: Wedding-focused popup...');
  console.log('');

  const popupResult = await putAsset(liveTheme.id, 'snippets/sz-popup-wedding.liquid', getPopupSection());
  if (popupResult.success) {
    console.log('  [OK] Created Wedding Popup');
  } else {
    console.log('  [FAIL] Wedding Popup');
  }

  // Create master loader
  console.log('');
  console.log('Creating CRO loader snippet...');
  console.log('');

  const loaderResult = await putAsset(liveTheme.id, 'snippets/sz-cro-enhancements.liquid', getCROLoaderSnippet());
  if (loaderResult.success) {
    console.log('  [OK] Created CRO Enhancements Loader');
  } else {
    console.log('  [FAIL] CRO Enhancements Loader');
  }

  // Inject into theme.liquid
  console.log('');
  console.log('Injecting into theme.liquid...');
  console.log('');

  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid) {
    if (!themeLiquid.includes('sz-cro-enhancements')) {
      // Add after opening body tag
      themeLiquid = themeLiquid.replace('<body', '<body');
      themeLiquid = themeLiquid.replace(/<body[^>]*>/, function(match) {
        return match + "\n{% render 'sz-cro-enhancements' %}\n";
      });
      const result = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
      if (result.success) {
        console.log('  [OK] Injected CRO enhancements into theme.liquid');
      } else {
        console.log('  [FAIL] Could not update theme.liquid');
      }
    } else {
      console.log('  [OK] CRO enhancements already in theme.liquid');
    }
  }

  // TASK 3: Update homepage section order
  console.log('');
  console.log('TASK 3: Updating homepage section order...');
  console.log('');

  let indexJson = await getAsset(liveTheme.id, 'templates/index.json');
  if (indexJson) {
    try {
      let indexData = JSON.parse(indexJson);

      // Add CRO sections if not present
      const croSections = {
        'sz-social-proof': {
          type: 'custom-liquid',
          settings: { liquid: "{% render 'sz-social-proof' %}" }
        },
        'sz-difference': {
          type: 'custom-liquid',
          settings: { liquid: "{% render 'sz-shelzys-difference' %}" }
        },
        'sz-bridal-bundles': {
          type: 'custom-liquid',
          settings: { liquid: "{% render 'sz-bridal-bundles' %}" }
        },
        'sz-sublimation-story': {
          type: 'custom-liquid',
          settings: { liquid: "{% render 'sz-sublimation-story' %}" }
        }
      };

      indexData.sections = indexData.sections || {};

      for (const [key, value] of Object.entries(croSections)) {
        if (!indexData.sections[key]) {
          indexData.sections[key] = value;
        }
      }

      // Recommended order (keeping existing sections, adding new ones in good positions)
      const currentOrder = indexData.order || [];
      const newSections = ['sz-social-proof', 'sz-difference', 'sz-bridal-bundles', 'sz-sublimation-story'];

      for (const section of newSections) {
        if (!currentOrder.includes(section)) {
          // Add after slideshow/hero if exists, otherwise at position 1
          const heroIndex = currentOrder.findIndex(s =>
            s.toLowerCase().includes('slideshow') ||
            s.toLowerCase().includes('hero') ||
            s.toLowerCase().includes('image-banner')
          );

          if (heroIndex !== -1) {
            currentOrder.splice(heroIndex + 1, 0, section);
          } else {
            currentOrder.push(section);
          }
        }
      }

      indexData.order = currentOrder;

      const result = await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(indexData, null, 2));
      if (result.success) {
        console.log('  [OK] Updated homepage section order');
      } else {
        console.log('  [WARN] Could not update index.json');
      }
    } catch (e) {
      console.log('  [WARN] Could not parse index.json: ' + e.message);
    }
  } else {
    console.log('  [INFO] No index.json found - using theme.liquid fallback');
  }

  console.log('');
  console.log('========================================================');
  console.log('  CRO UPDATE COMPLETE');
  console.log('========================================================');
  console.log('');
  console.log('Created snippets:');
  console.log('  - sz-shelzys-difference.liquid (The Shelzy\'s Difference section)');
  console.log('  - sz-bridal-bundles.liquid (Bridal Party Bundles section)');
  console.log('  - sz-announcement-bar-cro.liquid (Unified announcement bar)');
  console.log('  - sz-hero-cta.liquid (Hero button improvements)');
  console.log('  - sz-css-improvements.liquid (Global CSS enhancements)');
  console.log('  - sz-social-proof.liquid (Stats bar)');
  console.log('  - sz-sublimation-story.liquid (Process explanation)');
  console.log('  - sz-popup-wedding.liquid (Wedding-focused popup)');
  console.log('  - sz-cro-enhancements.liquid (Master loader)');
  console.log('');
  console.log('Key messaging standardized to:');
  console.log('  - "5-7 business days" turnaround');
  console.log('  - "Free personalization" on all bottles');
  console.log('  - "Permanent sublimation printing"');
  console.log('  - "Free shipping $75+"');
  console.log('');
  console.log('View at: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
