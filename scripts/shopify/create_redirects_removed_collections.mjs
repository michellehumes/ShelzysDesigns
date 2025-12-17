#!/usr/bin/env node

/**
 * Shelzy's Designs - Create URL Redirects for Removed Collections
 *
 * This script creates 301 redirects for legacy collection URLs using the
 * Shopify Admin GraphQL API. All legacy collection paths redirect to
 * /collections/custom-water-bottles.
 *
 * REDIRECTS CREATED:
 * /collections/wedding -> /collections/custom-water-bottles
 * /collections/bridesmaid -> /collections/custom-water-bottles
 * /collections/bridal-party-sets -> /collections/custom-water-bottles
 * /collections/bridal-party -> /collections/custom-water-bottles
 * /collections/proposal-boxes -> /collections/custom-water-bottles
 * /collections/bridesmaid-proposal -> /collections/custom-water-bottles
 * /collections/wedding-day -> /collections/custom-water-bottles
 * /collections/bachelorette -> /collections/custom-water-bottles
 * /collections/bridal-shower -> /collections/custom-water-bottles
 * /collections/baby-shower -> /collections/custom-water-bottles
 * /collections/corporate-bulk -> /collections/custom-water-bottles
 * /collections/best-sellers -> /collections/custom-water-bottles
 *
 * ENVIRONMENT VARIABLES REQUIRED:
 * - SHOPIFY_STORE_DOMAIN: Your Shopify store domain (e.g., shelzysdesigns.myshopify.com)
 * - SHOPIFY_ADMIN_API_ACCESS_TOKEN: Your Shopify Admin API access token
 * - SHOPIFY_API_VERSION: (Optional) API version, defaults to 2024-01
 *
 * REQUIRED API SCOPES:
 * - write_content (for URL redirects)
 *
 * USAGE:
 * export SHOPIFY_STORE_DOMAIN="shelzysdesigns.myshopify.com"
 * export SHOPIFY_ADMIN_API_ACCESS_TOKEN="shpat_xxxxxxxxxxxx"
 * node scripts/shopify/create_redirects_removed_collections.mjs
 *
 * This script is idempotent - running it multiple times is safe.
 * If a redirect already exists, it will be skipped.
 */

const LEGACY_COLLECTION_PATHS = [
  '/collections/wedding',
  '/collections/bridesmaid',
  '/collections/bridal-party-sets',
  '/collections/bridal-party',
  '/collections/proposal-boxes',
  '/collections/bridesmaid-proposal',
  '/collections/wedding-day',
  '/collections/bachelorette',
  '/collections/bridal-shower',
  '/collections/baby-shower',
  '/collections/corporate-bulk',
  '/collections/best-sellers'
];

const TARGET_PATH = '/collections/custom-water-bottles';

// Environment configuration
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

// Validate environment variables
function validateEnvironment() {
  const missing = [];

  if (!SHOPIFY_STORE_DOMAIN) {
    missing.push('SHOPIFY_STORE_DOMAIN');
  }

  if (!SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
    missing.push('SHOPIFY_ADMIN_API_ACCESS_TOKEN');
  }

  if (missing.length > 0) {
    console.error('ERROR: Missing required environment variables:');
    missing.forEach(varName => console.error(`  - ${varName}`));
    console.error('\nPlease set these environment variables before running this script.');
    console.error('\nExample:');
    console.error('  export SHOPIFY_STORE_DOMAIN="shelzysdesigns.myshopify.com"');
    console.error('  export SHOPIFY_ADMIN_API_ACCESS_TOKEN="shpat_xxxxxxxxxxxx"');
    process.exit(1);
  }
}

