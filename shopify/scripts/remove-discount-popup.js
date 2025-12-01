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

async function listAssets(themeId) {
  const response = await shopifyRequest('GET', `/themes/${themeId}/assets.json`);
  return response.assets || [];
}

async function main() {
  console.log('================================================================');
  console.log('  REMOVING DISCOUNT POPUP');
  console.log('================================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // List all assets to find popup-related files
    const assets = await listAssets(themeId);
    const assetKeys = assets.map(a => a.key);

    console.log('--- Searching for popup files ---\n');

    // Common popup file patterns
    const popupPatterns = ['popup', 'modal', 'newsletter', 'email-signup', 'discount'];
    const popupFiles = assetKeys.filter(key => {
      const keyLower = key.toLowerCase();
      return popupPatterns.some(pattern => keyLower.includes(pattern));
    });

    console.log('Found popup-related files:');
    popupFiles.forEach(f => console.log(`  • ${f}`));

    // Check theme.liquid for popup renders
    console.log('\n--- Checking theme.liquid for popup includes ---\n');

    const themeLiquid = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquid) {
      // Find all render/include statements
      const renderMatches = themeLiquid.match(/{%\s*(render|include)\s*['"][^'"]*popup[^'"]*['"]\s*%}/gi) || [];
      const sectionMatches = themeLiquid.match(/{%\s*section\s*['"][^'"]*popup[^'"]*['"]\s*%}/gi) || [];

      console.log('Popup includes in theme.liquid:');
      [...renderMatches, ...sectionMatches].forEach(m => console.log(`  • ${m}`));

      // Remove popup includes from theme.liquid
      let updatedTheme = themeLiquid;

      // Remove common popup patterns - be careful not to remove our styled popup
      const patternsToRemove = [
        // Generic black/white popups
        /{%\s*(render|include)\s*['"]popup['"]\s*%}\n?/gi,
        /{%\s*(render|include)\s*['"]newsletter-popup['"]\s*%}\n?/gi,
        /{%\s*(render|include)\s*['"]email-popup['"]\s*%}\n?/gi,
        /{%\s*section\s*['"]popup['"]\s*%}\n?/gi,
        /{%\s*section\s*['"]newsletter-popup['"]\s*%}\n?/gi,
      ];

      let removed = [];
      for (const pattern of patternsToRemove) {
        if (pattern.test(updatedTheme)) {
          const match = updatedTheme.match(pattern);
          if (match) removed.push(match[0].trim());
          updatedTheme = updatedTheme.replace(pattern, '');
        }
      }

      if (removed.length > 0) {
        await createAsset(themeId, 'layout/theme.liquid', updatedTheme);
        console.log('\n✓ Removed from theme.liquid:');
        removed.forEach(r => console.log(`  - ${r}`));
      }
    }

    // Check settings_data.json to disable popups
    console.log('\n--- Checking theme settings ---\n');

    const settingsData = await getAsset(themeId, 'config/settings_data.json');
    if (settingsData) {
      let settings = JSON.parse(settingsData);
      let modified = false;

      // Check current theme settings
      const current = settings.current || {};

      // Common popup setting keys to disable
      const popupSettings = [
        'show_popup',
        'popup_enabled',
        'newsletter_popup',
        'enable_popup',
        'popup_show',
        'show_newsletter_popup',
        'enable_newsletter_popup',
        'popup_newsletter_enable'
      ];

      for (const key of popupSettings) {
        if (current[key] !== undefined && current[key] === true) {
          current[key] = false;
          modified = true;
          console.log(`  • Disabled: ${key}`);
        }
      }

      // Check sections for popup sections
      if (current.sections) {
        for (const [sectionId, section] of Object.entries(current.sections)) {
          if (section.type && section.type.toLowerCase().includes('popup')) {
            if (section.disabled !== true) {
              section.disabled = true;
              modified = true;
              console.log(`  • Disabled section: ${sectionId} (${section.type})`);
            }
          }
        }
      }

      if (modified) {
        settings.current = current;
        await createAsset(themeId, 'config/settings_data.json', JSON.stringify(settings, null, 2));
        console.log('\n✓ Updated theme settings');
      } else {
        console.log('  No popup settings found to disable');
      }
    }

    // Add CSS to hide any remaining popups (as backup)
    console.log('\n--- Adding popup hide CSS ---\n');

    const hidePopupCSS = `{% comment %}
  Hide unwanted popups - keeps only sz-branded popups
{% endcomment %}

<style>
/* Hide default theme popups */
.popup-modal:not(.sz-popup),
.newsletter-popup:not(.sz-popup),
.modal--newsletter:not(.sz-popup),
#popup:not(.sz-popup),
.popup-overlay:not(.sz-popup-overlay),
[data-popup]:not(.sz-popup),
.klaviyo-popup,
.mfp-wrap {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Also hide popups by common class patterns */
.modal[class*="newsletter"]:not(.sz-popup),
.modal[class*="popup"]:not(.sz-popup),
div[class*="email-popup"]:not(.sz-popup),
div[class*="newsletter-popup"]:not(.sz-popup) {
  display: none !important;
}
</style>`;

    await createAsset(themeId, 'snippets/sz-hide-popups.liquid', hidePopupCSS);
    console.log('✓ Created snippets/sz-hide-popups.liquid');

    // Add to theme.liquid head
    const themeLiquidFresh = await getAsset(themeId, 'layout/theme.liquid');
    if (themeLiquidFresh && !themeLiquidFresh.includes('sz-hide-popups')) {
      const updatedTheme = themeLiquidFresh.replace('</head>', "{% render 'sz-hide-popups' %}\n</head>");
      await createAsset(themeId, 'layout/theme.liquid', updatedTheme);
      console.log('✓ Added popup hide CSS to theme.liquid');
    }

    console.log('\n================================================================');
    console.log('  POPUP REMOVAL COMPLETE');
    console.log('================================================================');
    console.log('\nThe black/white discount popup should now be hidden.');
    console.log('Your branded coral popup (if you have one) will still show.');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
