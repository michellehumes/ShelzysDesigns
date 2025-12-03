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

async function deleteAsset(themeId, key) {
  try {
    await shopifyRequest('DELETE', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return true;
  } catch (e) {
    return false;
  }
}

// Clean, minimal site-wide styles
const szCleanStyles = `{% comment %}
  SZ Clean Styles - Minimal, on-brand enhancements
{% endcomment %}

<style>
/* =============================================
   SHELZYS DESIGNS - CLEAN SITE STYLES
   Brand Color: #D4A574 (Rose Gold/Copper)
   ============================================= */

/* Hide ALL custom announcement bars - use theme default */
.sz-announcement,
.sz-announcement-bar,
.sz-announcement-cro,
#sz-announcement,
[class*="sz-announcement"] {
  display: none !important;
}

/* Hide any black/dark announcement overrides */
.announcement-bar[style*="background: #000"],
.announcement-bar[style*="background:#000"],
.announcement-bar[style*="background: black"],
.announcement-bar[style*="background:black"] {
  background: #D4A574 !important;
}

/* =============================================
   TRUST STRIP - Subtle, clean design
   ============================================= */
.sz-trust-strip {
  background: #fdf8f4 !important;
  padding: 12px 0 !important;
  border-bottom: 1px solid #f0e6dc !important;
}

.sz-trust-strip-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #666;
}

.sz-trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sz-trust-item svg {
  width: 16px;
  height: 16px;
  color: #D4A574;
}

/* =============================================
   PRODUCT PAGE ENHANCEMENTS
   ============================================= */
.sz-product-trust {
  background: #fdf8f4;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}

.sz-product-trust-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #555;
  border-bottom: 1px solid #f0e6dc;
}

.sz-product-trust-item:last-child {
  border-bottom: none;
}

.sz-product-trust-item svg {
  width: 18px;
  height: 18px;
  color: #D4A574;
  flex-shrink: 0;
}

/* =============================================
   COLLECTION PAGE - Clean filters
   ============================================= */
.sz-collection-filters {
  padding: 15px 0;
  margin-bottom: 20px;
}

.sz-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.sz-filter-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  color: #555;
  font-size: 13px;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.2s;
}

.sz-filter-btn:hover,
.sz-filter-btn.active {
  border-color: #D4A574;
  background: #D4A574;
  color: white;
}

/* Hide filter title for cleaner look */
.sz-filter-title {
  display: none;
}

/* =============================================
   BUTTONS - Consistent styling
   ============================================= */
.sz-btn-primary {
  background: #D4A574;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.sz-btn-primary:hover {
  background: #c49664;
}

/* =============================================
   HIDE DUPLICATE/MESSY ELEMENTS
   ============================================= */

/* Hide any duplicate social proof */
.sz-social-proof:not(:first-of-type) {
  display: none !important;
}

/* Hide collection banners - too busy */
.sz-collection-banner {
  display: none !important;
}

/* Hide product card badges - too cluttered */
.sz-card-badges {
  display: none !important;
}

/* Hide blog sidebar on mobile */
@media (max-width: 768px) {
  .sz-blog-sidebar {
    display: none;
  }
}

/* =============================================
   CART ENHANCEMENTS - Subtle
   ============================================= */
.sz-cart-trust {
  background: #fdf8f4;
  padding: 12px 15px;
  border-radius: 6px;
  margin: 15px 0;
  font-size: 13px;
  color: #666;
  text-align: center;
}

/* =============================================
   FOOTER - Clean enhancement
   ============================================= */
.sz-footer-trust {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  color: #888;
}

/* =============================================
   GENERAL CLEANUP
   ============================================= */

/* Smooth transitions */
a, button {
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

/* Remove any leftover black backgrounds */
[style*="background: #000"],
[style*="background:#000"],
[style*="background: black"],
[style*="background:black"] {
  background: #D4A574 !important;
}

/* Hide empty sections */
section:empty {
  display: none;
}

/* Consistent link colors */
a {
  color: #D4A574;
}

a:hover {
  color: #c49664;
}

/* Product card hover - subtle */
.product-card,
.card-wrapper {
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover,
.card-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .sz-trust-strip-inner {
    gap: 15px;
    font-size: 12px;
  }

  .sz-trust-item span {
    display: none;
  }
}
</style>`;

// Simplified site loader
const szSiteLoader = `{% comment %}
  SZ Site Loader - Clean, minimal enhancements
{% endcomment %}

{% comment %} Clean styles - loads first {% endcomment %}
{% render 'sz-clean-styles' %}

{% comment %} SEO enhancements {% endcomment %}
{% render 'sz-seo-meta' %}

{% comment %} Product page trust elements {% endcomment %}
{% if template contains 'product' %}
  {% render 'sz-product-trust-stack' %}
{% endif %}

{% comment %} Collection filters {% endcomment %}
{% if template contains 'collection' %}
  {% render 'sz-collection-filters' %}
{% endif %}`;

async function main() {
  console.log('========================================================');
  console.log('  SHELZYS DESIGNS - STYLE CLEANUP');
  console.log('========================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // Delete old messy snippets
    console.log('Removing messy snippets...');

    const toDelete = [
      'snippets/sz-announcement-bar-cro.liquid',
      'snippets/sz-social-proof.liquid',
      'snippets/sz-popup-wedding.liquid',
      'snippets/sz-cro-enhancements.liquid',
      'snippets/sz-hero-cta.liquid',
      'snippets/sz-bridal-bundles.liquid',
      'snippets/sz-sublimation-story.liquid',
      'snippets/sz-site-overhaul.liquid',
      'snippets/sz-phase2-loader.liquid',
      'snippets/sz-collection-banner.liquid',
      'snippets/sz-product-card-enhance.liquid',
      'snippets/sz-blog-sidebar.liquid'
    ];

    for (const key of toDelete) {
      const deleted = await deleteAsset(themeId, key);
      if (deleted) {
        console.log(`  ✓ Removed ${key}`);
      }
    }

    // Create clean styles
    console.log('\nCreating clean styles...');
    await createAsset(themeId, 'snippets/sz-clean-styles.liquid', szCleanStyles);
    console.log('  ✓ Created sz-clean-styles.liquid');

    // Create simplified loader
    await createAsset(themeId, 'snippets/sz-site-loader.liquid', szSiteLoader);
    console.log('  ✓ Created sz-site-loader.liquid');

    // Update theme.liquid to use new loader
    console.log('\nUpdating theme.liquid...');
    let themeLiquid = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`);
    themeLiquid = themeLiquid.asset.value;

    // Remove old loader references
    themeLiquid = themeLiquid.replace(/\s*\{% comment %\} Shelzys Designs Site Enhancements \{% endcomment %\}/g, '');
    themeLiquid = themeLiquid.replace(/\s*\{% render 'sz-site-overhaul' %\}/g, '');
    themeLiquid = themeLiquid.replace(/\s*\{% render 'sz-phase2-loader' %\}/g, '');
    themeLiquid = themeLiquid.replace(/\s*\{% render 'sz-site-loader' %\}/g, '');

    // Add new clean loader
    if (themeLiquid.includes('</head>')) {
      themeLiquid = themeLiquid.replace('</head>', "\n  {% render 'sz-site-loader' %}\n</head>");
    }

    await createAsset(themeId, 'layout/theme.liquid', themeLiquid);
    console.log('  ✓ Updated theme.liquid with clean loader');

    console.log('\n========================================================');
    console.log('  CLEANUP COMPLETE!');
    console.log('========================================================');
    console.log('\nChanges made:');
    console.log('  • Removed cluttered announcement bars');
    console.log('  • Removed busy collection banners');
    console.log('  • Removed product card badges');
    console.log('  • Removed duplicate social proof');
    console.log('  • Removed popups');
    console.log('  • Applied clean, on-brand styles (#D4A574)');
    console.log('  • Simplified to essential enhancements only');
    console.log('\nYour site should now be clean and cohesive!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
