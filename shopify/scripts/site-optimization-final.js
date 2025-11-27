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
    return response.asset ? response.asset.value : null;
  } catch (e) {
    return null;
  }
}

// ============================================================================
// 1. TRUST BADGES SNIPPET (Below Add to Cart)
// ============================================================================
const trustBadgesSnippet = `{% comment %}
  Shelzy's Trust Badges - Display below Add to Cart button
  Include with: {% render 'sz-trust-badges-atc' %}
{% endcomment %}

<div class="sz-trust-badges-atc">
  <div class="sz-trust-item">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
    <span>Permanent Sublimation Print</span>
  </div>
  <div class="sz-trust-item">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
    <span>Dishwasher Safe</span>
  </div>
  <div class="sz-trust-item">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
    <span>Free Shipping Over $75</span>
  </div>
  <div class="sz-trust-item">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
    <span>100% Satisfaction Guarantee</span>
  </div>
</div>

<style>
.sz-trust-badges-atc {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
  padding: 20px;
  background: var(--sz-cream, #FFF9F3);
  border-radius: 16px;
}

.sz-trust-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #2C2C2C;
  font-weight: 500;
}

.sz-trust-item svg {
  color: var(--sz-coral, #FF8A80);
  flex-shrink: 0;
}

@media (max-width: 749px) {
  .sz-trust-badges-atc {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 16px;
  }
}
</style>`;

// ============================================================================
// 2. FREE SHIPPING PROGRESS BAR
// ============================================================================
const freeShippingBar = `{% comment %}
  Shelzy's Free Shipping Progress Bar
  Include in cart with: {% render 'sz-shipping-progress' %}
{% endcomment %}

{% assign free_shipping_threshold = 7500 %}
{% assign cart_total = cart.total_price %}
{% assign amount_remaining = free_shipping_threshold | minus: cart_total %}
{% assign progress_percent = cart_total | times: 100 | divided_by: free_shipping_threshold %}
{% if progress_percent > 100 %}{% assign progress_percent = 100 %}{% endif %}

<div class="sz-shipping-progress">
  {% if amount_remaining > 0 %}
    <p class="sz-shipping-message">
      <span class="sz-shipping-icon">🚚</span>
      You're <strong>{{ amount_remaining | money }}</strong> away from FREE shipping!
    </p>
  {% else %}
    <p class="sz-shipping-message sz-shipping-success">
      <span class="sz-shipping-icon">🎉</span>
      <strong>Congrats!</strong> You've unlocked FREE shipping!
    </p>
  {% endif %}

  <div class="sz-progress-track">
    <div class="sz-progress-fill" style="width: {{ progress_percent }}%;"></div>
  </div>

  <div class="sz-progress-labels">
    <span>$0</span>
    <span>Free Shipping at $75</span>
  </div>
</div>

<style>
.sz-shipping-progress {
  background: linear-gradient(135deg, #FFF9F3 0%, #FFF5EB 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.sz-shipping-message {
  font-size: 15px;
  color: #2C2C2C;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sz-shipping-success {
  color: #2E7D32;
}

.sz-progress-track {
  height: 10px;
  background: #E0E0E0;
  border-radius: 10px;
  overflow: hidden;
}

.sz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sz-coral, #FF8A80), var(--sz-pool, #4EC7E8));
  border-radius: 10px;
  transition: width 0.5s ease;
}

.sz-progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 8px;
}
</style>`;

