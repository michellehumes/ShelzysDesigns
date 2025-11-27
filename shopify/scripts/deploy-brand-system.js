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

async function getAsset(themeId, key) {
  try {
    const response = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return response.asset ? response.asset.value : null;
  } catch (e) {
    return null;
  }
}

async function createAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value }
  });
}

// ============================================================================
// BRAND CSS - Complete Design System
// ============================================================================
const brandCSS = `/*
 * Shelzy's Designs - Brand Design System
 * Luxury personalized water bottle brand
 * ============================================
 */

/* ============================================
   1. CSS VARIABLES / DESIGN TOKENS
   ============================================ */
:root {
  /* Primary Colors */
  --sz-sage: #A6B8A0;
  --sz-sage-dark: #8FA589;
  --sz-sage-light: #C4D4BE;

  /* Secondary Colors */
  --sz-beige: #F7F3EC;
  --sz-beige-dark: #EDE7DB;

  /* Neutrals */
  --sz-white: #FFFFFF;
  --sz-black: #111111;
  --sz-gray-dark: #333333;
  --sz-gray: #666666;
  --sz-gray-light: #999999;
  --sz-gray-lighter: #E5E5E5;

  /* Accent */
  --sz-blush: #FBEDEA;
  --sz-blush-dark: #F5DDD7;

  /* Typography */
  --sz-font-heading: 'Playfair Display', Georgia, serif;
  --sz-font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Font Sizes - Desktop */
  --sz-h1-size: 38px;
  --sz-h2-size: 28px;
  --sz-h3-size: 22px;
  --sz-h4-size: 18px;
  --sz-body-size: 17px;
  --sz-small-size: 14px;

  /* Font Weights */
  --sz-weight-normal: 400;
  --sz-weight-medium: 500;
  --sz-weight-semibold: 600;
  --sz-weight-bold: 700;

  /* Spacing */
  --sz-section-padding: 80px;
  --sz-section-padding-mobile: 48px;
  --sz-container-width: 1200px;
  --sz-gap-lg: 48px;
  --sz-gap-md: 32px;
  --sz-gap-sm: 16px;

  /* Border Radius */
  --sz-radius-pill: 999px;
  --sz-radius-lg: 20px;
  --sz-radius-md: 12px;
  --sz-radius-sm: 8px;

  /* Shadows */
  --sz-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --sz-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --sz-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.10);
  --sz-shadow-hover: 0 8px 24px rgba(166, 184, 160, 0.25);

  /* Transitions */
  --sz-transition: 0.25s ease;
  --sz-transition-fast: 0.15s ease;
}

/* ============================================
   2. TYPOGRAPHY
   ============================================ */

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

/* Base Typography */
body {
  font-family: var(--sz-font-body);
  font-size: var(--sz-body-size);
  font-weight: var(--sz-weight-normal);
  line-height: 1.6;
  color: var(--sz-black);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Headings */
h1, .h1,
h2, .h2,
h3, .h3,
h4, .h4,
h5, .h5,
h6, .h6 {
  font-family: var(--sz-font-heading);
  font-weight: var(--sz-weight-semibold);
  line-height: 1.25;
  color: var(--sz-black);
  margin-bottom: 0.5em;
  letter-spacing: -0.01em;
}

h1, .h1 {
  font-size: var(--sz-h1-size);
}

h2, .h2 {
  font-size: var(--sz-h2-size);
}

h3, .h3 {
  font-size: var(--sz-h3-size);
}

h4, .h4 {
  font-size: var(--sz-h4-size);
}

/* Section Headers */
.section-header__title,
.collection__title,
.page-header__title,
.article__title,
.product-single__title {
  font-family: var(--sz-font-heading) !important;
  font-weight: var(--sz-weight-semibold) !important;
  letter-spacing: -0.01em !important;
}

/* Body Text */
p {
  margin-bottom: 1em;
  color: var(--sz-gray-dark);
}

/* Links */
a {
  color: var(--sz-sage);
  text-decoration: none;
  transition: color var(--sz-transition-fast);
}

a:hover {
  color: var(--sz-sage-dark);
}

/* Mobile Typography */
@media (max-width: 749px) {
  :root {
    --sz-h1-size: 28px;
    --sz-h2-size: 22px;
    --sz-h3-size: 18px;
    --sz-h4-size: 16px;
    --sz-body-size: 16px;
  }
}

/* ============================================
   3. BUTTONS
   ============================================ */

/* Primary Button */
.btn,
.button,
button[type="submit"],
input[type="submit"],
.shopify-payment-button button,
.product-form__cart-submit,
.cart__submit,
.btn--primary,
a.btn,
.spr-button,
.spr-button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--sz-font-body) !important;
  font-size: 14px !important;
  font-weight: var(--sz-weight-semibold) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  background: var(--sz-sage) !important;
  color: var(--sz-white) !important;
  border: none !important;
  border-radius: var(--sz-radius-pill) !important;
  padding: 14px 32px !important;
  cursor: pointer;
  transition: all var(--sz-transition) !important;
  text-decoration: none !important;
  box-shadow: var(--sz-shadow-sm);
  min-height: 48px;
}

.btn:hover,
.button:hover,
button[type="submit"]:hover,
input[type="submit"]:hover,
.shopify-payment-button button:hover,
.product-form__cart-submit:hover,
.cart__submit:hover,
.btn--primary:hover,
a.btn:hover {
  background: var(--sz-sage-dark) !important;
  color: var(--sz-white) !important;
  transform: translateY(-2px);
  box-shadow: var(--sz-shadow-hover) !important;
}

.btn:active,
.button:active,
button[type="submit"]:active {
  transform: translateY(0);
}

/* Secondary Button */
.btn--secondary,
.btn--outline,
.button--secondary {
  background: var(--sz-white) !important;
  color: var(--sz-sage) !important;
  border: 2px solid var(--sz-sage) !important;
}

.btn--secondary:hover,
.btn--outline:hover,
.button--secondary:hover {
  background: var(--sz-sage) !important;
  color: var(--sz-white) !important;
  border-color: var(--sz-sage) !important;
}

/* Small Button */
.btn--small,
.button--small {
  padding: 10px 20px !important;
  font-size: 12px !important;
  min-height: 40px;
}

/* Disabled State */
.btn:disabled,
.btn[disabled],
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* ============================================
   4. LAYOUT & SPACING
   ============================================ */

/* Container */
.page-width,
.container,
.wrapper {
  max-width: var(--sz-container-width);
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

@media (min-width: 750px) {
  .page-width,
  .container,
  .wrapper {
    padding-left: 40px;
    padding-right: 40px;
  }
}

/* Section Spacing */
.shopify-section,
.index-section,
section {
  padding-top: var(--sz-section-padding);
  padding-bottom: var(--sz-section-padding);
}

@media (max-width: 749px) {
  .shopify-section,
  .index-section,
  section {
    padding-top: var(--sz-section-padding-mobile);
    padding-bottom: var(--sz-section-padding-mobile);
  }
}

/* Section Header Spacing */
.section-header {
  margin-bottom: var(--sz-gap-lg);
  text-align: center;
}

.section-header__title {
  margin-bottom: 16px;
}

.section-header__link {
  margin-top: 24px;
}

/* ============================================
   5. BACKGROUNDS
   ============================================ */

body {
  background-color: var(--sz-white);
}

/* Alternate section backgrounds */
.section--beige,
.index-section:nth-child(even) {
  background-color: var(--sz-beige);
}

.section--blush {
  background-color: var(--sz-blush);
}

.section--white {
  background-color: var(--sz-white);
}

/* ============================================
   6. CARDS & PRODUCT GRID
   ============================================ */

/* Product Cards */
.product-card,
.grid-product,
.collection-grid-item {
  background: var(--sz-white);
  border-radius: var(--sz-radius-lg);
  overflow: hidden;
  transition: all var(--sz-transition);
  box-shadow: var(--sz-shadow-sm);
}

.product-card:hover,
.grid-product:hover,
.collection-grid-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--sz-shadow-lg);
}

/* Product Card Image */
.product-card__image-wrapper,
.grid-product__image-wrapper {
  background: var(--sz-beige);
  aspect-ratio: 1;
  overflow: hidden;
}

.product-card__image,
.grid-product__image {
  transition: transform 0.4s ease;
}

.product-card:hover .product-card__image,
.grid-product:hover .grid-product__image {
  transform: scale(1.05);
}

/* Product Card Content */
.product-card__info,
.grid-product__meta {
  padding: 20px;
  text-align: center;
}

.product-card__title,
.grid-product__title {
  font-family: var(--sz-font-heading);
  font-size: 16px;
  font-weight: var(--sz-weight-medium);
  color: var(--sz-black);
  margin-bottom: 8px;
}

.product-card__price,
.grid-product__price {
  font-family: var(--sz-font-body);
  font-size: 15px;
  font-weight: var(--sz-weight-semibold);
  color: var(--sz-sage);
}

/* ============================================
   7. FORMS & INPUTS
   ============================================ */

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"],
input[type="number"],
input[type="search"],
textarea,
select {
  font-family: var(--sz-font-body);
  font-size: 16px;
  color: var(--sz-black);
  background: var(--sz-white);
  border: 1px solid var(--sz-gray-lighter);
  border-radius: var(--sz-radius-md);
  padding: 14px 18px;
  width: 100%;
  transition: border-color var(--sz-transition-fast), box-shadow var(--sz-transition-fast);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--sz-sage);
  box-shadow: 0 0 0 3px rgba(166, 184, 160, 0.15);
}

input::placeholder,
textarea::placeholder {
  color: var(--sz-gray-light);
}

label {
  display: block;
  font-size: 14px;
  font-weight: var(--sz-weight-medium);
  color: var(--sz-gray-dark);
  margin-bottom: 8px;
}

/* ============================================
   8. HEADER & NAVIGATION
   ============================================ */

.site-header {
  background: var(--sz-white);
  border-bottom: 1px solid var(--sz-gray-lighter);
}

.site-nav__link,
.mobile-nav__link {
  font-family: var(--sz-font-body);
  font-size: 14px;
  font-weight: var(--sz-weight-medium);
  color: var(--sz-black);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color var(--sz-transition-fast);
}

.site-nav__link:hover,
.mobile-nav__link:hover {
  color: var(--sz-sage);
}

/* ============================================
   9. FOOTER
   ============================================ */

.site-footer {
  background: var(--sz-black);
  color: var(--sz-white);
  padding: 64px 0 32px;
}

.site-footer a {
  color: rgba(255, 255, 255, 0.8);
}

.site-footer a:hover {
  color: var(--sz-white);
}

.site-footer h4,
.footer__title {
  font-family: var(--sz-font-heading);
  font-size: 16px;
  font-weight: var(--sz-weight-semibold);
  color: var(--sz-white);
  margin-bottom: 20px;
}

/* ============================================
   10. PRODUCT PAGE
   ============================================ */

.product-single__title {
  font-size: 32px;
  margin-bottom: 16px;
}

.product-single__price {
  font-size: 24px;
  font-weight: var(--sz-weight-semibold);
  color: var(--sz-sage);
  margin-bottom: 24px;
}

.product-single__description {
  color: var(--sz-gray);
  line-height: 1.7;
  margin-bottom: 32px;
}

/* Product Form */
.product-form {
  margin-top: 32px;
}

.product-form__item {
  margin-bottom: 20px;
}

/* ============================================
   11. COLLECTION PAGE
   ============================================ */

.collection-hero {
  background: var(--sz-beige);
  padding: 48px 0;
  text-align: center;
  margin-bottom: 48px;
}

.collection-hero__title {
  font-size: 36px;
  margin-bottom: 12px;
}

.collection-hero__description {
  font-size: 17px;
  color: var(--sz-gray);
  max-width: 640px;
  margin: 0 auto;
}

/* Collection Grid */
.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

/* ============================================
   12. BLOG
   ============================================ */

.article-card {
  background: var(--sz-white);
  border-radius: var(--sz-radius-lg);
  overflow: hidden;
  box-shadow: var(--sz-shadow-sm);
  transition: all var(--sz-transition);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--sz-shadow-lg);
}

.article-card__title {
  font-family: var(--sz-font-heading);
  font-size: 20px;
  font-weight: var(--sz-weight-medium);
}

.article-card__excerpt {
  color: var(--sz-gray);
  font-size: 15px;
  line-height: 1.6;
}

/* ============================================
   13. ANNOUNCEMENT BAR
   ============================================ */

.announcement-bar {
  background: var(--sz-sage) !important;
  color: var(--sz-white) !important;
  font-size: 13px;
  font-weight: var(--sz-weight-medium);
  letter-spacing: 0.03em;
  padding: 10px 16px;
  text-align: center;
}

.announcement-bar a {
  color: var(--sz-white);
  text-decoration: underline;
}

/* ============================================
   14. CART
   ============================================ */

.cart__row {
  padding: 24px 0;
  border-bottom: 1px solid var(--sz-gray-lighter);
}

.cart__product-title {
  font-family: var(--sz-font-heading);
  font-weight: var(--sz-weight-medium);
}

.cart__price {
  font-weight: var(--sz-weight-semibold);
  color: var(--sz-sage);
}

/* ============================================
   15. UTILITY CLASSES
   ============================================ */

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mt-4 { margin-top: 32px; }
.mt-5 { margin-top: 48px; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 8px; }
.mb-2 { margin-bottom: 16px; }
.mb-3 { margin-bottom: 24px; }
.mb-4 { margin-bottom: 32px; }
.mb-5 { margin-bottom: 48px; }

.py-1 { padding-top: 8px; padding-bottom: 8px; }
.py-2 { padding-top: 16px; padding-bottom: 16px; }
.py-3 { padding-top: 24px; padding-bottom: 24px; }
.py-4 { padding-top: 32px; padding-bottom: 32px; }
.py-5 { padding-top: 48px; padding-bottom: 48px; }

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* ============================================
   16. ANIMATIONS
   ============================================ */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.animate-slide-up {
  animation: slideUp 0.5s ease forwards;
}

/* ============================================
   17. PRINT STYLES
   ============================================ */

@media print {
  .site-header,
  .site-footer,
  .announcement-bar,
  .btn {
    display: none !important;
  }

  body {
    font-size: 12pt;
    color: #000;
  }
}
`;

