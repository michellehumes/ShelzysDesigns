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
// 1. BENEFITS BLOCK (Above Add to Cart)
// ============================================================================
const benefitsBlock = `{% comment %}
  Shelzy's PDP Benefits Block - Shows above Add to Cart
  Include with: {% render 'sz-pdp-benefits' %}
{% endcomment %}

<div class="sz-pdp-benefits">
  <ul class="sz-pdp-benefits__list">
    <li class="sz-pdp-benefits__item">
      <svg class="sz-pdp-benefits__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
      <span>Customizable in any font and color</span>
    </li>
    <li class="sz-pdp-benefits__item">
      <svg class="sz-pdp-benefits__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      <span>Double-walled stainless steel – keeps drinks cold for hours</span>
    </li>
    <li class="sz-pdp-benefits__item">
      <svg class="sz-pdp-benefits__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
      </svg>
      <span>Permanent sublimation printing (no peeling vinyl)</span>
    </li>
    <li class="sz-pdp-benefits__item">
      <svg class="sz-pdp-benefits__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
      <span>Ships in 3–5 business days</span>
    </li>
  </ul>
</div>

<style>
.sz-pdp-benefits {
  background: var(--sz-beige, #F7F3EC);
  border-radius: 16px;
  padding: 20px 24px;
  margin: 20px 0;
}

.sz-pdp-benefits__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sz-pdp-benefits__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: var(--sz-black, #111111);
  line-height: 1.4;
}

.sz-pdp-benefits__icon {
  color: var(--sz-sage, #A6B8A0);
  flex-shrink: 0;
  margin-top: 1px;
}

@media (max-width: 749px) {
  .sz-pdp-benefits {
    padding: 16px 18px;
  }

  .sz-pdp-benefits__item {
    font-size: 13px;
  }
}
</style>`;

// ============================================================================
// 2. PERSONALIZATION INPUT UX
// ============================================================================
const personalizationInput = `{% comment %}
  Shelzy's Personalization Input - Enhanced UX for name entry
  Include with: {% render 'sz-personalization-input', product: product %}
{% endcomment %}

{% assign is_set = false %}
{% assign set_size = 1 %}

{% for tag in product.tags %}
  {% assign tag_lower = tag | downcase %}
  {% if tag_lower contains 'set' or tag_lower contains 'bundle' or tag_lower contains 'pack' %}
    {% assign is_set = true %}
  {% endif %}
{% endfor %}

{% if product.title contains 'Set of' or product.title contains 'Pack of' %}
  {% assign is_set = true %}
{% endif %}

<div class="sz-personalization">
  <div class="sz-personalization__field">
    <label for="sz-personalization-input" class="sz-personalization__label">
      {% if is_set %}
        Names / Text to Print
      {% else %}
        Name / Text to Print
      {% endif %}
      <span class="sz-personalization__required">*</span>
    </label>

    {% if is_set %}
      <textarea
        id="sz-personalization-input"
        name="properties[Personalization]"
        class="sz-personalization__textarea"
        rows="3"
        placeholder="Michelle, Kathleen, Sapna, Jessica"
        required
      ></textarea>
      <p class="sz-personalization__helper">
        Enter all names separated by commas. Please double-check spelling and capitalization.
        <br><em>Tip: You can also email your full list to us after checkout.</em>
      </p>
    {% else %}
      <input
        type="text"
        id="sz-personalization-input"
        name="properties[Personalization]"
        class="sz-personalization__input"
        placeholder="Michelle"
        required
      />
      <p class="sz-personalization__helper">
        Please enter the exact spelling and capitalization you want on the bottle.
      </p>
    {% endif %}
  </div>

  {% comment %} Optional: Font selection if product has font options {% endcomment %}
  {% for option in product.options_with_values %}
    {% assign option_lower = option.name | downcase %}
    {% if option_lower contains 'font' %}
      <div class="sz-personalization__field">
        <label for="sz-font-select" class="sz-personalization__label">
          {{ option.name }}
        </label>
        <select id="sz-font-select" name="properties[Font]" class="sz-personalization__select">
          {% for value in option.values %}
            <option value="{{ value }}">{{ value }}</option>
          {% endfor %}
        </select>
      </div>
    {% endif %}
  {% endfor %}
</div>

<style>
.sz-personalization {
  margin: 20px 0;
  padding: 20px;
  background: white;
  border: 1px solid var(--sz-gray-lighter, #E5E5E5);
  border-radius: 12px;
}

.sz-personalization__field {
  margin-bottom: 16px;
}

.sz-personalization__field:last-child {
  margin-bottom: 0;
}

.sz-personalization__label {
  display: block;
  font-family: var(--sz-font-body, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 600;
  color: var(--sz-black, #111111);
  margin-bottom: 8px;
}

.sz-personalization__required {
  color: #E53935;
  margin-left: 2px;
}

.sz-personalization__input,
.sz-personalization__textarea,
.sz-personalization__select {
  width: 100%;
  font-family: var(--sz-font-body, 'Inter', sans-serif);
  font-size: 16px;
  color: var(--sz-black, #111111);
  background: var(--sz-beige, #F7F3EC);
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 14px 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.sz-personalization__input:focus,
.sz-personalization__textarea:focus,
.sz-personalization__select:focus {
  outline: none;
  border-color: var(--sz-sage, #A6B8A0);
  box-shadow: 0 0 0 3px rgba(166, 184, 160, 0.15);
}

.sz-personalization__input::placeholder,
.sz-personalization__textarea::placeholder {
  color: var(--sz-gray-light, #999999);
  font-style: italic;
}

.sz-personalization__helper {
  font-size: 12px;
  color: var(--sz-gray, #666666);
  margin: 8px 0 0 0;
  line-height: 1.5;
}

.sz-personalization__helper em {
  color: var(--sz-sage, #A6B8A0);
}

@media (max-width: 749px) {
  .sz-personalization {
    padding: 16px;
  }

  .sz-personalization__input,
  .sz-personalization__textarea {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>`;

