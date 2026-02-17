#!/usr/bin/env node

/**
 * Shelzy's Designs - Add Personalization Input Field
 * Supports single bottles AND multi-bottle sets with step-by-step wizard
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

  // Create the personalization snippet
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('DEPLOYING PERSONALIZATION FORM');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // The snippet content - using a heredoc-style approach to avoid escaping issues
  const snippetContent = `{% comment %}
  Shelzy's Designs - Personalization Input
  Supports single bottles AND multi-bottle sets (3-pack, 5-pack, 6-pack, 10-pack)
{% endcomment %}

{% if template contains 'product' %}
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
  margin: 0 0 16px 0;
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
.sz-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.sz-progress-step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background: #e8e8e8;
  color: #888;
  transition: all 0.3s ease;
}
.sz-progress-step.active {
  background: #d4a574;
  color: #fff;
  transform: scale(1.1);
}
.sz-progress-step.completed {
  background: #4caf50;
  color: #fff;
}
.sz-current-bottle {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
.sz-current-bottle strong {
  color: #d4a574;
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
.sz-btn-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.sz-btn {
  flex: 1;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.sz-btn-next {
  background: #d4a574;
  color: #fff;
}
.sz-btn-next:hover {
  background: #c49464;
}
.sz-btn-back {
  background: #e8e8e8;
  color: #666;
}
.sz-btn-back:hover {
  background: #ddd;
}
.sz-completed-list {
  margin-top: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}
.sz-completed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: #fff;
  border-radius: 6px;
  border-left: 3px solid #4caf50;
  font-size: 13px;
}
.sz-completed-item:last-child {
  margin-bottom: 0;
}
.sz-completed-item .bottle-num {
  font-weight: 600;
  color: #d4a574;
  min-width: 30px;
}
.sz-completed-item .bottle-name {
  flex: 1;
  margin: 0 12px;
  color: #333;
}
.sz-completed-item .bottle-edit {
  color: #d4a574;
  text-decoration: underline;
  cursor: pointer;
  font-size: 12px;
}
.sz-all-done {
  text-align: center;
  padding: 20px;
  background: #e8f5e9;
  border-radius: 10px;
  margin-top: 16px;
}
.sz-all-done h4 {
  margin: 0 0 8px 0;
  color: #4caf50;
  font-size: 16px;
}
.sz-all-done p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
.sz-font-script { font-family: 'Brush Script MT', cursive; }
.sz-font-calligraphy { font-family: 'Monotype Corsiva', cursive; font-style: italic; }
.sz-font-handwritten { font-family: 'Comic Sans MS', cursive; }
.sz-font-brush { font-family: 'Brush Script MT', cursive; }
.sz-font-signature { font-family: 'Lucida Handwriting', cursive; font-style: italic; }
.sz-font-serif { font-family: Georgia, serif; }
.sz-font-elegant { font-family: 'Palatino Linotype', serif; }
.sz-font-oldenglish { font-family: 'Old English Text MT', fantasy; }
.sz-font-roman { font-family: 'Times New Roman', serif; }
.sz-font-playfair { font-family: Didot, serif; }
.sz-font-sans { font-family: Arial, sans-serif; }
.sz-font-modern { font-family: 'Trebuchet MS', sans-serif; }
.sz-font-minimalist { font-family: 'Century Gothic', sans-serif; letter-spacing: 2px; }
.sz-font-bold { font-family: Impact, sans-serif; font-weight: 900; }
.sz-font-rounded { font-family: Verdana, sans-serif; }
.sz-font-artdeco { font-family: Copperplate, serif; letter-spacing: 3px; }
.sz-font-stencil { font-family: Impact, sans-serif; letter-spacing: 1px; }
.sz-font-monogram { font-family: 'Monotype Corsiva', cursive; font-size: 28px; }
.sz-font-vintage { font-family: 'Courier New', monospace; }
</style>

<script>
(function() {
  function initPersonalization() {
    // Remove existing if any
    var existing = document.getElementById('sz-personalization');
    if (existing) existing.remove();

    // Find product form
    var productForm = document.querySelector('form[action*="/cart/add"]');
    if (!productForm) {
      productForm = document.querySelector('.product-form');
    }
    if (!productForm) {
      productForm = document.querySelector('[data-product-form]');
    }
    if (!productForm) return;

    // Find add button
    var addButton = productForm.querySelector('[type="submit"]');
    if (!addButton) addButton = productForm.querySelector('.add-to-cart');
    if (!addButton) addButton = productForm.querySelector('button');
    if (!addButton) return;

    // Get product title
    var titleEl = document.querySelector('.product__title, .product-single__title, h1.title, [data-product-title], .ProductMeta__Title, h1');
    var titleText = titleEl ? titleEl.textContent.toLowerCase() : '';

    // Detect bottle count
    var bottleCount = 1;
    var setMatch = titleText.match(/set of (\\d+)/);
    if (setMatch) {
      bottleCount = parseInt(setMatch[1]);
    } else {
      var packMatch = titleText.match(/(\\d+)\\s*-?pack/);
      if (packMatch) {
        bottleCount = parseInt(packMatch[1]);
      }
    }

    // Font and color options
    var fontOptions = '<optgroup label="Script & Cursive">' +
      '<option value="Script">Script (Elegant Cursive)</option>' +
      '<option value="Calligraphy">Calligraphy (Formal)</option>' +
      '<option value="Handwritten">Handwritten (Casual)</option>' +
      '<option value="Brush Script">Brush Script (Artistic)</option>' +
      '<option value="Signature">Signature (Personal)</option>' +
      '</optgroup>' +
      '<optgroup label="Serif (Classic)">' +
      '<option value="Serif">Serif (Traditional)</option>' +
      '<option value="Elegant">Elegant (Refined)</option>' +
      '<option value="Old English">Old English (Gothic)</option>' +
      '<option value="Roman">Roman (Timeless)</option>' +
      '<option value="Playfair">Playfair (Sophisticated)</option>' +
      '</optgroup>' +
      '<optgroup label="Sans Serif (Modern)">' +
      '<option value="Sans Serif">Sans Serif (Clean)</option>' +
      '<option value="Modern">Modern (Contemporary)</option>' +
      '<option value="Minimalist">Minimalist (Simple)</option>' +
      '<option value="Bold">Bold (Statement)</option>' +
      '<option value="Rounded">Rounded (Friendly)</option>' +
      '</optgroup>' +
      '<optgroup label="Decorative">' +
      '<option value="Art Deco">Art Deco (Vintage)</option>' +
      '<option value="Stencil">Stencil (Industrial)</option>' +
      '<option value="Monogram">Monogram (Initial Style)</option>' +
      '<option value="Vintage">Vintage (Retro)</option>' +
      '</optgroup>';

    var colorOptions = '<optgroup label="Metallic">' +
      '<option value="Gold">Gold</option>' +
      '<option value="Silver">Silver</option>' +
      '<option value="Rose Gold">Rose Gold</option>' +
      '<option value="Champagne">Champagne</option>' +
      '<option value="Bronze">Bronze</option>' +
      '</optgroup>' +
      '<optgroup label="Classic">' +
      '<option value="Black">Black</option>' +
      '<option value="White">White</option>' +
      '<option value="Navy Blue">Navy Blue</option>' +
      '<option value="Burgundy">Burgundy</option>' +
      '<option value="Forest Green">Forest Green</option>' +
      '<option value="Ivory">Ivory</option>' +
      '<option value="Blush Pink">Blush Pink</option>' +
      '</optgroup>';

    var fontClasses = {
      'Script': 'sz-font-script', 'Calligraphy': 'sz-font-calligraphy',
      'Handwritten': 'sz-font-handwritten', 'Brush Script': 'sz-font-brush',
      'Signature': 'sz-font-signature', 'Serif': 'sz-font-serif',
      'Elegant': 'sz-font-elegant', 'Old English': 'sz-font-oldenglish',
      'Roman': 'sz-font-roman', 'Playfair': 'sz-font-playfair',
      'Sans Serif': 'sz-font-sans', 'Modern': 'sz-font-modern',
      'Minimalist': 'sz-font-minimalist', 'Bold': 'sz-font-bold',
      'Rounded': 'sz-font-rounded', 'Art Deco': 'sz-font-artdeco',
      'Stencil': 'sz-font-stencil', 'Monogram': 'sz-font-monogram',
      'Vintage': 'sz-font-vintage'
    };

    var colorValues = {
      'Gold': '#d4a574', 'Silver': '#8e8e8e', 'Rose Gold': '#b76e79',
      'Champagne': '#f7e7ce', 'Bronze': '#cd7f32', 'Black': '#222222',
      'White': '#666666', 'Navy Blue': '#1a3a5c', 'Burgundy': '#722f37',
      'Forest Green': '#228b22', 'Ivory': '#fffff0', 'Blush Pink': '#de98ab'
    };

    // Create container
    var container = document.createElement('div');
    container.className = 'sz-personalization-wrapper';
    container.id = 'sz-personalization';

    var html = '<h3>' +
      '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>' +
      'Personalize Your ' + (bottleCount > 1 ? bottleCount + ' Bottles' : 'Bottle') +
      '</h3>';

    if (bottleCount > 1) {
      // Multi-bottle wizard
      html += '<div class="sz-progress" id="sz-progress">';
      for (var i = 0; i < bottleCount; i++) {
        html += '<div class="sz-progress-step' + (i === 0 ? ' active' : '') + '" data-step="' + i + '">' + (i + 1) + '</div>';
      }
      html += '</div>';
      html += '<div class="sz-current-bottle">Customizing <strong>Bottle #<span id="sz-bottle-num">1</span></strong> of ' + bottleCount + '</div>';
    }

    html += '<div id="sz-form-area">' +
      '<div class="sz-field-row">' +
      '<div class="sz-field-group">' +
      '<label>Font Style <span class="required-star">*</span></label>' +
      '<select id="sz-font"' + (bottleCount === 1 ? ' name="properties[Font]"' : '') + ' required>' +
      '<option value="">Select a font...</option>' + fontOptions + '</select>' +
      '</div>' +
      '<div class="sz-field-group">' +
      '<label>Text Color <span class="required-star">*</span></label>' +
      '<select id="sz-color"' + (bottleCount === 1 ? ' name="properties[Color]"' : '') + ' required>' +
      '<option value="">Select a color...</option>' + colorOptions + '</select>' +
      '</div>' +
      '</div>' +
      '<div class="sz-field-group">' +
      '<label>Name on Water Bottle <span class="required-star">*</span></label>' +
      '<input type="text" id="sz-name"' + (bottleCount === 1 ? ' name="properties[Name on bottle]"' : '') + ' placeholder="e.g., Sarah, Mr. & Mrs. Smith" maxlength="25" required autocomplete="off">' +
      '<span class="sz-char-counter" id="sz-counter">0 / 25 characters</span>' +
      '</div>' +
      '<div class="sz-preview-box">' +
      '<div class="sz-preview-label">Live Preview</div>' +
      '<div class="sz-preview-text" id="sz-preview">Your name will appear here</div>' +
      '<div class="sz-preview-details" id="sz-details">Select font and color above</div>' +
      '</div>' +
      '<div class="sz-error-msg" id="sz-error">Please complete all fields.</div>';

    if (bottleCount > 1) {
      html += '<div class="sz-btn-row">' +
        '<button type="button" class="sz-btn sz-btn-back" id="sz-back" style="display:none;">← Back</button>' +
        '<button type="button" class="sz-btn sz-btn-next" id="sz-next">Save & Next Bottle →</button>' +
        '</div>';
    }

    html += '</div>';

    if (bottleCount > 1) {
      html += '<div id="sz-completed" class="sz-completed-list" style="display:none;"></div>' +
        '<div id="sz-done" class="sz-all-done" style="display:none;">' +
        '<h4>✓ All ' + bottleCount + ' Bottles Customized!</h4>' +
        '<p>Click "Add to Cart" to complete your order.</p>' +
        '</div>' +
        '<div id="sz-hidden"></div>';
    }

    container.innerHTML = html;
    addButton.parentNode.insertBefore(container, addButton);

    // Get elements
    var fontEl = document.getElementById('sz-font');
    var colorEl = document.getElementById('sz-color');
    var nameEl = document.getElementById('sz-name');
    var counterEl = document.getElementById('sz-counter');
    var previewEl = document.getElementById('sz-preview');
    var detailsEl = document.getElementById('sz-details');
    var errorEl = document.getElementById('sz-error');

    function updatePreview() {
      var name = nameEl.value.trim();
      var font = fontEl.value;
      var color = colorEl.value;

      previewEl.textContent = name || 'Your name will appear here';
      previewEl.className = 'sz-preview-text';
      if (font && fontClasses[font]) {
        previewEl.classList.add(fontClasses[font]);
      }
      previewEl.style.color = (color && colorValues[color]) ? colorValues[color] : '#d4a574';

      var details = [];
      if (font) details.push(font + ' font');
      if (color) details.push(color + ' color');
      detailsEl.textContent = details.length ? details.join(' • ') : 'Select font and color above';
      errorEl.classList.remove('show');
    }

    nameEl.addEventListener('input', function() {
      var len = this.value.length;
      counterEl.textContent = len + ' / 25 characters';
      counterEl.style.color = len >= 25 ? '#e74c3c' : (len >= 20 ? '#e67e22' : '#888');
      updatePreview();
    });

    fontEl.addEventListener('change', updatePreview);
    colorEl.addEventListener('change', updatePreview);

    // Multi-bottle wizard logic
    if (bottleCount > 1) {
      var bottles = [];
      var currentBottle = 0;
      var nextBtn = document.getElementById('sz-next');
      var backBtn = document.getElementById('sz-back');
      var bottleNumEl = document.getElementById('sz-bottle-num');
      var formArea = document.getElementById('sz-form-area');
      var completedEl = document.getElementById('sz-completed');
      var doneEl = document.getElementById('sz-done');
      var hiddenEl = document.getElementById('sz-hidden');
      var progressSteps = document.querySelectorAll('.sz-progress-step');

      function updateProgress() {
        progressSteps.forEach(function(step, idx) {
          step.classList.remove('active', 'completed');
          step.textContent = idx + 1;
          if (idx < bottles.length) {
            step.classList.add('completed');
            step.textContent = '✓';
          } else if (idx === currentBottle) {
            step.classList.add('active');
          }
        });
      }

      function updateCompleted() {
        var html = '';
        bottles.forEach(function(b, idx) {
          html += '<div class="sz-completed-item">' +
            '<span class="bottle-num">#' + (idx + 1) + '</span>' +
            '<span class="bottle-name">' + b.name + ' (' + b.font + ', ' + b.color + ')</span>' +
            '<span class="bottle-edit" data-idx="' + idx + '">Edit</span>' +
            '</div>';
        });
        completedEl.innerHTML = html;
        completedEl.style.display = bottles.length ? 'block' : 'none';

        completedEl.querySelectorAll('.bottle-edit').forEach(function(el) {
          el.addEventListener('click', function() {
            currentBottle = parseInt(this.getAttribute('data-idx'));
            showForm();
          });
        });
      }

      function updateHidden() {
        var html = '';
        bottles.forEach(function(b, idx) {
          var n = idx + 1;
          html += '<input type="hidden" name="properties[Bottle ' + n + ' - Font]" value="' + b.font + '">' +
            '<input type="hidden" name="properties[Bottle ' + n + ' - Color]" value="' + b.color + '">' +
            '<input type="hidden" name="properties[Bottle ' + n + ' - Name]" value="' + b.name + '">';
        });
        hiddenEl.innerHTML = html;
      }

      function showForm() {
        formArea.style.display = 'block';
        doneEl.style.display = 'none';
        bottleNumEl.textContent = currentBottle + 1;
        backBtn.style.display = currentBottle > 0 ? 'block' : 'none';
        nextBtn.textContent = currentBottle === bottleCount - 1 ? 'Save & Finish ✓' : 'Save & Next Bottle →';

        if (bottles[currentBottle]) {
          fontEl.value = bottles[currentBottle].font;
          colorEl.value = bottles[currentBottle].color;
          nameEl.value = bottles[currentBottle].name;
        } else {
          fontEl.value = '';
          colorEl.value = '';
          nameEl.value = '';
        }
        updatePreview();
        updateProgress();
        updateCompleted();
      }

      function validate() {
        if (!fontEl.value || !colorEl.value || !nameEl.value.trim()) {
          errorEl.classList.add('show');
          if (!fontEl.value) fontEl.focus();
          else if (!colorEl.value) colorEl.focus();
          else nameEl.focus();
          return false;
        }
        return true;
      }

      function save() {
        bottles[currentBottle] = {
          font: fontEl.value,
          color: colorEl.value,
          name: nameEl.value.trim()
        };
        updateHidden();
        updateCompleted();
      }

      nextBtn.addEventListener('click', function() {
        if (!validate()) return;
        save();

        if (currentBottle < bottleCount - 1) {
          currentBottle++;
          showForm();
        } else {
          formArea.style.display = 'none';
          doneEl.style.display = 'block';
          updateProgress();
          updateCompleted();
        }
      });

      backBtn.addEventListener('click', function() {
        if (fontEl.value && colorEl.value && nameEl.value.trim()) {
          save();
        }
        currentBottle--;
        showForm();
      });

      productForm.addEventListener('submit', function(e) {
        if (bottles.length < bottleCount) {
          e.preventDefault();
          errorEl.textContent = 'Please customize all ' + bottleCount + ' bottles before adding to cart.';
          errorEl.classList.add('show');
          container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      showForm();
    } else {
      // Single bottle validation
      productForm.addEventListener('submit', function(e) {
        if (!fontEl.value || !colorEl.value || !nameEl.value.trim()) {
          e.preventDefault();
          errorEl.classList.add('show');
          if (!fontEl.value) fontEl.focus();
          else if (!colorEl.value) colorEl.focus();
          else nameEl.focus();
          container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersonalization);
  } else {
    initPersonalization();
  }
})();
</script>
{% endif %}
`;

  const result1 = await putAsset(liveTheme.id, 'snippets/sz-personalization-inject.liquid', snippetContent);
  console.log(result1.success ? '   ✅ Created sz-personalization-inject.liquid' : '   ❌ Failed');

  // Ensure it's in theme.liquid
  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid) {
    if (!themeLiquid.includes('sz-personalization-inject')) {
      themeLiquid = themeLiquid.replace('</body>', "{% render 'sz-personalization-inject' %}\n</body>");
      const result2 = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
      console.log(result2.success ? '   ✅ Injected into theme.liquid' : '   ❌ Failed to inject');
    } else {
      console.log('   ✓ Already in theme.liquid');
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ PERSONALIZATION DEPLOYED                                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Features:');
  console.log('  • Font selection (19 options)');
  console.log('  • Color selection (12 options)');
  console.log('  • Name input with character counter');
  console.log('  • Live preview');
  console.log('');
  console.log('Multi-bottle sets (auto-detected from title):');
  console.log('  • "Set of 3", "Set of 5", "Set of 6", "Set of 10"');
  console.log('  • Step-by-step wizard');
  console.log('  • Progress indicator');
  console.log('  • Edit completed bottles');
  console.log('');
  console.log('🔗 Test at: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
