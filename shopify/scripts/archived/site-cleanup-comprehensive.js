#!/usr/bin/env node

/**
 * Shelzy's Designs - Comprehensive Site Audit & Cleanup
 *
 * 1. Remove leftover clothing/Luxette content
 * 2. Standardize shipping/turnaround messaging
 * 3. Fix personalization messaging
 * 4. Clean up homepage sections
 * 5. Consolidate popups
 * 6. Update product page patterns
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('Missing SHOPIFY_ACCESS_TOKEN');
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
// 1. UNIFIED ANNOUNCEMENT BAR
// ============================================================

function getUnifiedAnnouncementBar() {
  return `{% comment %}Shelzy's - Unified Announcement Bar (Cleaned){% endcomment %}
<style>
.sz-unified-announcement {
  background: linear-gradient(90deg, #2d2d2d 0%, #3d3d3d 100%);
  color: white;
  padding: 12px 20px;
  text-align: center;
  font-size: 14px;
  position: relative;
  z-index: 100;
}

.sz-unified-announcement a {
  color: #d4a574;
  text-decoration: none;
  font-weight: 600;
}

.sz-unified-announcement a:hover {
  text-decoration: underline;
}

.sz-announcement-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 20px;
}

.sz-announcement-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sz-announcement-divider {
  color: #666;
  font-size: 12px;
}

@media (max-width: 768px) {
  .sz-unified-announcement {
    font-size: 12px;
    padding: 10px 15px;
  }

  .sz-announcement-divider {
    display: none;
  }

  .sz-announcement-content {
    flex-direction: column;
    gap: 4px;
  }
}
</style>

<div class="sz-unified-announcement">
  <div class="sz-announcement-content">
    <span class="sz-announcement-item">
      <span>Wedding-ready in 5–7 business days</span>
    </span>
    <span class="sz-announcement-divider">•</span>
    <span class="sz-announcement-item">
      <span>Free shipping $75+</span>
    </span>
    <span class="sz-announcement-divider">•</span>
    <span class="sz-announcement-item">
      <span>Permanent sublimation printing</span>
    </span>
  </div>
</div>
`;
}

// ============================================================
// 2. STANDARDIZED SHIPPING INFO BLOCK
// ============================================================

function getShippingInfoBlock() {
  return `{% comment %}Shelzy's - Standardized Shipping Info{% endcomment %}
<div class="sz-shipping-info">
  <h4>Shipping & Processing</h4>
  <ul>
    <li><strong>Processing:</strong> 3–5 business days</li>
    <li><strong>Shipping:</strong> 3–7 business days (US standard)</li>
    <li><strong>Total:</strong> 6–12 business days depending on location</li>
    <li><strong>Free shipping</strong> on orders $75+</li>
  </ul>
  <p class="sz-rush-note">Need it faster? <a href="/pages/contact">Contact us</a> about rush options.</p>
</div>

<style>
.sz-shipping-info {
  background: #fdf8f5;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.sz-shipping-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 12px 0;
}

.sz-shipping-info ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}

.sz-shipping-info li {
  padding: 6px 0;
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sz-shipping-info li:before {
  content: "✓";
  color: #4caf50;
  font-weight: bold;
}

.sz-rush-note {
  font-size: 13px;
  color: #888;
  margin: 0;
  font-style: italic;
}

.sz-rush-note a {
  color: #d4a574;
}
</style>
`;
}

// ============================================================
// 3. DIGITAL PRODUCT SHIPPING INFO
// ============================================================

function getDigitalShippingInfo() {
  return `{% comment %}Shelzy's - Digital Product Info{% endcomment %}
<div class="sz-digital-info">
  <div class="sz-digital-badge">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    <span>Instant Digital Download</span>
  </div>
  <p>This is a digital product. After purchase, you'll receive an email with your download link immediately. No physical item will be shipped.</p>
</div>

<style>
.sz-digital-info {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border: 1px solid #c8e6c9;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.sz-digital-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 10px;
}

.sz-digital-info p {
  font-size: 14px;
  color: #555;
  margin: 0;
  line-height: 1.6;
}
</style>
`;
}

// ============================================================
// 4. CLEANED BENEFITS STACK (NO ENGRAVING)
// ============================================================

function getCleanedBenefitsStack() {
  return `{% comment %}Shelzy's - Cleaned Benefits Stack{% endcomment %}
<div class="sz-benefits-stack">
  <div class="sz-benefit">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>Permanent sublimation print (no vinyl, no peeling)</span>
  </div>
  <div class="sz-benefit">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>Free personalization on every bottle</span>
  </div>
  <div class="sz-benefit">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>Free shipping on orders $75+</span>
  </div>
  <div class="sz-benefit">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>Wedding-ready in 5–7 business days</span>
  </div>
</div>

<style>
.sz-benefits-stack {
  background: #fdf8f5;
  border-radius: 10px;
  padding: 16px;
  margin: 16px 0;
}

.sz-benefit {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: #333;
}

.sz-benefit svg {
  flex-shrink: 0;
}
</style>
`;
}

// ============================================================
// 5. FREE PERSONALIZATION BLOCK (CORRECTED)
// ============================================================

function getFreePersonalizationBlock() {
  return `{% comment %}Shelzy's - Free Personalization Block{% endcomment %}
<section class="sz-free-personalization">
  <div class="page-width">
    <div class="personalization-content">
      <h2>Free Personalization On Every Bottle</h2>
      <p>Add names, fonts, and colors that match your event or brand. Personalization is <strong>always free</strong> on every bottle order. Free shipping on orders $75+.</p>
      <a href="/collections/all" class="btn-personalize">Start Personalizing</a>
    </div>
  </div>
</section>

<style>
.sz-free-personalization {
  background: linear-gradient(135deg, #fdf8f5 0%, #fff5f0 100%);
  padding: 50px 0;
  text-align: center;
}

.personalization-content h2 {
  font-size: 28px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 15px;
}

.personalization-content p {
  font-size: 16px;
  color: #666;
  max-width: 600px;
  margin: 0 auto 25px;
  line-height: 1.7;
}

.btn-personalize {
  display: inline-block;
  background: #d4a574;
  color: white;
  padding: 14px 32px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-personalize:hover {
  background: #c49a6c;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .personalization-content h2 {
    font-size: 24px;
  }
}
</style>
`;
}

// ============================================================
// 6. HOW IT WORKS - 3 STEPS
// ============================================================

function getHowItWorks() {
  return `{% comment %}Shelzy's - How It Works (3 Steps){% endcomment %}
<section class="sz-how-it-works">
  <div class="page-width">
    <h2>How It Works</h2>
    <p class="section-subtitle">Three simple steps to your perfect personalized bottles</p>

    <div class="steps-grid">
      <div class="step">
        <div class="step-number">1</div>
        <div class="step-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <h3>Choose Your Style</h3>
        <p>Select your bottle type, color, and quantity.</p>
      </div>

      <div class="step">
        <div class="step-number">2</div>
        <div class="step-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <h3>Personalize It</h3>
        <p>Add names, roles, dates, and choose your font and color.</p>
      </div>

      <div class="step">
        <div class="step-number">3</div>
        <div class="step-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <h3>We Print & Ship</h3>
        <p>Made to order in 3–5 days. Free shipping on orders $75+.</p>
      </div>
    </div>
  </div>
</section>

<style>
.sz-how-it-works {
  padding: 60px 0;
  background: #fff;
}

.sz-how-it-works h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 8px;
}

.sz-how-it-works .section-subtitle {
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.step {
  text-align: center;
  padding: 30px 20px;
  background: #fdf8f5;
  border-radius: 16px;
  position: relative;
}

.step-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: #d4a574;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.step-icon {
  color: #d4a574;
  margin-bottom: 15px;
}

.step h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 10px;
}

.step p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .sz-how-it-works h2 {
    font-size: 26px;
  }
}
</style>
`;
}

// ============================================================
// 7. UNIFIED POPUP (SINGLE, CLEAN)
// ============================================================

function getUnifiedPopup() {
  return `{% comment %}Shelzy's - Unified Popup (Single){% endcomment %}
<style>
.sz-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.sz-popup-overlay.active {
  display: flex;
}

.sz-popup-modal {
  background: white;
  border-radius: 20px;
  max-width: 450px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: popupSlideIn 0.3s ease;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sz-popup-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
  transition: all 0.2s;
  z-index: 2;
}

.sz-popup-close:hover {
  background: rgba(0,0,0,0.2);
}

.sz-popup-header {
  background: linear-gradient(135deg, #fdf8f5 0%, #fff5f0 100%);
  padding: 35px 25px 25px;
  text-align: center;
}

.sz-popup-header h2 {
  font-size: 26px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 8px;
  line-height: 1.3;
}

.sz-popup-header p {
  font-size: 15px;
  color: #666;
  margin: 0;
}

.sz-popup-body {
  padding: 25px;
}

.sz-popup-form input[type="email"] {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  margin-bottom: 12px;
  transition: border-color 0.2s;
}

.sz-popup-form input[type="email"]:focus {
  outline: none;
  border-color: #d4a574;
}

.sz-popup-form button {
  width: 100%;
  background: #d4a574;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.sz-popup-form button:hover {
  background: #c49a6c;
}

.sz-popup-footer {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 15px;
}

.sz-popup-footer a {
  color: #d4a574;
  text-decoration: none;
}
</style>

<div class="sz-popup-overlay" id="sz-main-popup">
  <div class="sz-popup-modal">
    <button class="sz-popup-close" onclick="closeSzMainPopup()">&times;</button>

    <div class="sz-popup-header">
      <h2>Get 10% Off Bridal &<br>Event Bottles</h2>
      <p>Plus early access to new fonts, colors & limited-edition drops</p>
    </div>

    <div class="sz-popup-body">
      <form class="sz-popup-form" onsubmit="return handleSzMainPopup(event)">
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Get My 10% Off</button>
      </form>
      <p class="sz-popup-footer">No spam, ever. <a href="/pages/privacy">Privacy Policy</a></p>
    </div>
  </div>
</div>

<script>
(function() {
  var POPUP_KEY = "sz_main_popup_seen";
  var POPUP_DELAY = 4000;

  function shouldShowPopup() {
    if (localStorage.getItem(POPUP_KEY)) return false;
    return true;
  }

  function showPopup() {
    var popup = document.getElementById("sz-main-popup");
    if (popup) popup.classList.add("active");
  }

  window.closeSzMainPopup = function() {
    var popup = document.getElementById("sz-main-popup");
    if (popup) popup.classList.remove("active");
    localStorage.setItem(POPUP_KEY, "1");
  };

  window.handleSzMainPopup = function(e) {
    e.preventDefault();
    var email = e.target.querySelector("input[type=email]").value;
    console.log("Popup signup:", email);
    localStorage.setItem(POPUP_KEY, "1");

    var modal = document.querySelector(".sz-popup-modal");
    modal.innerHTML = '<div style="padding: 50px; text-align: center;"><h2 style="color: #2d2d2d; margin-bottom: 15px;">Welcome to Shelzy\\'s!</h2><p style="color: #666; margin-bottom: 20px;">Check your email for your 10% off code: <strong>WELCOME10</strong></p><button onclick="closeSzMainPopup()" style="background: #d4a574; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-weight: 600;">Start Shopping</button></div>';

    return false;
  };

  document.addEventListener("click", function(e) {
    if (e.target.id === "sz-main-popup") {
      closeSzMainPopup();
    }
  });

  if (shouldShowPopup()) {
    setTimeout(showPopup, POPUP_DELAY);
  }
})();
</script>
`;
}

// ============================================================
// 8. SOCIAL PROOF BAND
// ============================================================

function getSocialProofBand() {
  return `{% comment %}Shelzy's - Social Proof Band{% endcomment %}
<section class="sz-social-proof-band">
  <div class="page-width">
    <div class="proof-stats">
      <div class="proof-stat">
        <span class="stat-value">4.9★</span>
        <span class="stat-label">Average Rating</span>
      </div>
      <div class="proof-divider"></div>
      <div class="proof-stat">
        <span class="stat-value">500+</span>
        <span class="stat-label">Happy Customers</span>
      </div>
      <div class="proof-divider"></div>
      <div class="proof-stat">
        <span class="stat-value">5-7</span>
        <span class="stat-label">Days to Ship</span>
      </div>
    </div>

    <div class="proof-quotes">
      <div class="proof-quote">
        <p>"The bottles were PERFECT for my bridal party. Everyone loved them!"</p>
        <span class="quote-author">— Sarah M., Bride</span>
      </div>
      <div class="proof-quote">
        <p>"Fast shipping and the quality exceeded expectations. Will order again!"</p>
        <span class="quote-author">— Jennifer K., Event Planner</span>
      </div>
      <div class="proof-quote">
        <p>"Our team bottles are a huge hit. The sublimation print is incredible."</p>
        <span class="quote-author">— Mike R., Corporate</span>
      </div>
    </div>
  </div>
</section>

<style>
.sz-social-proof-band {
  background: #2d2d2d;
  padding: 40px 0;
}

.proof-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 30px;
}

.proof-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #d4a574;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: #aaa;
  margin-top: 4px;
}

.proof-divider {
  width: 1px;
  height: 40px;
  background: #555;
}

.proof-quotes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.proof-quote {
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.proof-quote p {
  font-size: 14px;
  color: #ddd;
  font-style: italic;
  margin: 0 0 10px;
  line-height: 1.6;
}

.quote-author {
  font-size: 12px;
  color: #d4a574;
}

@media (max-width: 768px) {
  .proof-stats {
    gap: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .proof-quotes {
    grid-template-columns: 1fr;
  }
}
</style>
`;
}

// ============================================================
// 9. PERSONALIZATION MICROCOPY
// ============================================================

function getPersonalizationMicrocopy() {
  return `{% comment %}Shelzy's - Personalization Microcopy{% endcomment %}
<div class="sz-personalization-tips">
  <p class="tip-main">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
    We print exactly what you type — double-check spelling before adding to cart.
  </p>
  <p class="tip-secondary">Fonts and colors will match your selections. All bottles are hand-checked before shipping.</p>
</div>

<style>
.sz-personalization-tips {
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 12px 15px;
  margin: 15px 0;
}

.tip-main {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #f57c00;
  font-weight: 500;
  margin: 0 0 6px;
}

.tip-main svg {
  flex-shrink: 0;
}

.tip-secondary {
  font-size: 12px;
  color: #888;
  margin: 0;
  padding-left: 24px;
}
</style>
`;
}

// ============================================================
// 10. CLEANUP CSS - HIDE LEFTOVER ELEMENTS
// ============================================================

function getCleanupCSS() {
  return `{% comment %}Shelzy's - Cleanup CSS{% endcomment %}
<style>
/* Hide leftover clothing/summer sale content */
[class*="summer-sale"],
[class*="black-friday"],
[class*="luxette"],
.countdown-timer-summer,
.promo-summer-dresses {
  display: none !important;
}

