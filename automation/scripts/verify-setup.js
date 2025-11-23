/**
 * Verify Setup
 * Checks that all collections, pages, and products are configured correctly
 */

import { getCollections, getPages, getProducts, STORE_URL } from './api-client.js';

async function verify() {
  console.log('🔍 Verifying Shopify Setup...\n');

  const issues = [];
  const successes = [];

  // Check collections
  console.log('Checking collections...');
  const collections = await getCollections();
  const collectionHandles = collections.map(c => c.handle);

  const requiredCollections = ['corporate', 'everyday', 'weddings'];
  for (const handle of requiredCollections) {
    if (collectionHandles.includes(handle)) {
      successes.push(`✅ Collection exists: /collections/${handle}`);
    } else {
      issues.push(`❌ Missing collection: /collections/${handle}`);
    }
  }

  // Check pages
  console.log('Checking pages...');
  const pages = await getPages();
  const pageHandles = pages.map(p => p.handle);

  const requiredPages = ['contact', 'faq', 'how-it-works', 'about-us', 'shipping', 'why-sublimation'];
  for (const handle of requiredPages) {
    // Check various possible handles
    const variants = [handle, handle.replace(/-/g, ''), handle.replace('about-us', 'about')];
    const found = variants.some(v => pageHandles.some(ph => ph.includes(v.replace(/-/g, ''))));

    if (found) {
      successes.push(`✅ Page exists: /pages/${handle}`);
    } else {
      issues.push(`❌ Missing page: /pages/${handle}`);
    }
  }

  // Check products
  console.log('Checking products...');
  const products = await getProducts();

  // Check for sublimation in titles/descriptions
  let sublimationCount = 0;
  for (const product of products) {
    const hasSubInTitle = product.title.toLowerCase().includes('sublimation');
    const hasSubInBody = product.body_html?.toLowerCase().includes('sublimation');

    if (hasSubInTitle || hasSubInBody) {
      sublimationCount++;
    }
  }

  if (sublimationCount >= products.length * 0.7) {
    successes.push(`✅ ${sublimationCount}/${products.length} products mention sublimation`);
  } else {
    issues.push(`⚠️ Only ${sublimationCount}/${products.length} products mention sublimation`);
  }

  // Check for template products (should be removed)
  const templateProducts = products.filter(p =>
    p.title.toLowerCase().includes('canva') ||
    p.title.toLowerCase().includes('template')
  );

  if (templateProducts.length === 0) {
    successes.push('✅ No off-brand template products found');
  } else {
    issues.push(`⚠️ ${templateProducts.length} template products still exist (consider removing)`);
  }

  // Print results
  console.log('\n' + '═'.repeat(50));
  console.log('VERIFICATION RESULTS');
  console.log('═'.repeat(50));

  console.log('\n✅ PASSING:');
  successes.forEach(s => console.log(`   ${s}`));

  if (issues.length > 0) {
    console.log('\n❌ NEEDS ATTENTION:');
    issues.forEach(i => console.log(`   ${i}`));
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`Score: ${successes.length}/${successes.length + issues.length} checks passed`);
  console.log('═'.repeat(50));

  console.log(`\n🔗 Test URLs:`);
  console.log(`   Homepage: https://${STORE_URL.replace('.myshopify.com', '')}.com`);
  console.log(`   Collections: https://${STORE_URL.replace('.myshopify.com', '')}.com/collections/all`);
  console.log(`   Corporate: https://${STORE_URL.replace('.myshopify.com', '')}.com/collections/corporate`);
  console.log(`   FAQ: https://${STORE_URL.replace('.myshopify.com', '')}.com/pages/faq`);

  return issues.length === 0;
}

verify().catch(console.error);
