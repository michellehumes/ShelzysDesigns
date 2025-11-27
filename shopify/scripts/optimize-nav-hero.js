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
// 1. ANNOUNCEMENT BAR SNIPPET
// ============================================================================
const announcementBar = `{% comment %}
  Shelzy's Announcement Bar - Benefit-driven, always visible
{% endcomment %}

<div class="sz-announcement-bar">
  <div class="sz-announcement-bar__inner">
    <p class="sz-announcement-bar__text">
      <span class="sz-announcement-bar__item">Free Shipping Over $50</span>
      <span class="sz-announcement-bar__divider">•</span>
      <span class="sz-announcement-bar__item">3–5 Day Turnaround</span>
      <span class="sz-announcement-bar__divider">•</span>
      <span class="sz-announcement-bar__item">Permanent Sublimation Printing</span>
    </p>
  </div>
</div>

<style>
.sz-announcement-bar {
  background: var(--sz-sage, #A6B8A0);
  color: white;
  text-align: center;
  padding: 10px 16px;
  font-family: var(--sz-font-body, 'Inter', sans-serif);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.03em;
  position: relative;
  z-index: 100;
}

.sz-announcement-bar__inner {
  max-width: 1200px;
  margin: 0 auto;
}

.sz-announcement-bar__text {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}

.sz-announcement-bar__item {
  white-space: nowrap;
}

.sz-announcement-bar__divider {
  opacity: 0.6;
}

/* Hide default theme announcement bar */
.announcement-bar:not(.sz-announcement-bar),
.announcement:not(.sz-announcement-bar),
[class*="announcement"]:not(.sz-announcement-bar):not([class*="sz-"]) {
  display: none !important;
}

@media (max-width: 749px) {
  .sz-announcement-bar {
    font-size: 11px;
    padding: 8px 12px;
  }

  .sz-announcement-bar__divider {
    display: none;
  }

  .sz-announcement-bar__text {
    gap: 4px 12px;
  }

  .sz-announcement-bar__item::before {
    content: "✓ ";
    opacity: 0.8;
  }
}
</style>`;

// ============================================================================
// 2. HOMEPAGE HERO SECTION
// ============================================================================
const homepageHero = `{% comment %}
  Shelzy's Homepage Hero - Optimized for clarity
{% endcomment %}

<section class="sz-hero">
  <div class="sz-hero__background">
    {% if section.settings.hero_image != blank %}
      {{ section.settings.hero_image | image_url: width: 1920 | image_tag: class: 'sz-hero__image', loading: 'eager' }}
    {% endif %}
    <div class="sz-hero__overlay"></div>
  </div>

  <div class="sz-hero__content">
    <div class="sz-hero__inner">
      <h1 class="sz-hero__title">{{ section.settings.heading }}</h1>
      <p class="sz-hero__subtitle">{{ section.settings.subheading }}</p>

      <div class="sz-hero__buttons">
        {% if section.settings.button_primary_text != blank %}
          <a href="{{ section.settings.button_primary_link }}" class="sz-hero__btn sz-hero__btn--primary">
            {{ section.settings.button_primary_text }}
          </a>
        {% endif %}
        {% if section.settings.button_secondary_text != blank %}
          <a href="{{ section.settings.button_secondary_link }}" class="sz-hero__btn sz-hero__btn--secondary">
            {{ section.settings.button_secondary_text }}
          </a>
        {% endif %}
      </div>
    </div>
  </div>
</section>

<style>
.sz-hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--sz-beige, #F7F3EC);
}

.sz-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.sz-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sz-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.4) 100%
  );
}

.sz-hero__content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 60px 24px;
  text-align: center;
}

.sz-hero__inner {
  max-width: 800px;
  margin: 0 auto;
}

.sz-hero__title {
  font-family: var(--sz-font-heading, 'Playfair Display', serif);
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 600;
  line-height: 1.15;
  color: var(--sz-black, #111111);
  margin: 0 0 20px 0;
  letter-spacing: -0.02em;
}

.sz-hero__subtitle {
  font-family: var(--sz-font-body, 'Inter', sans-serif);
  font-size: clamp(16px, 2vw, 19px);
  font-weight: 400;
  line-height: 1.6;
  color: var(--sz-gray-dark, #333333);
  margin: 0 0 32px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.sz-hero__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.sz-hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--sz-font-body, 'Inter', sans-serif);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 16px 36px;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.25s ease;
  min-width: 180px;
}

.sz-hero__btn--primary {
  background: var(--sz-sage, #A6B8A0);
  color: white;
  box-shadow: 0 4px 16px rgba(166, 184, 160, 0.3);
}

.sz-hero__btn--primary:hover {
  background: var(--sz-sage-dark, #8FA589);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(166, 184, 160, 0.4);
}

.sz-hero__btn--secondary {
  background: white;
  color: var(--sz-sage, #A6B8A0);
  border: 2px solid var(--sz-sage, #A6B8A0);
}

.sz-hero__btn--secondary:hover {
  background: var(--sz-sage, #A6B8A0);
  color: white;
}

@media (max-width: 749px) {
  .sz-hero {
    min-height: 60vh;
  }

  .sz-hero__content {
    padding: 48px 20px;
  }

  .sz-hero__buttons {
    flex-direction: column;
    align-items: center;
  }

  .sz-hero__btn {
    width: 100%;
    max-width: 280px;
  }
}
</style>

{% schema %}
{
  "name": "Shelzy's Hero",
  "settings": [
    {
      "type": "image_picker",
      "id": "hero_image",
      "label": "Background image"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Luxury Personalized Water Bottles for Weddings & Events"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "Permanent sublimation printing that never peels. 3–5 day turnaround with free personalization on every bottle."
    },
    {
      "type": "text",
      "id": "button_primary_text",
      "label": "Primary button text",
      "default": "Shop Bridal Bottles"
    },
    {
      "type": "url",
      "id": "button_primary_link",
      "label": "Primary button link"
    },
    {
      "type": "text",
      "id": "button_secondary_text",
      "label": "Secondary button text",
      "default": "Shop Best Sellers"
    },
    {
      "type": "url",
      "id": "button_secondary_link",
      "label": "Secondary button link"
    }
  ],
  "presets": [
    {
      "name": "Shelzy's Hero"
    }
  ]
}
{% endschema %}`;