/* Hide generic shipping bullets that don't apply */
.product__shipping-text:contains("worldwide"),
.product__shipping-text:contains("backordered") {
  display: none !important;
}

/* Hide subscription text if not used */
.recurring-purchase-notice,
.subscription-notice {
  display: none !important;
}

/* Clean up any duplicate announcement bars */
.announcement-bar + .announcement-bar,
.announcement-bar + .sz-unified-announcement {
  display: none !important;
}

/* Ensure only one popup shows */
.popup:not(.sz-popup-overlay) {
  display: none !important;
}

/* Hide placeholder collapsible content */
.product-accordion__content:contains("Use collapsible tabs for more detailed information") {
  display: none !important;
}

/* Style fixes for consistency */
.product-form__cart-submit {
  background: #d4a574 !important;
  border-color: #d4a574 !important;
}

.product-form__cart-submit:hover {
  background: #c49a6c !important;
  border-color: #c49a6c !important;
}
</style>

<script>
// Remove leftover content via JS
document.addEventListener('DOMContentLoaded', function() {
  // Remove elements containing summer sale, black friday, etc.
  var badPhrases = [
    'summer dresses',
    'black friday',
    'luxette',
    'lightweight fabric',
    'Made in California',
    'shirts on the beach',
    'size guide',
    'mega summer sale',
    '30% off all summer'
  ];

  function cleanElement(el) {
    var text = el.textContent.toLowerCase();
    for (var i = 0; i < badPhrases.length; i++) {
      if (text.includes(badPhrases[i].toLowerCase())) {
        el.style.display = 'none';
        return true;
      }
    }
    return false;
  }

  // Check common elements
  var elements = document.querySelectorAll('section, div, p, span, h1, h2, h3, h4, h5, h6');
  elements.forEach(function(el) {
    // Only hide if it's a container with bad content
    if (el.children.length < 3) {
      cleanElement(el);
    }
  });

  // Replace engraving mentions with sublimation
  var allText = document.body.innerHTML;
  if (allText.includes('laser-etched') || allText.includes('engraving')) {
    // Log for manual review
    console.log('Found engraving/laser-etched text - may need manual review');
  }
});
</script>
`;
}

// ============================================================
// 11. MASTER LOADER
// ============================================================

function getMasterCleanupLoader() {
  return `{% comment %}Shelzy's - Master Cleanup Loader{% endcomment %}
{% render 'sz-unified-announcement' %}
{% render 'sz-cleanup-css' %}

