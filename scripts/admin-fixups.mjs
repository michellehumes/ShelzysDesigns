// scripts/admin-fixups.mjs
// Node 18+ (fetch available). Run with:
// SHOPIFY_STORE_DOMAIN=... SHOPIFY_ADMIN_TOKEN=... node scripts/admin-fixups.mjs

const shop = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_TOKEN;

if (!shop || !token) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN");
  process.exit(1);
}

// Use a valid Shopify API version (quarterly releases: 01, 04, 07, 10)
const endpoint = `https://${shop}/admin/api/2025-01/graphql.json`;

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
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

async function createRedirect(path, target) {
  const m = `
    mutation CreateRedirect($path: String!, $target: String!) {
      urlRedirectCreate(urlRedirect: {path: $path, target: $target}) {
        urlRedirect { id path target }
        userErrors { field message }
      }
    }
  `;
  const data = await gql(m, { path, target });
  const errs = data.urlRedirectCreate.userErrors;
  if (errs?.length) console.warn("Redirect error:", path, errs);
  else console.log("Redirect OK:", path, "->", target);
}

(async () => {
  // Fix dead legacy URLs (adjust targets if you prefer different destinations)
  await createRedirect("/pages/about-us", "/pages/about");
  await createRedirect("/pages/shipping-returns", "/pages/shipping");
  await createRedirect("/pages/care-instructions", "/blogs/news/the-ultimate-water-bottle-maintenance-guide");

  // If you know other dead URLs, add them here
  // await createRedirect("/collections/best-sellers/products/event-set-of-10-personalized-water-bottles", "/collections/all");

  console.log("Done.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