// GraphQL endpoint URL
function getGraphQLEndpoint() {
  return `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

// Execute GraphQL query
async function executeGraphQL(query, variables = {}) {
  const response = await fetch(getGraphQLEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(`HTTP 401 Unauthorized - Invalid or expired API token. Please verify your SHOPIFY_ADMIN_API_ACCESS_TOKEN.`);
    }
    if (response.status === 403) {
      throw new Error(`HTTP 403 Forbidden - Token may lack required scopes. Ensure 'write_content' scope is enabled.`);
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}

// Check if a redirect already exists for a path
async function checkRedirectExists(path) {
  const query = `
    query getRedirects($query: String!) {
      urlRedirects(first: 1, query: $query) {
        edges {
          node {
            id
            path
            target
          }
        }
      }
    }
  `;

  try {
    const data = await executeGraphQL(query, { query: `path:${path}` });
    return data.urlRedirects.edges.length > 0;
  } catch (error) {
    // If we can't check, assume it doesn't exist
    console.warn(`Warning: Could not check if redirect exists for ${path}: ${error.message}`);
    return false;
  }
}

// Create a URL redirect
async function createRedirect(path, target) {
  const mutation = `
    mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {
      urlRedirectCreate(urlRedirect: $urlRedirect) {
        urlRedirect {
          id
          path
          target
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    urlRedirect: {
      path: path,
      target: target
    }
  };

  const data = await executeGraphQL(mutation, variables);
  return data.urlRedirectCreate;
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Shelzy\'s Designs - URL Redirect Creator');
  console.log('Creating 301 redirects for removed collection URLs');
  console.log('='.repeat(60));
  console.log('');

  // Validate environment
  validateEnvironment();

  console.log(`Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`API Version: ${SHOPIFY_API_VERSION}`);
  console.log(`Target: ${TARGET_PATH}`);

  // Debug: Show token info (masked)
  const tokenLength = SHOPIFY_ADMIN_API_ACCESS_TOKEN?.length || 0;
  const tokenPreview = tokenLength > 10
    ? `${SHOPIFY_ADMIN_API_ACCESS_TOKEN.substring(0, 8)}...${SHOPIFY_ADMIN_API_ACCESS_TOKEN.substring(tokenLength - 4)}`
    : '(token too short or missing)';
  console.log(`Token: ${tokenPreview} (${tokenLength} chars)`);

  if (!SHOPIFY_ADMIN_API_ACCESS_TOKEN.startsWith('shpat_')) {
    console.log('\n⚠️  WARNING: Token does not start with "shpat_"');
    console.log('   Shopify Admin API tokens should start with "shpat_"');
    console.log('   Make sure you copied the full token from Shopify Admin.');
  }

  console.log('');

  const results = {
    created: [],
    skipped: [],
    failed: []
  };

  // Process each legacy path
  for (const sourcePath of LEGACY_COLLECTION_PATHS) {
    console.log(`Processing: ${sourcePath}`);

    try {
      // Check if redirect already exists
      const exists = await checkRedirectExists(sourcePath);

      if (exists) {
        console.log(`  ⏭️  Skipped (redirect already exists)`);
        results.skipped.push(sourcePath);
        continue;
      }

      // Create the redirect
      const result = await createRedirect(sourcePath, TARGET_PATH);

      if (result.userErrors && result.userErrors.length > 0) {
        const errorMsg = result.userErrors.map(e => e.message).join(', ');

        // Check if error is about redirect already existing
        if (errorMsg.toLowerCase().includes('already exists') ||
            errorMsg.toLowerCase().includes('duplicate')) {
          console.log(`  ⏭️  Skipped (${errorMsg})`);
          results.skipped.push(sourcePath);
        } else {
          console.log(`  ❌ Failed: ${errorMsg}`);
          results.failed.push({ path: sourcePath, error: errorMsg });
        }
      } else if (result.urlRedirect) {
        console.log(`  ✅ Created redirect to ${TARGET_PATH}`);
        results.created.push(sourcePath);
      }

      // Rate limiting - small delay between requests
      await new Promise(resolve => setTimeout(resolve, 250));

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      results.failed.push({ path: sourcePath, error: error.message });
    }
  }

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Created: ${results.created.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.created.length > 0) {
    console.log('\nCreated redirects:');
    results.created.forEach(path => console.log(`  ${path} -> ${TARGET_PATH}`));
  }

  if (results.failed.length > 0) {
    console.log('\nFailed redirects:');
    results.failed.forEach(item => console.log(`  ${item.path}: ${item.error}`));
  }

  console.log('');
  console.log('Done!');

  // Exit with error code if any failed
  if (results.failed.length > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