// ============================================================================
// 3. PRICE PER BOTTLE (for bundles)
// ============================================================================
const pricePerBottle = `{% comment %}
  Shelzy's Price Per Bottle Display
  Include on product page: {% render 'sz-price-per-bottle', product: product %}
{% endcomment %}

{% assign bundle_sizes = "4,6,8,10,12" | split: "," %}
{% assign is_bundle = false %}
{% assign bottle_count = 1 %}

{% for tag in product.tags %}
  {% assign tag_lower = tag | downcase %}
  {% if tag_lower contains 'bundle' or tag_lower contains 'set' or tag_lower contains 'pack' %}
    {% assign is_bundle = true %}
  {% endif %}

  {% for size in bundle_sizes %}
    {% if tag contains size %}
      {% assign bottle_count = size | plus: 0 %}
    {% endif %}
  {% endfor %}
{% endfor %}

{% comment %} Also check title for bundle size {% endcomment %}
{% assign title_lower = product.title | downcase %}
{% if title_lower contains 'set of' or title_lower contains 'pack of' %}
  {% assign is_bundle = true %}
  {% for size in bundle_sizes %}
    {% if product.title contains size %}
      {% assign bottle_count = size | plus: 0 %}
    {% endif %}
  {% endfor %}
{% endif %}

{% if is_bundle and bottle_count > 1 %}
  {% assign price_per = product.price | divided_by: bottle_count %}
  <div class="sz-price-per-bottle">
    <span class="sz-ppb-amount">{{ price_per | money }}/bottle</span>
    <span class="sz-ppb-savings">Better value in sets!</span>
  </div>
{% endif %}

<style>
.sz-price-per-bottle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--sz-pool, #4EC7E8) 0%, #7DD3F0 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 14px;
  margin-top: 8px;
}

.sz-ppb-amount {
  font-weight: 700;
}

.sz-ppb-savings {
  font-size: 12px;
  opacity: 0.9;
}
</style>`;

// ============================================================================
// 4. STICKY MOBILE ADD TO CART
// ============================================================================
const stickyMobileATC = `{% comment %}
  Shelzy's Sticky Mobile Add to Cart
  Include in theme.liquid before </body>: {% render 'sz-sticky-mobile-atc' %}
{% endcomment %}

{% if template contains 'product' %}
<div class="sz-sticky-atc" id="szStickyATC">
  <div class="sz-sticky-atc-inner">
    <div class="sz-sticky-atc-info">
      <span class="sz-sticky-atc-title">{{ product.title | truncate: 30 }}</span>
      <span class="sz-sticky-atc-price">{{ product.selected_or_first_available_variant.price | money }}</span>
    </div>
    <button type="button" class="sz-sticky-atc-btn" onclick="document.querySelector('form[action*=cart] [type=submit]').click()">
      Add to Cart
    </button>
  </div>
</div>

<style>
.sz-sticky-atc {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  z-index: 999;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.sz-sticky-atc-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 100%;
}

.sz-sticky-atc-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sz-sticky-atc-title {
  font-size: 13px;
  font-weight: 600;
  color: #2C2C2C;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sz-sticky-atc-price {
  font-size: 15px;
  font-weight: 700;
  color: var(--sz-coral, #FF8A80);
}

.sz-sticky-atc-btn {
  background: linear-gradient(135deg, var(--sz-coral, #FF8A80) 0%, #FF6B6B 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.sz-sticky-atc-btn:active {
  transform: scale(0.98);
}

@media (min-width: 750px) {
  .sz-sticky-atc {
    display: none !important;
  }
}

@media (max-width: 749px) {
  .sz-sticky-atc.is-visible {
    display: block;
  }
}
</style>

<script>
(function() {
  var sticky = document.getElementById('szStickyATC');
  var addToCartBtn = document.querySelector('form[action*=cart] [type=submit]');

  if (!sticky || !addToCartBtn) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        sticky.classList.remove('is-visible');
      } else {
        sticky.classList.add('is-visible');
      }
    });
  }, { threshold: 0 });

  observer.observe(addToCartBtn);
})();
</script>
{% endif %}`;