// ============================================================================
// 3. REASSURANCE STRIP (Under Add to Cart)
// ============================================================================
const reassuranceStrip = `{% comment %}
  Shelzy's Reassurance Strip - Shows under Add to Cart
  Include with: {% render 'sz-pdp-reassurance' %}
{% endcomment %}

<div class="sz-pdp-reassurance">
  <div class="sz-pdp-reassurance__item">
    <svg class="sz-pdp-reassurance__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
    <span>Free shipping $50+</span>
  </div>
  <div class="sz-pdp-reassurance__item">
    <svg class="sz-pdp-reassurance__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
    <span>3–5 day turnaround</span>
  </div>
  <div class="sz-pdp-reassurance__item">
    <svg class="sz-pdp-reassurance__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>Hand-checked personalization</span>
  </div>
</div>

<style>
.sz-pdp-reassurance {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 24px 0;
  padding: 16px;
  background: var(--sz-beige, #F7F3EC);
  border-radius: 12px;
  flex-wrap: wrap;
}

.sz-pdp-reassurance__item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--sz-black, #111111);
  white-space: nowrap;
}

.sz-pdp-reassurance__icon {
  color: var(--sz-sage, #A6B8A0);
  flex-shrink: 0;
}

@media (max-width: 749px) {
  .sz-pdp-reassurance {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px;
  }

  .sz-pdp-reassurance__item {
    font-size: 14px;
  }
}
</style>`;

