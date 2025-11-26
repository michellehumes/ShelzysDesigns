#!/usr/bin/env node

/**
 * Shelzy's Designs - Add Personalization Input Field
 *
 * Adds a real text input field for personalization on product pages.
 * Uses line item properties so the name appears in orders.
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable');
  console.error('   Run: export SHOPIFY_ACCESS_TOKEN=your_token_here');
  process.exit(1);
}

const API_VERSION = '2024-01';

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

async function getAsset(themeId, key) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  if (response.status === 200) {
    return response.data.asset.value;
  }
  return null;
}

async function putAsset(themeId, key, content) {
  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value: content }
  });
  return { success: response.status === 200 || response.status === 201, data: response.data };
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✏️  ADD PERSONALIZATION INPUT FIELD                           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Get live theme
  const themesResponse = await apiRequest('GET', '/themes.json');

  if (themesResponse.status !== 200 || !themesResponse.data || !themesResponse.data.themes) {
    console.error('❌ Failed to fetch themes:', themesResponse.status, themesResponse.data);
    process.exit(1);
  }

  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');

  if (!liveTheme) {
    console.error('❌ No published theme found');
    process.exit(1);
  }

  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1: Create the personalization input snippet
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 1: CREATE PERSONALIZATION INPUT SNIPPET');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const personalizationSnippet = `{% comment %}
  Shelzy's Designs - Personalization Input Field
  This creates a real text input for customers to enter the name they want on their bottle.
  The value is stored as a line item property and appears in order details.
{% endcomment %}

<style>
  .sz-personalization-wrapper {
    margin: 20px 0;
    padding: 20px;
    background: linear-gradient(135deg, #fdf6f0 0%, #fff5eb 100%);
    border: 2px solid #d4a574;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(212, 165, 116, 0.15);
  }

  .sz-personalization-wrapper label {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: #2c2c2c;
    margin-bottom: 10px;
    letter-spacing: 0.3px;
  }

  .sz-personalization-wrapper label .required-star {
    color: #e74c3c;
    margin-left: 3px;
  }

  .sz-personalization-wrapper .label-hint {
    display: block;
    font-size: 13px;
    font-weight: 400;
    color: #666;
    margin-top: 4px;
  }

  .sz-personalization-wrapper input[type="text"] {
    width: 100%;
    padding: 14px 16px;
    font-size: 16px;
    border: 2px solid #d4a574;
    border-radius: 8px;
    background: #fff;
    color: #333;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .sz-personalization-wrapper input[type="text"]:focus {
    outline: none;
    border-color: #b8956a;
    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
  }

  .sz-personalization-wrapper input[type="text"]::placeholder {
    color: #999;
    font-style: italic;
  }

  .sz-personalization-wrapper .char-counter {
    display: block;
    text-align: right;
    font-size: 12px;
    color: #888;
    margin-top: 6px;
  }

  .sz-personalization-wrapper .char-counter.warning {
    color: #e67e22;
  }

  .sz-personalization-wrapper .char-counter.limit {
    color: #e74c3c;
  }

  .sz-personalization-preview {
    margin-top: 12px;
    padding: 12px;
    background: #fff;
    border-radius: 8px;
    border: 1px dashed #d4a574;
    text-align: center;
  }

  .sz-personalization-preview .preview-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888;
    margin-bottom: 6px;
  }

  .sz-personalization-preview .preview-text {
    font-size: 18px;
    font-weight: 600;
    color: #d4a574;
    font-family: 'Georgia', serif;
    min-height: 24px;
  }

  .sz-personalization-error {
    display: none;
    color: #e74c3c;
    font-size: 13px;
    margin-top: 8px;
    padding: 8px 12px;
    background: #fdf2f2;
    border-radius: 6px;
    border-left: 3px solid #e74c3c;
  }

  .sz-personalization-error.show {
    display: block;
  }
</style>

<div class="sz-personalization-wrapper" id="sz-personalization">
  <label for="sz-name-on-bottle">
    Name on Water Bottle <span class="required-star">*</span>
    <span class="label-hint">Enter the name exactly as you want it to appear</span>
  </label>

  <input
    id="sz-name-on-bottle"
    type="text"
    name="properties[Name on bottle]"
    placeholder="e.g., Sarah, Mr. & Mrs. Smith, Team Alpha"
    maxlength="25"
    required
    autocomplete="off"
  >

  <span class="char-counter" id="sz-char-counter">0 / 25 characters</span>

  <div class="sz-personalization-preview">
    <div class="preview-label">Preview</div>
    <div class="preview-text" id="sz-preview-text">Your name will appear here</div>
  </div>

  <div class="sz-personalization-error" id="sz-personalization-error">
    Please enter a name for your bottle before adding to cart.
  </div>
</div>

<script>
(function() {
  var input = document.getElementById('sz-name-on-bottle');
  var counter = document.getElementById('sz-char-counter');
  var preview = document.getElementById('sz-preview-text');
  var errorMsg = document.getElementById('sz-personalization-error');
  var maxLength = 25;

  if (!input) return;

  // Update character counter and preview
  input.addEventListener('input', function() {
    var length = this.value.length;
    counter.textContent = length + ' / ' + maxLength + ' characters';

    // Update counter color
    counter.classList.remove('warning', 'limit');
    if (length >= maxLength) {
      counter.classList.add('limit');
    } else if (length >= maxLength - 5) {
      counter.classList.add('warning');
    }

    // Update preview
    if (this.value.trim()) {
      preview.textContent = this.value;
      preview.style.color = '#d4a574';
    } else {
      preview.textContent = 'Your name will appear here';
      preview.style.color = '#999';
    }

    // Hide error when typing
    if (errorMsg) {
      errorMsg.classList.remove('show');
    }
  });

  // Validate on form submit
  var form = input.closest('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      if (!input.value.trim()) {
        e.preventDefault();
        errorMsg.classList.add('show');
        input.focus();

        // Scroll to input
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Also hook into Add to Cart buttons
  document.addEventListener('click', function(e) {
    var button = e.target.closest('[type="submit"], .add-to-cart, .product-form__submit, [name="add"], .btn-add-to-cart');
    if (button && input && !input.value.trim()) {
      // Check if this button is related to a product form with our input
      var buttonForm = button.closest('form');
      var inputForm = input.closest('form');

      if (buttonForm === inputForm || button.closest('.product') || button.closest('.product-single')) {
        e.preventDefault();
        e.stopPropagation();
        errorMsg.classList.add('show');
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, true);
})();
</script>
`;

  const result1 = await putAsset(liveTheme.id, 'snippets/sz-personalization-input.liquid', personalizationSnippet);
  console.log(result1.success ? '   ✅ Created sz-personalization-input.liquid' : '   ❌ Failed to create snippet');

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 2: Inject into product form
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 2: INJECT INTO PRODUCT FORM');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Get list of assets to find product form section
  const assetsResponse = await apiRequest('GET', `/themes/${liveTheme.id}/assets.json`);
  const assets = assetsResponse.data?.assets || [];

  // Find potential product form files
  const productFiles = assets.filter(a =>
    a.key.includes('product') &&
    (a.key.endsWith('.liquid') || a.key.endsWith('.json'))
  );

  console.log('   Found product-related files:');
  productFiles.forEach(f => console.log(`     - ${f.key}`));
  console.log('');

  let injected = false;

  // Try to inject into main-product.liquid first (Shopify 2.0 themes)
  const mainProductSection = await getAsset(liveTheme.id, 'sections/main-product.liquid');
  if (mainProductSection) {
    console.log('   Found sections/main-product.liquid');

    if (!mainProductSection.includes('sz-personalization-input')) {
      // Find the product form and inject before the add-to-cart button
      let modified = mainProductSection;

      // Try various injection points
      const injectionPatterns = [
        // Before variant picker
        { pattern: /{%[-]?\s*render\s+['"]product-variant-picker['"]/, prepend: true },
        // Before quantity selector
        { pattern: /<quantity-input|{%[-]?\s*render\s+['"]quantity-input['"]/, prepend: true },
        // Before add-to-cart button
        { pattern: /<button[^>]*add-to-cart|<button[^>]*type="submit"[^>]*>(?:Add|Cart)/i, prepend: true },
        // After product form opening
        { pattern: /<form[^>]*product-form[^>]*>|<product-form/, append: true },
        // After variant selects
        { pattern: /<\/variant-selects>|{%[-]?\s*endform[-]?%}/, prepend: true },
      ];

      for (const { pattern, prepend } of injectionPatterns) {
        if (pattern.test(modified)) {
          const injection = "\n{% render 'sz-personalization-input' %}\n";
          modified = modified.replace(pattern, (match) => {
            return prepend ? injection + match : match + injection;
          });
          console.log('   Injected snippet into main-product.liquid');
          injected = true;
          break;
        }
      }

      if (injected) {
        const result = await putAsset(liveTheme.id, 'sections/main-product.liquid', modified);
        console.log(result.success ? '   ✅ Updated main-product.liquid' : '   ❌ Failed to update');
      } else {
        console.log('   Could not find injection point in main-product.liquid');
      }
    } else {
      console.log('   ✓ Already has personalization input');
      injected = true;
    }
  }

  // Also try product-template.liquid (older themes)
  if (!injected) {
    const productTemplate = await getAsset(liveTheme.id, 'sections/product-template.liquid');
    if (productTemplate) {
      console.log('   Found sections/product-template.liquid');

      if (!productTemplate.includes('sz-personalization-input')) {
        let modified = productTemplate;

        // Look for form or add button
        const patterns = [
          /<button[^>]*type="submit"/i,
          /<input[^>]*type="submit"/i,
          /class="[^"]*add-to-cart/i,
        ];

        for (const pattern of patterns) {
          if (pattern.test(modified)) {
            modified = modified.replace(pattern, (match) => {
              return "{% render 'sz-personalization-input' %}\n" + match;
            });
            injected = true;
            break;
          }
        }

        if (injected) {
          const result = await putAsset(liveTheme.id, 'sections/product-template.liquid', modified);
          console.log(result.success ? '   ✅ Updated product-template.liquid' : '   ❌ Failed to update');
        }
      } else {
        console.log('   ✓ Already has personalization input');
        injected = true;
      }
    }
  }

  // Try product.liquid in templates
  if (!injected) {
    const productLiquid = await getAsset(liveTheme.id, 'templates/product.liquid');
    if (productLiquid && !productLiquid.includes('sz-personalization-input')) {
      console.log('   Found templates/product.liquid');

      // Inject near the top
      let modified = productLiquid.replace(
        /({%[-]?\s*layout\s+['"][^'"]+['"][-]?%})/i,
        "$1\n{% render 'sz-personalization-input' %}"
      );

      if (modified !== productLiquid) {
        const result = await putAsset(liveTheme.id, 'templates/product.liquid', modified);
        console.log(result.success ? '   ✅ Updated templates/product.liquid' : '   ❌ Failed to update');
        injected = true;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 3: Create fallback injection via theme.liquid
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 3: FALLBACK - INJECT VIA THEME.LIQUID');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Create a JS-based injection as fallback
  const jsInjectionSnippet = `{% comment %}
  Shelzy's - Auto-inject personalization input on product pages
  Includes: Font, Color, and Name on bottle fields
{% endcomment %}

{% if template contains 'product' %}
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Check if personalization input already exists
  if (document.getElementById('sz-personalization') || document.querySelector('[name="properties[Name on bottle]"]')) {
    return;
  }

  // Find the product form
  var productForm = document.querySelector('form[action*="/cart/add"]') ||
                   document.querySelector('.product-form') ||
                   document.querySelector('[data-product-form]');

  if (!productForm) return;

  // Find injection point (before add-to-cart button)
  var addButton = productForm.querySelector('[type="submit"]') ||
                  productForm.querySelector('.add-to-cart') ||
                  productForm.querySelector('.product-form__submit');

  if (!addButton) return;

  // Create personalization container
  var container = document.createElement('div');
  container.className = 'sz-personalization-wrapper';
  container.id = 'sz-personalization';
  container.innerHTML = \`
    <style>
      .sz-personalization-wrapper {
        margin: 20px 0;
        padding: 24px;
        background: linear-gradient(135deg, #fdf6f0 0%, #fff5eb 100%);
        border: 2px solid #d4a574;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(212, 165, 116, 0.15);
      }
      .sz-personalization-wrapper h3 {
        margin: 0 0 20px 0;
        font-size: 18px;
        font-weight: 700;
        color: #2c2c2c;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sz-personalization-wrapper h3 svg {
        width: 20px;
        height: 20px;
        fill: #d4a574;
      }
      .sz-field-group {
        margin-bottom: 18px;
      }
      .sz-field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 18px;
      }
      @media (max-width: 500px) {
        .sz-field-row {
          grid-template-columns: 1fr;
        }
      }
      .sz-personalization-wrapper label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #2c2c2c;
        margin-bottom: 8px;
      }
      .sz-personalization-wrapper .required-star {
        color: #e74c3c;
      }
      .sz-personalization-wrapper select,
      .sz-personalization-wrapper input[type="text"] {
        width: 100%;
        padding: 12px 14px;
        font-size: 15px;
        border: 2px solid #d4a574;
        border-radius: 8px;
        background: #fff;
        color: #333;
        box-sizing: border-box;
        transition: all 0.2s ease;
        -webkit-appearance: none;
        appearance: none;
      }
      .sz-personalization-wrapper select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23d4a574' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 14px center;
        padding-right: 40px;
        cursor: pointer;
      }
      .sz-personalization-wrapper select:focus,
      .sz-personalization-wrapper input[type="text"]:focus {
        outline: none;
        border-color: #b8956a;
        box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
      }
      .sz-personalization-wrapper input[type="text"]::placeholder {
        color: #999;
      }
      .sz-char-counter {
        display: block;
        text-align: right;
        font-size: 12px;
        color: #888;
        margin-top: 6px;
      }
      .sz-preview-box {
        margin-top: 16px;
        padding: 16px;
        background: #fff;
        border-radius: 10px;
        border: 2px dashed #d4a574;
        text-align: center;
      }
      .sz-preview-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #888;
        margin-bottom: 8px;
      }
      .sz-preview-text {
        font-size: 22px;
        font-weight: 600;
        color: #d4a574;
        min-height: 30px;
        transition: all 0.3s ease;
      }
      .sz-preview-details {
        font-size: 12px;
        color: #888;
        margin-top: 8px;
      }
      .sz-error-msg {
        display: none;
        color: #e74c3c;
        font-size: 13px;
        margin-top: 12px;
        padding: 10px 14px;
        background: #fdf2f2;
        border-radius: 6px;
        border-left: 3px solid #e74c3c;
      }
      .sz-error-msg.show {
        display: block;
      }
      /* Font preview classes */
      .sz-font-script { font-family: 'Brush Script MT', 'Segoe Script', cursive; }
      .sz-font-calligraphy { font-family: 'Edwardian Script ITC', 'Monotype Corsiva', cursive; font-style: italic; }
      .sz-font-handwritten { font-family: 'Comic Sans MS', 'Segoe Print', cursive; }
      .sz-font-brush { font-family: 'Mistral', 'Brush Script MT', cursive; }
      .sz-font-signature { font-family: 'Lucida Handwriting', 'Segoe Script', cursive; font-style: italic; }
      .sz-font-serif { font-family: 'Georgia', 'Times New Roman', serif; }
      .sz-font-elegant { font-family: 'Palatino Linotype', 'Book Antiqua', serif; }
      .sz-font-oldenglish { font-family: 'Old English Text MT', 'Luminari', fantasy; }
      .sz-font-roman { font-family: 'Times New Roman', 'Garamond', serif; }
      .sz-font-playfair { font-family: 'Didot', 'Bodoni MT', serif; font-weight: 400; }
      .sz-font-sans { font-family: 'Arial', 'Helvetica', sans-serif; }
      .sz-font-modern { font-family: 'Trebuchet MS', 'Lucida Sans', sans-serif; }
      .sz-font-minimalist { font-family: 'Futura', 'Century Gothic', sans-serif; letter-spacing: 2px; }
      .sz-font-bold { font-family: 'Impact', 'Arial Black', sans-serif; font-weight: 900; }
      .sz-font-rounded { font-family: 'Verdana', 'Arial Rounded MT Bold', sans-serif; }
      .sz-font-artdeco { font-family: 'Copperplate', 'Copperplate Gothic Bold', serif; letter-spacing: 3px; }
      .sz-font-stencil { font-family: 'Stencil Std', 'Impact', sans-serif; letter-spacing: 1px; }
      .sz-font-monogram { font-family: 'Monotype Corsiva', 'Edwardian Script ITC', cursive; font-size: 28px; }
      .sz-font-vintage { font-family: 'Courier New', 'American Typewriter', monospace; }
    </style>

    <h3>
      <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
      Personalize Your Bottle
    </h3>

    <div class="sz-field-row">
      <div class="sz-field-group">
        <label for="sz-font-select">
          Font Style <span class="required-star">*</span>
        </label>
        <select id="sz-font-select" name="properties[Font]" required>
          <option value="">Select a font...</option>
          <optgroup label="Script & Cursive">
            <option value="Script">Script (Elegant Cursive)</option>
            <option value="Calligraphy">Calligraphy (Formal)</option>
            <option value="Handwritten">Handwritten (Casual)</option>
            <option value="Brush Script">Brush Script (Artistic)</option>
            <option value="Signature">Signature (Personal)</option>
          </optgroup>
          <optgroup label="Serif (Classic)">
            <option value="Serif">Serif (Traditional)</option>
            <option value="Elegant">Elegant (Refined)</option>
            <option value="Old English">Old English (Gothic)</option>
            <option value="Roman">Roman (Timeless)</option>
            <option value="Playfair">Playfair (Sophisticated)</option>
          </optgroup>
          <optgroup label="Sans Serif (Modern)">
            <option value="Sans Serif">Sans Serif (Clean)</option>
            <option value="Modern">Modern (Contemporary)</option>
            <option value="Minimalist">Minimalist (Simple)</option>
            <option value="Bold">Bold (Statement)</option>
            <option value="Rounded">Rounded (Friendly)</option>
          </optgroup>
          <optgroup label="Decorative">
            <option value="Art Deco">Art Deco (Vintage)</option>
            <option value="Stencil">Stencil (Industrial)</option>
            <option value="Monogram">Monogram (Initial Style)</option>
            <option value="Vintage">Vintage (Retro)</option>
          </optgroup>
        </select>
      </div>

      <div class="sz-field-group">
        <label for="sz-color-select">
          Text Color <span class="required-star">*</span>
        </label>
        <select id="sz-color-select" name="properties[Color]" required>
          <option value="">Select a color...</option>
          <optgroup label="Metallic">
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Rose Gold">Rose Gold</option>
            <option value="Champagne">Champagne</option>
            <option value="Bronze">Bronze</option>
          </optgroup>
          <optgroup label="Classic">
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Navy Blue">Navy Blue</option>
            <option value="Burgundy">Burgundy</option>
            <option value="Forest Green">Forest Green</option>
            <option value="Ivory">Ivory</option>
            <option value="Blush Pink">Blush Pink</option>
          </optgroup>
        </select>
      </div>
    </div>

    <div class="sz-field-group">
      <label for="sz-name-input">
        Name on Water Bottle <span class="required-star">*</span>
      </label>
      <input
        id="sz-name-input"
        type="text"
        name="properties[Name on bottle]"
        placeholder="e.g., Sarah, Mr. & Mrs. Smith, Team Alpha"
        maxlength="25"
        required
        autocomplete="off"
      >
      <span class="sz-char-counter">0 / 25 characters</span>
    </div>

    <div class="sz-preview-box">
      <div class="sz-preview-label">Live Preview</div>
      <div class="sz-preview-text" id="sz-js-preview">Your name will appear here</div>
      <div class="sz-preview-details" id="sz-preview-details">Select font and color above</div>
    </div>

    <div class="sz-error-msg" id="sz-js-error">Please complete all personalization fields before adding to cart.</div>
  \`;

  // Insert before add button
  addButton.parentNode.insertBefore(container, addButton);

  // Set up event listeners
  var nameInput = document.getElementById('sz-name-input');
  var fontSelect = document.getElementById('sz-font-select');
  var colorSelect = document.getElementById('sz-color-select');
  var counter = container.querySelector('.sz-char-counter');
  var preview = document.getElementById('sz-js-preview');
  var previewDetails = document.getElementById('sz-preview-details');
  var errorMsg = document.getElementById('sz-js-error');

  // Font class mapping
  var fontClasses = {
    'Script': 'sz-font-script',
    'Calligraphy': 'sz-font-calligraphy',
    'Handwritten': 'sz-font-handwritten',
    'Brush Script': 'sz-font-brush',
    'Signature': 'sz-font-signature',
    'Serif': 'sz-font-serif',
    'Elegant': 'sz-font-elegant',
    'Old English': 'sz-font-oldenglish',
    'Roman': 'sz-font-roman',
    'Playfair': 'sz-font-playfair',
    'Sans Serif': 'sz-font-sans',
    'Modern': 'sz-font-modern',
    'Minimalist': 'sz-font-minimalist',
    'Bold': 'sz-font-bold',
    'Rounded': 'sz-font-rounded',
    'Art Deco': 'sz-font-artdeco',
    'Stencil': 'sz-font-stencil',
    'Monogram': 'sz-font-monogram',
    'Vintage': 'sz-font-vintage'
  };

  // Color mapping
  var colorValues = {
    'Gold': '#d4a574',
    'Silver': '#8e8e8e',
    'Rose Gold': '#b76e79',
    'Champagne': '#f7e7ce',
    'Bronze': '#cd7f32',
    'Black': '#222222',
    'White': '#666666',
    'Navy Blue': '#1a3a5c',
    'Burgundy': '#722f37',
    'Forest Green': '#228b22',
    'Ivory': '#fffff0',
    'Blush Pink': '#de98ab'
  };

  function updatePreview() {
    var name = nameInput.value.trim();
    var font = fontSelect.value;
    var color = colorSelect.value;

    // Update name preview
    if (name) {
      preview.textContent = name;
    } else {
      preview.textContent = 'Your name will appear here';
    }

    // Update font
    preview.className = 'sz-preview-text';
    if (font && fontClasses[font]) {
      preview.classList.add(fontClasses[font]);
    }

    // Update color
    if (color && colorValues[color]) {
      preview.style.color = colorValues[color];
    } else {
      preview.style.color = '#d4a574';
    }

    // Update details text
    var details = [];
    if (font) details.push(font + ' font');
    if (color) details.push(color + ' color');
    if (details.length > 0) {
      previewDetails.textContent = details.join(' • ');
    } else {
      previewDetails.textContent = 'Select font and color above';
    }

    errorMsg.classList.remove('show');
  }

  nameInput.addEventListener('input', function() {
    var len = this.value.length;
    counter.textContent = len + ' / 25 characters';
    counter.style.color = len >= 25 ? '#e74c3c' : (len >= 20 ? '#e67e22' : '#888');
    updatePreview();
  });

  fontSelect.addEventListener('change', updatePreview);
  colorSelect.addEventListener('change', updatePreview);

  // Validate on submit
  productForm.addEventListener('submit', function(e) {
    var errors = [];
    if (!fontSelect.value) errors.push('font');
    if (!colorSelect.value) errors.push('color');
    if (!nameInput.value.trim()) errors.push('name');

    if (errors.length > 0) {
      e.preventDefault();
      errorMsg.classList.add('show');
      if (!fontSelect.value) {
        fontSelect.focus();
      } else if (!colorSelect.value) {
        colorSelect.focus();
      } else {
        nameInput.focus();
      }
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
</script>
{% endif %}
`;

  const result2 = await putAsset(liveTheme.id, 'snippets/sz-personalization-inject.liquid', jsInjectionSnippet);
  console.log(result2.success ? '   ✅ Created sz-personalization-inject.liquid' : '   ❌ Failed');

  // Inject into theme.liquid
  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid && !themeLiquid.includes('sz-personalization-inject')) {
    themeLiquid = themeLiquid.replace('</body>', "{% render 'sz-personalization-inject' %}\n</body>");
    const result3 = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
    console.log(result3.success ? '   ✅ Injected into theme.liquid' : '   ❌ Failed to inject');
  } else if (themeLiquid) {
    console.log('   ✓ Already injected into theme.liquid');
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ PERSONALIZATION INPUT ADDED                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Features added:');
  console.log('  • Real text input field with name="properties[Name on bottle]"');
  console.log('  • Character counter (max 25 characters)');
  console.log('  • Live preview of personalization');
  console.log('  • Required field validation');
  console.log('  • Styled to match brand colors');
  console.log('');
  console.log('The personalization will appear in:');
  console.log('  • Order confirmations');
  console.log('  • Shopify admin order details');
  console.log('  • Packing slips and invoices');
  console.log('');
  console.log('🔗 Test: https://shelzysdesigns.com/collections/all');
  console.log('   (View any product page)');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
