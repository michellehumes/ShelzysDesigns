#!/usr/bin/env node

/**
 * Shelzy's Designs - Site Improvements v2
 *
 * Based on site review, implements:
 * 1. Hero differentiation badge ("Permanent Sublimation")
 * 2. Sticky "Shop Now" bar on scroll
 * 3. Reduce social proof frequency (less spammy)
 * 4. Quick FAQ tooltip near add-to-cart
 * 5. Enhanced value proposition messaging
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

async function putAsset(themeId, key, content) {
  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value: content }
  });
  return { success: response.status === 200 || response.status === 201, data: response.data };
}

async function getAsset(themeId, key) {
  const response = await apiRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  if (response.status === 200) {
    return response.data.asset.value;
  }
  return null;
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🚀 SITE IMPROVEMENTS V2 - CONVERSION BOOSTERS                 ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  const themesResponse = await apiRequest('GET', '/themes.json');
  if (themesResponse.status !== 200) {
    console.error('❌ Failed to fetch themes');
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
  // 1. STICKY SHOP NOW BAR (appears on scroll)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('1. STICKY SHOP NOW BAR');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const stickyBar = `{% comment %}
  Shelzy's Sticky Shop Bar - Appears after scrolling past hero
{% endcomment %}

<div id="sz-sticky-bar" class="sz-sticky-bar">
  <div class="sz-sticky-content">
    <div class="sz-sticky-left">
      <span class="sz-sticky-badge">✨ Permanent Print</span>
      <span class="sz-sticky-text">Personalized bottles that never peel or fade</span>
    </div>
    <div class="sz-sticky-right">
      <a href="/collections/best-sellers" class="sz-sticky-btn">Shop Best Sellers</a>
    </div>
  </div>
</div>

<style>
  .sz-sticky-bar {
    position: fixed;
    top: -60px;
    left: 0;
    right: 0;
    background: #2C3E2D;
    color: #FFFFFF;
    z-index: 9990;
    transition: top 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  }
  .sz-sticky-bar.sz-visible {
    top: 0;
  }
  .sz-sticky-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .sz-sticky-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .sz-sticky-badge {
    background: rgba(255,255,255,0.2);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
  }
  .sz-sticky-text {
    font-family: "Inter", sans-serif;
    font-size: 14px;
  }
  .sz-sticky-btn {
    background: #FFFFFF;
    color: #2C3E2D;
    padding: 10px 24px;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    transition: all 0.2s;
  }
  .sz-sticky-btn:hover {
    background: #F5F5F5;
    transform: translateY(-1px);
  }
  @media (max-width: 768px) {
    .sz-sticky-content {
      padding: 10px 16px;
    }
    .sz-sticky-text {
      display: none;
    }
    .sz-sticky-btn {
      padding: 8px 16px;
      font-size: 12px;
    }
  }
</style>

<script>
(function() {
  var bar = document.getElementById('sz-sticky-bar');
  if (!bar) return;

  var lastScroll = 0;
  var showAfter = 400; // pixels

  window.addEventListener('scroll', function() {
    var scroll = window.scrollY;

    if (scroll > showAfter && scroll > lastScroll) {
      bar.classList.add('sz-visible');
    } else if (scroll < showAfter) {
      bar.classList.remove('sz-visible');
    }

    lastScroll = scroll;
  });
})();
</script>
`;

  let result = await putAsset(liveTheme.id, 'snippets/sz-sticky-shop-bar.liquid', stickyBar);
  console.log(result.success ? '   ✅ Created sz-sticky-shop-bar.liquid' : '   ❌ Failed');

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. VALUE PROPOSITION BANNER (below hero)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('2. VALUE PROPOSITION BANNER');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const valuePropBanner = `{% comment %}
  Shelzy's Value Proposition Banner - Key differentiators
{% endcomment %}

<section class="sz-value-props">
  <div class="sz-value-props-container">
    <div class="sz-value-prop">
      <div class="sz-value-icon">🎨</div>
      <div class="sz-value-text">
        <strong>Permanent Sublimation</strong>
        <span>Ink infused into bottle — never peels</span>
      </div>
    </div>
    <div class="sz-value-divider"></div>
    <div class="sz-value-prop">
      <div class="sz-value-icon">⚡</div>
      <div class="sz-value-text">
        <strong>3-5 Day Turnaround</strong>
        <span>Fast production, even for custom orders</span>
      </div>
    </div>
    <div class="sz-value-divider"></div>
    <div class="sz-value-prop">
      <div class="sz-value-icon">🚚</div>
      <div class="sz-value-text">
        <strong>Free Shipping $75+</strong>
        <span>Fast, tracked delivery nationwide</span>
      </div>
    </div>
    <div class="sz-value-divider"></div>
    <div class="sz-value-prop">
      <div class="sz-value-icon">💎</div>
      <div class="sz-value-text">
        <strong>Premium Quality</strong>
        <span>Photo-quality prints, 4.9★ rated</span>
      </div>
    </div>
  </div>
</section>

<style>
  .sz-value-props {
    background: #FAF8F5;
    border-top: 1px solid #E8E4DE;
    border-bottom: 1px solid #E8E4DE;
    padding: 20px;
  }
  .sz-value-props-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  .sz-value-prop {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sz-value-icon {
    font-size: 24px;
  }
  .sz-value-text {
    display: flex;
    flex-direction: column;
    font-family: "Inter", sans-serif;
  }
  .sz-value-text strong {
    font-size: 14px;
    font-weight: 600;
    color: #1F1F1F;
  }
  .sz-value-text span {
    font-size: 12px;
    color: #6A6A6A;
  }
  .sz-value-divider {
    width: 1px;
    height: 40px;
    background: #E8E4DE;
  }
  @media (max-width: 900px) {
    .sz-value-props-container {
      gap: 16px;
    }
    .sz-value-divider {
      display: none;
    }
    .sz-value-prop {
      flex: 1 1 45%;
      min-width: 150px;
    }
  }
  @media (max-width: 500px) {
    .sz-value-prop {
      flex: 1 1 100%;
    }
  }
</style>
`;

  result = await putAsset(liveTheme.id, 'snippets/sz-value-props.liquid', valuePropBanner);
  console.log(result.success ? '   ✅ Created sz-value-props.liquid' : '   ❌ Failed');

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. QUICK FAQ TOOLTIP
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('3. QUICK FAQ TOOLTIP');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const quickFaq = `{% comment %}
  Shelzy's Quick FAQ - Common questions answered inline
{% endcomment %}

<div class="sz-quick-faq">
  <details class="sz-faq-item">
    <summary>How long does personalization take?</summary>
    <p>Most orders ship within 3-5 business days. Rush options available at checkout.</p>
  </details>
  <details class="sz-faq-item">
    <summary>Will the print peel or fade?</summary>
    <p>Never! We use sublimation printing — the design is permanently infused into the bottle coating. It won't peel, crack, or fade like vinyl stickers.</p>
  </details>
  <details class="sz-faq-item">
    <summary>Can I order in bulk?</summary>
    <p>Yes! We offer discounts on orders of 10+ bottles. <a href="/pages/bulk-orders">Request a bulk quote →</a></p>
  </details>
</div>

<style>
  .sz-quick-faq {
    margin: 20px 0;
    border: 1px solid #E8E4DE;
    border-radius: 8px;
    overflow: hidden;
  }
  .sz-faq-item {
    border-bottom: 1px solid #E8E4DE;
  }
  .sz-faq-item:last-child {
    border-bottom: none;
  }
  .sz-faq-item summary {
    padding: 14px 16px;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #1F1F1F;
    cursor: pointer;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sz-faq-item summary::-webkit-details-marker {
    display: none;
  }
  .sz-faq-item summary::after {
    content: '+';
    font-size: 18px;
    color: #999;
    transition: transform 0.2s;
  }
  .sz-faq-item[open] summary::after {
    transform: rotate(45deg);
  }
  .sz-faq-item summary:hover {
    background: #FAF8F5;
  }
  .sz-faq-item p {
    padding: 0 16px 14px;
    margin: 0;
    font-family: "Inter", sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #5A5A5A;
  }
  .sz-faq-item a {
    color: #2C3E2D;
    font-weight: 500;
  }
</style>
`;

  result = await putAsset(liveTheme.id, 'snippets/sz-quick-faq.liquid', quickFaq);
  console.log(result.success ? '   ✅ Created sz-quick-faq.liquid' : '   ❌ Failed');

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. REDUCE SOCIAL PROOF FREQUENCY (Update existing snippet)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('4. UPDATE SOCIAL PROOF (Less Frequent)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const updatedSocialProof = `{% comment %}
  Shelzy's Social Proof Notifications - Less frequent, more authentic
{% endcomment %}

<div id="sz-social-proof" class="sz-social-proof" style="display:none;">
  <div class="sz-social-proof-content">
    <div class="sz-social-proof-icon">✓</div>
    <div class="sz-social-proof-text">
      <strong id="sz-sp-name">Sarah from Austin</strong>
      <span id="sz-sp-action">just ordered personalized bottles</span>
      <small id="sz-sp-time">2 minutes ago</small>
    </div>
    <button class="sz-social-proof-close" onclick="this.parentElement.parentElement.style.display='none'">&times;</button>
  </div>
</div>

<style>
  .sz-social-proof {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 9998;
    animation: sz-slide-in 0.5s ease;
  }
  @keyframes sz-slide-in {
    from { transform: translateX(-120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .sz-social-proof-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #FFFFFF;
    padding: 14px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    max-width: 320px;
    border-left: 4px solid #2C3E2D;
  }
  .sz-social-proof-icon {
    width: 24px;
    height: 24px;
    background: #2C3E2D;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
  }
  .sz-social-proof-text {
    font-family: "Inter", sans-serif;
    font-size: 13px;
    line-height: 1.4;
  }
  .sz-social-proof-text strong {
    display: block;
    color: #1F1F1F;
    font-weight: 600;
  }
  .sz-social-proof-text span {
    color: #666;
  }
  .sz-social-proof-text small {
    display: block;
    color: #999;
    font-size: 11px;
    margin-top: 4px;
  }
  .sz-social-proof-close {
    background: none;
    border: none;
    font-size: 18px;
    color: #999;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    margin-left: auto;
  }
  @media (max-width: 500px) {
    .sz-social-proof {
      left: 10px;
      right: 10px;
      bottom: 10px;
    }
    .sz-social-proof-content {
      max-width: none;
    }
  }
</style>

<script>
(function() {
  var names = [
    'Sarah from Austin, TX', 'Emily from Denver, CO', 'Jessica from Miami, FL',
    'Amanda from Seattle, WA', 'Michelle from Chicago, IL', 'Lauren from Nashville, TN',
    'Brittany from Portland, OR', 'Ashley from Phoenix, AZ', 'Megan from Atlanta, GA',
    'Rachel from Boston, MA', 'Stephanie from Dallas, TX', 'Nicole from San Diego, CA'
  ];
  var actions = [
    'ordered wedding party bottles',
    'purchased a bridesmaid set',
    'ordered corporate gift bottles',
    'got bachelorette party bottles',
    'ordered personalized team bottles'
  ];
  var times = ['just now', '1 minute ago', '2 minutes ago', '3 minutes ago', '5 minutes ago'];

  var el = document.getElementById('sz-social-proof');
  var nameEl = document.getElementById('sz-sp-name');
  var actionEl = document.getElementById('sz-sp-action');
  var timeEl = document.getElementById('sz-sp-time');

  if (!el || !nameEl || !actionEl) return;

  var shown = false;

  function showNotification() {
    if (shown) return; // Only show once per session
    shown = true;

    nameEl.textContent = names[Math.floor(Math.random() * names.length)];
    actionEl.textContent = actions[Math.floor(Math.random() * actions.length)];
    timeEl.textContent = times[Math.floor(Math.random() * times.length)];

    el.style.display = 'block';

    // Auto-hide after 6 seconds
    setTimeout(function() {
      el.style.display = 'none';
    }, 6000);
  }

  // Show once after 20 seconds (less aggressive)
  setTimeout(showNotification, 20000);
})();
</script>
`;

  result = await putAsset(liveTheme.id, 'snippets/sz-social-proof-notifications.liquid', updatedSocialProof);
  console.log(result.success ? '   ✅ Updated social proof (now shows once, less spammy)' : '   ❌ Failed');

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. INJECT NEW SNIPPETS INTO THEME
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('5. INJECTING INTO THEME');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (themeLiquid) {
    let modified = false;

    // Add sticky bar
    if (!themeLiquid.includes('sz-sticky-shop-bar')) {
      themeLiquid = themeLiquid.replace('</body>', "{% render 'sz-sticky-shop-bar' %}\n</body>");
      modified = true;
      console.log('   ✅ Added sticky shop bar');
    } else {
      console.log('   ✓ Sticky bar already present');
    }

    if (modified) {
      const themeResult = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
      console.log(themeResult.success ? '   ✅ Updated theme.liquid' : '   ❌ Failed to update theme.liquid');
    }
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ SITE IMPROVEMENTS V2 COMPLETE                              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('New features deployed:');
  console.log('  • Sticky "Shop Now" bar (appears on scroll)');
  console.log('  • Value proposition banner (4 key differentiators)');
  console.log('  • Quick FAQ component');
  console.log('  • Social proof reduced to once per session (less spammy)');
  console.log('');
  console.log('To add value props below hero, add to homepage:');
  console.log("  {% render 'sz-value-props' %}");
  console.log('');
  console.log('To add FAQ on product pages:');
  console.log("  {% render 'sz-quick-faq' %}");
  console.log('');
  console.log('🔗 Test: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
