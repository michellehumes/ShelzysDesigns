#!/usr/bin/env node
/**
 * Comet Campaign Data Ingestion Script
 *
 * Reads campaign CSV files and generates Shopify Admin API mutations
 * for populating product and collection metafields.
 *
 * Usage: node ingest-campaign.js <campaign_slug>
 * Example: node ingest-campaign.js spring-2025
 */

const fs = require('fs');
const path = require('path');

const CAMPAIGN_SLUG = process.argv[2];

if (!CAMPAIGN_SLUG) {
  console.error('Error: Please provide a campaign slug');
  console.error('Usage: node ingest-campaign.js <campaign_slug>');
  process.exit(1);
}

const CAMPAIGN_PATH = path.join(__dirname, '../../ops/comet_packs', CAMPAIGN_SLUG);

// Validate campaign exists
if (!fs.existsSync(CAMPAIGN_PATH)) {
  console.error(`Error: Campaign "${CAMPAIGN_SLUG}" not found at ${CAMPAIGN_PATH}`);
  process.exit(1);
}

/**
 * Parse CSV file into array of objects
 */
function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

/**
 * Normalize handle to Shopify standards
 */
function normalizeHandle(handle) {
  return handle
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate GraphQL mutation for product metafields
 */
function generateProductMetafieldMutation(product) {
  const handle = normalizeHandle(product.Handle);
  const sellingPoints = product.selling_points ? product.selling_points.split('|').map(p => p.trim()) : [];
  const badges = product.badges ? product.badges.split(',').map(b => b.trim()) : [];

  return {
    handle,
    mutations: [
      {
        type: 'selling_points',
        query: `
mutation SetProductSellingPoints {
  productUpdate(input: {
    id: "gid://shopify/Product/PRODUCT_ID_FOR_${handle}"
    metafields: [{
      namespace: "shelzys"
      key: "selling_points"
      type: "list.single_line_text_field"
      value: ${JSON.stringify(JSON.stringify(sellingPoints))}
    }]
  }) {
    product { id title }
    userErrors { field message }
  }
}`,
        values: sellingPoints
      },
      {
        type: 'badges',
        query: `
mutation SetProductBadges {
  productUpdate(input: {
    id: "gid://shopify/Product/PRODUCT_ID_FOR_${handle}"
    metafields: [{
      namespace: "shelzys"
      key: "badges"
      type: "list.single_line_text_field"
      value: ${JSON.stringify(JSON.stringify(badges))}
    }]
  }) {
    product { id title }
    userErrors { field message }
  }
}`,
        values: badges
      }
    ]
  };
}

/**
 * Generate GraphQL mutation for collection metafields
 */
function generateCollectionMetafieldMutation(collection) {
  const handle = normalizeHandle(collection.Handle);
  const heroImage = collection.hero_image || '';

  return {
    handle,
    mutations: [
      {
        type: 'hero_image',
        query: `
mutation SetCollectionHeroImage {
  collectionUpdate(input: {
    id: "gid://shopify/Collection/COLLECTION_ID_FOR_${handle}"
    metafields: [{
      namespace: "shelzys"
      key: "hero_image"
      type: "file_reference"
      value: "gid://shopify/MediaImage/MEDIA_ID_FOR_${heroImage}"
    }]
  }) {
    collection { id title }
    userErrors { field message }
  }
}`,
        file: heroImage
      }
    ]
  };
}

/**
 * Generate shop announcement bar mutation
 */
function generateAnnouncementMutation(campaign) {
  return `
mutation SetAnnouncementBar {
  metafieldsSet(metafields: [{
    namespace: "shelzys"
    key: "announcement_bar"
    ownerId: "gid://shopify/Shop/SHOP_ID"
    type: "single_line_text_field"
    value: ${JSON.stringify(campaign.announcement_bar)}
  }]) {
    metafields { id key value }
    userErrors { field message }
  }
}`;
}

// Main execution
console.log(`\n🚀 Comet Campaign Ingestion: ${CAMPAIGN_SLUG}\n`);
console.log('='.repeat(50));

// Load campaign config
const campaignPath = path.join(CAMPAIGN_PATH, 'campaign.json');
if (!fs.existsSync(campaignPath)) {
  console.error('Error: campaign.json not found');
  process.exit(1);
}
const campaign = JSON.parse(fs.readFileSync(campaignPath, 'utf-8'));
console.log(`✓ Loaded campaign: ${campaign.campaign_name}`);

// Load products CSV
const productsPath = path.join(CAMPAIGN_PATH, 'products.csv');
let products = [];
if (fs.existsSync(productsPath)) {
  products = parseCSV(productsPath);
  console.log(`✓ Loaded ${products.length} products from products.csv`);
} else {
  console.log('⚠ No products.csv found');
}

// Load collections CSV
const collectionsPath = path.join(CAMPAIGN_PATH, 'collections.csv');
let collections = [];
if (fs.existsSync(collectionsPath)) {
  collections = parseCSV(collectionsPath);
  console.log(`✓ Loaded ${collections.length} collections from collections.csv`);
} else {
  console.log('⚠ No collections.csv found');
}

// Generate output
const output = {
  campaign: {
    slug: CAMPAIGN_SLUG,
    name: campaign.campaign_name,
    generated_at: new Date().toISOString()
  },
  shop_mutations: {
    announcement_bar: generateAnnouncementMutation(campaign)
  },
  product_mutations: products.map(generateProductMetafieldMutation),
  collection_mutations: collections.map(generateCollectionMetafieldMutation),
  summary: {
    products: products.length,
    collections: collections.length,
    total_mutations: products.length * 2 + collections.length + 1
  }
};

// Write output
const outputPath = path.join(CAMPAIGN_PATH, 'generated-mutations.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`\n✓ Generated mutations saved to: ${outputPath}`);

// Generate CLI commands file
const cliCommands = `#!/bin/bash
# Shopify CLI Commands for ${campaign.campaign_name}
# Generated: ${new Date().toISOString()}

# 1. Create metafield definitions (run once)
echo "Creating metafield definitions..."
# shopify app function run --path config/metafields/

# 2. Update product metafields
echo "Updating product metafields..."
${products.map(p => `# shopify product update --handle ${normalizeHandle(p.Handle)} --metafield shelzys.selling_points='${p.selling_points}' --metafield shelzys.badges='${p.badges}'`).join('\n')}

# 3. Update collection metafields
echo "Updating collection metafields..."
${collections.map(c => `# shopify collection update --handle ${normalizeHandle(c.Handle)} --metafield shelzys.hero_image='${c.hero_image}'`).join('\n')}

# 4. Set announcement bar
echo "Setting announcement bar..."
# shopify metafield set --namespace shelzys --key announcement_bar --value "${campaign.announcement_bar}"

echo "Done! Campaign ${CAMPAIGN_SLUG} data ingested."
`;

const cliPath = path.join(CAMPAIGN_PATH, 'ingest-commands.sh');
fs.writeFileSync(cliPath, cliCommands);
fs.chmodSync(cliPath, '755');
console.log(`✓ CLI commands saved to: ${cliPath}`);

// Print summary
console.log('\n' + '='.repeat(50));
console.log('📊 INGESTION SUMMARY');
console.log('='.repeat(50));
console.log(`Campaign: ${campaign.campaign_name}`);
console.log(`Products: ${products.length}`);
console.log(`Collections: ${collections.length}`);
console.log(`Total Mutations: ${output.summary.total_mutations}`);
console.log('\n📝 Product Metafields to Update:');
products.forEach(p => {
  console.log(`  - ${p.Handle}: selling_points (${p.selling_points.split('|').length}), badges (${p.badges.split(',').length})`);
});
console.log('\n📁 Collection Metafields to Update:');
collections.forEach(c => {
  console.log(`  - ${c.Handle}: hero_image (${c.hero_image})`);
});
console.log('\n🔔 Announcement Bar:');
console.log(`  "${campaign.announcement_bar}"`);
console.log('\n✅ Ingestion preparation complete!\n');
