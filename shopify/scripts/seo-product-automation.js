#!/usr/bin/env node

/**
 * Shelzy's Designs - Product SEO Automation
 *
 * Autonomous product-SEO updater triggered by Shopify webhooks.
 * Handles products/create and products/update events.
 *
 * CAPABILITIES:
 * 1. Generate SEO-optimized title (55-60 chars) + meta description (150-160 chars)
 * 2. Generate ADA-compliant alt text for all product images
 * 3. Expand tags with high-intent keywords (6-12 tags)
 * 4. Optionally improve body copy (Highlights, Perfect For, Care sections)
 * 5. Writeback all changes to Shopify via Admin API
 *
 * USAGE:
 *   echo '{"id":123,"title":"..."}' | node seo-product-automation.js
 *   OR
 *   node seo-product-automation.js < product-payload.json
 *
 * ENVIRONMENT:
 *   SHOPIFY_STORE_URL - Store domain (e.g., shelzys-designs.myshopify.com)
 *   SHOPIFY_ACCESS_TOKEN - Admin API token with write_products scope
 */

const https = require('https');

// ============================================================
// CONFIGURATION
// ============================================================

const STORE_URL = process.env.SHOPIFY_STORE_URL || 'shelzys-designs.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-10';

// Rate limiting: sleep between API calls (ms)
const RATE_LIMIT_MS = 600;

// Brand voice keywords and guardrails
const BRAND = {
  name: "Shelzy's Designs",
  tone: ['elevated', 'clean', 'premium', 'minimal', 'friendly'],
  bannedWords: ['insane', 'crazy', 'amazing', 'unbelievable', 'incredible', 'mind-blowing', 'epic', 'killer', 'sick', 'lit', 'love island'],
  categories: {
    drinkware: ['water bottle', 'tumbler', 'cup', 'mug', 'thermos', 'flask'],
    occasions: ['wedding', 'bridesmaid', 'bachelorette', 'bridal party', 'birthday', 'team', 'corporate', 'coach', 'teacher'],
    features: ['personalized', 'custom', 'monogram', 'name', 'stainless steel', 'insulated', 'leakproof', 'sublimation']
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeForBrand(text) {
  let result = text;
  BRAND.bannedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    result = result.replace(regex, '');
  });
  return result.replace(/\s+/g, ' ').trim();
}

function truncateWithEllipsis(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 1).trim() + '…';
}

function normalizeTag(tag) {
  return tag.toLowerCase().trim().replace(/\s+/g, ' ');
}