// ============================================================================
// 3. HOMEPAGE HERO JSON TEMPLATE SETTINGS
// ============================================================================
const heroSettings = {
  "heading": "Luxury Personalized Water Bottles for Weddings & Events",
  "subheading": "Permanent sublimation printing that never peels. 3–5 day turnaround with free personalization on every bottle.",
  "button_primary_text": "Shop Bridal Bottles",
  "button_primary_link": "/collections/wedding-water-bottles",
  "button_secondary_text": "Shop Best Sellers",
  "button_secondary_link": "/collections/best-sellers"
};

// ============================================================================
// 4. NAVIGATION MENU UPDATE (via theme settings if available)
// ============================================================================
const navigationConfig = `{% comment %}
  Shelzy's Navigation - Clean, prioritized structure
  This snippet provides navigation styling and mobile optimization
{% endcomment %}

<style>
/* Clean navigation styling */
.site-nav,
.header__nav {
  font-family: var(--sz-font-body, 'Inter', sans-serif);
}

.site-nav__link,
.header__nav-link,
.main-nav__link {
  font-size: 13px !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
  color: var(--sz-black, #111111) !important;
  padding: 8px 14px !important;
  transition: color 0.2s ease !important;
}

.site-nav__link:hover,
.header__nav-link:hover,
.main-nav__link:hover {
  color: var(--sz-sage, #A6B8A0) !important;
}

/* Ensure nav doesn't wrap */
.site-nav__links,
.header__nav-items,
.main-nav__list {
  flex-wrap: nowrap !important;
  gap: 4px !important;
}

/* Active state */
.site-nav__link--active,
.header__nav-link--active {
  color: var(--sz-sage, #A6B8A0) !important;
}

/* Mobile nav styling */
@media (max-width: 989px) {
  .mobile-nav__link {
    font-family: var(--sz-font-body, 'Inter', sans-serif) !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    padding: 14px 20px !important;
    border-bottom: 1px solid var(--sz-gray-lighter, #E5E5E5) !important;
  }

  .mobile-nav__link:hover {
    color: var(--sz-sage, #A6B8A0) !important;
    background: var(--sz-beige, #F7F3EC) !important;
  }
}

/* Header cleanup */
.site-header,
.header {
  background: white !important;
  border-bottom: 1px solid var(--sz-gray-lighter, #E5E5E5) !important;
}
</style>`;