// ============================================================================
// 5. URGENCY BANNER FOR PRODUCT PAGE
// ============================================================================
const productUrgency = `{% comment %}
  Shelzy's Product Urgency Banner
  Include on product page: {% render 'sz-product-urgency' %}
{% endcomment %}

<div class="sz-product-urgency">
  <div class="sz-urgency-icon">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  </div>
  <div class="sz-urgency-text">
    <strong>Made to Order</strong> — Your bottles ship in 3-5 business days
  </div>
</div>

<style>
.sz-product-urgency {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #FFF9F3 0%, #FFEBE6 100%);
  border: 1px solid rgba(255, 138, 128, 0.2);
  border-radius: 12px;
  padding: 14px 18px;
  margin: 16px 0;
}

.sz-urgency-icon {
  color: var(--sz-coral, #FF8A80);
  flex-shrink: 0;
}

.sz-urgency-text {
  font-size: 14px;
  color: #2C2C2C;
  line-height: 1.4;
}

.sz-urgency-text strong {
  color: var(--sz-coral, #FF8A80);
}
</style>`;

// ============================================================================
// 6. BRAND COLOR VARIABLES (Ensure they're injected)
// ============================================================================
const brandColorCSS = `{% comment %}
  Shelzy's Brand Colors - Core CSS Variables
  This ensures the tropical palette is available sitewide
{% endcomment %}

<style id="sz-brand-colors">
:root {
  /* Primary Palette */
  --sz-coral: #FF8A80;
  --sz-sand: #FFD9A0;
  --sz-pool: #4EC7E8;
  --sz-lilac: #F3C8FF;

  /* Neutrals */
  --sz-cream: #FFF9F3;
  --sz-charcoal: #2C2C2C;
  --sz-warm-gray: #8B8680;

  /* Functional */
  --sz-success: #4CAF50;
  --sz-warning: #FF9800;

  /* Gradients */
  --sz-gradient-primary: linear-gradient(135deg, var(--sz-coral) 0%, var(--sz-pool) 100%);
  --sz-gradient-warm: linear-gradient(135deg, var(--sz-coral) 0%, var(--sz-sand) 100%);
  --sz-gradient-cool: linear-gradient(135deg, var(--sz-pool) 0%, var(--sz-lilac) 100%);
}

/* Override theme defaults to use brand colors */
.btn,
.shopify-payment-button button,
button[type="submit"]:not(.sz-sticky-atc-btn) {
  background: var(--sz-gradient-primary) !important;
  border: none !important;
  color: white !important;
  border-radius: 30px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  font-weight: 600 !important;
  transition: transform 0.2s, box-shadow 0.2s !important;
}

.btn:hover,
.shopify-payment-button button:hover,
button[type="submit"]:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(255, 138, 128, 0.3) !important;
}

/* Links in brand coral */
a:not(.btn):not([class*="nav"]) {
  color: var(--sz-coral);
}

/* Ensure page backgrounds use cream */
body,
.page-content,
.shopify-section {
  background-color: var(--sz-cream);
}
</style>`;

