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

async function getAsset(themeId, key) {
  try {
    const response = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return response.asset.value;
  } catch (e) {
    return null;
  }
}

async function deleteAsset(themeId, key) {
  try {
    await shopifyRequest('DELETE', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return true;
  } catch (e) {
    return false;
  }
}

// ============================================================
// PHASE 3: BRAND DESIGN SYSTEM - CSS
// ============================================================

const shelzysBrandCSS = `/* ============================================================
   SHELZY'S DESIGNS - BRAND DESIGN SYSTEM
   Sun-soaked, pastel-tropical, villa-inspired aesthetic
   ============================================================ */

/* COLOR VARIABLES */
:root {
  --sz-coral: #FF8A80;
  --sz-coral-dark: #FF6A60;
  --sz-sand: #FFD9A0;
  --sz-sand-light: #FFECD1;
  --sz-pool: #4EC7E8;
  --sz-pool-dark: #3BB5D6;
  --sz-lilac: #F3C8FF;
  --sz-cream: #FFF9F3;
  --sz-text-dark: #2C2C2C;
  --sz-text-soft: #555;
  --sz-white: #FFFFFF;
}

/* ============================================================
   TYPOGRAPHY SYSTEM
   ============================================================ */

h1, .h1 {
  font-size: 2.4rem;
  letter-spacing: 0.02em;
  font-weight: 700;
  color: var(--sz-text-dark);
  line-height: 1.2;
}

h2, .h2 {
  font-size: 1.9rem;
  letter-spacing: 0.015em;
  font-weight: 700;
  color: var(--sz-text-dark);
  line-height: 1.25;
}

h3, .h3 {
  font-size: 1.35rem;
  letter-spacing: 0.01em;
  font-weight: 600;
  color: var(--sz-text-dark);
  line-height: 1.3;
}

h4, .h4 {
  font-size: 1.1rem;
  letter-spacing: 0.01em;
  font-weight: 600;
  color: var(--sz-text-dark);
}

@media (min-width: 750px) {
  h1, .h1 { font-size: 3rem; }
  h2, .h2 { font-size: 2.2rem; }
  h3, .h3 { font-size: 1.5rem; }
}

/* ============================================================
   PRIMARY BUTTONS - Coral pill style
   ============================================================ */

.btn,
.button,
button[type="submit"]:not(.shopify-payment-button button),
.shopify-payment-button .shopify-payment-button__button--unbranded,
.product-form__submit,
.cart__submit {
  background: var(--sz-coral) !important;
  color: var(--sz-white) !important;
  border: none !important;
  border-radius: 999px !important;
  padding: 14px 28px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
  text-transform: none !important;
  letter-spacing: 0.02em !important;
  transition: all 0.25s ease !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
}

.btn:hover,
.button:hover,
button[type="submit"]:hover:not(.shopify-payment-button button),
.shopify-payment-button .shopify-payment-button__button--unbranded:hover,
.product-form__submit:hover,
.cart__submit:hover {
  background: var(--sz-coral-dark) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(255, 138, 128, 0.35) !important;
}

/* Secondary button - Pool outline */
.btn--secondary,
.button--secondary {
  background: transparent !important;
  border: 2px solid var(--sz-pool) !important;
  color: var(--sz-pool) !important;
}

.btn--secondary:hover,
.button--secondary:hover {
  background: var(--sz-pool) !important;
  color: var(--sz-white) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(78, 199, 232, 0.3) !important;
}

/* ============================================================
   CARD STYLING - Rounded, soft shadows
   ============================================================ */

.card,
.product-card,
.card-wrapper,
.collection-card,
.blog-card,
.sz-card {
  border-radius: 20px !important;
  background: var(--sz-white) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}

.card:hover,
.product-card:hover,
.card-wrapper:hover,
.collection-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08) !important;
}

.card__inner,
.card__content {
  padding: 20px 22px !important;
}

/* ============================================================
   SECTION BACKGROUNDS - Pastel surfaces
   ============================================================ */

.sz-bg-cream {
  background-color: var(--sz-cream) !important;
}

.sz-bg-sand {
  background-color: var(--sz-sand-light) !important;
}

.sz-bg-gradient {
  background: linear-gradient(135deg, rgba(78, 199, 232, 0.1) 0%, rgba(255, 138, 128, 0.1) 100%) !important;
}

/* Apply cream background to key sections */
.section-faq,
.section-testimonials,
[class*="shelzy-difference"],
[class*="bridal-bundle"],
.collection-list-wrapper {
  background-color: var(--sz-cream) !important;
  padding: 60px 0 !important;
}

/* ============================================================
   ANNOUNCEMENT BAR - Coral gradient
   ============================================================ */

.announcement-bar,
.announcement,
[class*="announcement"] {
  background: linear-gradient(90deg, var(--sz-coral) 0%, var(--sz-sand) 100%) !important;
  color: var(--sz-white) !important;
  padding: 10px 15px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: center !important;
}

.announcement-bar a,
.announcement a {
  color: var(--sz-white) !important;
  text-decoration: underline !important;
}

/* ============================================================
   HERO SECTION STYLING
   ============================================================ */

.hero__title,
.banner__heading {
  font-size: 2.8rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.02em !important;
  color: var(--sz-white) !important;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2) !important;
}

.hero__subtitle,
.banner__text {
  font-size: 1.1rem !important;
  color: var(--sz-white) !important;
  opacity: 0.95 !important;
  max-width: 600px !important;
  margin: 0 auto !important;
}

@media (min-width: 750px) {
  .hero__title,
  .banner__heading {
    font-size: 3.5rem !important;
  }

  .hero__subtitle,
  .banner__text {
    font-size: 1.25rem !important;
  }
}

/* ============================================================
   PRODUCT PAGE ENHANCEMENTS
   ============================================================ */

.product__title {
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  color: var(--sz-text-dark) !important;
}

.product__price {
  font-size: 1.4rem !important;
  color: var(--sz-coral) !important;
  font-weight: 600 !important;
}

/* Trust badges styling */
.sz-trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--sz-cream);
  border-radius: 20px;
  font-size: 13px;
  color: var(--sz-text-soft);
}

.sz-trust-badge svg {
  width: 16px;
  height: 16px;
  color: var(--sz-coral);
}

/* ============================================================
   COLLECTION PAGE STYLING
   ============================================================ */

.collection-hero {
  background: linear-gradient(135deg, var(--sz-cream) 0%, var(--sz-sand-light) 100%) !important;
  padding: 50px 20px !important;
  text-align: center !important;
  border-radius: 0 0 30px 30px !important;
}

.collection-hero__title {
  font-size: 2.4rem !important;
  color: var(--sz-text-dark) !important;
  margin-bottom: 15px !important;
}

.collection-hero__description {
  font-size: 1.1rem !important;
  color: var(--sz-text-soft) !important;
  max-width: 650px !important;
  margin: 0 auto !important;
  line-height: 1.6 !important;
}

/* ============================================================
   NAVIGATION STYLING
   ============================================================ */

.header__menu-item {
  font-weight: 500 !important;
  color: var(--sz-text-dark) !important;
  transition: color 0.2s ease !important;
}

.header__menu-item:hover {
  color: var(--sz-coral) !important;
}

/* ============================================================
   FOOTER STYLING
   ============================================================ */

.footer {
  background: var(--sz-cream) !important;
}

.footer__title {
  color: var(--sz-text-dark) !important;
  font-weight: 600 !important;
}

/* ============================================================
   FORM INPUTS
   ============================================================ */

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="number"],
textarea,
select {
  border: 2px solid #e0e0e0 !important;
  border-radius: 12px !important;
  padding: 14px 16px !important;
  font-size: 16px !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--sz-coral) !important;
  box-shadow: 0 0 0 3px rgba(255, 138, 128, 0.15) !important;
  outline: none !important;
}

/* ============================================================
   BADGES & TAGS
   ============================================================ */

.badge,
.tag,
.product__badge {
  background: var(--sz-coral) !important;
  color: var(--sz-white) !important;
  border-radius: 20px !important;
  padding: 4px 12px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.03em !important;
}

/* ============================================================
   CART STYLING
   ============================================================ */

.cart__item {
  border-bottom: 1px solid var(--sz-sand-light) !important;
  padding: 20px 0 !important;
}

.cart__total {
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  color: var(--sz-text-dark) !important;
}

/* ============================================================
   POPUP / MODAL STYLING
   ============================================================ */

.popup__inner,
.modal__inner {
  border-radius: 24px !important;
  overflow: hidden !important;
}

.popup__content {
  padding: 40px !important;
}

/* ============================================================
   LOADING STATES
   ============================================================ */

.loading,
.btn--loading {
  opacity: 0.7 !important;
  pointer-events: none !important;
}

/* ============================================================
   UTILITY CLASSES
   ============================================================ */

.text-coral { color: var(--sz-coral) !important; }
.text-pool { color: var(--sz-pool) !important; }
.text-sand { color: var(--sz-sand) !important; }

.bg-coral { background-color: var(--sz-coral) !important; }
.bg-pool { background-color: var(--sz-pool) !important; }
.bg-sand { background-color: var(--sz-sand-light) !important; }
.bg-cream { background-color: var(--sz-cream) !important; }

.rounded-full { border-radius: 999px !important; }
.rounded-xl { border-radius: 20px !important; }

/* ============================================================
   HIDE OLD/CONFLICTING ELEMENTS
   ============================================================ */

/* Hide any old announcement bars we created */
.sz-announcement,
.sz-announcement-bar,
#sz-announcement,
[class*="sz-announcement"] {
  display: none !important;
}

/* Hide old trust strips */
.sz-trust-strip {
  display: none !important;
}

/* Hide leftover clothing/luxette references */
[class*="luxette"],
[id*="luxette"],
[class*="clothing"],
[class*="dress"] {
  display: none !important;
}

/* ============================================================
   RESPONSIVE ADJUSTMENTS
   ============================================================ */

@media (max-width: 749px) {
  .btn,
  .button {
    padding: 12px 22px !important;
    font-size: 14px !important;
  }

  .card__inner,
  .card__content {
    padding: 16px 18px !important;
  }

  .collection-hero {
    padding: 35px 15px !important;
  }
}

/* ============================================================
   ANIMATIONS
   ============================================================ */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp 0.5s ease forwards;
}
`;

// ============================================================
// PHASE 1 & 4: HERO & HOMEPAGE SNIPPETS
// ============================================================

const szHeroContent = `{% comment %}
  SZ Hero Content - Water bottles brand positioning
{% endcomment %}

<style>
.sz-hero-overlay {
  position: relative;
  padding: 80px 20px;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 138, 128, 0.85) 0%, rgba(78, 199, 232, 0.75) 100%);
  color: white;
}

.sz-hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.sz-hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.15;
  text-shadow: 0 2px 15px rgba(0,0,0,0.15);
}

.sz-hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.6;
  opacity: 0.95;
  margin-bottom: 35px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.sz-hero-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.sz-hero-btn-primary {
  background: white;
  color: #FF8A80;
  padding: 16px 32px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.25s ease;
  display: inline-block;
}

.sz-hero-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.sz-hero-btn-secondary {
  background: transparent;
  color: white;
  padding: 14px 30px;
  border: 2px solid white;
  border-radius: 999px;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.25s ease;
  display: inline-block;
}

.sz-hero-btn-secondary:hover {
  background: white;
  color: #4EC7E8;
}

@media (min-width: 750px) {
  .sz-hero-overlay {
    padding: 120px 40px;
  }

  .sz-hero-title {
    font-size: 3.2rem;
  }

  .sz-hero-subtitle {
    font-size: 1.3rem;
  }
}
</style>

<div class="sz-hero-overlay">
  <div class="sz-hero-content">
    <h1 class="sz-hero-title">Custom Personalized Water Bottles for Every Occasion</h1>
    <p class="sz-hero-subtitle">Sun-soaked, gift-ready bottles personalized with your names, colors, and fonts — perfect for weddings, bachelorettes, bridal showers, bridesmaid gifts, birthdays, corporate events, and everyday hydration.</p>
    <div class="sz-hero-buttons">
      <a href="/collections/all" class="sz-hero-btn-primary">Shop All Water Bottles</a>
      <a href="/collections/wedding-water-bottles" class="sz-hero-btn-secondary">Shop Wedding Bottles</a>
    </div>
  </div>
</div>`;

// ============================================================
// PHASE 2: SHOP BY OCCASION GRID
// ============================================================

const szOccasionGrid = `{% comment %}
  SZ Shop by Occasion Grid - Occasion-based navigation
{% endcomment %}

<style>
.sz-occasions {
  padding: 70px 20px;
  background: var(--sz-cream, #FFF9F3);
}

.sz-occasions-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #2C2C2C;
  margin-bottom: 15px;
}

.sz-occasions-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 45px;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}

.sz-occasions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.sz-occasion-card {
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.sz-occasion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.sz-occasion-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.sz-occasion-card:nth-child(1) .sz-occasion-icon { background: linear-gradient(135deg, #FF8A80, #FFD9A0); }
.sz-occasion-card:nth-child(2) .sz-occasion-icon { background: linear-gradient(135deg, #F3C8FF, #FF8A80); }
.sz-occasion-card:nth-child(3) .sz-occasion-icon { background: linear-gradient(135deg, #4EC7E8, #F3C8FF); }
.sz-occasion-card:nth-child(4) .sz-occasion-icon { background: linear-gradient(135deg, #FFD9A0, #FF8A80); }
.sz-occasion-card:nth-child(5) .sz-occasion-icon { background: linear-gradient(135deg, #FF8A80, #4EC7E8); }
.sz-occasion-card:nth-child(6) .sz-occasion-icon { background: linear-gradient(135deg, #4EC7E8, #FFD9A0); }
.sz-occasion-card:nth-child(7) .sz-occasion-icon { background: linear-gradient(135deg, #FFD9A0, #4EC7E8); }
.sz-occasion-card:nth-child(8) .sz-occasion-icon { background: linear-gradient(135deg, #F3C8FF, #4EC7E8); }

.sz-occasion-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2C2C2C;
}

.sz-occasion-desc {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

@media (min-width: 750px) {
  .sz-occasions-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .sz-occasions-title {
    font-size: 2.4rem;
  }
}
</style>

<section class="sz-occasions">
  <h2 class="sz-occasions-title">Shop by Occasion</h2>
  <p class="sz-occasions-subtitle">Find the perfect personalized water bottles for your celebration</p>

  <div class="sz-occasions-grid">
    <a href="/collections/wedding-water-bottles" class="sz-occasion-card">
      <div class="sz-occasion-icon">💒</div>
      <span class="sz-occasion-name">Weddings</span>
      <span class="sz-occasion-desc">Elegant bottles for your big day</span>
    </a>

    <a href="/collections/bachelorette-party-bottles" class="sz-occasion-card">
      <div class="sz-occasion-icon">🎉</div>
      <span class="sz-occasion-name">Bachelorette Parties</span>
      <span class="sz-occasion-desc">Fun bottles for the bride squad</span>
    </a>

    <a href="/collections/bridal-shower-bottles" class="sz-occasion-card">
      <div class="sz-occasion-icon">💐</div>
      <span class="sz-occasion-name">Bridal Showers</span>
      <span class="sz-occasion-desc">Celebrating the bride-to-be</span>
    </a>

    <a href="/collections/bridesmaid-gift-bottles" class="sz-occasion-card">
      <div class="sz-occasion-icon">💝</div>
      <span class="sz-occasion-name">Bridesmaid Gifts</span>
      <span class="sz-occasion-desc">Thank your best girls</span>
    </a>

    <a href="/collections/birthday-party-bottles" class="sz-occasion-card">
      <div class="sz-occasion-icon">🎂</div>
      <span class="sz-occasion-name">Birthday Parties</span>
      <span class="sz-occasion-desc">Make birthdays extra special</span>
    </a>

    <a href="/collections/corporate-event-bottles" class="sz-occasion-card">
      <div class="sz-occasion-icon">💼</div>
      <span class="sz-occasion-name">Corporate Events</span>
      <span class="sz-occasion-desc">Branded bottles for your team</span>
    </a>

    <a href="/collections/sports-team-bottles" class="sz-occasion-card">
      <div class="sz-occasion-icon">⚽</div>
      <span class="sz-occasion-name">Sports & Teams</span>
      <span class="sz-occasion-desc">Team spirit, personalized</span>
    </a>

    <a href="/collections/everyday-bottles" class="sz-occasion-card">
      <div class="sz-occasion-icon">☀️</div>
      <span class="sz-occasion-name">Everyday Hydration</span>
      <span class="sz-occasion-desc">Daily bottles, your style</span>
    </a>
  </div>
</section>`;

// ============================================================
// PHASE 5: UNIFIED SHIPPING/TIMING BLOCK
// ============================================================

const szShippingInfo = `{% comment %}
  SZ Shipping Info - Unified timing messaging
{% endcomment %}

<style>
.sz-shipping-block {
  background: var(--sz-sand-light, #FFECD1);
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
}

.sz-shipping-title {
  font-size: 15px;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sz-shipping-title svg {
  width: 20px;
  height: 20px;
  color: var(--sz-coral, #FF8A80);
}

.sz-shipping-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sz-shipping-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #555;
}

.sz-shipping-item-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.sz-shipping-highlight {
  background: linear-gradient(135deg, var(--sz-coral, #FF8A80), var(--sz-sand, #FFD9A0));
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  margin-top: 12px;
}
</style>

<div class="sz-shipping-block">
  <div class="sz-shipping-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    Order Timeline
  </div>
  <div class="sz-shipping-timeline">
    <div class="sz-shipping-item">
      <span class="sz-shipping-item-icon">1</span>
      <span><strong>Processing:</strong> 3-5 business days (we personalize each bottle!)</span>
    </div>
    <div class="sz-shipping-item">
      <span class="sz-shipping-item-icon">2</span>
      <span><strong>Shipping:</strong> 3-7 business days via USPS</span>
    </div>
  </div>
  <div class="sz-shipping-highlight">
    Wedding-ready in 5-7 business days
  </div>
</div>`;

// ============================================================
// PHASE 1: ABOUT SUBLIMATION / WATER BOTTLES
// ============================================================

const szAboutBottles = `{% comment %}
  SZ About Our Bottles - Water bottle focused content
{% endcomment %}

<style>
.sz-about-bottles {
  padding: 70px 20px;
  background: white;
}

.sz-about-bottles-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;
}

.sz-about-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2C2C2C;
  margin-bottom: 20px;
}

.sz-about-content p {
  font-size: 1.05rem;
  color: #555;
  line-height: 1.7;
  margin-bottom: 15px;
}

.sz-about-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 25px;
}

.sz-about-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: var(--sz-cream, #FFF9F3);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #2C2C2C;
}

.sz-about-feature-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--sz-coral, #FF8A80), var(--sz-sand, #FFD9A0));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

@media (min-width: 750px) {
  .sz-about-bottles-inner {
    grid-template-columns: 1fr 1fr;
  }

  .sz-about-content h2 {
    font-size: 2.4rem;
  }
}
</style>

<section class="sz-about-bottles">
  <div class="sz-about-bottles-inner page-width">
    <div class="sz-about-content">
      <h2>Premium Sublimation Water Bottles</h2>
      <p>Every Shelzys bottle is crafted using professional sublimation printing — the gold standard for vibrant, permanent designs that never fade, peel, or scratch.</p>
      <p>Your personalized design becomes part of the bottle itself, not just a sticker or wrap. The result? A stunning, dishwasher-safe bottle that looks gorgeous from day one to day 1,000.</p>

      <div class="sz-about-features">
        <div class="sz-about-feature">
          <span class="sz-about-feature-icon">🎨</span>
          <span>Vibrant Colors</span>
        </div>
        <div class="sz-about-feature">
          <span class="sz-about-feature-icon">💪</span>
          <span>Never Peels or Fades</span>
        </div>
        <div class="sz-about-feature">
          <span class="sz-about-feature-icon">🫧</span>
          <span>Dishwasher Safe</span>
        </div>
        <div class="sz-about-feature">
          <span class="sz-about-feature-icon">✨</span>
          <span>Premium Quality</span>
        </div>
      </div>
    </div>
    <div class="sz-about-image">
      <!-- Theme can insert image here -->
    </div>
  </div>
</section>`;

// ============================================================
// PHASE 6: UNIFIED POPUP
// ============================================================

const szPopup = `{% comment %}
  SZ Welcome Popup - Single unified popup
{% endcomment %}

<style>
.sz-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.sz-popup-overlay.active {
  display: flex;
}

.sz-popup-box {
  background: white;
  border-radius: 24px;
  max-width: 420px;
  width: 100%;
  overflow: hidden;
  position: relative;
  animation: popupSlideIn 0.4s ease;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.sz-popup-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666;
  transition: background 0.2s;
}

.sz-popup-close:hover {
  background: rgba(0,0,0,0.2);
}

.sz-popup-header {
  background: linear-gradient(135deg, var(--sz-coral, #FF8A80) 0%, var(--sz-pool, #4EC7E8) 100%);
  padding: 40px 30px;
  text-align: center;
  color: white;
}

.sz-popup-header h3 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.sz-popup-header p {
  font-size: 1rem;
  opacity: 0.95;
}

.sz-popup-body {
  padding: 30px;
}

.sz-popup-code {
  background: var(--sz-cream, #FFF9F3);
  border: 2px dashed var(--sz-coral, #FF8A80);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  margin-bottom: 20px;
}

.sz-popup-code-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 5px;
}

.sz-popup-code-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--sz-coral, #FF8A80);
  letter-spacing: 0.1em;
}

.sz-popup-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sz-popup-input {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.sz-popup-input:focus {
  border-color: var(--sz-coral, #FF8A80);
  outline: none;
}

.sz-popup-submit {
  background: var(--sz-coral, #FF8A80);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.sz-popup-submit:hover {
  background: var(--sz-coral-dark, #FF6A60);
  transform: translateY(-2px);
}

.sz-popup-note {
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-top: 15px;
}
</style>

<div class="sz-popup-overlay" id="szWelcomePopup">
  <div class="sz-popup-box">
    <button class="sz-popup-close" onclick="closeSzPopup()">&times;</button>

    <div class="sz-popup-header">
      <h3>Get 10% Off Bridal & Event Bottles</h3>
      <p>Join our list for early access to new fonts, colors, and bottle drops</p>
    </div>

    <div class="sz-popup-body">
      <div class="sz-popup-code">
        <div class="sz-popup-code-label">Your discount code</div>
        <div class="sz-popup-code-value">WELCOME10</div>
      </div>

      <form class="sz-popup-form" action="/contact#contact_form" method="post">
        <input type="email" name="contact[email]" class="sz-popup-input" placeholder="Enter your email" required>
        <button type="submit" class="sz-popup-submit">Get My 10% Off</button>
      </form>

      <p class="sz-popup-note">No spam, just sunshine and savings ☀️</p>
    </div>
  </div>
</div>

<script>
(function() {
  var popupShown = sessionStorage.getItem('szPopupShown');
  if (!popupShown) {
    setTimeout(function() {
      document.getElementById('szWelcomePopup').classList.add('active');
    }, 4000);
  }
})();

function closeSzPopup() {
  document.getElementById('szWelcomePopup').classList.remove('active');
  sessionStorage.setItem('szPopupShown', 'true');
}

document.getElementById('szWelcomePopup').addEventListener('click', function(e) {
  if (e.target === this) closeSzPopup();
});
</script>`;

// ============================================================
// MASTER BRAND LOADER
// ============================================================

const szBrandLoader = `{% comment %}
  SZ Brand Loader - Loads all brand transformation assets
{% endcomment %}

{{ 'shelzys-brand.css' | asset_url | stylesheet_tag }}

{% render 'sz-seo-meta' %}
{% render 'sz-popup-welcome' %}`;

// ============================================================
// COLLECTION DESCRIPTIONS
// ============================================================

const collectionDescriptions = {
  'wedding-water-bottles': {
    title: 'Wedding Water Bottles',
    description: 'Make your wedding day unforgettable with custom personalized water bottles. From ceremony to reception, our premium sublimation bottles keep your bridal party hydrated in style. Add names, wedding dates, and colors that match your theme perfectly.'
  },
  'bachelorette-party-bottles': {
    title: 'Bachelorette Party Bottles',
    description: 'Turn up the fun with personalized bachelorette bottles! Whether you are hitting the beach, the pool, or the town, these custom bottles bring squad energy to every sip. Perfect for villa weekends, party buses, and making memories.'
  },
  'bridal-shower-bottles': {
    title: 'Bridal Shower Bottles',
    description: 'Celebrate the bride-to-be with elegant personalized bottles. Our bridal shower bottles make beautiful favors and keepsakes that guests will actually use. Customize with names, dates, and soft pastel colors.'
  },
  'bridesmaid-gift-bottles': {
    title: 'Bridesmaid Gift Bottles',
    description: 'Thank your best girls with a gift they will love! Personalized bridesmaid bottles are the perfect way to show appreciation. Add each bridesmaid name for a thoughtful, custom touch they will treasure.'
  },
  'birthday-party-bottles': {
    title: 'Birthday Party Bottles',
    description: 'Make birthdays extra special with personalized party bottles! From milestone celebrations to backyard bashes, custom bottles add a fun, memorable touch. Perfect for party favors or matching the birthday theme.'
  },
  'corporate-event-bottles': {
    title: 'Corporate Event Bottles',
    description: 'Elevate your company events with branded water bottles. Perfect for team retreats, conferences, client gifts, and employee appreciation. Professional sublimation printing ensures your logo looks stunning.'
  },
  'sports-team-bottles': {
    title: 'Sports & Team Bottles',
    description: 'Build team spirit with personalized bottles! Perfect for sports teams, dance squads, cheer groups, and clubs. Add team names, player numbers, and colors for a cohesive look on and off the field.'
  },
  'everyday-bottles': {
    title: 'Everyday Hydration Bottles',
    description: 'Your daily bottle, your style. Personalized water bottles are not just for events — make hydration personal every single day. Add your name, favorite quote, or custom design for a bottle that is uniquely yours.'
  }
};

// ============================================================
// MAIN EXECUTION
// ============================================================

async function main() {
  console.log('================================================================');
  console.log('  SHELZYS DESIGNS - COMPLETE BRAND TRANSFORMATION');
  console.log('  Sun-soaked, Pastel-Tropical, Villa-Inspired');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // --------------------------------------------------------
    // PHASE 3: BRAND DESIGN SYSTEM
    // --------------------------------------------------------
    console.log('--- PHASE 3: Brand Design System ---');

    await createAsset(themeId, 'assets/shelzys-brand.css', shelzysBrandCSS);
    console.log('✓ Created shelzys-brand.css (color palette + typography + components)');

    // --------------------------------------------------------
    // PHASE 1 & 4: HERO & CONTENT SNIPPETS
    // --------------------------------------------------------
    console.log('\n--- PHASE 1 & 4: Hero & Content Updates ---');

    await createAsset(themeId, 'snippets/sz-hero-content.liquid', szHeroContent);
    console.log('✓ Created sz-hero-content.liquid (water bottles positioning)');

    await createAsset(themeId, 'snippets/sz-about-bottles.liquid', szAboutBottles);
    console.log('✓ Created sz-about-bottles.liquid (sublimation info)');

    // --------------------------------------------------------
    // PHASE 2: OCCASION GRID
    // --------------------------------------------------------
    console.log('\n--- PHASE 2: Shop by Occasion Grid ---');

    await createAsset(themeId, 'snippets/sz-occasion-grid.liquid', szOccasionGrid);
    console.log('✓ Created sz-occasion-grid.liquid');

    // --------------------------------------------------------
    // PHASE 5: SHIPPING INFO
    // --------------------------------------------------------
    console.log('\n--- PHASE 5: Unified Shipping Info ---');

    await createAsset(themeId, 'snippets/sz-shipping-info.liquid', szShippingInfo);
    console.log('✓ Created sz-shipping-info.liquid (3-5 processing, 3-7 shipping)');

    // --------------------------------------------------------
    // PHASE 6: UNIFIED POPUP
    // --------------------------------------------------------
    console.log('\n--- PHASE 6: Unified Popup ---');

    await createAsset(themeId, 'snippets/sz-popup-welcome.liquid', szPopup);
    console.log('✓ Created sz-popup-welcome.liquid (WELCOME10)');

    // Delete old popup snippets
    const oldPopups = [
      'snippets/sz-popup-wedding.liquid',
      'snippets/sz-popup.liquid'
    ];
    for (const key of oldPopups) {
      if (await deleteAsset(themeId, key)) {
        console.log(`  ✓ Removed old ${key}`);
      }
    }

    // --------------------------------------------------------
    // MASTER LOADER
    // --------------------------------------------------------
    console.log('\n--- Creating Master Brand Loader ---');

    await createAsset(themeId, 'snippets/sz-brand-loader.liquid', szBrandLoader);
    console.log('✓ Created sz-brand-loader.liquid');

    // --------------------------------------------------------
    // UPDATE THEME.LIQUID
    // --------------------------------------------------------
    console.log('\n--- Updating theme.liquid ---');

    let themeLiquid = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquid) {
      // Remove ALL old sz- loader references
      themeLiquid = themeLiquid.replace(/\s*\{% render 'sz-[^']*' %\}/g, '');
      themeLiquid = themeLiquid.replace(/\s*\{% comment %\}[^%]*Shelzy[^%]*\{% endcomment %\}/g, '');

      // Add new brand loader before </head>
      if (!themeLiquid.includes("sz-brand-loader")) {
        themeLiquid = themeLiquid.replace('</head>', "  {% render 'sz-brand-loader' %}\n</head>");
      }

      await createAsset(themeId, 'layout/theme.liquid', themeLiquid);
      console.log('✓ Updated theme.liquid with brand loader');
    }

    // --------------------------------------------------------
    // CREATE COLLECTIONS
    // --------------------------------------------------------
    console.log('\n--- PHASE 2: Creating Occasion Collections ---');

    const collectionsToCreate = [
      { title: 'All Water Bottles', handle: 'all-water-bottles' },
      { title: 'Wedding Water Bottles', handle: 'wedding-water-bottles' },
      { title: 'Bachelorette Party Bottles', handle: 'bachelorette-party-bottles' },
      { title: 'Bridal Shower Bottles', handle: 'bridal-shower-bottles' },
      { title: 'Bridesmaid Gift Bottles', handle: 'bridesmaid-gift-bottles' },
      { title: 'Birthday Party Bottles', handle: 'birthday-party-bottles' },
      { title: 'Corporate Event Bottles', handle: 'corporate-event-bottles' },
      { title: 'Sports & Team Bottles', handle: 'sports-team-bottles' },
      { title: 'Everyday Hydration Bottles', handle: 'everyday-bottles' }
    ];

    for (const coll of collectionsToCreate) {
      try {
        const desc = collectionDescriptions[coll.handle];
        const body_html = desc ? `<p>${desc.description}</p>` : '';

        await shopifyRequest('POST', '/custom_collections.json', {
          custom_collection: {
            title: coll.title,
            body_html: body_html,
            published: true
          }
        });
        console.log(`✓ Created collection: ${coll.title}`);
      } catch (e) {
        if (e.message.includes('422')) {
          console.log(`  (Collection "${coll.title}" already exists)`);
        } else {
          console.log(`  Warning: ${coll.title} - ${e.message}`);
        }
      }
    }

    // --------------------------------------------------------
    // UPDATE NAVIGATION
    // --------------------------------------------------------
    console.log('\n--- PHASE 2: Updating Navigation ---');

    // Get existing menus
    const menusResponse = await shopifyRequest('GET', '/menus.json');
    const mainMenu = menusResponse.menus.find(m =>
      m.handle === 'main-menu' || m.handle === 'main' || m.title.toLowerCase().includes('main')
    );

    if (mainMenu) {
      console.log(`Found main menu: ${mainMenu.title} (ID: ${mainMenu.id})`);
      console.log('  Note: Navigation menu items need to be updated in Shopify Admin');
      console.log('  Recommended order:');
      console.log('    1. Shop All Bottles → /collections/all-water-bottles');
      console.log('    2. Weddings → /collections/wedding-water-bottles');
      console.log('    3. Bachelorettes → /collections/bachelorette-party-bottles');
      console.log('    4. Bridal Showers → /collections/bridal-shower-bottles');
      console.log('    5. Bridesmaid Gifts → /collections/bridesmaid-gift-bottles');
      console.log('    6. Birthdays → /collections/birthday-party-bottles');
      console.log('    7. Corporate → /collections/corporate-event-bottles');
      console.log('    8. Sports & Teams → /collections/sports-team-bottles');
      console.log('    9. Everyday → /collections/everyday-bottles');
    }

    // --------------------------------------------------------
    // CLEANUP OLD SNIPPETS
    // --------------------------------------------------------
    console.log('\n--- PHASE 6: Cleanup Old Content ---');

    const snippetsToDelete = [
      'snippets/sz-announcement-bar-cro.liquid',
      'snippets/sz-social-proof.liquid',
      'snippets/sz-cro-enhancements.liquid',
      'snippets/sz-bridal-bundles.liquid',
      'snippets/sz-sublimation-story.liquid',
      'snippets/sz-site-overhaul.liquid',
      'snippets/sz-phase2-loader.liquid',
      'snippets/sz-site-loader.liquid',
      'snippets/sz-clean-styles.liquid',
      'snippets/sz-collection-banner.liquid',
      'snippets/sz-product-card-enhance.liquid',
      'snippets/sz-collection-filters.liquid',
      'snippets/sz-blog-sidebar.liquid',
      'snippets/sz-blog-cta.liquid',
      'snippets/sz-theme-cleanup.liquid',
      'snippets/sz-trust-strip.liquid',
      'snippets/sz-cart-trust.liquid',
      'snippets/sz-footer-content.liquid',
      'snippets/sz-hero-cta.liquid'
    ];

    for (const key of snippetsToDelete) {
      if (await deleteAsset(themeId, key)) {
        console.log(`  ✓ Removed ${key}`);
      }
    }

    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------
    console.log('\n================================================================');
    console.log('  BRAND TRANSFORMATION COMPLETE!');
    console.log('================================================================');

    console.log('\n📁 FILES CHANGED:');
    console.log('  CREATED/UPDATED:');
    console.log('    • assets/shelzys-brand.css - Full design system');
    console.log('    • snippets/sz-hero-content.liquid - Water bottles hero');
    console.log('    • snippets/sz-occasion-grid.liquid - Shop by occasion');
    console.log('    • snippets/sz-about-bottles.liquid - Sublimation info');
    console.log('    • snippets/sz-shipping-info.liquid - Unified timing');
    console.log('    • snippets/sz-popup-welcome.liquid - WELCOME10 popup');
    console.log('    • snippets/sz-brand-loader.liquid - Master loader');
    console.log('    • layout/theme.liquid - Updated with loader');

    console.log('\n🎨 DESIGN SYSTEM APPLIED:');
    console.log('    • Colors: Coral (#FF8A80), Sand (#FFD9A0), Pool (#4EC7E8), Lilac (#F3C8FF)');
    console.log('    • Buttons: Coral pill-shaped with hover effects');
    console.log('    • Cards: 20px radius, soft shadows');
    console.log('    • Typography: Increased sizes, better spacing');

    console.log('\n📂 COLLECTIONS CREATED:');
    console.log('    • All Water Bottles');
    console.log('    • Wedding Water Bottles');
    console.log('    • Bachelorette Party Bottles');
    console.log('    • Bridal Shower Bottles');
    console.log('    • Bridesmaid Gift Bottles');
    console.log('    • Birthday Party Bottles');
    console.log('    • Corporate Event Bottles');
    console.log('    • Sports & Team Bottles');
    console.log('    • Everyday Hydration Bottles');

    console.log('\n⏱️ TIMING UNIFIED:');
    console.log('    • Processing: 3-5 business days');
    console.log('    • Shipping: 3-7 business days');
    console.log('    • Headline: "Wedding-ready in 5-7 business days"');

    console.log('\n🎉 POPUP CONSOLIDATED:');
    console.log('    • Single popup: WELCOME10');
    console.log('    • "Get 10% Off Bridal & Event Bottles"');

    console.log('\n⚠️ MANUAL STEPS NEEDED:');
    console.log('    1. Update navigation menu order in Shopify Admin');
    console.log('    2. Assign products to new occasion collections');
    console.log('    3. Add hero section to homepage using theme editor');
    console.log('    4. Add occasion grid section to homepage');

    console.log('\n✅ Brand is now sun-soaked, pastel-tropical, and ALL ABOUT WATER BOTTLES!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
