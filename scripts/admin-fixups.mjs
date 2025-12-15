#!/usr/bin/env node
/**
 * Shopify Admin URL Redirects Script
 *
 * Creates URL redirects for dead/indexed URLs to prevent 404s.
 * Safe to re-run - handles "already exists" errors gracefully.
 *
 * Usage:
 *   SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com \
 *   SHOPIFY_ADMIN_TOKEN=shpat_xxx \
 *   node scripts/admin-fixups.mjs
 *
 * Environment Variables:
 *   SHOPIFY_STORE_DOMAIN - Your myshopify.com domain (e.g., shelzysdesigns.myshopify.com)
 *   SHOPIFY_ADMIN_TOKEN  - Admin API access token with write_url_redirects scope
 */

const shop = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_TOKEN;

if (!shop || !token) {
  console.error("Error: Missing required environment variables.");
  console.error("");
  console.error("Usage:");
  console.error("  SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com \\");
  console.error("  SHOPIFY_ADMIN_TOKEN=shpat_xxx \\");
  console.error("  node scripts/admin-fixups.mjs");
  console.error("");
  console.error("Required scopes: write_url_redirects");
  process.exit(1);
}

const endpoint = `https://${shop}/admin/api/2024-10/graphql.json`;

/**
 * Execute GraphQL query against Shopify Admin API
 */
async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }
  return json.data;
}

/**
 * Create a URL redirect in Shopify
 * Handles "already exists" errors gracefully
 */
async function createRedirect(path, target) {
  const mutation = `
    mutation CreateRedirect($urlRedirect: UrlRedirectInput!) {
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

  try {
    const data = await gql(mutation, {
      urlRedirect: { path, target }
    });

    const result = data.urlRedirectCreate;
    const errors = result.userErrors || [];

    if (errors.length > 0) {
      const msg = errors.map(e => e.message).join(" | ");

      // Check if the error is because redirect already exists
      if (/already|exists|duplicate/i.test(msg)) {
        console.log(`  [SKIP] ${path} -> redirect already exists`);
        return { status: "exists", path, target };
      }

      console.warn(`  [WARN] ${path} -> ${msg}`);
      return { status: "error", path, target, error: msg };
    }

    console.log(`  [OK]   ${path} -> ${target}`);
    return { status: "created", path, target, id: result.urlRedirect?.id };

  } catch (err) {
    console.error(`  [ERR]  ${path} -> ${err.message}`);
    return { status: "error", path, target, error: err.message };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("");
  console.log("=".repeat(60));
  console.log("Shopify URL Redirects - Admin Fixups");
  console.log("=".repeat(60));
  console.log(`Store: ${shop}`);
  console.log("");

  const redirects = [
    { path: "/pages/about-us", target: "/pages/about" },
    { path: "/pages/shipping-returns", target: "/pages/shipping" },
  ];

  console.log("Creating redirects...");
  console.log("");

  const results = [];
  for (const { path, target } of redirects) {
    const result = await createRedirect(path, target);
    results.push(result);
  }

  console.log("");
  console.log("-".repeat(60));
  console.log("Summary:");

  const created = results.filter(r => r.status === "created").length;
  const existing = results.filter(r => r.status === "exists").length;
  const errors = results.filter(r => r.status === "error").length;

  console.log(`  Created: ${created}`);
  console.log(`  Already existed: ${existing}`);
  console.log(`  Errors: ${errors}`);
  console.log("");

  if (errors > 0) {
    console.log("Some redirects failed. Check your API token permissions.");
    process.exit(1);
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error("");
  console.error("Fatal error:", err.message);
  process.exit(1);
});