// ============================================================================
// 7. COLLECTION HERO BANNER
// ============================================================================
const collectionHero = `{% comment %}
  Shelzy's Collection Hero Banner
  Automatically adds occasion-specific messaging to collections
{% endcomment %}

{% assign collection_handle = collection.handle | downcase %}

{% assign hero_headline = collection.title %}
{% assign hero_subhead = collection.description | strip_html | truncate: 160 %}
{% assign hero_bg = "var(--sz-gradient-warm)" %}

{% case collection_handle %}
  {% when 'wedding-water-bottles' or 'wedding' %}
    {% assign hero_headline = "Wedding Day Bottles" %}
    {% assign hero_subhead = "Elegant personalized bottles for your bridal party, welcome bags, and reception tables. Made with permanent sublimation printing." %}
    {% assign hero_bg = "linear-gradient(135deg, #FFF9F3 0%, #FFEBE6 100%)" %}
  {% when 'bachelorette-water-bottles' or 'bachelorette' or 'bachelorette-party' %}
    {% assign hero_headline = "Bachelorette Party Bottles" %}
    {% assign hero_subhead = "Pool-ready, photo-worthy bottles for the bride tribe. Customize with names, dates, and your party theme." %}
    {% assign hero_bg = "linear-gradient(135deg, #E8F7FC 0%, #FCE8F7 100%)" %}
  {% when 'bridal-shower-water-bottles' or 'bridal-shower' %}
    {% assign hero_headline = "Bridal Shower Bottles" %}
    {% assign hero_subhead = "Sweet keepsake bottles your guests will actually use. Perfect for shower favors and bridesmaid gifts." %}
    {% assign hero_bg = "linear-gradient(135deg, #FCE8F0 0%, #FFF9F3 100%)" %}
  {% when 'bridesmaid-gift-bottles' or 'bridesmaid' %}
    {% assign hero_headline = "Bridesmaid Gift Bottles" %}
    {% assign hero_subhead = "Thoughtful, personalized gifts your girls will love. Add names, roles, or custom messages." %}
    {% assign hero_bg = "linear-gradient(135deg, #F3E8FF 0%, #FFE8F3 100%)" %}
  {% when 'birthday-party-bottles' or 'birthday' %}
    {% assign hero_headline = "Birthday Party Bottles" %}
    {% assign hero_subhead = "Make their day extra special with custom bottles featuring names, ages, and party themes." %}
    {% assign hero_bg = "linear-gradient(135deg, #FFE8D9 0%, #E8F0FF 100%)" %}
  {% when 'corporate-event-bottles' or 'corporate' %}
    {% assign hero_headline = "Corporate & Event Bottles" %}
    {% assign hero_subhead = "Professional branded bottles for conferences, retreats, and company events. Bulk pricing available." %}
    {% assign hero_bg = "linear-gradient(135deg, #E8F2F7 0%, #F7F7F7 100%)" %}
{% endcase %}

<div class="sz-collection-hero" style="background: {{ hero_bg }};">
  <div class="sz-collection-hero-inner">
    <h1 class="sz-collection-title">{{ hero_headline }}</h1>
    {% if hero_subhead != blank %}
      <p class="sz-collection-subhead">{{ hero_subhead }}</p>
    {% endif %}
    <div class="sz-collection-trust">
      <span>✓ Permanent Print</span>
      <span>✓ Ships in 3-5 Days</span>
      <span>✓ Free Shipping $75+</span>
    </div>
  </div>
</div>

<style>
.sz-collection-hero {
  padding: 48px 24px;
  text-align: center;
  margin-bottom: 32px;
  border-radius: 0 0 32px 32px;
}

.sz-collection-hero-inner {
  max-width: 680px;
  margin: 0 auto;
}

.sz-collection-title {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 700;
  color: var(--sz-charcoal, #2C2C2C);
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.sz-collection-subhead {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.sz-collection-trust {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--sz-charcoal, #2C2C2C);
}

.sz-collection-trust span {
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 749px) {
  .sz-collection-hero {
    padding: 32px 16px;
  }

  .sz-collection-trust {
    flex-direction: column;
    gap: 8px;
  }
}
</style>`;

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================
async function main() {
  console.log('================================================================');
  console.log('  SITE OPTIMIZATION - CONVERSION BOOSTERS');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // Deploy all snippets
    console.log('--- Deploying Conversion Snippets ---\n');

    await createAsset(themeId, 'snippets/sz-trust-badges-atc.liquid', trustBadgesSnippet);
    console.log('✓ Created snippets/sz-trust-badges-atc.liquid');

    await createAsset(themeId, 'snippets/sz-shipping-progress.liquid', freeShippingBar);
    console.log('✓ Created snippets/sz-shipping-progress.liquid');

    await createAsset(themeId, 'snippets/sz-price-per-bottle.liquid', pricePerBottle);
    console.log('✓ Created snippets/sz-price-per-bottle.liquid');

    await createAsset(themeId, 'snippets/sz-sticky-mobile-atc.liquid', stickyMobileATC);
    console.log('✓ Created snippets/sz-sticky-mobile-atc.liquid');

    await createAsset(themeId, 'snippets/sz-product-urgency.liquid', productUrgency);
    console.log('✓ Created snippets/sz-product-urgency.liquid');

    await createAsset(themeId, 'snippets/sz-brand-colors.liquid', brandColorCSS);
    console.log('✓ Created snippets/sz-brand-colors.liquid');

    await createAsset(themeId, 'snippets/sz-collection-hero.liquid', collectionHero);
    console.log('✓ Created snippets/sz-collection-hero.liquid');

    // Inject brand colors into theme.liquid
    console.log('\n--- Injecting Brand Colors into Theme ---\n');

    const themeLiquid = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquid) {
      // Check if already injected
      if (!themeLiquid.includes('sz-brand-colors')) {
        const updatedTheme = themeLiquid.replace(
          '</head>',
          "{% render 'sz-brand-colors' %}\n</head>"
        );
        await createAsset(themeId, 'layout/theme.liquid', updatedTheme);
        console.log('✓ Injected brand colors into theme.liquid');
      } else {
        console.log('• Brand colors already in theme.liquid');
      }

      // Add sticky mobile ATC before </body>
      if (!themeLiquid.includes('sz-sticky-mobile-atc')) {
        const withStickyATC = themeLiquid.replace(
          '</body>',
          "{% render 'sz-sticky-mobile-atc' %}\n</body>"
        );
        await createAsset(themeId, 'layout/theme.liquid', withStickyATC);
        console.log('✓ Added sticky mobile ATC to theme.liquid');
      } else {
        console.log('• Sticky mobile ATC already in theme.liquid');
      }
    }

    // Get cart template and inject shipping progress
    console.log('\n--- Updating Cart Template ---\n');

    const cartTemplate = await getAsset(themeId, 'sections/cart-template.liquid');
    if (cartTemplate && !cartTemplate.includes('sz-shipping-progress')) {
      // Find a good injection point - after opening div or form
      const updatedCart = cartTemplate.replace(
        /<form[^>]*cart[^>]*>/i,
        (match) => match + "\n{% render 'sz-shipping-progress' %}"
      );
      if (updatedCart !== cartTemplate) {
        await createAsset(themeId, 'sections/cart-template.liquid', updatedCart);
        console.log('✓ Added shipping progress to cart');
      } else {
        console.log('• Could not find injection point in cart (manual add needed)');
      }
    } else if (cartTemplate) {
      console.log('• Shipping progress already in cart');
    } else {
      console.log('• Cart template not found (theme may use different structure)');
    }

    // Summary
    console.log('\n================================================================');
    console.log('  OPTIMIZATION COMPLETE!');
    console.log('================================================================');
    console.log('\n📦 SNIPPETS DEPLOYED:');
    console.log('  • sz-trust-badges-atc.liquid - Trust icons below Add to Cart');
    console.log('  • sz-shipping-progress.liquid - Free shipping progress bar');
    console.log('  • sz-price-per-bottle.liquid - Per-bottle pricing for bundles');
    console.log('  • sz-sticky-mobile-atc.liquid - Sticky mobile buy button');
    console.log('  • sz-product-urgency.liquid - Made-to-order urgency banner');
    console.log('  • sz-brand-colors.liquid - Coral/tropical color palette');
    console.log('  • sz-collection-hero.liquid - Occasion-specific collection headers');

    console.log('\n📝 MANUAL STEPS NEEDED:');
    console.log('  1. Add to product template (product-template.liquid):');
    console.log("     {% render 'sz-trust-badges-atc' %}");
    console.log("     {% render 'sz-product-urgency' %}");
    console.log("     {% render 'sz-price-per-bottle', product: product %}");
    console.log('');
    console.log('  2. Add to collection template (collection-template.liquid):');
    console.log("     {% render 'sz-collection-hero' %}");
    console.log('');
    console.log('  3. Verify in Shopify Admin > Online Store > Themes > Edit code');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