function deduplicateTags(tags) {
  const seen = new Set();
  return tags.filter(tag => {
    const normalized = normalizeTag(tag);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

// ============================================================
// SEO GENERATION FUNCTIONS
// ============================================================

/**
 * Generate SEO-optimized title (55-60 characters)
 * Includes primary keyword + brand tone
 */
function generateSeoTitle(product) {
  const title = product.title || '';
  const productType = (product.product_type || '').toLowerCase();

  // Extract key descriptors
  const hasCustom = /custom|personali[zs]ed|monogram/i.test(title);
  const hasMaterial = /stainless|steel|insulated/i.test(title);

  // Identify primary product type
  let primaryType = 'Bottle';
  if (/tumbler/i.test(title)) primaryType = 'Tumbler';
  else if (/cup/i.test(title)) primaryType = 'Cup';
  else if (/mug/i.test(title)) primaryType = 'Mug';
  else if (/bottle/i.test(title)) primaryType = 'Bottle';

  // Build SEO title variants
  let seoTitle = '';

  if (hasCustom) {
    seoTitle = `Custom ${primaryType} | Personalized ${productType || 'Gift'}`;
  } else {
    seoTitle = `${title} | Premium ${productType || 'Drinkware'}`;
  }

  // Add brand suffix if room
  if (seoTitle.length < 45) {
    seoTitle += ' – Shelzy\'s';
  }

  // Truncate to 60 chars max
  seoTitle = truncateWithEllipsis(sanitizeForBrand(seoTitle), 60);

  // Ensure minimum 55 chars if possible
  if (seoTitle.length < 55 && !seoTitle.includes('Shelzy')) {
    seoTitle = seoTitle.replace(/\s*$/, ' | Shelzy\'s Designs');
  }

  return seoTitle.substring(0, 60);
}

/**
 * Generate SEO meta description (150-160 characters)
 * Includes benefit + differentiator + soft CTA
 */
function generateSeoDescription(product) {
  const title = product.title || '';
  const productType = (product.product_type || 'drinkware').toLowerCase();
  const bodyHtml = product.body_html || '';

  // Extract key features from title/body
  const isPersonalized = /custom|personali[zs]ed|monogram/i.test(title + bodyHtml);
  const isInsulated = /insulated|double.?wall|vacuum/i.test(title + bodyHtml);
  const isStainless = /stainless|steel/i.test(title + bodyHtml);
  const isLeakproof = /leakproof|leak.?proof|spill.?proof/i.test(title + bodyHtml);

  // Determine occasion fit
  let occasion = '';
  if (/bridesmaid|bridal|bride/i.test(title + bodyHtml)) occasion = 'bridesmaid gifts';
  else if (/wedding/i.test(title + bodyHtml)) occasion = 'wedding favors';
  else if (/bachelorette/i.test(title + bodyHtml)) occasion = 'bachelorette parties';
  else if (/team|coach|sport/i.test(title + bodyHtml)) occasion = 'team gifts';
  else occasion = 'special occasions';

  // Build description components
  const features = [];
  if (isPersonalized) features.push('personalized');
  if (isInsulated) features.push('insulated');
  if (isStainless) features.push('stainless steel');
  if (isLeakproof) features.push('leakproof');

  const featureStr = features.length > 0 ? features.slice(0, 2).join(', ') + ' ' : '';

  // Compose meta description
  let description = `Shop our ${featureStr}${productType}—perfect for ${occasion}. `;
  description += 'Sublimation designs that never peel or fade. ';
  description += 'Free personalization, ships in 5-7 days.';

  // Ensure within bounds
  description = sanitizeForBrand(description);

  if (description.length > 160) {
    description = truncateWithEllipsis(description, 160);
  } else if (description.length < 150) {
    description += ' Order yours today.';
  }

  return description.substring(0, 160);
}

/**
 * Generate ADA-compliant alt text for an image (8-16 words)
 * Describes color, angle, material, and use context
 */
function generateImageAltText(image, product, index) {
  const title = product.title || 'Custom bottle';
  const productType = (product.product_type || 'drinkware').toLowerCase();
  const src = image.src || '';

  // Extract hints from filename
  const filename = src.split('/').pop().split('?')[0].toLowerCase();

  // Detect color from filename or title
  let color = '';
  const colorPatterns = ['white', 'black', 'pink', 'rose', 'gold', 'silver', 'blue', 'green', 'purple', 'red', 'coral', 'mint', 'blush'];
  for (const c of colorPatterns) {
    if (filename.includes(c) || title.toLowerCase().includes(c)) {
      color = c;
      break;
    }
  }

  // Detect angle/view from filename
  let angle = '';
  if (filename.includes('front') || filename.includes('straight')) angle = 'front view';
  else if (filename.includes('side')) angle = 'side angle';
  else if (filename.includes('detail') || filename.includes('close')) angle = 'close-up detail';
  else if (filename.includes('group') || filename.includes('set')) angle = 'group arrangement';
  else if (filename.includes('lifestyle') || filename.includes('use')) angle = 'lifestyle shot';
  else if (index === 0) angle = 'product photo';
  else angle = 'alternate view';

  // Build descriptive alt text
  const colorStr = color ? `${color} ` : '';
  const personalized = /custom|personali[zs]ed|monogram/i.test(title) ? 'personalized ' : '';
  const material = /stainless/i.test(title) ? 'stainless steel ' : '';

  let altText = `${colorStr}${personalized}${material}${productType} ${angle}`;

  // Add context based on product type
  if (/bridesmaid|bridal/i.test(title)) {
    altText += ' for bridesmaid gift';
  } else if (/wedding/i.test(title)) {
    altText += ' for wedding favor';
  } else if (/bachelorette/i.test(title)) {
    altText += ' for bachelorette party';
  }

  // Add brand attribution
  altText += ' by Shelzy\'s Designs';

  // Clean up and ensure word count (8-16 words)
  altText = sanitizeForBrand(altText).replace(/\s+/g, ' ').trim();
  const words = altText.split(' ');

  if (words.length < 8) {
    altText = `Custom ${altText} with sublimation print`;
  } else if (words.length > 16) {
    altText = words.slice(0, 16).join(' ');
  }

  return altText;
}

/**
 * Generate expanded tags (6-12 high-intent keywords)
 * Mix of head terms and long-tail keywords
 */
function generateExpandedTags(product) {
  const existingTags = (product.tags || '').split(',').map(t => t.trim()).filter(Boolean);
  const title = (product.title || '').toLowerCase();
  const bodyHtml = (product.body_html || '').toLowerCase();
  const productType = (product.product_type || '').toLowerCase();
  const content = title + ' ' + bodyHtml + ' ' + productType;

  const newTags = [];

  // Head terms based on product type
  if (/bottle/i.test(content)) {
    newTags.push('water bottle', 'custom water bottle', 'personalized bottle');
  }
  if (/tumbler/i.test(content)) {
    newTags.push('tumbler', 'custom tumbler', 'personalized tumbler');
  }

  // Material tags
  if (/stainless|steel/i.test(content)) {
    newTags.push('stainless steel bottle', 'metal water bottle');
  }
  if (/insulated/i.test(content)) {
    newTags.push('insulated water bottle', 'double wall bottle');
  }

  // Feature tags
  if (/leakproof|leak.?proof/i.test(content)) {
    newTags.push('leakproof water bottle', 'spill proof bottle');
  }
  if (/custom|personali[zs]ed/i.test(content)) {
    newTags.push('personalized gift', 'custom name bottle', 'monogram bottle');
  }

  // Occasion tags (long-tail, high-intent)
  if (/bridesmaid|bridal/i.test(content)) {
    newTags.push('bridesmaid gifts', 'bridesmaid proposal', 'bridal party gifts');
  }
  if (/wedding/i.test(content)) {
    newTags.push('wedding favors', 'wedding party gifts', 'bride gifts');
  }
  if (/bachelorette/i.test(content)) {
    newTags.push('bachelorette party', 'bachelorette favors', 'bride tribe');
  }
  if (/team|coach|sport/i.test(content)) {
    newTags.push('team gifts', 'coach gifts', 'sports bottle');
  }
  if (/teacher/i.test(content)) {
    newTags.push('teacher gifts', 'teacher appreciation');
  }
  if (/birthday/i.test(content)) {
    newTags.push('birthday gift', 'birthday party favors');
  }

  // General gift tags
  newTags.push('gift for her', 'unique gift');

  // Hydration/wellness tags
  newTags.push('hydration', 'reusable bottle');

  // Merge with existing, deduplicate, limit to 12
  const allTags = [...existingTags, ...newTags];
  const uniqueTags = deduplicateTags(allTags);

  // Prioritize: existing tags first, then new high-intent tags
  const prioritized = [
    ...existingTags.filter(t => uniqueTags.includes(t)),
    ...uniqueTags.filter(t => !existingTags.includes(t))
  ];

  return deduplicateTags(prioritized).slice(0, 12);
}

/**
 * Generate body copy blocks (Highlights, Perfect For, Care)
 */
function generateBodyBlocks(product) {
  const title = (product.title || '').toLowerCase();
  const bodyHtml = (product.body_html || '').toLowerCase();
  const productType = (product.product_type || 'drinkware').toLowerCase();
  const content = title + ' ' + bodyHtml;

  // Determine product characteristics
  const isStainless = /stainless|steel/i.test(content);
  const isInsulated = /insulated|double.?wall/i.test(content);
  const isPersonalized = /custom|personali[zs]ed|monogram/i.test(content);
  const isLeakproof = /leakproof|leak.?proof/i.test(content);

  // Determine capacity if mentioned
  let capacity = '';
  const capacityMatch = content.match(/(\d+)\s*oz/i);
  if (capacityMatch) capacity = capacityMatch[1] + ' oz';

  // Generate Highlights (3-5 bullets)
  const highlights = [];

  if (isStainless) {
    highlights.push('Premium 18/8 stainless steel construction');
  }
  if (isInsulated) {
    highlights.push('Double-wall vacuum insulation keeps drinks cold 24 hrs or hot 12 hrs');
  }
  if (capacity) {
    highlights.push(`${capacity} capacity—perfect for all-day hydration`);
  }
  highlights.push('Sublimation printing fused into coating—never peels, cracks, or fades');
  if (isLeakproof) {
    highlights.push('Leakproof lid with easy-carry handle');
  }
  if (isPersonalized) {
    highlights.push('Free personalization with names, dates, or custom text');
  }
  highlights.push('Dishwasher safe on top rack');

  // Limit to 5 highlights
  const finalHighlights = highlights.slice(0, 5);

  // Generate Perfect For (based on content analysis)
  const perfectFor = [];

  if (/bridesmaid|bridal/i.test(content)) {
    perfectFor.push('Bridesmaid proposal boxes', 'Bridal party thank-you gifts');
  }
  if (/wedding/i.test(content)) {
    perfectFor.push('Wedding day party favors', 'Rehearsal dinner gifts');
  }
  if (/bachelorette/i.test(content)) {
    perfectFor.push('Bachelorette weekend supplies', 'Girls trip favors');
  }
  perfectFor.push('Birthday celebrations', 'Team appreciation gifts', 'Corporate event swag');

  // Limit to 5 occasions
  const finalPerfectFor = [...new Set(perfectFor)].slice(0, 5);

  // Generate Care instructions
  let care = 'Hand wash recommended for longest print life. ';
  care += 'Top-rack dishwasher safe. ';
  care += 'Do not microwave. ';
  care += 'Avoid abrasive scrubbers on printed surface.';

  return {
    highlights: finalHighlights,
    perfect_for: finalPerfectFor,
    care: care.trim()
  };
}

// ============================================================
// HTML INJECTION HELPERS
// ============================================================

/**
 * Generate HTML sections to inject into body_html
 */
function generateBodyHtmlSections(blocks) {
  const { highlights, perfect_for, care } = blocks;

  let html = '';

  // Highlights section
  if (highlights && highlights.length > 0) {
    html += '\n<section class="pdp-highlights">\n';
    html += '  <h3>Highlights</h3>\n';
    html += '  <ul>\n';
    highlights.forEach(h => {
      html += `    <li>${h}</li>\n`;
    });
    html += '  </ul>\n';
    html += '</section>\n';
  }

  // Perfect For section
  if (perfect_for && perfect_for.length > 0) {
    html += '\n<section class="pdp-perfect-for">\n';
    html += '  <h3>Perfect For</h3>\n';
    html += '  <ul>\n';
    perfect_for.forEach(p => {
      html += `    <li>${p}</li>\n`;
    });
    html += '  </ul>\n';
    html += '</section>\n';
  }

  // Care section
  if (care) {
    html += '\n<section class="pdp-care">\n';
    html += '  <h3>Care Instructions</h3>\n';
    html += `  <p>${care}</p>\n`;
    html += '</section>\n';
  }

  return html;
}

/**
 * Inject or replace PDP sections in body_html
 */
function updateBodyHtml(existingHtml, newSections) {
  let html = existingHtml || '';

  // Remove existing PDP sections if present
  html = html.replace(/<section class="pdp-highlights">[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<section class="pdp-perfect-for">[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<section class="pdp-care">[\s\S]*?<\/section>/gi, '');

  // Trim whitespace
  html = html.trim();

  // Append new sections
  html += newSections;

  return html;
}

// ============================================================
// SHOPIFY API FUNCTIONS
// ============================================================

async function apiRequest(method, endpoint, data = null, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await makeApiRequest(method, endpoint, data);
      return result;
    } catch (error) {
      if (attempt === retries) throw error;
      console.error(`API request failed, retrying (${attempt}/${retries})...`);
      await sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
    }
  }
}

function makeApiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: STORE_URL,
      port: 443,
      path: '/admin/api/' + API_VERSION + endpoint,
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

/**
 * Update product SEO metafields (title tag and description tag)
 */
async function updateProductSeo(productId, seoTitle, seoDescription) {
  const response = await apiRequest('PUT', `/products/${productId}.json`, {
    product: {
      id: productId,
      metafields_global_title_tag: seoTitle,
      metafields_global_description_tag: seoDescription
    }
  });

  return response.status === 200;
}

/**
 * Update product tags
 */
async function updateProductTags(productId, tags) {
  const response = await apiRequest('PUT', `/products/${productId}.json`, {
    product: {
      id: productId,
      tags: tags.join(', ')
    }
  });

  return response.status === 200;
}

/**
 * Update product body_html
 */
async function updateProductBody(productId, bodyHtml) {
  const response = await apiRequest('PUT', `/products/${productId}.json`, {
    product: {
      id: productId,
      body_html: bodyHtml
    }
  });

  return response.status === 200;
}

/**
 * Update image alt text
 */
async function updateImageAltText(productId, imageId, altText) {
  const response = await apiRequest('PUT', `/products/${productId}/images/${imageId}.json`, {
    image: {
      id: imageId,
      alt: altText
    }
  });

  return response.status === 200;
}

// ============================================================
// MAIN ORCHESTRATOR
// ============================================================

async function processProduct(product) {
  const productId = product.id;
  const updated = [];
  const summary = {
    product_id: productId,
    product_title: product.title,
    tags_added: 0,
    images_updated: 0,
    fields_changed: []
  };

  console.log(`\n========================================`);
  console.log(`Processing product: ${product.title} (ID: ${productId})`);
  console.log(`========================================\n`);

  // 1. Generate SEO metadata
  const seoTitle = generateSeoTitle(product);
  const seoDescription = generateSeoDescription(product);

  console.log(`SEO Title (${seoTitle.length} chars): ${seoTitle}`);
  console.log(`SEO Description (${seoDescription.length} chars): ${seoDescription}`);

  // 2. Generate alt text for images
  const altTextMap = {};
  const images = product.images || [];

  images.forEach((image, index) => {
    const altText = generateImageAltText(image, product, index);
    altTextMap[image.id] = altText;
    console.log(`Image ${image.id} alt: ${altText}`);
  });

  // 3. Generate expanded tags
  const existingTagCount = (product.tags || '').split(',').filter(t => t.trim()).length;
  const mergedTags = generateExpandedTags(product);
  const tagsAdded = mergedTags.length - existingTagCount;

  console.log(`\nTags (${mergedTags.length} total, ${Math.max(0, tagsAdded)} new): ${mergedTags.join(', ')}`);

  // 4. Generate body blocks
  const bodyBlocks = generateBodyBlocks(product);

  console.log(`\nHighlights: ${bodyBlocks.highlights.length} items`);
  console.log(`Perfect For: ${bodyBlocks.perfect_for.length} items`);
  console.log(`Care: ${bodyBlocks.care.length} chars`);

  // 5. Generate updated body_html
  const newSections = generateBodyHtmlSections(bodyBlocks);
  const updatedBodyHtml = updateBodyHtml(product.body_html, newSections);

  // Output the proposed changes (before writeback)
  const proposedChanges = {
    product_id: productId,
    seo: {
      title: seoTitle,
      description: seoDescription
    },
    alt_text_map: altTextMap,
    tags_merged: mergedTags,
    body_blocks: bodyBlocks
  };

  console.log(`\n--- PROPOSED CHANGES ---`);
  console.log(JSON.stringify(proposedChanges, null, 2));
  console.log(`------------------------\n`);

  // 6. Execute Shopify writeback
  if (!ACCESS_TOKEN) {
    console.log('SHOPIFY_ACCESS_TOKEN not set - skipping API writes');
    return { status: 'dry_run', product_id: productId, proposed: proposedChanges };
  }

  console.log('Executing Shopify API writes...\n');

  // Update SEO
  console.log('Updating SEO metadata...');
  const seoSuccess = await updateProductSeo(productId, seoTitle, seoDescription);
  if (seoSuccess) {
    updated.push('seo_title', 'seo_description');
    summary.fields_changed.push('seo_title', 'seo_description');
  }
  await sleep(RATE_LIMIT_MS);

  // Update tags
  console.log('Updating tags...');
  const tagsSuccess = await updateProductTags(productId, mergedTags);
  if (tagsSuccess) {
    updated.push('tags');
    summary.fields_changed.push('tags');
    summary.tags_added = Math.max(0, tagsAdded);
  }
  await sleep(RATE_LIMIT_MS);

  // Update body_html
  console.log('Updating body HTML...');
  const bodySuccess = await updateProductBody(productId, updatedBodyHtml);
  if (bodySuccess) {
    updated.push('body_html');
    summary.fields_changed.push('body_html');
  }
  await sleep(RATE_LIMIT_MS);

  // Update image alt texts
  console.log('Updating image alt texts...');
  for (const image of images) {
    const altText = altTextMap[image.id];
    if (altText && altText !== image.alt) {
      const success = await updateImageAltText(productId, image.id, altText);
      if (success) {
        summary.images_updated++;
      }
      await sleep(RATE_LIMIT_MS);
    }
  }

  if (summary.images_updated > 0) {
    updated.push('alt_text');
    summary.fields_changed.push('alt_text');
  }

  // Final output
  const result = {
    status: 'ok',
    product_id: productId,
    updated: updated
  };

  console.log(`\n--- SUMMARY ---`);
  console.log(JSON.stringify(summary, null, 2));
  console.log(`---------------\n`);

  console.log(JSON.stringify(result));

  return result;
}

// ============================================================
// ENTRY POINT
// ============================================================

async function main() {
  // Read product payload from stdin
  let input = '';

  process.stdin.setEncoding('utf8');

  for await (const chunk of process.stdin) {
    input += chunk;
  }

  if (!input.trim()) {
    console.error('Error: No product payload provided. Pipe JSON to stdin.');
    console.error('Usage: echo \'{"id":123,"title":"..."}\' | node seo-product-automation.js');
    process.exit(1);
  }

  let product;
  try {
    product = JSON.parse(input);
  } catch (e) {
    console.error('Error: Invalid JSON payload');
    console.error(e.message);
    process.exit(1);
  }

  if (!product.id) {
    console.error('Error: Product payload must include "id" field');
    process.exit(1);
  }

  try {
    const result = await processProduct(product);
    process.exit(result.status === 'ok' || result.status === 'dry_run' ? 0 : 1);
  } catch (error) {
    console.error('Error processing product:', error.message);
    process.exit(1);
  }
}

main();
