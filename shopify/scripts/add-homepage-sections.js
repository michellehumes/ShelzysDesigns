#!/usr/bin/env node

/**
 * Shelzy's Designs - Add Homepage Sections
 *
 * Adds testimonials, why-choose-us, and trust-badges to homepage
 */

const https = require('https');

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
const API_VERSION = '2024-01';

if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN') {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN');
  process.exit(1);
}

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
  return response.status === 200 ? response.data.asset.value : null;
}

async function putAsset(themeId, key, content) {
  const response = await apiRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value: content }
  });
  return response.status === 200 || response.status === 201;
}

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🏠 ADDING HOMEPAGE SECTIONS                                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Get live theme
  console.log('📋 Finding live theme...');
  const themesResponse = await apiRequest('GET', '/themes.json');
  const liveTheme = themesResponse.data.themes.find(t => t.role === 'main');

  if (!liveTheme) {
    console.error('❌ No live theme found');
    process.exit(1);
  }

  console.log(`✅ Theme: "${liveTheme.name}" (ID: ${liveTheme.id})`);
  console.log('');

  // Check for index.json (JSON template)
  console.log('📄 Checking homepage template...');
  let indexJson = await getAsset(liveTheme.id, 'templates/index.json');

  if (indexJson) {
    console.log('   Found JSON template (index.json)');
    console.log('');

    try {
      const template = JSON.parse(indexJson);

      // Add our custom sections
      const sectionsToAdd = {
        'shelzys-testimonials': {
          type: 'shelzys-testimonials',
          settings: {}
        },
        'shelzys-why-choose-us': {
          type: 'shelzys-why-choose-us',
          settings: {}
        },
        'shelzys-trust-badges': {
          type: 'shelzys-trust-badges',
          settings: {}
        }
      };

      // Check if sections already exist
      let added = [];
      let alreadyPresent = [];

      for (const [key, section] of Object.entries(sectionsToAdd)) {
        if (!template.sections[key]) {
          template.sections[key] = section;
          // Add to order if order array exists
          if (template.order && !template.order.includes(key)) {
            template.order.push(key);
          }
          added.push(key);
        } else {
          alreadyPresent.push(key);
        }
      }

      if (added.length > 0) {
        // Save updated template
        if (await putAsset(liveTheme.id, 'templates/index.json', JSON.stringify(template, null, 2))) {
          console.log('✅ Added sections to homepage:');
          added.forEach(s => console.log(`   • ${s}`));
        } else {
          console.log('❌ Failed to update index.json');
        }
      }

      if (alreadyPresent.length > 0) {
        console.log('');
        console.log('ℹ️ Already present:');
        alreadyPresent.forEach(s => console.log(`   • ${s}`));
      }

    } catch (e) {
      console.log('❌ Error parsing index.json:', e.message);
      console.log('');
      console.log('Trying alternative approach...');
    }
  }

  // Also try to inject into theme.liquid as fallback
  console.log('');
  console.log('📄 Adding to theme.liquid as fallback...');

  let themeLayout = await getAsset(liveTheme.id, 'layout/theme.liquid');

  if (themeLayout) {
    let modified = false;

    // Find the main content area and add sections after it
    // Look for {{ content_for_layout }} and add sections after main content areas

    const sectionsCode = `
{%- comment -%} Shelzy's Homepage Sections {%- endcomment -%}
{%- if template.name == 'index' -%}
  {% render 'shelzys-testimonials' %}
  {% render 'shelzys-why-choose-us' %}
  {% render 'shelzys-trust-badges' %}
{%- endif -%}
`;

    if (!themeLayout.includes('shelzys-testimonials') && !themeLayout.includes('shelzys-why-choose-us')) {
      // Try to add before footer
      const footerPatterns = [
        /{%\s*sections?\s+['"]footer/i,
        /{%\s*render\s+['"]footer/i,
        /{%\s*section\s+['"]footer/i
      ];

      let inserted = false;
      for (const pattern of footerPatterns) {
        const match = themeLayout.match(pattern);
        if (match) {
          const idx = themeLayout.indexOf(match[0]);
          themeLayout = themeLayout.slice(0, idx) + sectionsCode + '\n' + themeLayout.slice(idx);
          inserted = true;
          modified = true;
          break;
        }
      }

      // If no footer found, add before </main> or </body>
      if (!inserted) {
        const mainClose = themeLayout.indexOf('</main>');
        if (mainClose !== -1) {
          themeLayout = themeLayout.slice(0, mainClose) + sectionsCode + '\n' + themeLayout.slice(mainClose);
          modified = true;
        } else {
          // Last resort: before newsletter section or body close
          const bodyClose = themeLayout.indexOf("{% render 'shelzys-newsletter' %}");
          if (bodyClose !== -1) {
            themeLayout = themeLayout.slice(0, bodyClose) + sectionsCode + '\n' + themeLayout.slice(bodyClose);
            modified = true;
          }
        }
      }
    }

    if (modified) {
      if (await putAsset(liveTheme.id, 'layout/theme.liquid', themeLayout)) {
        console.log('✅ Added homepage sections to theme.liquid');
        console.log('   (Shows only on homepage via template check)');
      }
    } else {
      console.log('   ℹ️ Sections already present in theme.liquid');
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('🎉 Done! Visit https://shelzysdesigns.com to see:');
  console.log('   • Customer testimonials (4.9★ reviews)');
  console.log('   • "Why Choose Us" comparison section');
  console.log('   • Trust badges bar');
  console.log('');
  console.log('💡 Hard refresh (Cmd+Shift+R) to see changes!');
  console.log('');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
