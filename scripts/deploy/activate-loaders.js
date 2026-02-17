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
  const response = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  return response.asset.value;
}

async function createAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
    asset: { key, value }
  });
}

async function main() {
  console.log('========================================================');
  console.log('  ACTIVATING SHELZYS DESIGNS LOADERS');
  console.log('========================================================\n');

  try {
    const themeId = await getThemeId();
    console.log(`Theme ID: ${themeId}\n`);

    // Get current theme.liquid
    console.log('Fetching theme.liquid...');
    let themeLiquid = await getAsset(themeId, 'layout/theme.liquid');

    // Check if loaders already exist
    const hasLoader1 = themeLiquid.includes("sz-site-overhaul");
    const hasLoader2 = themeLiquid.includes("sz-phase2-loader");

    if (hasLoader1 && hasLoader2) {
      console.log('✓ Both loaders already active in theme.liquid');
      return;
    }

    // Build the loader block
    let loaderBlock = '\n  {% comment %} Shelzys Designs Site Enhancements {% endcomment %}';

    if (!hasLoader1) {
      loaderBlock += "\n  {% render 'sz-site-overhaul' %}";
    }

    if (!hasLoader2) {
      loaderBlock += "\n  {% render 'sz-phase2-loader' %}";
    }

    // Find </head> and insert before it
    if (themeLiquid.includes('</head>')) {
      themeLiquid = themeLiquid.replace('</head>', loaderBlock + '\n</head>');

      await createAsset(themeId, 'layout/theme.liquid', themeLiquid);
      console.log('✓ Updated theme.liquid with loaders');

      console.log('\n========================================================');
      console.log('  LOADERS ACTIVATED!');
      console.log('========================================================');
      console.log('\nAdded to theme.liquid:');
      if (!hasLoader1) console.log("  • {% render 'sz-site-overhaul' %}");
      if (!hasLoader2) console.log("  • {% render 'sz-phase2-loader' %}");
      console.log('\nAll site enhancements are now active!');
    } else {
      console.log('Could not find </head> tag in theme.liquid');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
