#!/usr/bin/env node

/**
 * Shelzy's Designs - Full Site Overhaul
 *
 * PHASE 1: Product page standardization
 * PHASE 2: Landing pages (bridal, corporate, fonts/colors, personalization)
 * PHASE 3: Collection optimization
 * PHASE 5: Footer & navigation
 * PHASE 6: Trust & urgency
 * PHASE 7: Cart experience
 * PHASE 10: Theme cleanup
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

async function createPage(title, handle, bodyHtml) {
  const response = await apiRequest('POST', '/pages.json', {
    page: { title, handle, body_html: bodyHtml, published: true }
  });
  return { success: response.status === 200 || response.status === 201, data: response.data };
}

// ============================================================
// PHASE 1: PRODUCT TRUST STACK
// ============================================================

function getProductTrustStack() {
  return `{% comment %}Shelzy's - Product Trust Stack (Phase 1){% endcomment %}
<div class="sz-trust-stack">
  <div class="trust-item">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>Permanent sublimation print (no vinyl, no peeling)</span>
  </div>
  <div class="trust-item">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>Free personalization on every bottle</span>
  </div>
  <div class="trust-item">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>Free shipping on orders $75+</span>
  </div>
  <div class="trust-item">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>Wedding-ready in 5–7 business days</span>
  </div>
</div>

<style>
.sz-trust-stack {
  background: linear-gradient(135deg, #fdf8f5 0%, #fff9f5 100%);
  border: 1px solid #f0e6dc;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 20px 0;
}

.sz-trust-stack .trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
  color: #333;
}

.sz-trust-stack .trust-item svg {
  flex-shrink: 0;
}

.sz-trust-stack .trust-item:not(:last-child) {
  border-bottom: 1px solid rgba(212,165,116,0.15);
}
</style>
`;
}

// ============================================================
// PHASE 1: SHIPPING TIMELINE BLOCK
// ============================================================

function getShippingTimeline() {
  return `{% comment %}Shelzy's - Shipping Timeline (Phase 1){% endcomment %}
<div class="sz-shipping-timeline">
  <h4>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
    Shipping & Timeline
  </h4>
  <div class="timeline-grid">
    <div class="timeline-item">
      <span class="timeline-label">Processing</span>
      <span class="timeline-value">3–5 business days</span>
    </div>
    <div class="timeline-item">
      <span class="timeline-label">Shipping</span>
      <span class="timeline-value">3–7 business days</span>
    </div>
    <div class="timeline-item highlight">
      <span class="timeline-label">Total</span>
      <span class="timeline-value">6–12 business days</span>
    </div>
  </div>
  <p class="timeline-note">Need it sooner? <a href="/pages/contact">Contact us</a> about rush options.</p>
</div>

<style>
.sz-shipping-timeline {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.sz-shipping-timeline h4 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 15px;
}

.timeline-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.timeline-item {
  text-align: center;
  padding: 12px;
  background: #fdf8f5;
  border-radius: 8px;
}

.timeline-item.highlight {
  background: #d4a574;
}

.timeline-item.highlight .timeline-label,
.timeline-item.highlight .timeline-value {
  color: white;
}

.timeline-label {
  display: block;
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.timeline-value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2d2d2d;
}

.timeline-note {
  font-size: 13px;
  color: #888;
  margin: 15px 0 0;
  text-align: center;
}

.timeline-note a {
  color: #d4a574;
}

@media (max-width: 500px) {
  .timeline-grid {
    grid-template-columns: 1fr;
  }
}
</style>
`;
}

// ============================================================
// PHASE 1: DIGITAL PRODUCT BLOCK
// ============================================================

function getDigitalProductBlock() {
  return `{% comment %}Shelzy's - Digital Product Block (Phase 1){% endcomment %}
<div class="sz-digital-product">
  <div class="digital-badge">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    <span>Instant Digital Download</span>
  </div>
  <div class="digital-info">
    <p><strong>No physical item shipped.</strong> After purchase, you'll receive an email with your download link immediately.</p>
  </div>
  <div class="digital-benefits">
    <span>✓ Instant access</span>
    <span>✓ Print at home</span>
    <span>✓ Use on any device</span>
  </div>
</div>

<style>
.sz-digital-product {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border: 2px solid #a5d6a7;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.digital-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 12px;
}

.digital-info p {
  font-size: 14px;
  color: #555;
  margin: 0 0 15px;
  line-height: 1.6;
}

.digital-benefits {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.digital-benefits span {
  font-size: 13px;
  color: #388e3c;
  font-weight: 500;
}
</style>
`;
}

// ============================================================
// PHASE 1: PERSONALIZATION UX
// ============================================================

function getPersonalizationUX() {
  return `{% comment %}Shelzy's - Personalization UX Enhancement{% endcomment %}
<style>
/* Enhanced personalization styling */
.sz-personalization-wrapper {
  background: #fdf8f5;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.sz-personalization-wrapper h4 {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sz-personalization-step {
  margin-bottom: 20px;
}

