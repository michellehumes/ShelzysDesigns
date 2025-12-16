#!/usr/bin/env node
/**
 * Comet Campaign Validation Script
 *
 * Validates all required files exist and data is correctly formatted.
 *
 * Usage: node validate-campaign.js <campaign_slug>
 */

const fs = require('fs');
const path = require('path');

const CAMPAIGN_SLUG = process.argv[2];

if (!CAMPAIGN_SLUG) {
  console.error('Error: Please provide a campaign slug');
  console.error('Usage: node validate-campaign.js <campaign_slug>');
  process.exit(1);
}

const CAMPAIGN_PATH = path.join(__dirname, '../../ops/comet_packs', CAMPAIGN_SLUG);

const errors = [];
const warnings = [];

console.log(`\n🔍 Validating Campaign: ${CAMPAIGN_SLUG}\n`);
console.log('='.repeat(50));

// Check campaign directory exists
if (!fs.existsSync(CAMPAIGN_PATH)) {
  console.error(`❌ FATAL: Campaign directory not found: ${CAMPAIGN_PATH}`);
  process.exit(1);
}
console.log(`✓ Campaign directory exists`);

// Required files
const requiredFiles = [
  'campaign.json',
  'homepage.json',
  'products.csv',
  'collections.csv'
];

requiredFiles.forEach(file => {
  const filePath = path.join(CAMPAIGN_PATH, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} exists`);
  } else {
    errors.push(`Missing required file: ${file}`);
    console.log(`❌ ${file} MISSING`);
  }
});

// Check media directory
const mediaPath = path.join(CAMPAIGN_PATH, 'media');
if (fs.existsSync(mediaPath)) {
  const mediaFiles = fs.readdirSync(mediaPath).filter(f => !f.startsWith('.'));
  console.log(`✓ media/ directory exists (${mediaFiles.length} files)`);

  if (mediaFiles.length === 0) {
    warnings.push('Media directory is empty - images need to be added');
  }
} else {
  warnings.push('media/ directory does not exist');
  console.log(`⚠ media/ directory MISSING`);
}

// Validate campaign.json
const campaignPath = path.join(CAMPAIGN_PATH, 'campaign.json');
if (fs.existsSync(campaignPath)) {
  try {
    const campaign = JSON.parse(fs.readFileSync(campaignPath, 'utf-8'));

    const requiredFields = ['campaign_slug', 'campaign_name', 'hero', 'announcement_bar'];
    requiredFields.forEach(field => {
      if (!campaign[field]) {
        errors.push(`campaign.json missing required field: ${field}`);
      }
    });

    if (campaign.hero) {
      if (!campaign.hero.heading) warnings.push('Hero section missing heading');
      if (!campaign.hero.primary_cta) warnings.push('Hero section missing primary CTA');
    }

    console.log(`✓ campaign.json is valid JSON`);
  } catch (e) {
    errors.push(`campaign.json is not valid JSON: ${e.message}`);
    console.log(`❌ campaign.json invalid JSON`);
  }
}

// Validate homepage.json
const homepagePath = path.join(CAMPAIGN_PATH, 'homepage.json');
if (fs.existsSync(homepagePath)) {
  try {
    const homepage = JSON.parse(fs.readFileSync(homepagePath, 'utf-8'));

    if (!homepage.sections_order || !Array.isArray(homepage.sections_order)) {
      errors.push('homepage.json missing sections_order array');
    }

    if (!homepage.sections) {
      errors.push('homepage.json missing sections object');
    }

    console.log(`✓ homepage.json is valid JSON`);
  } catch (e) {
    errors.push(`homepage.json is not valid JSON: ${e.message}`);
    console.log(`❌ homepage.json invalid JSON`);
  }
}

// Validate products.csv
const productsPath = path.join(CAMPAIGN_PATH, 'products.csv');
if (fs.existsSync(productsPath)) {
  const content = fs.readFileSync(productsPath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const requiredHeaders = ['Handle', 'Title', 'selling_points', 'badges'];
  requiredHeaders.forEach(header => {
    if (!headers.includes(header)) {
      errors.push(`products.csv missing required header: ${header}`);
    }
  });

  console.log(`✓ products.csv has ${lines.length - 1} products`);

  // Validate handle format
  lines.slice(1).forEach((line, i) => {
    const handle = line.split(',')[0];
    if (handle && !/^[a-z0-9-]+$/.test(handle.toLowerCase())) {
      warnings.push(`Product ${i + 1} has non-standard handle: ${handle}`);
    }
  });
}

// Validate collections.csv
const collectionsPath = path.join(CAMPAIGN_PATH, 'collections.csv');
if (fs.existsSync(collectionsPath)) {
  const content = fs.readFileSync(collectionsPath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const requiredHeaders = ['Handle', 'Title', 'hero_image'];
  requiredHeaders.forEach(header => {
    if (!headers.includes(header)) {
      errors.push(`collections.csv missing required header: ${header}`);
    }
  });

  console.log(`✓ collections.csv has ${lines.length - 1} collections`);
}

// Check for referenced media files
if (fs.existsSync(campaignPath) && fs.existsSync(mediaPath)) {
  try {
    const campaign = JSON.parse(fs.readFileSync(campaignPath, 'utf-8'));
    const mediaFiles = fs.readdirSync(mediaPath).map(f => f.toLowerCase());

    // Check hero image
    if (campaign.hero?.media?.src) {
      const heroFile = campaign.hero.media.src.toLowerCase();
      if (!mediaFiles.includes(heroFile) && !heroFile.includes('placeholder')) {
        warnings.push(`Hero image not found in media/: ${campaign.hero.media.src}`);
      }
    }
  } catch (e) {
    // Already handled above
  }
}

// Print results
console.log('\n' + '='.repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ VALIDATION PASSED - Campaign is ready for deployment!\n');
  process.exit(0);
}

if (errors.length > 0) {
  console.log(`\n❌ ERRORS (${errors.length}):`);
  errors.forEach(e => console.log(`   - ${e}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠ WARNINGS (${warnings.length}):`);
  warnings.forEach(w => console.log(`   - ${w}`));
}

if (errors.length > 0) {
  console.log('\n❌ VALIDATION FAILED - Fix errors before deployment\n');
  process.exit(1);
} else {
  console.log('\n⚠ VALIDATION PASSED WITH WARNINGS\n');
  process.exit(0);
}
