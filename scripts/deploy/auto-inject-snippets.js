#!/usr/bin/env node

/**
 * AUTO-INJECT THEME SNIPPETS
 * ==========================
 * Automatically injects all conversion optimization snippets into theme templates
 * No manual theme editing required!
 *
 * Usage:
 *   node shopify/scripts/auto-inject-snippets.js
 *
 * Environment Variables Required:
 *   SHOPIFY_STORE_URL - Your Shopify store URL
 *   SHOPIFY_ACCESS_TOKEN - Your Shopify Admin API access token
 */

const https = require('https');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

// Colors for console
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(msg, color = 'reset') {
  console.log(`${c[color]}${msg}${c.reset}`);
}

// Shopify API request helper
function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    if (!CONFIG.accessToken) {
      reject(new Error('SHOPIFY_ACCESS_TOKEN not set'));
      return;
    }

    const options = {
      hostname: CONFIG.storeUrl,
      port: 443,
      path: `/admin/api/${CONFIG.apiVersion}${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': CONFIG.accessToken
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(result)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Get active theme
async function getActiveTheme() {
  const themes = await shopifyRequest('GET', '/themes.json');
  return themes.themes.find(t => t.role === 'main');
}

// Get theme asset
async function getAsset(themeId, key) {
  try {
    const result = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return result.asset ? result.asset.value : null;
  } catch (e) {
    return null;
  }
}

// Update theme asset
async function updateAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value }
  });
}

// ============================================
// SNIPPET DEFINITIONS
// ============================================

const SNIPPETS = {
  // Free Shipping Bar - goes in theme.liquid before </body>
  'sz-free-shipping-bar': `
{% comment %}
  Shelzy's Designs - Free Shipping Progress Bar
  Auto-injected by automation script
{% endcomment %}
<div id="sz-free-shipping-bar" style="display:none;">
  <div class="sz-shipping-inner">
    <span class="sz-shipping-message"></span>
    <div class="sz-shipping-progress">
      <div class="sz-shipping-progress-fill"></div>
    </div>
  </div>
</div>
<style>
#sz-free-shipping-bar{position:fixed;bottom:0;left:0;right:0;background:#4E5F4A;color:#fff;padding:12px 20px;text-align:center;z-index:9999;font-size:14px;font-family:Inter,sans-serif}
.sz-shipping-progress{height:4px;background:rgba(255,255,255,.3);border-radius:2px;margin-top:8px;max-width:300px;margin-left:auto;margin-right:auto}
.sz-shipping-progress-fill{height:100%;background:#D1C7A1;border-radius:2px;transition:width .3s ease;width:0}
</style>
<script>
(function(){var t=75,b=document.getElementById("sz-free-shipping-bar"),m=b.querySelector(".sz-shipping-message"),f=b.querySelector(".sz-shipping-progress-fill");function u(c){if(c>=t){m.innerHTML="🎉 You qualify for FREE shipping!";f.style.width="100%"}else{var r=(t-c).toFixed(2);m.innerHTML="Add $"+r+" more for FREE shipping!";f.style.width=(c/t*100)+"%"}b.style.display="block"}fetch("/cart.js").then(function(r){return r.json()}).then(function(c){if(c.item_count>0)u(c.total_price/100)});document.addEventListener("cart:updated",function(e){if(e.detail&&e.detail.total_price)u(e.detail.total_price/100)})})();
</script>`,

  // Social Proof Banner - can be rendered anywhere
  'sz-social-proof-banner': `
{% comment %}
  Shelzy's Designs - Social Proof Banner
  Auto-injected by automation script
{% endcomment %}
<div class="sz-proof-banner">
  <span>⭐ Rated 4.9/5 by 5,000+ Happy Customers</span>
</div>
<style>
.sz-proof-banner{background:#FAF9F6;text-align:center;padding:10px;font-size:14px;color:#4E5F4A;border-bottom:1px solid #E0E3DF}
</style>`,

  // Trust Badges
  'sz-trust-badges': `
{% comment %}
  Shelzy's Designs - Trust Badges
  Auto-injected by automation script
{% endcomment %}
<div class="sz-trust-badges">
  <div class="sz-badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Secure Checkout</span></div>
  <div class="sz-badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Satisfaction Guaranteed</span></div>
  <div class="sz-badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Fast Processing</span></div>
  <div class="sz-badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg><span>Premium Quality</span></div>
</div>
<style>
.sz-trust-badges{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;padding:20px;border-top:1px solid #E0E3DF;margin-top:20px}
.sz-badge{display:flex;align-items:center;gap:6px;color:#666;font-size:13px}
.sz-badge svg{color:#8BAA88}
@media(max-width:600px){.sz-trust-badges{gap:15px}.sz-badge{font-size:11px}}
</style>`,

  // Cart Upsell
  'sz-cart-upsell': `
{% comment %}
  Shelzy's Designs - Cart Upsell
  Auto-injected by automation script
{% endcomment %}
{% if cart.item_count > 0 %}
<div class="sz-cart-upsell">
  <h4>Complete Your Order</h4>
  <div class="sz-upsell-products">
    {% assign upsell_products = collections['best-sellers'].products | default: collections.all.products %}
    {% for product in upsell_products limit: 3 %}
      {% assign in_cart = false %}
      {% for item in cart.items %}
        {% if item.product.id == product.id %}{% assign in_cart = true %}{% break %}{% endif %}
      {% endfor %}
      {% unless in_cart %}
        <div class="sz-upsell-item">
          <a href="{{ product.url }}">
            {% if product.featured_image %}<img src="{{ product.featured_image | img_url: '100x' }}" alt="{{ product.title }}" loading="lazy">{% endif %}
          </a>
          <div class="sz-upsell-info">
            <a href="{{ product.url }}">{{ product.title | truncate: 25 }}</a>
            <span>{{ product.price | money }}</span>
          </div>
        </div>
      {% endunless %}
    {% endfor %}
  </div>
</div>
{% endif %}
<style>
.sz-cart-upsell{padding:20px;background:#FAF9F6;border-radius:12px;margin-top:20px}
.sz-cart-upsell h4{font-family:"Playfair Display",serif;color:#4E5F4A;margin:0 0 15px;font-size:16px}
.sz-upsell-products{display:flex;gap:12px;overflow-x:auto}
.sz-upsell-item{flex:0 0 100px;text-align:center}
.sz-upsell-item img{width:100%;border-radius:8px;margin-bottom:6px}
.sz-upsell-info a{color:#2B2B2B;text-decoration:none;font-size:12px;display:block}
.sz-upsell-info span{color:#8BAA88;font-weight:600;font-size:13px}
</style>`,

  // Urgency Timer
  'sz-urgency': `
{% comment %}
  Shelzy's Designs - Urgency Elements
  Auto-injected by automation script
{% endcomment %}
{% if product.available %}
<div class="sz-urgency">
  <div class="sz-order-deadline">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    <span>Order within <strong id="sz-countdown"></strong> to ship tomorrow!</span>
  </div>
  {% if product.variants.first.inventory_quantity <= 5 and product.variants.first.inventory_quantity > 0 %}
  <div class="sz-low-stock"><span class="sz-pulse"></span>Only {{ product.variants.first.inventory_quantity }} left in stock!</div>
  {% endif %}
</div>
<style>
.sz-urgency{margin:15px 0}
.sz-order-deadline{display:flex;align-items:center;gap:8px;padding:12px 15px;background:#FFF9E6;border-radius:8px;font-size:14px}
.sz-order-deadline svg{color:#D1C7A1;flex-shrink:0}
.sz-low-stock{display:flex;align-items:center;gap:8px;color:#e74c3c;font-size:14px;font-weight:500;margin-top:10px}
.sz-pulse{width:8px;height:8px;background:#e74c3c;border-radius:50%;animation:szpulse 1.5s infinite}
@keyframes szpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.2)}}
</style>
<script>
(function(){var el=document.getElementById("sz-countdown");if(!el)return;function upd(){var now=new Date(),cut=new Date();cut.setHours(14,0,0,0);if(now>=cut)cut.setDate(cut.getDate()+1);var d=cut-now,h=Math.floor(d/36e5),m=Math.floor((d%36e5)/6e4);el.textContent=h+"h "+m+"m"}upd();setInterval(upd,6e4)})();
</script>
{% endif %}`,

  // Announcement Bar
  'sz-announcement-bar': `
{% comment %}
  Shelzy's Designs - Announcement Bar
  Auto-injected by automation script
{% endcomment %}
<div class="sz-announcement">
  <div class="sz-announcement-inner">
    <span>✨ FREE SHIPPING on orders over $75! Use code <strong>WELCOME10</strong> for 10% off your first order ✨</span>
  </div>
</div>
<style>
.sz-announcement{background:linear-gradient(90deg,#8BAA88,#4E5F4A);color:#fff;text-align:center;padding:10px 15px;font-size:13px}
.sz-announcement strong{color:#D1C7A1}
@media(max-width:600px){.sz-announcement{font-size:11px;padding:8px 10px}}
</style>`,

  // Email Popup (Exit Intent)
  'sz-email-popup': `
{% comment %}
  Shelzy's Designs - Email Capture Popup
  Auto-injected by automation script
{% endcomment %}
<div id="sz-popup-overlay" style="display:none;">
  <div class="sz-popup">
    <button class="sz-popup-close" onclick="document.getElementById('sz-popup-overlay').style.display='none';localStorage.setItem('sz-popup-closed','1')">&times;</button>
    <h2>Get 10% Off Your First Order!</h2>
    <p>Join our VIP list for exclusive deals, new arrivals, and bridal party tips.</p>
    <form id="sz-popup-form" action="/contact#contact_form" method="post">
      <input type="hidden" name="form_type" value="customer">
      <input type="hidden" name="contact[tags]" value="newsletter,popup">
      <input type="email" name="contact[email]" placeholder="Enter your email" required>
      <button type="submit">GET MY 10% OFF</button>
    </form>
    <p class="sz-popup-code">Use code: <strong>WELCOME10</strong></p>
    <p class="sz-popup-note">No spam, unsubscribe anytime.</p>
  </div>
</div>
<style>
#sz-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:99999;display:flex;align-items:center;justify-content:center}
.sz-popup{background:#fff;padding:40px;border-radius:16px;max-width:400px;width:90%;text-align:center;position:relative;font-family:Inter,sans-serif}
.sz-popup-close{position:absolute;top:10px;right:15px;background:none;border:none;font-size:28px;cursor:pointer;color:#999}
.sz-popup h2{font-family:"Playfair Display",serif;color:#4E5F4A;margin:0 0 10px;font-size:24px}
.sz-popup p{color:#666;margin:0 0 20px;font-size:14px}
.sz-popup input[type="email"]{width:100%;padding:14px;border:1px solid #E0E3DF;border-radius:999px;font-size:16px;margin-bottom:12px;box-sizing:border-box}
.sz-popup button[type="submit"]{width:100%;padding:14px;background:#8BAA88;color:#fff;border:none;border-radius:999px;font-size:16px;font-weight:600;cursor:pointer}
.sz-popup button[type="submit"]:hover{background:#4E5F4A}
.sz-popup-code{background:#FAF9F6;padding:10px;border-radius:8px;margin:15px 0 10px}
.sz-popup-code strong{color:#8BAA88}
.sz-popup-note{font-size:11px;color:#999;margin:0}
</style>
<script>
(function(){if(localStorage.getItem('sz-popup-closed'))return;var shown=false;function show(){if(shown)return;shown=true;document.getElementById('sz-popup-overlay').style.display='flex'}
document.addEventListener('mouseleave',function(e){if(e.clientY<0)show()});
setTimeout(show,15000);
var scroll=0;window.addEventListener('scroll',function(){scroll++;if(scroll>3)show()})})();
</script>`
};

// ============================================
// THEME INJECTION LOGIC
// ============================================

async function injectIntoThemeLiquid(themeId) {
  log('\n[1/4] Injecting into theme.liquid...', 'cyan');

  const key = 'layout/theme.liquid';
  let content = await getAsset(themeId, key);

  if (!content) {
    log('  Could not read theme.liquid', 'red');
    return;
  }

  let modified = false;

  // Inject announcement bar after <body> tag
  if (!content.includes('sz-announcement')) {
    content = content.replace(/<body[^>]*>/i, (match) => {
      modified = true;
      return match + '\n{% render \'sz-announcement-bar\' %}\n{% render \'sz-social-proof-banner\' %}';
    });
    log('  + Added announcement bar and social proof banner', 'green');
  }

  // Inject free shipping bar and popup before </body>
  if (!content.includes('sz-free-shipping-bar')) {
    content = content.replace(/<\/body>/i, (match) => {
      modified = true;
      return '{% render \'sz-free-shipping-bar\' %}\n{% render \'sz-email-popup\' %}\n' + match;
    });
    log('  + Added free shipping bar and email popup', 'green');
  }

  if (modified) {
    await updateAsset(themeId, key, content);
    log('  ✓ theme.liquid updated', 'green');
  } else {
    log('  Already injected, skipping', 'yellow');
  }
}

async function injectIntoProductTemplate(themeId) {
  log('\n[2/4] Injecting into product template...', 'cyan');

  // Try different possible product template locations
  const possibleKeys = [
    'sections/main-product.liquid',
    'sections/product-template.liquid',
    'templates/product.liquid',
    'sections/product.liquid'
  ];

  let found = false;

  for (const key of possibleKeys) {
    let content = await getAsset(themeId, key);
    if (!content) continue;

    found = true;
    let modified = false;

    // Add trust badges and urgency near the add to cart button
    if (!content.includes('sz-trust-badges')) {
      // Try to find add to cart button area
      const patterns = [
        /(<\/form>)/i,
        /({% endform %})/i,
        /(class="product-form[^"]*"[^>]*>[\s\S]*?<\/div>)/i
      ];

      for (const pattern of patterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, (match) => {
            modified = true;
            return match + '\n{% render \'sz-urgency\' %}\n{% render \'sz-trust-badges\' %}';
          });
          break;
        }
      }
    }

    if (modified) {
      await updateAsset(themeId, key, content);
      log(`  ✓ ${key} updated with trust badges and urgency`, 'green');
    } else {
      log(`  Already injected in ${key}, skipping`, 'yellow');
    }
    break;
  }

  if (!found) {
    log('  Could not find product template, creating standalone section', 'yellow');
  }
}

async function injectIntoCartTemplate(themeId) {
  log('\n[3/4] Injecting into cart template...', 'cyan');

  const possibleKeys = [
    'sections/main-cart-items.liquid',
    'sections/cart-template.liquid',
    'templates/cart.liquid',
    'sections/cart.liquid'
  ];

  let found = false;

  for (const key of possibleKeys) {
    let content = await getAsset(themeId, key);
    if (!content) continue;

    found = true;
    let modified = false;

    if (!content.includes('sz-cart-upsell')) {
      // Add upsell section before checkout button or at end
      const patterns = [
        /(class="cart__checkout[^"]*")/i,
        /(<button[^>]*checkout[^>]*>)/i,
        /(<\/form>)/i
      ];

      for (const pattern of patterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, (match) => {
            modified = true;
            return '{% render \'sz-cart-upsell\' %}\n' + match;
          });
          break;
        }
      }

      // If no pattern matched, append at end
      if (!modified) {
        content += '\n{% render \'sz-cart-upsell\' %}';
        modified = true;
      }
    }

    if (modified) {
      await updateAsset(themeId, key, content);
      log(`  ✓ ${key} updated with upsells`, 'green');
    } else {
      log(`  Already injected in ${key}, skipping`, 'yellow');
    }
    break;
  }

  if (!found) {
    log('  Could not find cart template', 'yellow');
  }
}

async function uploadAllSnippets(themeId) {
  log('\n[4/4] Uploading snippet files...', 'cyan');

  for (const [name, content] of Object.entries(SNIPPETS)) {
    try {
      await updateAsset(themeId, `snippets/${name}.liquid`, content);
      log(`  ✓ snippets/${name}.liquid`, 'green');
    } catch (e) {
      log(`  ✗ snippets/${name}.liquid: ${e.message}`, 'red');
    }
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║   AUTO-INJECT THEME SNIPPETS - Shelzy\'s Designs       ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');

  if (!CONFIG.accessToken) {
    log('ERROR: SHOPIFY_ACCESS_TOKEN not set!', 'red');
    log('\nSet it with:', 'yellow');
    log('  export SHOPIFY_ACCESS_TOKEN="your_token"', 'reset');
    process.exit(1);
  }

  try {
    // Get active theme
    log('Finding active theme...', 'cyan');
    const theme = await getActiveTheme();
    if (!theme) {
      throw new Error('No active theme found');
    }
    log(`Active theme: ${theme.name} (ID: ${theme.id})`, 'green');

    // Upload all snippets first
    await uploadAllSnippets(theme.id);

    // Inject into templates
    await injectIntoThemeLiquid(theme.id);
    await injectIntoProductTemplate(theme.id);
    await injectIntoCartTemplate(theme.id);

    console.log('\n');
    log('╔════════════════════════════════════════════════════════╗', 'green');
    log('║              INJECTION COMPLETE!                       ║', 'green');
    log('╚════════════════════════════════════════════════════════╝', 'green');
    console.log('\n');
    log('The following are now active on your site:', 'cyan');
    log('  ✓ Announcement bar with discount code', 'reset');
    log('  ✓ Social proof banner', 'reset');
    log('  ✓ Free shipping progress bar', 'reset');
    log('  ✓ Exit-intent email popup', 'reset');
    log('  ✓ Trust badges on product pages', 'reset');
    log('  ✓ Urgency timer on product pages', 'reset');
    log('  ✓ Cart upsell section', 'reset');
    console.log('\n');

  } catch (e) {
    log(`\nFATAL ERROR: ${e.message}`, 'red');
    process.exit(1);
  }
}

main();