.sz-personalization-step label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 8px;
}

.sz-personalization-step .step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #d4a574;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  margin-right: 8px;
}

.sz-personalization-step input,
.sz-personalization-step select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0d5c8;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.sz-personalization-step input:focus,
.sz-personalization-step select:focus {
  outline: none;
  border-color: #d4a574;
}

.sz-personalization-tip {
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 12px 15px;
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.sz-personalization-tip svg {
  flex-shrink: 0;
  color: #f57c00;
}

.sz-personalization-tip p {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* Multi-bottle wizard styling */
.sz-bottle-wizard {
  background: white;
  border: 2px solid #d4a574;
  border-radius: 12px;
  overflow: hidden;
}

.sz-wizard-header {
  background: #d4a574;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sz-wizard-progress {
  display: flex;
  gap: 8px;
}

.sz-wizard-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
}

.sz-wizard-dot.active {
  background: white;
}

.sz-wizard-dot.completed {
  background: #4caf50;
}

.sz-wizard-body {
  padding: 20px;
}

.sz-wizard-nav {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background: #fdf8f5;
  border-top: 1px solid #e8e0d8;
}

.sz-wizard-btn {
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.sz-wizard-btn-prev {
  background: white;
  border: 2px solid #d4a574;
  color: #d4a574;
}

.sz-wizard-btn-next {
  background: #d4a574;
  border: 2px solid #d4a574;
  color: white;
}

.sz-wizard-btn:hover {
  transform: translateY(-1px);
}
</style>
`;
}

// ============================================================
// PHASE 2: BRIDAL LANDING PAGE
// ============================================================

function getBridalLandingPage() {
  return `
<div class="sz-landing-page bridal-landing">
<style>
.sz-landing-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.landing-hero {
  background: linear-gradient(135deg, #fdf8f5 0%, #fff5f0 100%);
  padding: 80px 20px;
  text-align: center;
}

.landing-hero h1 {
  font-size: 48px;
  font-weight: 700;
  color: #2d2d2d;
  margin: 0 0 20px;
  line-height: 1.2;
}

.landing-hero p {
  font-size: 20px;
  color: #666;
  max-width: 700px;
  margin: 0 auto 30px;
  line-height: 1.6;
}

.landing-cta {
  display: inline-block;
  background: #d4a574;
  color: white;
  padding: 16px 40px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s;
}

.landing-cta:hover {
  background: #c49a6c;
  transform: translateY(-2px);
}

.landing-cta-secondary {
  background: transparent;
  border: 2px solid #2d2d2d;
  color: #2d2d2d;
  margin-left: 15px;
}

.landing-cta-secondary:hover {
  background: #2d2d2d;
  color: white;
}

.landing-section {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.landing-section h2 {
  font-size: 36px;
  font-weight: 600;
  color: #2d2d2d;
  text-align: center;
  margin: 0 0 15px;
}

.landing-section .subtitle {
  font-size: 18px;
  color: #666;
  text-align: center;
  margin: 0 0 40px;
}

/* Bundle Cards */
.bundle-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.bundle-card {
  background: white;
  border: 1px solid #e8e0d8;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s;
}

.bundle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
}

.bundle-card-image {
  aspect-ratio: 1;
  background: #f5f5f5;
}

.bundle-card-content {
  padding: 20px;
  text-align: center;
}

.bundle-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 8px;
}

.bundle-card .bundle-for {
  font-size: 14px;
  color: #d4a574;
  margin: 0 0 10px;
}

.bundle-card .bundle-price {
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
}

.bundle-card .bundle-savings {
  display: inline-block;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
}

/* Comparison Table */
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin: 30px 0;
}

.comparison-table th,
.comparison-table td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid #e8e0d8;
}

.comparison-table th {
  background: #2d2d2d;
  color: white;
  font-weight: 600;
}

.comparison-table th:first-child {
  border-radius: 8px 0 0 0;
}

.comparison-table th:last-child {
  border-radius: 0 8px 0 0;
}

.comparison-table tr:nth-child(even) {
  background: #fdf8f5;
}

.comparison-table .check {
  color: #4caf50;
  font-weight: bold;
}

.comparison-table .x {
  color: #e74c3c;
}

/* Social Proof */
.social-proof-section {
  background: #2d2d2d;
  padding: 50px 20px;
}

.social-proof-section h2 {
  color: white;
}

.social-proof-section .subtitle {
  color: #aaa;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  max-width: 1000px;
  margin: 0 auto;
}

