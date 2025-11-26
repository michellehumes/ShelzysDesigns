#!/usr/bin/env node

/**
 * Inject product enhancement snippets into product template
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

// Snippet to inject via JavaScript on product pages
function getProductPageInjector() {
  return '{% comment %}Shelzy\'s - Product Page Snippet Injector{% endcomment %}\n' +
'{% if template contains \'product\' %}\n' +
'<script>\n' +
'(function() {\n' +
'  function injectProductEnhancements() {\n' +
'    // Find the product form or add to cart button\n' +
'    var targets = [\n' +
'      ".product-form",\n' +
'      ".product__form",\n' +
'      ".product-single__form",\n' +
'      "[data-product-form]",\n' +
'      ".shopify-product-form",\n' +
'      "#AddToCartForm",\n' +
'      ".product__info-wrapper"\n' +
'    ];\n' +
'    \n' +
'    var form = null;\n' +
'    for (var i = 0; i < targets.length; i++) {\n' +
'      form = document.querySelector(targets[i]);\n' +
'      if (form) break;\n' +
'    }\n' +
'    \n' +
'    if (!form) {\n' +
'      console.log("Product form not found, trying broader search...");\n' +
'      // Try to find add to cart button and go up\n' +
'      var addBtn = document.querySelector(\'[name="add"], .add-to-cart, #AddToCart, .product-form__cart-submit\');\n' +
'      if (addBtn) {\n' +
'        form = addBtn.closest("form") || addBtn.parentElement;\n' +
'      }\n' +
'    }\n' +
'    \n' +
'    if (form) {\n' +
'      // Check if already injected\n' +
'      if (document.querySelector(".sz-product-trust")) return;\n' +
'      \n' +
'      // Create trust badges\n' +
'      var trustHTML = \'<div class="sz-product-trust">\' +\n' +
'        \'<div class="trust-badges-row">\' +\n' +
'        \'<div class="trust-badge"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg><span>Permanent Print</span></div>\' +\n' +
'        \'<div class="trust-badge"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>Secure Checkout</span></div>\' +\n' +
'        \'<div class="trust-badge"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2.81A2 2 0 0 1 20 8v8a2 2 0 0 1-2 2h-2"/><polyline points="15 3 18 6 15 9"/><line x1="18" y1="6" x2="9" y2="6"/></svg><span>5-7 Day Shipping</span></div>\' +\n' +
'        \'<div class="trust-badge"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span>Made with Love</span></div>\' +\n' +
'        \'</div>\' +\n' +
'        \'<div class="trust-guarantee"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>100% Satisfaction Guaranteed - Love it or we\\\'ll make it right</span></div>\' +\n' +
'        \'</div>\';\n' +
'      \n' +
'      // Create specs accordion\n' +
'      var specsHTML = \'<div class="sz-product-specs">\' +\n' +
'        \'<div class="specs-toggle" onclick="this.classList.toggle(\\\'active\\\')">\' +\n' +
'        \'<span>Product Details & Care</span>\' +\n' +
'        \'<svg class="toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>\' +\n' +
'        \'</div>\' +\n' +
'        \'<div class="specs-content">\' +\n' +
'        \'<div class="specs-section"><h4>Bottle Specifications</h4><ul>\' +\n' +
'        \'<li><strong>Capacity:</strong> 20oz / 590ml</li>\' +\n' +
'        \'<li><strong>Height:</strong> 10.5 inches</li>\' +\n' +
'        \'<li><strong>Material:</strong> 18/8 Stainless Steel</li>\' +\n' +
'        \'<li><strong>Insulation:</strong> Double-wall vacuum</li>\' +\n' +
'        \'<li><strong>Keeps drinks cold:</strong> 24+ hours</li>\' +\n' +
'        \'<li><strong>Keeps drinks hot:</strong> 12+ hours</li>\' +\n' +
'        \'</ul></div>\' +\n' +
'        \'<div class="specs-section"><h4>Sublimation Printing</h4><ul>\' +\n' +
'        \'<li>Permanently infused into coating</li>\' +\n' +
'        \'<li>Won\\\'t peel, crack, or fade</li>\' +\n' +
'        \'<li>Smooth, professional finish</li>\' +\n' +
'        \'<li>Vibrant, long-lasting colors</li>\' +\n' +
'        \'</ul></div>\' +\n' +
'        \'<div class="specs-section"><h4>Care Instructions</h4><ul>\' +\n' +
'        \'<li><strong>Dishwasher safe</strong> (top rack recommended)</li>\' +\n' +
'        \'<li>Hand wash for longest life</li>\' +\n' +
'        \'<li>Do not microwave</li>\' +\n' +
'        \'<li>Avoid abrasive scrubbers</li>\' +\n' +
'        \'</ul></div>\' +\n' +
'        \'</div></div>\';\n' +
'      \n' +
'      // Insert after form\n' +
'      var wrapper = document.createElement("div");\n' +
'      wrapper.innerHTML = trustHTML + specsHTML;\n' +
'      form.parentNode.insertBefore(wrapper, form.nextSibling);\n' +
'      \n' +
'      console.log("Shelzy\\'s product enhancements injected!");\n' +
'    }\n' +
'  }\n' +
'  \n' +
'  // Run on DOM ready and after a delay (for dynamic themes)\n' +
'  if (document.readyState === "loading") {\n' +
'    document.addEventListener("DOMContentLoaded", injectProductEnhancements);\n' +
'  } else {\n' +
'    injectProductEnhancements();\n' +
'  }\n' +
'  setTimeout(injectProductEnhancements, 1000);\n' +
'  setTimeout(injectProductEnhancements, 2500);\n' +
'})();\n' +
'</script>\n' +
'\n' +
'<style>\n' +
'.sz-product-trust {\n' +
'  margin: 20px 0;\n' +
'  padding: 20px;\n' +
'  background: #fdf8f5;\n' +
'  border-radius: 12px;\n' +
'}\n' +
'.trust-badges-row {\n' +
'  display: grid;\n' +
'  grid-template-columns: repeat(4, 1fr);\n' +
'  gap: 15px;\n' +
'  margin-bottom: 15px;\n' +
'}\n' +
'.sz-product-trust .trust-badge {\n' +
'  display: flex;\n' +
'  flex-direction: column;\n' +
'  align-items: center;\n' +
'  gap: 8px;\n' +
'  text-align: center;\n' +
'}\n' +
'.sz-product-trust .trust-badge svg { color: #d4a574; }\n' +
'.sz-product-trust .trust-badge span { font-size: 12px; color: #666; font-weight: 500; }\n' +
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
'.sz-product-specs {\n' +
'  margin: 20px 0;\n' +
'  border: 1px solid #e8e0d8;\n' +
'  border-radius: 12px;\n' +
'  overflow: hidden;\n' +
'}\n' +
'.specs-toggle {\n' +
'  display: flex;\n' +
'  justify-content: space-between;\n' +
'  align-items: center;\n' +
'  padding: 16px 20px;\n' +
'  background: #fff;\n' +
'  cursor: pointer;\n' +
'  font-weight: 600;\n' +
'  color: #2d2d2d;\n' +
'}\n' +
'.specs-toggle:hover { background: #fdf8f5; }\n' +
'.toggle-icon { transition: transform 0.3s; }\n' +
'.specs-toggle.active .toggle-icon { transform: rotate(180deg); }\n' +
'.specs-content { display: none; padding: 0 20px 20px; background: #fff; }\n' +
'.specs-toggle.active + .specs-content { display: block; }\n' +
'.specs-section { padding: 15px 0; border-bottom: 1px solid #f0f0f0; }\n' +
'.specs-section:last-child { border-bottom: none; }\n' +
'.specs-section h4 { font-size: 14px; font-weight: 600; color: #d4a574; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }\n' +
'.specs-section ul { list-style: none; padding: 0; margin: 0; }\n' +
'.specs-section li { font-size: 14px; color: #555; padding: 4px 0; display: flex; align-items: center; gap: 8px; }\n' +
'.specs-section li:before { content: ""; width: 4px; height: 4px; background: #d4a574; border-radius: 50%; flex-shrink: 0; }\n' +
'@media (max-width: 600px) {\n' +
'  .trust-badges-row { grid-template-columns: repeat(2, 1fr); }\n' +
'}\n' +
'</style>\n' +
'{% endif %}\n';
}

async function main() {
  console.log('Injecting product enhancements...');
  console.log('');

  const themesResponse = await apiRequest('GET', '/themes.json');
  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');
  console.log('Theme: ' + liveTheme.name);

  // Create the injector snippet
  const result = await putAsset(liveTheme.id, 'snippets/sz-product-page-injector.liquid', getProductPageInjector());

  if (result.success) {
    console.log('[OK] Created product page injector snippet');
  } else {
    console.log('[FAIL] Could not create snippet');
    process.exit(1);
  }

  // Add to theme.liquid if not present
  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid && !themeLiquid.includes('sz-product-page-injector')) {
    themeLiquid = themeLiquid.replace('</body>', "{% render 'sz-product-page-injector' %}\n</body>");
    const updateResult = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
    console.log(updateResult.success ? '[OK] Added to theme.liquid' : '[FAIL] Could not update theme.liquid');
  } else {
    console.log('[OK] Already in theme.liquid');
  }

  console.log('');
  console.log('Done! Trust badges and specs will now appear on all product pages.');
  console.log('View at: https://shelzysdesigns.com/collections/all');
}

main().catch(console.error);
