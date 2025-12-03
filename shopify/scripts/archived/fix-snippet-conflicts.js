#!/usr/bin/env node

/**
 * FIX SNIPPET CONFLICTS
 * Removes conflicting snippets that duplicate existing theme features
 */

const https = require('https');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    if (!CONFIG.accessToken) { reject(new Error('SHOPIFY_ACCESS_TOKEN not set')); return; }
    const options = {
      hostname: CONFIG.storeUrl, port: 443,
      path: `/admin/api/${CONFIG.apiVersion}${endpoint}`,
      method, headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': CONFIG.accessToken }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : {};
          res.statusCode >= 200 && res.statusCode < 300 ? resolve(result) : reject(new Error(`API ${res.statusCode}: ${body}`));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function getActiveTheme() {
  const themes = await shopifyRequest('GET', '/themes.json');
  return themes.themes.find(t => t.role === 'main');
}

async function getAsset(themeId, key) {
  try {
    const result = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return result.asset ? result.asset.value : null;
  } catch (e) { return null; }
}

async function updateAsset(themeId, key, value) {
  return shopifyRequest('PUT', `/themes/${themeId}/assets.json`, { asset: { key, value } });
}

async function deleteAsset(themeId, key) {
  try {
    return await shopifyRequest('DELETE', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
  } catch (e) { console.log(`Could not delete ${key}`); }
}

async function main() {
  console.log('\n🔧 Fixing snippet conflicts...\n');

  const theme = await getActiveTheme();
  if (!theme) { console.log('No active theme found'); return; }
  console.log(`Theme: ${theme.name} (ID: ${theme.id})\n`);

  // 1. Remove the social proof banner snippet (conflicts with existing reviews)
  console.log('Removing conflicting social proof banner...');
  await deleteAsset(theme.id, 'snippets/sz-social-proof-banner.liquid');

  // 2. Fix theme.liquid - remove the social proof banner render
  console.log('Cleaning theme.liquid...');
  let themeLiquid = await getAsset(theme.id, 'layout/theme.liquid');

  if (themeLiquid) {
    // Remove the social proof banner render
    themeLiquid = themeLiquid.replace(/\{% render 'sz-social-proof-banner' %\}\n?/g, '');
    themeLiquid = themeLiquid.replace(/\{% render 'sz-announcement-bar' %\}\n?/g, '');

    await updateAsset(theme.id, 'layout/theme.liquid', themeLiquid);
    console.log('✓ Removed conflicting renders from theme.liquid');
  }

  // 3. Also remove the announcement bar if it conflicts
  console.log('Removing conflicting announcement bar...');
  await deleteAsset(theme.id, 'snippets/sz-announcement-bar.liquid');

  console.log('\n✅ Fix complete! Refresh your site to see the changes.\n');
}

main().catch(e => console.error('Error:', e.message));