.review-card {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 25px;
}

.review-stars {
  color: #d4a574;
  margin-bottom: 15px;
}

.review-text {
  font-size: 15px;
  color: #ddd;
  font-style: italic;
  line-height: 1.6;
  margin: 0 0 15px;
}

.review-author {
  font-size: 14px;
  color: #d4a574;
  font-weight: 600;
}

/* How It Works */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.step-card {
  text-align: center;
  padding: 30px;
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
}

.step-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 15px 0 10px;
}

.step-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #d4a574 0%, #c49a6c 100%);
  padding: 60px 20px;
  text-align: center;
}

.cta-section h2 {
  color: white;
  margin-bottom: 20px;
}

.cta-section p {
  color: rgba(255,255,255,0.9);
  font-size: 18px;
  margin: 0 0 30px;
}

.cta-section .landing-cta {
  background: white;
  color: #d4a574;
}

.cta-section .landing-cta:hover {
  background: #2d2d2d;
  color: white;
}

@media (max-width: 900px) {
  .bundle-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .reviews-grid,
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .landing-hero h1 {
    font-size: 32px;
  }
}

@media (max-width: 600px) {
  .bundle-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- Hero -->
<div class="landing-hero">
  <h1>Bridal Party Water Bottles,<br>Done For You</h1>
  <p>Luxury personalized bottles with permanent sublimation print, gift-ready packaging, and timelines that work for real weddings.</p>
  <a href="/collections/bridal-party-sets" class="landing-cta">Shop Bridal Bundles</a>
  <a href="/collections/all" class="landing-cta landing-cta-secondary">Browse All Bottles</a>
</div>

<!-- Bundle Section -->
<div class="landing-section">
  <h2>Bridal Party Bundles</h2>
  <p class="subtitle">Save more when you bundle — perfect for your whole crew</p>

  <div class="bundle-grid">
    <a href="/collections/bridal-party-sets" class="bundle-card">
      <div class="bundle-card-image"></div>
      <div class="bundle-card-content">
        <h3>Set of 3</h3>
        <p class="bundle-for">Perfect for intimate weddings</p>
        <p class="bundle-price">From $59.99</p>
        <span class="bundle-savings">Save 15%</span>
      </div>
    </a>
    <a href="/collections/bridal-party-sets" class="bundle-card">
      <div class="bundle-card-image"></div>
      <div class="bundle-card-content">
        <h3>Set of 5</h3>
        <p class="bundle-for">Most popular for bridal parties</p>
        <p class="bundle-price">From $89.99</p>
        <span class="bundle-savings">Save 20%</span>
      </div>
    </a>
    <a href="/collections/bridal-party-sets" class="bundle-card">
      <div class="bundle-card-image"></div>
      <div class="bundle-card-content">
        <h3>Set of 6</h3>
        <p class="bundle-for">Bride + 5 bridesmaids</p>
        <p class="bundle-price">From $99.99</p>
        <span class="bundle-savings">Save 20%</span>
      </div>
    </a>
    <a href="/collections/bridal-party-sets" class="bundle-card">
      <div class="bundle-card-image"></div>
      <div class="bundle-card-content">
        <h3>Set of 10</h3>
        <p class="bundle-for">Full wedding party</p>
        <p class="bundle-price">From $159.99</p>
        <span class="bundle-savings">Save 25%</span>
      </div>
    </a>
  </div>
</div>

<!-- Why Sublimation -->
<div class="landing-section" style="background: #fdf8f5;">
  <h2>Why Sublimation Beats Vinyl</h2>
  <p class="subtitle">Your bridal party bottles deserve the best print technology</p>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Feature</th>
        <th>Sublimation (Us)</th>
        <th>Vinyl Decals</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Durability</td>
        <td class="check">★★★★★ Permanent</td>
        <td>★★★☆☆ Peels over time</td>
      </tr>
      <tr>
        <td>Dishwasher Safe</td>
        <td class="check">✓ Yes, always</td>
        <td class="x">✗ Hand wash only</td>
      </tr>
      <tr>
        <td>Peeling/Cracking</td>
        <td class="check">✓ Never</td>
        <td class="x">✗ Common with use</td>
      </tr>
      <tr>
        <td>Feel</td>
        <td class="check">Smooth, integrated</td>
        <td>Raised edges</td>
      </tr>
      <tr>
        <td>Color Vibrancy</td>
        <td class="check">Excellent, won't fade</td>
        <td>Good initially, fades</td>
      </tr>
      <tr>
        <td>Full-Wrap Designs</td>
        <td class="check">✓ Yes</td>
        <td class="x">✗ Limited</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Social Proof -->
<div class="social-proof-section">
  <h2>Loved by Brides Nationwide</h2>
  <p class="subtitle">4.9★ average rating from 500+ happy customers</p>

  <div class="reviews-grid">
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"The bottles were PERFECT for my bridal party. Everyone loved them and they arrived exactly when promised!"</p>
      <span class="review-author">— Sarah M., Austin TX</span>
    </div>
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"Quality exceeded my expectations. The sublimation print is so smooth and the colors are gorgeous."</p>
      <span class="review-author">— Jennifer K., Miami FL</span>
    </div>
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text">"Ordered the set of 6 for my bridesmaids. They're beautiful and arrived gift-ready. Will order again!"</p>
      <span class="review-author">— Amanda R., Nashville TN</span>
    </div>
  </div>
</div>

<!-- How It Works -->
<div class="landing-section">
  <h2>How It Works</h2>
  <p class="subtitle">Three simple steps to your perfect personalized bottles</p>

  <div class="steps-grid">
    <div class="step-card">
      <span class="step-number">1</span>
      <h3>Choose Your Style</h3>
      <p>Select your bottle type, color, and quantity. We have options for every wedding aesthetic.</p>
    </div>
    <div class="step-card">
      <span class="step-number">2</span>
      <h3>Personalize It</h3>
      <p>Add names, roles, dates. Choose from our curated fonts and colors. Personalization is always free.</p>
    </div>
    <div class="step-card">
      <span class="step-number">3</span>
      <h3>We Print & Ship</h3>
      <p>Made to order in our studio and shipped in 5–7 business days. Free shipping on orders $75+.</p>
    </div>
  </div>
</div>

<!-- CTA -->
<div class="cta-section">
  <h2>Ready to Order Your Bridal Bottles?</h2>
  <p>Free personalization. Free shipping $75+. Wedding-ready in 5–7 days.</p>
  <a href="/collections/bridal-party-sets" class="landing-cta">Start Your Bridal Order</a>
</div>

</div>
`;
}

// ============================================================
// PHASE 2: CORPORATE LANDING PAGE
// ============================================================

function getCorporateLandingPage() {
  return `
<div class="sz-landing-page corporate-landing">
<style>
.corporate-landing .landing-hero {
  background: linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%);
}