// ============================================================================
// 4. PDP STYLES (Overall product page improvements)
// ============================================================================
const pdpStyles = `{% comment %}
  Shelzy's PDP Styles - Product page layout improvements
{% endcomment %}

<style>
/* Product Title */
.product-single__title,
.product__title {
  font-family: var(--sz-font-heading, 'Playfair Display', serif) !important;
  font-size: clamp(24px, 4vw, 32px) !important;
  font-weight: 600 !important;
  color: var(--sz-black, #111111) !important;
  line-height: 1.2 !important;
  margin-bottom: 12px !important;
}

/* Product Price */
.product-single__price,
.product__price {
  font-family: var(--sz-font-body, 'Inter', sans-serif) !important;
  font-size: 22px !important;
  font-weight: 600 !important;
  color: var(--sz-sage, #A6B8A0) !important;
  margin-bottom: 16px !important;
}

/* Product Description */
.product-single__description,
.product__description {
  font-size: 15px;
  line-height: 1.7;
  color: var(--sz-gray-dark, #333333);
}

/* Product Form */
.product-form {
  margin-top: 24px;
}

/* Add to Cart Button */
.product-form__cart-submit,
.btn--add-to-cart,
.add-to-cart {
  width: 100% !important;
  font-size: 15px !important;
  padding: 18px 32px !important;
  margin-top: 16px !important;
}

/* Variant Selectors */
.variant-wrapper label,
.product-form__item label {
  font-size: 14px;
  font-weight: 600;
  color: var(--sz-black, #111111);
  margin-bottom: 8px;
  display: block;
}

.variant-wrapper select,
.product-form__input select {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid var(--sz-gray-lighter, #E5E5E5);
  border-radius: 10px;
  background: white;
}

/* Product Images */
.product-single__photos,
.product__media-container {
  margin-bottom: 24px;
}

.product-single__photo,
.product__media {
  border-radius: 16px;
  overflow: hidden;
}

/* Quantity Selector */
.quantity-selector,
.product-form__quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.quantity-selector input,
.product-form__quantity input {
  width: 60px;
  text-align: center;
  padding: 10px;
  border: 1px solid var(--sz-gray-lighter, #E5E5E5);
  border-radius: 8px;
}

/* Mobile Optimizations */
@media (max-width: 749px) {
  .product-single__meta,
  .product__info-container {
    padding: 0 16px;
  }

  .product-single__title,
  .product__title {
    font-size: 22px !important;
  }

  .product-single__price,
  .product__price {
    font-size: 20px !important;
  }
}
</style>`;