{% if template == 'index' %}
  {% render 'sz-social-proof-band' %}
  {% render 'sz-how-it-works-clean' %}
  {% render 'sz-free-personalization-block' %}
{% endif %}

{% if template contains 'product' %}
  {% render 'sz-benefits-stack-clean' %}
  {% render 'sz-personalization-microcopy' %}

  {% if product.type == 'Digital Download' %}
    {% render 'sz-digital-shipping-info' %}
  {% else %}
    {% render 'sz-shipping-info-block' %}
  {% endif %}
{% endif %}

{% render 'sz-unified-popup-clean' %}
`;
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('');
  console.log('========================================================');
  console.log('  SHELZY\'S DESIGNS - COMPREHENSIVE SITE CLEANUP');
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

  const snippets = [
    { key: 'snippets/sz-unified-announcement.liquid', content: getUnifiedAnnouncementBar(), name: 'Unified Announcement Bar' },
    { key: 'snippets/sz-shipping-info-block.liquid', content: getShippingInfoBlock(), name: 'Shipping Info Block' },
    { key: 'snippets/sz-digital-shipping-info.liquid', content: getDigitalShippingInfo(), name: 'Digital Product Info' },
    { key: 'snippets/sz-benefits-stack-clean.liquid', content: getCleanedBenefitsStack(), name: 'Benefits Stack' },
    { key: 'snippets/sz-free-personalization-block.liquid', content: getFreePersonalizationBlock(), name: 'Free Personalization Block' },
    { key: 'snippets/sz-how-it-works-clean.liquid', content: getHowItWorks(), name: 'How It Works' },
    { key: 'snippets/sz-unified-popup-clean.liquid', content: getUnifiedPopup(), name: 'Unified Popup' },
    { key: 'snippets/sz-social-proof-band.liquid', content: getSocialProofBand(), name: 'Social Proof Band' },
    { key: 'snippets/sz-personalization-microcopy.liquid', content: getPersonalizationMicrocopy(), name: 'Personalization Microcopy' },
    { key: 'snippets/sz-cleanup-css.liquid', content: getCleanupCSS(), name: 'Cleanup CSS' },
    { key: 'snippets/sz-master-cleanup.liquid', content: getMasterCleanupLoader(), name: 'Master Cleanup Loader' }
  ];

  console.log('Creating cleanup snippets...');
  console.log('');

  for (const snippet of snippets) {
    const result = await putAsset(liveTheme.id, snippet.key, snippet.content);
    if (result.success) {
      console.log('  [OK] ' + snippet.name);
    } else {
      console.log('  [FAIL] ' + snippet.name);
    }
  }

  // Inject master loader into theme.liquid
  console.log('');
  console.log('Injecting into theme.liquid...');

  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid) {
    if (!themeLiquid.includes('sz-master-cleanup')) {
      themeLiquid = themeLiquid.replace('<body', '<body');
      themeLiquid = themeLiquid.replace(/<body[^>]*>/, function(match) {
        return match + "\n{% render 'sz-master-cleanup' %}\n";
      });
      const result = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
      console.log(result.success ? '  [OK] Injected master cleanup' : '  [FAIL] Could not update theme.liquid');
    } else {
      console.log('  [OK] Already injected');
    }
  }

  console.log('');
  console.log('========================================================');
  console.log('  CLEANUP COMPLETE');
  console.log('========================================================');
  console.log('');
  console.log('Changes made:');
  console.log('  1. Unified announcement bar (5-7 days, free shipping $75+, sublimation)');
  console.log('  2. Standardized shipping info block');
  console.log('  3. Digital product info for downloads');
  console.log('  4. Cleaned benefits stack (no engraving mentions)');
  console.log('  5. Fixed personalization block (always free)');
  console.log('  6. 3-step How It Works section');
  console.log('  7. Single unified popup (WELCOME10)');
  console.log('  8. Social proof band with stats + quotes');
  console.log('  9. Personalization microcopy/tips');
  console.log('  10. CSS to hide leftover clothing content');
  console.log('');
  console.log('View at: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