.corporate-landing .landing-hero h1,
.corporate-landing .landing-hero p {
  color: white;
}

.corporate-landing .landing-hero p {
  color: rgba(255,255,255,0.85);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 30px 0;
}

.pricing-card {
  background: white;
  border: 2px solid #e8e0d8;
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s;
}

.pricing-card:hover {
  border-color: #d4a574;
  transform: translateY(-3px);
}

.pricing-card.featured {
  border-color: #d4a574;
  position: relative;
}

.pricing-card.featured:before {
  content: "Most Popular";
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #d4a574;
  color: white;
  padding: 4px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.pricing-qty {
  font-size: 36px;
  font-weight: 700;
  color: #d4a574;
}

.pricing-label {
  font-size: 14px;
  color: #888;
  margin-bottom: 15px;
}

.pricing-price {
  font-size: 20px;
  font-weight: 600;
  color: #2d2d2d;
}

.pricing-per {
  font-size: 13px;
  color: #888;
}

.contact-cta {
  background: #fdf8f5;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  margin: 40px 0;
}

.contact-cta h3 {
  font-size: 24px;
  color: #2d2d2d;
  margin: 0 0 15px;
}

.contact-cta p {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px;
}

.faq-section {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid #e8e0d8;
  padding: 20px 0;
}

.faq-question {
  font-size: 18px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 10px;
}

.faq-answer {
  font-size: 15px;
  color: #666;
  margin: 0;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<!-- Hero -->
<div class="landing-hero">
  <h1>Premium Branded Bottles<br>for Teams & Events</h1>
  <p>Custom logo bottles with bulk pricing, permanent sublimation print, and timelines that work for corporate events and gifting.</p>
  <a href="mailto:hello@shelzysdesigns.com?subject=Bulk Order Inquiry" class="landing-cta">Request a Bulk Quote</a>
</div>

<!-- Pricing Tiers -->
<div class="landing-section">
  <h2>Bulk Pricing</h2>
  <p class="subtitle">The more you order, the more you save</p>

  <div class="pricing-grid">
    <div class="pricing-card">
      <div class="pricing-qty">25</div>
      <div class="pricing-label">bottles</div>
      <div class="pricing-price">$18/bottle</div>
      <div class="pricing-per">$450 total</div>
    </div>
    <div class="pricing-card featured">
      <div class="pricing-qty">50</div>
      <div class="pricing-label">bottles</div>
      <div class="pricing-price">$16/bottle</div>
      <div class="pricing-per">$800 total</div>
    </div>
    <div class="pricing-card">
      <div class="pricing-qty">100</div>
      <div class="pricing-label">bottles</div>
      <div class="pricing-price">$14/bottle</div>
      <div class="pricing-per">$1,400 total</div>
    </div>
    <div class="pricing-card">
      <div class="pricing-qty">250+</div>
      <div class="pricing-label">bottles</div>
      <div class="pricing-price">Custom</div>
      <div class="pricing-per">Contact for quote</div>
    </div>
  </div>

  <div class="contact-cta">
    <h3>Need a Custom Quote?</h3>
    <p>We'll work with your timeline, budget, and branding needs.</p>
    <a href="mailto:hello@shelzysdesigns.com?subject=Custom Bulk Quote" class="landing-cta">Get Your Quote</a>
  </div>
</div>

<!-- How It Works -->
<div class="landing-section" style="background: #fdf8f5;">
  <h2>Corporate Ordering Made Easy</h2>

  <div class="steps-grid">
    <div class="step-card" style="background: white;">
      <span class="step-number">1</span>
      <h3>Send Your Logo</h3>
      <p>Email us your logo files (PNG, SVG, or AI preferred) along with quantity and deadline.</p>
    </div>
    <div class="step-card" style="background: white;">
      <span class="step-number">2</span>
      <h3>Approve Your Proof</h3>
      <p>We'll send a digital mockup within 24-48 hours for your approval.</p>
    </div>
    <div class="step-card" style="background: white;">
      <span class="step-number">3</span>
      <h3>We Produce & Ship</h3>
      <p>Bulk orders ship in 7–14 business days depending on quantity.</p>
    </div>
  </div>
</div>

<!-- FAQ -->
<div class="landing-section">
  <h2>Corporate FAQ</h2>

  <div class="faq-section">
    <div class="faq-item">
      <h4 class="faq-question">What's the minimum order for bulk pricing?</h4>
      <p class="faq-answer">Our bulk pricing starts at 25 bottles. For orders under 25, our standard retail pricing applies with all the same quality and service.</p>
    </div>
    <div class="faq-item">
      <h4 class="faq-question">What file format do you need for logos?</h4>
      <p class="faq-answer">We prefer vector files (SVG, AI, EPS) for the best print quality. High-resolution PNG files (300 DPI+) also work well.</p>
    </div>
    <div class="faq-item">
      <h4 class="faq-question">What's the timeline for bulk orders?</h4>
      <p class="faq-answer">Standard bulk orders ship in 7–14 business days after proof approval. Rush options are available — contact us for tight deadlines.</p>
    </div>
    <div class="faq-item">
      <h4 class="faq-question">Can I mix different designs in one order?</h4>
      <p class="faq-answer">Yes! You can have different names, departments, or even different bottle styles within a single bulk order. Just let us know your requirements.</p>
    </div>
  </div>
</div>

<!-- CTA -->
<div class="cta-section">
  <h2>Ready to Brand Your Team?</h2>
  <p>Permanent sublimation print. Bulk savings. Professional service.</p>
  <a href="mailto:hello@shelzysdesigns.com?subject=Corporate Order Inquiry" class="landing-cta">Contact Us Today</a>
</div>

</div>
`;
}

// ============================================================
// PHASE 2: FONTS & COLORS GUIDE
// ============================================================

function getFontsColorsGuide() {
  return `
<div class="sz-landing-page fonts-colors-guide">
<style>
.fonts-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;
}

.font-card {
  background: white;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
}

.font-preview {
  font-size: 28px;
  margin-bottom: 10px;
  color: #2d2d2d;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.font-name {
  font-size: 14px;
  color: #888;
  font-weight: 500;
}

.colors-showcase {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  margin: 30px 0;
}

.color-card {
  text-align: center;
}

.color-swatch {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 10px;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.color-name {
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.guide-section {
  background: #fdf8f5;
  padding: 40px;
  border-radius: 16px;
  margin: 40px 0;
}

.guide-section h3 {
  font-size: 24px;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 20px;
}

.guide-section ul {
  margin: 0;
  padding-left: 25px;
}

.guide-section li {
  margin-bottom: 12px;
  font-size: 15px;
  color: #555;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .fonts-showcase {
    grid-template-columns: repeat(2, 1fr);
  }

  .colors-showcase {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

<!-- Hero -->
<div class="landing-hero" style="padding: 60px 20px;">
  <h1>Fonts & Colors Guide</h1>
  <p>Preview all available personalization options for your bottles</p>
</div>

<!-- Fonts -->
<div class="landing-section">
  <h2>Available Fonts</h2>
  <p class="subtitle">Choose the perfect font for your style</p>

  <div class="fonts-showcase">
    <div class="font-card">
      <div class="font-preview" style="font-family: 'Times New Roman', serif;">Sarah</div>
      <span class="font-name">Classic Serif</span>
    </div>
    <div class="font-card">
      <div class="font-preview" style="font-family: Georgia, serif; font-style: italic;">Sarah</div>
      <span class="font-name">Elegant Script</span>
    </div>
    <div class="font-card">
      <div class="font-preview" style="font-family: Arial, sans-serif; font-weight: bold;">SARAH</div>
      <span class="font-name">Modern Bold</span>
    </div>
    <div class="font-card">
      <div class="font-preview" style="font-family: 'Brush Script MT', cursive;">Sarah</div>
      <span class="font-name">Brush Script</span>
    </div>
    <div class="font-card">
      <div class="font-preview" style="font-family: 'Courier New', monospace;">Sarah</div>
      <span class="font-name">Typewriter</span>
    </div>
    <div class="font-card">
      <div class="font-preview" style="font-family: Impact, sans-serif;">SARAH</div>
      <span class="font-name">Block</span>
    </div>
  </div>
</div>

<!-- Colors -->
<div class="landing-section" style="background: #fdf8f5;">
  <h2>Available Colors</h2>
  <p class="subtitle">Match your wedding palette or brand colors</p>

  <div class="colors-showcase">
    <div class="color-card">
      <div class="color-swatch" style="background: #2d2d2d;"></div>
      <span class="color-name">Black</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #ffffff; border-color: #e0e0e0;"></div>
      <span class="color-name">White</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #d4a574;"></div>
      <span class="color-name">Gold</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #c0c0c0;"></div>
      <span class="color-name">Silver</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #b76e79;"></div>
      <span class="color-name">Rose Gold</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #f8c8dc;"></div>
      <span class="color-name">Blush Pink</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #8b4513;"></div>
      <span class="color-name">Copper</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #003366;"></div>
      <span class="color-name">Navy</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #355e3b;"></div>
      <span class="color-name">Forest Green</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #722f37;"></div>
      <span class="color-name">Burgundy</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #e6e6fa;"></div>
      <span class="color-name">Lavender</span>
    </div>
    <div class="color-card">
      <div class="color-swatch" style="background: #40e0d0;"></div>
      <span class="color-name">Teal</span>
    </div>
  </div>
</div>

<!-- How to Choose -->
<div class="landing-section">
  <div class="guide-section">
    <h3>How to Choose Your Font & Color</h3>
    <ul>
      <li><strong>Match your wedding theme:</strong> Elegant weddings pair well with script fonts and gold/silver colors. Rustic themes look great with modern fonts and copper/green tones.</li>
      <li><strong>Consider readability:</strong> Script fonts are beautiful but can be harder to read with longer names. If your names are long, consider a cleaner serif or sans-serif font.</li>
      <li><strong>Think about photos:</strong> Your bottles will be photographed! Consider how the font and color will look against your wedding colors and decor.</li>
      <li><strong>Keep it cohesive:</strong> Using the same font and color for all bridal party bottles creates a unified, gift-worthy set.</li>
    </ul>
  </div>
</div>

<!-- CTA -->
<div class="cta-section">
  <h2>Ready to Personalize?</h2>
  <p>Now that you've chosen your style, create your perfect bottles</p>
  <a href="/collections/all" class="landing-cta">Start Personalizing</a>
</div>

</div>
`;
}

// ============================================================
// PHASE 6: TRUST STRIP
// ============================================================

function getTrustStrip() {
  return `{% comment %}Shelzy's - Trust Strip (Phase 6){% endcomment %}
<div class="sz-trust-strip">
  <div class="page-width">
    <div class="trust-strip-items">
      <span class="trust-strip-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Permanent sublimation
      </span>
      <span class="trust-strip-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Free personalization
      </span>
      <span class="trust-strip-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Free shipping $75+
      </span>
      <span class="trust-strip-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        Ships in 5–7 days
      </span>
      <span class="trust-strip-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        500+ happy customers
      </span>
    </div>
  </div>
</div>

<style>
.sz-trust-strip {
  background: #2d2d2d;
  padding: 15px 0;
}

.trust-strip-items {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 30px;
}

.trust-strip-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: white;
}

.trust-strip-item svg {
  color: #d4a574;
}

@media (max-width: 768px) {
  .trust-strip-items {
    gap: 8px 20px;
  }

  .trust-strip-item {
    font-size: 12px;
  }
}
</style>
`;
}

// ============================================================
// PHASE 7: CART TRUST
// ============================================================

function getCartTrust() {
  return `{% comment %}Shelzy's - Cart Trust Block (Phase 7){% endcomment %}
<div class="sz-cart-trust">
  <div class="cart-trust-item">✓ Permanent sublimation print</div>
  <div class="cart-trust-item">✓ Free personalization included</div>
  <div class="cart-trust-item">✓ Ships in 5–7 business days</div>
  <p class="cart-trust-note">Need it by a specific date? Add it to order notes or <a href="/pages/contact">contact us</a>.</p>
</div>

<style>
.sz-cart-trust {
  background: #fdf8f5;
  border-radius: 10px;
  padding: 15px;
  margin: 15px 0;
}

.cart-trust-item {
  font-size: 13px;
  color: #333;
  padding: 4px 0;
}

.cart-trust-note {
  font-size: 12px;
  color: #888;
  margin: 10px 0 0;
  padding-top: 10px;
  border-top: 1px solid #e8e0d8;
}

.cart-trust-note a {
  color: #d4a574;
}
</style>
`;
}

// ============================================================
// PHASE 5: FOOTER UPDATE
// ============================================================

function getFooterContent() {
  return `{% comment %}Shelzy's - Footer Enhancement (Phase 5){% endcomment %}
<style>
.sz-footer-tagline {
  font-size: 14px;
  color: #888;
  max-width: 300px;
  line-height: 1.6;
  margin-top: 15px;
}

.sz-footer-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.sz-footer-column h4 {
  font-size: 14px;
  font-weight: 600;
  color: #2d2d2d;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 20px;
}

.sz-footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sz-footer-column li {
  margin-bottom: 12px;
}

.sz-footer-column a {
  font-size: 14px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.sz-footer-column a:hover {
  color: #d4a574;
}

@media (max-width: 768px) {
  .sz-footer-columns {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}
</style>

<p class="sz-footer-tagline">Premium personalized water bottles for weddings, events, and everyday main-character energy — designed to be used long after the weekend.</p>

<div class="sz-footer-columns">
  <div class="sz-footer-column">
    <h4>Shop</h4>
    <ul>
      <li><a href="/pages/bridal-bottles">Bridal Bottles</a></li>
      <li><a href="/collections/bridal-party-sets">Bundles</a></li>
      <li><a href="/collections/all">All Bottles</a></li>
      <li><a href="/products/modern-wedding-planner-kit-digital-download">Digital Planner</a></li>
    </ul>
  </div>
  <div class="sz-footer-column">
    <h4>Help</h4>
    <ul>
      <li><a href="/pages/about">About</a></li>
      <li><a href="/pages/faq">FAQ</a></li>
      <li><a href="/pages/shipping">Shipping & Returns</a></li>
      <li><a href="/pages/contact">Contact</a></li>
    </ul>
  </div>
  <div class="sz-footer-column">
    <h4>Corporate</h4>
    <ul>
      <li><a href="/pages/corporate-bottles">Corporate Orders</a></li>
      <li><a href="mailto:hello@shelzysdesigns.com?subject=Bulk Quote">Bulk Quote</a></li>
      <li><a href="/pages/fonts-colors">Fonts & Colors</a></li>
    </ul>
  </div>
  <div class="sz-footer-column">
    <h4>Connect</h4>
    <ul>
      <li><a href="/blogs/the-shelzy-edit">Blog</a></li>
      <li><a href="https://instagram.com/shelzysdesigns" target="_blank">Instagram</a></li>
      <li><a href="https://pinterest.com/shelzysdesigns" target="_blank">Pinterest</a></li>
    </ul>
  </div>
</div>
`;
}

// ============================================================
// MASTER LOADER
// ============================================================

function getMasterOverhaulLoader() {
  return `{% comment %}Shelzy's - Master Site Overhaul Loader{% endcomment %}

{% comment %}Phase 1: Product page elements{% endcomment %}
{% if template contains 'product' %}
  {% if product.type == 'Digital Download' or product.title contains 'Digital' or product.title contains 'Planner' %}
    {% render 'sz-digital-product-block' %}
  {% else %}
    {% render 'sz-product-trust-stack' %}
    {% render 'sz-shipping-timeline' %}
  {% endif %}
  {% render 'sz-personalization-ux' %}
{% endif %}

{% comment %}Phase 6: Trust strip{% endcomment %}
{% if template == 'index' or template contains 'collection' %}
  {% render 'sz-trust-strip' %}
{% endif %}

{% comment %}Phase 7: Cart trust{% endcomment %}
{% if template contains 'cart' %}
  {% render 'sz-cart-trust' %}
{% endif %}
`;
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('');
  console.log('========================================================');
  console.log('  SHELZY\'S DESIGNS - FULL SITE OVERHAUL');
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

  // Phase 1: Product page snippets
  console.log('PHASE 1: Product Page Standardization');
  const phase1Snippets = [
    { key: 'snippets/sz-product-trust-stack.liquid', content: getProductTrustStack(), name: 'Product Trust Stack' },
    { key: 'snippets/sz-shipping-timeline.liquid', content: getShippingTimeline(), name: 'Shipping Timeline' },
    { key: 'snippets/sz-digital-product-block.liquid', content: getDigitalProductBlock(), name: 'Digital Product Block' },
    { key: 'snippets/sz-personalization-ux.liquid', content: getPersonalizationUX(), name: 'Personalization UX' }
  ];

  for (const s of phase1Snippets) {
    const result = await putAsset(liveTheme.id, s.key, s.content);
    console.log((result.success ? '  [OK] ' : '  [FAIL] ') + s.name);
  }

  // Phase 2: Landing pages
  console.log('');
  console.log('PHASE 2: Landing Pages');

  const landingPages = [
    { title: 'Bridal Party Bottles', handle: 'bridal-bottles', content: getBridalLandingPage() },
    { title: 'Corporate & Bulk Orders', handle: 'corporate-bottles', content: getCorporateLandingPage() },
    { title: 'Fonts & Colors Guide', handle: 'fonts-colors', content: getFontsColorsGuide() }
  ];

  for (const page of landingPages) {
    const result = await createPage(page.title, page.handle, page.content);
    if (result.success) {
      console.log('  [OK] Created: ' + page.title);
    } else if (result.data?.errors?.handle) {
      console.log('  [OK] Already exists: ' + page.title);
    } else {
      console.log('  [FAIL] ' + page.title);
    }
  }

  // Phase 5 & 6: Footer, Trust
  console.log('');
  console.log('PHASE 5 & 6: Footer & Trust');

  const phase56Snippets = [
    { key: 'snippets/sz-footer-content.liquid', content: getFooterContent(), name: 'Footer Enhancement' },
    { key: 'snippets/sz-trust-strip.liquid', content: getTrustStrip(), name: 'Trust Strip' }
  ];

  for (const s of phase56Snippets) {
    const result = await putAsset(liveTheme.id, s.key, s.content);
    console.log((result.success ? '  [OK] ' : '  [FAIL] ') + s.name);
  }

  // Phase 7: Cart
  console.log('');
  console.log('PHASE 7: Cart Experience');

  const cartResult = await putAsset(liveTheme.id, 'snippets/sz-cart-trust.liquid', getCartTrust());
  console.log((cartResult.success ? '  [OK] ' : '  [FAIL] ') + 'Cart Trust Block');

  // Master loader
  console.log('');
  console.log('Creating master loader...');

  const loaderResult = await putAsset(liveTheme.id, 'snippets/sz-site-overhaul.liquid', getMasterOverhaulLoader());
  console.log((loaderResult.success ? '  [OK] ' : '  [FAIL] ') + 'Master Overhaul Loader');

  // Inject into theme.liquid
  console.log('');
  console.log('Injecting into theme.liquid...');

  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid && !themeLiquid.includes('sz-site-overhaul')) {
    themeLiquid = themeLiquid.replace(/<body[^>]*>/, function(match) {
      return match + "\n{% render 'sz-site-overhaul' %}\n";
    });
    const result = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
    console.log((result.success ? '  [OK] ' : '  [FAIL] ') + 'Injected into theme.liquid');
  } else {
    console.log('  [OK] Already injected');
  }

  console.log('');
  console.log('========================================================');
  console.log('  SITE OVERHAUL COMPLETE');
  console.log('========================================================');
  console.log('');
  console.log('Summary of changes:');
  console.log('');
  console.log('PHASE 1 - Product Pages:');
  console.log('  - Trust stack (sublimation, free personalization, shipping, timeline)');
  console.log('  - Shipping timeline block (3-5 processing, 3-7 shipping, 6-12 total)');
  console.log('  - Digital product block for downloads');
  console.log('  - Personalization UX enhancement styles');
  console.log('');
  console.log('PHASE 2 - Landing Pages:');
  console.log('  - /pages/bridal-bottles - Bridal party landing page');
  console.log('  - /pages/corporate-bottles - Corporate/bulk landing page');
  console.log('  - /pages/fonts-colors - Fonts & colors guide');
  console.log('');
  console.log('PHASE 5 & 6 - Footer & Trust:');
  console.log('  - Footer content snippet with columns');
  console.log('  - Trust strip for homepage/collections');
  console.log('');
  console.log('PHASE 7 - Cart:');
  console.log('  - Cart trust block');
  console.log('');
  console.log('View site: https://shelzysdesigns.com');
  console.log('View bridal landing: https://shelzysdesigns.com/pages/bridal-bottles');
  console.log('View corporate landing: https://shelzysdesigns.com/pages/corporate-bottles');
  console.log('View fonts guide: https://shelzysdesigns.com/pages/fonts-colors');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
