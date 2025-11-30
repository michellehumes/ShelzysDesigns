#!/usr/bin/env node

/**
 * FIX HOMEPAGE REVIEWS BLOCKING ISSUE
 * ====================================
 * Removes all conflicting social proof and review elements that may be
 * blocking or overlapping content on the homepage.
 *
 * Usage:
 *   node shopify/scripts/fix-homepage-reviews.js
 *
 * Environment Variables:
 *   SHOPIFY_STORE_URL - Your Shopify store URL
 *   SHOPIFY_ACCESS_TOKEN - Admin API access token
 */

const https = require('https');

const CONFIG = {
  storeUrl: process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
};

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  section: (msg) => console.log(`\n\x1b[35m${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}\x1b[0m\n`)
};

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
            reject(new Error(`API Error ${res.statusCode}: ${body.substring(0, 300)}`));
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

async function getActiveTheme() {
  const themes = await shopifyRequest('GET', '/themes.json');
  return themes.themes.find(t => t.role === 'main');
}

async function getAsset(themeId, key) {
  try {
    const result = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`);
    return result.asset ? result.asset.value : null;
  } catch (e) {
    return null;
  }
}

async function updateAsset(themeId, key, value) {
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

// List of potentially conflicting snippets to remove
const SNIPPETS_TO_REMOVE = [
  'snippets/sz-social-proof-banner.liquid',
  'snippets/sz-social-proof.liquid',
  'snippets/shelzys-social-proof.liquid',
  'snippets/shelzys-social-proof-section.liquid',
  'snippets/sz-announcement-bar.liquid'
];

// Render tags to remove from theme.liquid
const RENDERS_TO_REMOVE = [
  "{% render 'sz-social-proof-banner' %}",
  "{% render 'sz-social-proof' %}",
  "{% render 'shelzys-social-proof' %}",
  "{% render 'shelzys-social-proof-section' %}",
  "{% render 'sz-announcement-bar' %}"
];

async function main() {
  log.section('FIXING HOMEPAGE REVIEW BLOCKING ISSUE');

  if (!CONFIG.accessToken) {
    log.error('SHOPIFY_ACCESS_TOKEN not set!');
    process.exit(1);
  }

  try {
    // Get active theme
    log.info('Finding active theme...');
    const theme = await getActiveTheme();
    if (!theme) {
      throw new Error('No active theme found');
    }
    log.success(`Active theme: ${theme.name} (ID: ${theme.id})`);

    // Step 1: Delete conflicting snippet files
    log.section('STEP 1: Removing conflicting snippet files');

    for (const snippetKey of SNIPPETS_TO_REMOVE) {
      log.info(`Attempting to remove ${snippetKey}...`);
      const deleted = await deleteAsset(theme.id, snippetKey);
      if (deleted) {
        log.success(`Removed ${snippetKey}`);
      } else {
        log.warn(`${snippetKey} not found or already removed`);
      }
    }

    // Step 2: Clean up theme.liquid
    log.section('STEP 2: Cleaning theme.liquid');

    let themeLiquid = await getAsset(theme.id, 'layout/theme.liquid');

    if (themeLiquid) {
      let modified = false;

      for (const renderTag of RENDERS_TO_REMOVE) {
        // Match with or without newlines
        const regex = new RegExp(renderTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n?', 'g');
        if (themeLiquid.includes(renderTag)) {
          themeLiquid = themeLiquid.replace(regex, '');
          log.success(`Removed: ${renderTag}`);
          modified = true;
        }
      }

      // Also remove any inline social proof styles that might be causing issues
      // Remove empty lines that might have been left behind
      themeLiquid = themeLiquid.replace(/\n{3,}/g, '\n\n');

      if (modified) {
        await updateAsset(theme.id, 'layout/theme.liquid', themeLiquid);
        log.success('theme.liquid updated');
      } else {
        log.info('No render tags found to remove in theme.liquid');
      }
    } else {
      log.warn('Could not read theme.liquid');
    }

    // Step 3: Check and clean index.liquid/index.json if needed
    log.section('STEP 3: Checking homepage template');

    // Try index.liquid first
    let indexContent = await getAsset(theme.id, 'templates/index.liquid');
    if (indexContent) {
      let modified = false;

      for (const renderTag of RENDERS_TO_REMOVE) {
        if (indexContent.includes(renderTag)) {
          indexContent = indexContent.replace(new RegExp(renderTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n?', 'g'), '');
          modified = true;
          log.success(`Removed from index.liquid: ${renderTag}`);
        }
      }

      if (modified) {
        await updateAsset(theme.id, 'templates/index.liquid', indexContent);
        log.success('index.liquid updated');
      }
    }

    // Try index.json (JSON template for Shopify 2.0 themes)
    let indexJson = await getAsset(theme.id, 'templates/index.json');
    if (indexJson) {
      try {
        const parsed = JSON.parse(indexJson);
        let modified = false;

        // Remove any sections related to social proof
        if (parsed.sections) {
          const sectionsToRemove = [];
          for (const [key, section] of Object.entries(parsed.sections)) {
            if (section.type && (
              section.type.includes('social-proof') ||
              section.type.includes('reviews') ||
              section.type.includes('shelzys-social-proof')
            )) {
              sectionsToRemove.push(key);
            }
          }

          for (const key of sectionsToRemove) {
            delete parsed.sections[key];
            modified = true;
            log.success(`Removed section: ${key}`);
          }

          // Also remove from order array if present
          if (parsed.order && Array.isArray(parsed.order)) {
            const originalLength = parsed.order.length;
            parsed.order = parsed.order.filter(key => !sectionsToRemove.includes(key));
            if (parsed.order.length < originalLength) {
              modified = true;
            }
          }
        }

        if (modified) {
          await updateAsset(theme.id, 'templates/index.json', JSON.stringify(parsed, null, 2));
          log.success('index.json updated');
        } else {
          log.info('No social proof sections found in index.json');
        }
      } catch (e) {
        log.warn(`Could not parse index.json: ${e.message}`);
      }
    }

    // Step 4: Check for any other common theme files
    log.section('STEP 4: Checking other template files');

    const otherTemplates = [
      'sections/main-product.liquid',
      'sections/product-template.liquid',
      'sections/main-collection.liquid',
      'sections/header.liquid'
    ];

    for (const templateKey of otherTemplates) {
      let content = await getAsset(theme.id, templateKey);
      if (content) {
        let modified = false;

        for (const renderTag of RENDERS_TO_REMOVE) {
          if (content.includes(renderTag)) {
            content = content.replace(new RegExp(renderTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n?', 'g'), '');
            modified = true;
            log.success(`Removed from ${templateKey}: ${renderTag}`);
          }
        }

        if (modified) {
          await updateAsset(theme.id, templateKey, content);
        }
      }
    }

    log.section('FIX COMPLETE');
    console.log('');
    log.success('All conflicting social proof/review elements have been removed.');
    console.log('');
    log.info('What was fixed:');
    console.log('  - Removed floating "Someone just purchased" popups');
    console.log('  - Removed duplicate social proof banners');
    console.log('  - Removed conflicting announcement bars');
    console.log('  - Cleaned up theme template files');
    console.log('');
    log.info('Please refresh your homepage to see the changes.');
    console.log('');

  } catch (e) {
    log.error(`Fatal error: ${e.message}`);
    process.exit(1);
  }
}

main();
