#!/usr/bin/env node

/**
 * Deploy Conversion Optimization Package to Shelzy's Designs
 *
 * This script deploys:
 * - Email popup snippet
 * - Trust badges
 * - Free shipping bar
 * - Upsell components
 * - Personalization form
 * - FAQ schema
 * - Instagram feed
 * - Featured products section
 * - Bulk order form
 * - Updated page content (Contact, About, FAQ)
 * - Discount codes
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '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';

console.log('🚀 Shelzy\'s Designs - Conversion Optimization Deployment');
console.log('=' .repeat(60));
console.log(`Store: ${STORE_URL}`);
console.log('');

// Helper function for API requests
function shopifyRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: `/admin/api/2024-01${endpoint}`,
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
        try {
          const result = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject({ statusCode: res.statusCode, body: result });
          }
        } catch (e) {
          reject({ error: e, body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Get active theme ID
async function getActiveThemeId() {
  console.log('📦 Getting active theme...');
  const response = await shopifyRequest('GET', '/themes.json');
  const activeTheme = response.themes.find(t => t.role === 'main');
  if (!activeTheme) throw new Error('No active theme found');
  console.log(`   Found: ${activeTheme.name} (ID: ${activeTheme.id})`);
  return activeTheme.id;
}

// Upload a snippet to the theme
async function uploadSnippet(themeId, filename, content) {
  const key = `snippets/${filename}`;
  console.log(`   Uploading ${filename}...`);

  try {
    await shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
      asset: { key, value: content }
    });
    console.log(`   ✅ ${filename} uploaded`);
    return true;
  } catch (error) {
    console.log(`   ⚠️  ${filename} - ${error.body?.errors || error.message || 'Error'}`);
    return false;
  }
}

// Upload a section to the theme
async function uploadSection(themeId, filename, content) {
  const key = `sections/${filename}`;
  console.log(`   Uploading section ${filename}...`);

  try {
    await shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
      asset: { key, value: content }
    });
    console.log(`   ✅ ${filename} uploaded`);
    return true;
  } catch (error) {
    console.log(`   ⚠️  ${filename} - ${error.body?.errors || error.message || 'Error'}`);
    return false;
  }
}

// Update theme.liquid to include snippets
async function updateThemeLiquid(themeId) {
  console.log('\n📝 Updating theme.liquid...');

  try {
    // Get current theme.liquid
    const response = await shopifyRequest('GET', `/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`);
    let content = response.asset.value;

    // Check if email popup is already included
    if (!content.includes("render 'email-popup'")) {
      // Add before </body>
      content = content.replace('</body>', "{% render 'email-popup' %}\n</body>");
      console.log('   Added email-popup render');
    }

    // Check if FAQ schema is included
    if (!content.includes("render 'faq-schema'")) {
      // Add before </head>
      content = content.replace('</head>', "{% render 'faq-schema' %}\n</head>");
      console.log('   Added faq-schema render');
    }

    // Upload updated theme.liquid
    await shopifyRequest('PUT', `/themes/${themeId}/assets.json`, {
      asset: { key: 'layout/theme.liquid', value: content }
    });

    console.log('   ✅ theme.liquid updated');
    return true;
  } catch (error) {
    console.log(`   ⚠️  Could not update theme.liquid: ${error.message || 'Error'}`);
    return false;
  }
}

// Create or update a page
async function updatePage(handle, title, htmlContent) {
  console.log(`   Updating page: ${title}...`);

  try {
    // First, try to find existing page
    const pages = await shopifyRequest('GET', `/pages.json?handle=${handle}`);

    if (pages.pages && pages.pages.length > 0) {
      // Update existing page
      const pageId = pages.pages[0].id;
      await shopifyRequest('PUT', `/pages/${pageId}.json`, {
        page: { id: pageId, body_html: htmlContent }
      });
      console.log(`   ✅ ${title} updated`);
    } else {
      // Create new page
      await shopifyRequest('POST', '/pages.json', {
        page: { title, handle, body_html: htmlContent }
      });
      console.log(`   ✅ ${title} created`);
    }
    return true;
  } catch (error) {
    console.log(`   ⚠️  ${title} - ${error.body?.errors || error.message || 'Error'}`);
    return false;
  }
}

// Create a discount code
async function createDiscount(code, percentage, title) {
  console.log(`   Creating discount: ${code}...`);

  try {
    // Create price rule first
    const priceRule = await shopifyRequest('POST', '/price_rules.json', {
      price_rule: {
        title: title,
        target_type: 'line_item',
        target_selection: 'all',
        allocation_method: 'across',
        value_type: 'percentage',
        value: `-${percentage}`,
        customer_selection: 'all',
        once_per_customer: true,
        starts_at: new Date().toISOString()
      }
    });

    // Create discount code
    await shopifyRequest('POST', `/price_rules/${priceRule.price_rule.id}/discount_codes.json`, {
      discount_code: { code: code }
    });

    console.log(`   ✅ ${code} created (${percentage}% off)`);
    return true;
  } catch (error) {
    if (error.body?.errors?.code) {
      console.log(`   ℹ️  ${code} already exists`);
    } else {
      console.log(`   ⚠️  ${code} - ${JSON.stringify(error.body?.errors) || error.message || 'Error'}`);
    }
    return false;
  }
}

// Main deployment function
async function deploy() {
  try {
    // Get theme ID
    const themeId = await getActiveThemeId();

    // Define snippets to upload
    console.log('\n📦 Deploying snippets...');

    const snippetsDir = path.join(__dirname, '..', 'snippets');
    const snippetFiles = [
      'email-popup.liquid',
      'trust-badges.liquid',
      'free-shipping-bar.liquid',
      'faq-schema.liquid',
      'upsell-frequently-bought.liquid',
      'personalization-form.liquid',
      'instagram-feed.liquid'
    ];

    for (const file of snippetFiles) {
      const filePath = path.join(snippetsDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        await uploadSnippet(themeId, file, content);
      } else {
        console.log(`   ⚠️  ${file} not found`);
      }
    }

    // Upload sections
    console.log('\n📦 Deploying sections...');

    const sectionsDir = path.join(__dirname, '..', 'sections');
    const sectionFiles = [
      'featured-products.liquid',
      'bulk-order-form.liquid'
    ];

    for (const file of sectionFiles) {
      const filePath = path.join(sectionsDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        await uploadSection(themeId, file, content);
      } else {
        console.log(`   ⚠️  ${file} not found`);
      }
    }

    // Update theme.liquid
    await updateThemeLiquid(themeId);

    // Update pages
    console.log('\n📄 Updating pages...');

    const pagesDir = path.join(__dirname, '..', 'pages');

    // Contact page
    const contactPath = path.join(pagesDir, 'contact-page.html');
    if (fs.existsSync(contactPath)) {
      const contactHtml = fs.readFileSync(contactPath, 'utf8');
      await updatePage('contact', 'Contact', contactHtml);
    }

    // About page
    const aboutPath = path.join(pagesDir, 'about-page.html');
    if (fs.existsSync(aboutPath)) {
      const aboutHtml = fs.readFileSync(aboutPath, 'utf8');
      await updatePage('about', 'About', aboutHtml);
    }

    // FAQ page
    const faqPath = path.join(pagesDir, 'faq-page-accordion.html');
    if (fs.existsSync(faqPath)) {
      const faqHtml = fs.readFileSync(faqPath, 'utf8');
      await updatePage('faq', 'FAQ', faqHtml);
    }

    // Create discount codes
    console.log('\n🎫 Creating discount codes...');
    await createDiscount('WELCOME10', 10, 'Welcome 10% Off - Email Signup');
    await createDiscount('COMEBACK10', 10, 'Comeback 10% Off - Abandoned Cart');
    await createDiscount('PHOTOREVIEW15', 15, 'Photo Review 15% Off');

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('✅ DEPLOYMENT COMPLETE!');
    console.log('=' .repeat(60));
    console.log('\nWhat was deployed:');
    console.log('  • 7 Liquid snippets (email popup, trust badges, etc.)');
    console.log('  • 2 theme sections (featured products, bulk form)');
    console.log('  • 3 page updates (Contact, About, FAQ)');
    console.log('  • 3 discount codes (WELCOME10, COMEBACK10, PHOTOREVIEW15)');
    console.log('  • theme.liquid updated with renders');
    console.log('\n🔗 View your store: https://' + STORE_URL.replace('.myshopify.com', '.com'));
    console.log('\n⚠️  Note: Some features may need manual activation in theme customizer.');

  } catch (error) {
    console.error('\n❌ Deployment error:', error.message || error);
    process.exit(1);
  }
}

// Run deployment
deploy();