// ============================================================================
// LIQUID SNIPPET FOR THEME INTEGRATION
// ============================================================================
const brandSnippet = `{% comment %}
  Shelzy's Brand Design System
  This snippet loads the brand CSS and applies consistent styling
{% endcomment %}

{{ 'shelzys-brand.css' | asset_url | stylesheet_tag }}
`;

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================
async function main() {
  console.log('================================================================');
  console.log('  DEPLOYING BRAND DESIGN SYSTEM');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // 1. Create the CSS asset
    console.log('--- Creating Brand CSS ---\n');
    await createAsset(themeId, 'assets/shelzys-brand.css', brandCSS);
    console.log('✓ Created assets/shelzys-brand.css');

    // 2. Create the snippet
    await createAsset(themeId, 'snippets/sz-brand-system.liquid', brandSnippet);
    console.log('✓ Created snippets/sz-brand-system.liquid');

    // 3. Inject into theme.liquid
    console.log('\n--- Injecting into theme.liquid ---\n');

    const themeLiquid = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquid) {
      let updated = themeLiquid;

      // Remove old brand color snippet if present
      updated = updated.replace(/\s*{%\s*render\s*['"]sz-brand-colors['"]\s*%}/g, '');

      // Add brand system if not present
      if (!updated.includes('sz-brand-system')) {
        updated = updated.replace('</head>', "{% render 'sz-brand-system' %}\n</head>");
        await createAsset(themeId, 'layout/theme.liquid', updated);
        console.log('✓ Added brand system to theme.liquid');
      } else {
        console.log('• Brand system already in theme.liquid');
      }
    }

    // 4. Update theme settings (colors)
    console.log('\n--- Updating Theme Settings ---\n');

    const settingsData = await getAsset(themeId, 'config/settings_data.json');
    if (settingsData) {
      let settings = JSON.parse(settingsData);
      const current = settings.current || {};

      // Update color settings
      const colorUpdates = {
        'color_primary': '#A6B8A0',
        'color_secondary': '#F7F3EC',
        'color_body_bg': '#FFFFFF',
        'color_body_text': '#111111',
        'color_button': '#A6B8A0',
        'color_button_text': '#FFFFFF',
        'color_sale': '#A6B8A0',
        'color_header': '#FFFFFF',
        'color_header_text': '#111111',
        'color_footer_bg': '#111111',
        'color_footer_text': '#FFFFFF',
        // Impulse theme specific
        'colorBtnPrimary': '#A6B8A0',
        'colorBtnPrimaryText': '#FFFFFF',
        'colorTextBody': '#111111',
        'colorBody': '#FFFFFF',
        'colorPrice': '#A6B8A0'
      };

      let settingsUpdated = false;
      for (const [key, value] of Object.entries(colorUpdates)) {
        if (current[key] !== undefined || current.hasOwnProperty(key)) {
          current[key] = value;
          settingsUpdated = true;
        }
      }

      // Update font settings if available
      const fontUpdates = {
        'type_header_font': 'Playfair Display',
        'type_base_font': 'Inter',
        'typeHeaderPrimary': 'Playfair Display',
        'typeBodyPrimary': 'Inter'
      };

      for (const [key, value] of Object.entries(fontUpdates)) {
        if (current[key] !== undefined) {
          current[key] = value;
          settingsUpdated = true;
        }
      }

      if (settingsUpdated) {
        settings.current = current;
        await createAsset(themeId, 'config/settings_data.json', JSON.stringify(settings, null, 2));
        console.log('✓ Updated theme color settings');
      } else {
        console.log('• No theme settings to update');
      }
    }

    // Summary
    console.log('\n================================================================');
    console.log('  BRAND DESIGN SYSTEM DEPLOYED!');
    console.log('================================================================');
    console.log('\n📦 FILES CREATED:');
    console.log('  • assets/shelzys-brand.css - Complete CSS design system');
    console.log('  • snippets/sz-brand-system.liquid - Theme integration snippet');

    console.log('\n🎨 DESIGN TOKENS APPLIED:');
    console.log('  • Primary: Sage Green (#A6B8A0)');
    console.log('  • Secondary: Warm Beige (#F7F3EC)');
    console.log('  • Background: White (#FFFFFF)');
    console.log('  • Text: Near-Black (#111111)');
    console.log('  • Accent: Soft Blush (#FBEDEA)');

    console.log('\n📝 TYPOGRAPHY:');
    console.log('  • Headings: Playfair Display (serif)');
    console.log('  • Body: Inter (sans-serif)');

    console.log('\n🔘 BUTTONS:');
    console.log('  • Primary: Sage bg, white text, pill-style');
    console.log('  • Secondary: White bg, sage border');

    console.log('\n✅ Refresh your store to see the changes!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