// ============================================================================
// 5. COMPLETE PDP SECTION (New section combining all elements)
// ============================================================================
const pdpSection = `{% comment %}
  Shelzy's Complete PDP Enhancement Section
  This section wraps all PDP improvements together
{% endcomment %}

{% render 'sz-pdp-styles' %}

{% comment %}
  The following snippets should be rendered in product-template.liquid:
  - sz-pdp-benefits (above variant selectors)
  - sz-personalization-input (in the product form)
  - sz-pdp-reassurance (after add to cart button)
{% endcomment %}`;

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================
async function main() {
  console.log('================================================================');
  console.log('  UPGRADING PRODUCT PAGES (PDP)');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // Deploy snippets
    console.log('--- Creating PDP Snippets ---\n');

    await createAsset(themeId, 'snippets/sz-pdp-benefits.liquid', benefitsBlock);
    console.log('✓ Created snippets/sz-pdp-benefits.liquid');

    await createAsset(themeId, 'snippets/sz-personalization-input.liquid', personalizationInput);
    console.log('✓ Created snippets/sz-personalization-input.liquid');

    await createAsset(themeId, 'snippets/sz-pdp-reassurance.liquid', reassuranceStrip);
    console.log('✓ Created snippets/sz-pdp-reassurance.liquid');

    await createAsset(themeId, 'snippets/sz-pdp-styles.liquid', pdpStyles);
    console.log('✓ Created snippets/sz-pdp-styles.liquid');

    // Add PDP styles to theme.liquid
    console.log('\n--- Updating theme.liquid ---\n');

    const themeLiquid = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquid && !themeLiquid.includes('sz-pdp-styles')) {
      const updated = themeLiquid.replace('</head>', "{% render 'sz-pdp-styles' %}\n</head>");
      await createAsset(themeId, 'layout/theme.liquid', updated);
      console.log('✓ Added PDP styles to theme.liquid');
    } else {
      console.log('• PDP styles already in theme.liquid');
    }

    // Try to inject into product template
    console.log('\n--- Updating Product Template ---\n');

    const productTemplates = [
      'sections/product-template.liquid',
      'sections/product.liquid',
      'sections/main-product.liquid'
    ];

    let injected = false;

    for (const templateKey of productTemplates) {
      const template = await getAsset(themeId, templateKey);
      if (template) {
        console.log(`Found: ${templateKey}`);

        let updated = template;
        let changes = [];

        // Inject benefits block before product form or add to cart
        if (!template.includes('sz-pdp-benefits')) {
          // Try to find product form
          const formPatterns = [
            /(<form[^>]*product[^>]*>)/i,
            /(class="product-form)/i,
            /({%\s*form\s*['"]product['"])/i
          ];

          for (const pattern of formPatterns) {
            if (pattern.test(updated)) {
              updated = updated.replace(pattern, "{% render 'sz-pdp-benefits' %}\n$1");
              changes.push('benefits block');
              break;
            }
          }
        }

        // Inject personalization input before add to cart button
        if (!template.includes('sz-personalization-input')) {
          const atcPatterns = [
            /(<button[^>]*add[^>]*cart[^>]*>)/i,
            /(class="product-form__cart-submit)/i,
            /({%\s*render\s*['"]product-form['"])/i
          ];

          for (const pattern of atcPatterns) {
            if (pattern.test(updated)) {
              updated = updated.replace(pattern, "{% render 'sz-personalization-input', product: product %}\n$1");
              changes.push('personalization input');
              break;
            }
          }
        }

        // Inject reassurance strip after add to cart / end of form
        if (!template.includes('sz-pdp-reassurance')) {
          const afterAtcPatterns = [
            /({%\s*endform\s*%})/i,
            /(<\/form>)/i
          ];

          for (const pattern of afterAtcPatterns) {
            if (pattern.test(updated)) {
              updated = updated.replace(pattern, "$1\n{% render 'sz-pdp-reassurance' %}");
              changes.push('reassurance strip');
              break;
            }
          }
        }

        if (changes.length > 0) {
          await createAsset(themeId, templateKey, updated);
          console.log(`✓ Injected into ${templateKey}: ${changes.join(', ')}`);
          injected = true;
        } else {
          console.log(`• All elements already in ${templateKey}`);
          injected = true;
        }

        break; // Only update first found template
      }
    }

    if (!injected) {
      console.log('• Could not auto-inject into product template');
      console.log('  Manual injection needed - see instructions below');
    }

    // Summary
    console.log('\n================================================================');
    console.log('  PDP UPGRADE COMPLETE!');
    console.log('================================================================');

    console.log('\n📦 SNIPPETS CREATED:');
    console.log('  • sz-pdp-benefits.liquid - Bullet benefits (above form)');
    console.log('  • sz-personalization-input.liquid - Name entry field');
    console.log('  • sz-pdp-reassurance.liquid - Trust strip (after ATC)');
    console.log('  • sz-pdp-styles.liquid - Typography & layout');

    console.log('\n📋 EXAMPLE PDP LAYOUT:');
    console.log('  ┌─────────────────────────────────────┐');
    console.log('  │  [Product Image]                    │');
    console.log('  │                                     │');
    console.log('  │  Personalized Bridesmaid Bottle     │');
    console.log('  │  $29.99                             │');
    console.log('  │                                     │');
    console.log('  │  ┌─────────────────────────────────┐│');
    console.log('  │  │ ✓ Customizable font & color    ││');
    console.log('  │  │ ✓ Double-walled stainless steel││');
    console.log('  │  │ ✓ Permanent sublimation print  ││');
    console.log('  │  │ ✓ Ships in 3–5 business days   ││');
    console.log('  │  └─────────────────────────────────┘│');
    console.log('  │                                     │');
    console.log('  │  Name / Text to Print *             │');
    console.log('  │  ┌─────────────────────────────────┐│');
    console.log('  │  │ Michelle                        ││');
    console.log('  │  └─────────────────────────────────┘│');
    console.log('  │  Please enter exact spelling...     │');
    console.log('  │                                     │');
    console.log('  │  ┌─────────────────────────────────┐│');
    console.log('  │  │      ADD TO CART                ││');
    console.log('  │  └─────────────────────────────────┘│');
    console.log('  │                                     │');
    console.log('  │  ✔ Free shipping $50+              │');
    console.log('  │  ✔ 3–5 day turnaround              │');
    console.log('  │  ✔ Hand-checked personalization    │');
    console.log('  └─────────────────────────────────────┘');

    console.log('\n📝 MANUAL STEPS (if auto-inject failed):');
    console.log('  Add to product-template.liquid:');
    console.log("    {% render 'sz-pdp-benefits' %}");
    console.log("    {% render 'sz-personalization-input', product: product %}");
    console.log("    {% render 'sz-pdp-reassurance' %}");

    console.log('\n✅ Refresh a product page to see the changes!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