// ============================================================================
// MAIN DEPLOYMENT
// ============================================================================
async function main() {
  console.log('================================================================');
  console.log('  NAVIGATION & HOMEPAGE OPTIMIZATION');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // 1. Deploy announcement bar
    console.log('--- Deploying Announcement Bar ---\n');
    await createAsset(themeId, 'snippets/sz-announcement-bar-new.liquid', announcementBar);
    console.log('✓ Created snippets/sz-announcement-bar-new.liquid');

    // 2. Deploy hero section
    console.log('\n--- Deploying Homepage Hero ---\n');
    await createAsset(themeId, 'sections/sz-hero-main.liquid', homepageHero);
    console.log('✓ Created sections/sz-hero-main.liquid');

    // 3. Deploy navigation styles
    console.log('\n--- Deploying Navigation Styles ---\n');
    await createAsset(themeId, 'snippets/sz-nav-styles.liquid', navigationConfig);
    console.log('✓ Created snippets/sz-nav-styles.liquid');

    // 4. Inject into theme.liquid
    console.log('\n--- Updating theme.liquid ---\n');
    const themeLiquid = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquid) {
      let updated = themeLiquid;
      let changes = [];

      // Add announcement bar after body open
      if (!updated.includes('sz-announcement-bar-new')) {
        updated = updated.replace(
          /<body[^>]*>/i,
          (match) => match + "\n{% render 'sz-announcement-bar-new' %}"
        );
        changes.push('announcement bar');
      }

      // Add nav styles to head
      if (!updated.includes('sz-nav-styles')) {
        updated = updated.replace('</head>', "{% render 'sz-nav-styles' %}\n</head>");
        changes.push('navigation styles');
      }

      if (changes.length > 0) {
        await createAsset(themeId, 'layout/theme.liquid', updated);
        console.log(`✓ Added to theme.liquid: ${changes.join(', ')}`);
      } else {
        console.log('• Theme.liquid already has all snippets');
      }
    }

    // 5. Update homepage template to use new hero
    console.log('\n--- Updating Homepage Template ---\n');

    // Try to get existing homepage template
    const homepageTemplate = await getAsset(themeId, 'templates/index.json');
    if (homepageTemplate) {
      try {
        let template = JSON.parse(homepageTemplate);

        // Add or update hero section with our settings
        if (!template.sections) {
          template.sections = {};
        }

        // Add our hero section
        template.sections['sz-hero-main'] = {
          type: 'sz-hero-main',
          settings: heroSettings
        };

        // Ensure hero is first in order
        if (!template.order) {
          template.order = [];
        }

        // Remove any existing hero references and add ours first
        template.order = template.order.filter(id =>
          !id.includes('hero') && id !== 'sz-hero-main'
        );
        template.order.unshift('sz-hero-main');

        await createAsset(themeId, 'templates/index.json', JSON.stringify(template, null, 2));
        console.log('✓ Updated templates/index.json with new hero');
      } catch (e) {
        console.log('• Could not parse index.json, hero section created but needs manual add');
      }
    } else {
      console.log('• No index.json found, hero section created for manual use');
    }

    // Summary
    console.log('\n================================================================');
    console.log('  OPTIMIZATION COMPLETE!');
    console.log('================================================================');

    console.log('\n📢 ANNOUNCEMENT BAR:');
    console.log('  "Free Shipping Over $50 • 3–5 Day Turnaround • Permanent Sublimation Printing"');

    console.log('\n🏠 HOMEPAGE HERO:');
    console.log('  Heading: "Luxury Personalized Water Bottles for Weddings & Events"');
    console.log('  Subhead: "Permanent sublimation printing that never peels.');
    console.log('            3–5 day turnaround with free personalization on every bottle."');
    console.log('  Primary CTA: "Shop Bridal Bottles" → /collections/wedding-water-bottles');
    console.log('  Secondary CTA: "Shop Best Sellers" → /collections/best-sellers');

    console.log('\n🧭 RECOMMENDED NAVIGATION ORDER:');
    console.log('  1. Bridal & Weddings');
    console.log('  2. All Bottles (or Everyday Bottles)');
    console.log('  3. Corporate Gifts');
    console.log('  4. Best Sellers');
    console.log('  5. Gift Guide');
    console.log('  6. How It Works');
    console.log('  7. Bulk Orders');
    console.log('  (Move About, Contact, FAQ to footer or keep minimal)');

    console.log('\n📝 MANUAL STEP NEEDED:');
    console.log('  Go to Shopify Admin > Online Store > Navigation');
    console.log('  Reorder your main menu to match the recommended order above.');
    console.log('  This cannot be done via API - requires admin access.');

    console.log('\n✅ Refresh your store to see the changes!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
