#!/usr/bin/env node

/**
 * Shelzy's Designs - Add Homepage Sections
 * Automatically injects testimonials, why choose us, and FAQ sections to homepage
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable');
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
  console.log('║  📄 ADDING HOMEPAGE SECTIONS                                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  const themesResponse = await apiRequest('GET', '/themes.json');
  if (!themesResponse.data?.themes) {
    console.error('❌ Failed to fetch themes');
    process.exit(1);
  }

  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');
  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // Create a snippet that renders all homepage sections
  console.log('1️⃣  Creating homepage sections loader...');

  const homepageSectionsSnippet = `{% comment %}Shelzy's - Homepage Sections Loader{% endcomment %}
{% if template == 'index' %}
  {% render 'sz-testimonials' %}
  {% render 'sz-why-choose' %}
  {% render 'sz-faq-section' %}
{% endif %}
`;

  await putAsset(liveTheme.id, 'snippets/sz-homepage-sections.liquid', homepageSectionsSnippet);
  console.log('   ✅ Created sz-homepage-sections.liquid');

  // Inject into theme.liquid before </body>
  console.log('2️⃣  Injecting into theme.liquid...');

  let themeLiquid = await getAsset(liveTheme.id, 'layout/theme.liquid');
  if (themeLiquid) {
    if (!themeLiquid.includes('sz-homepage-sections')) {
      // Add before closing body tag
      themeLiquid = themeLiquid.replace('</body>', "{% render 'sz-homepage-sections' %}\n</body>");
      const result = await putAsset(liveTheme.id, 'layout/theme.liquid', themeLiquid);
      if (result.success) {
        console.log('   ✅ Injected homepage sections into theme.liquid');
      } else {
        console.log('   ❌ Failed to update theme.liquid');
      }
    } else {
      console.log('   ✓ Already in theme.liquid');
    }
  }

  // Also try to add sections to index.json for Shopify 2.0 themes
  console.log('3️⃣  Updating index template...');

  let indexJson = await getAsset(liveTheme.id, 'templates/index.json');
  if (indexJson) {
    try {
      let indexData = JSON.parse(indexJson);

      // Check if we already have our sections
      let hasTestimonials = Object.values(indexData.sections || {}).some(s =>
        s.type === 'custom-liquid' && s.settings?.liquid?.includes('sz-testimonials')
      );

      if (!hasTestimonials) {
        // Add our custom sections
        const sectionOrder = indexData.order || [];

        // Add testimonials section
        indexData.sections = indexData.sections || {};
        indexData.sections['sz-testimonials'] = {
          type: 'custom-liquid',
          settings: {
            liquid: "{% render 'sz-testimonials' %}"
          }
        };

        // Add why choose section
        indexData.sections['sz-why-choose'] = {
          type: 'custom-liquid',
          settings: {
            liquid: "{% render 'sz-why-choose' %}"
          }
        };

        // Add FAQ section
        indexData.sections['sz-faq'] = {
          type: 'custom-liquid',
          settings: {
            liquid: "{% render 'sz-faq-section' %}"
          }
        };

        // Add to order if not already there
        if (!sectionOrder.includes('sz-testimonials')) {
          sectionOrder.push('sz-testimonials');
        }
        if (!sectionOrder.includes('sz-why-choose')) {
          sectionOrder.push('sz-why-choose');
        }
        if (!sectionOrder.includes('sz-faq')) {
          sectionOrder.push('sz-faq');
        }

        indexData.order = sectionOrder;

        const result = await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(indexData, null, 2));
        if (result.success) {
          console.log('   ✅ Added sections to index.json');
        } else {
          console.log('   ⚠ Could not update index.json - sections will load via theme.liquid fallback');
        }
      } else {
        console.log('   ✓ Sections already in index.json');
      }
    } catch (e) {
      console.log('   ⚠ Could not parse index.json - using theme.liquid fallback');
    }
  } else {
    console.log('   ℹ No index.json found - sections will load via theme.liquid');
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ HOMEPAGE SECTIONS ADDED                                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('The following sections are now on your homepage:');
  console.log('  • Testimonials - Customer reviews with avatars');
  console.log('  • Why Choose Us - Comparison table');
  console.log('  • FAQ - Common questions answered');
  console.log('');
  console.log('🔗 View at: https://shelzysdesigns.com');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
