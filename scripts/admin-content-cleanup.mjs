#!/usr/bin/env node
/**
 * Shopify Admin Content Cleanup Script
 *
 * This script:
 * 1. Lists and deletes ALL blogs (completely removes blog functionality)
 * 2. Creates URL redirects for dead/indexed URLs to prevent 404s
 *
 * Safe to re-run - handles "already exists" errors gracefully.
 *
 * Usage:
 *   SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com \
 *   SHOPIFY_ADMIN_TOKEN=shpat_xxx \
 *   node scripts/admin-content-cleanup.mjs
 *
 * Environment Variables:
 *   SHOPIFY_STORE_DOMAIN - Your myshopify.com domain (e.g., shelzysdesigns.myshopify.com)
 *   SHOPIFY_ADMIN_TOKEN  - Admin API access token with scopes:
 *                          - write_content (for blogs)
 *                          - write_url_redirects (for redirects)
 */

const shop = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_TOKEN;

if (!shop || !token) {
  console.error("Error: Missing required environment variables.");
  console.error("");
  console.error("Usage:");
  console.error("  SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com \\");
  console.error("  SHOPIFY_ADMIN_TOKEN=shpat_xxx \\");
  console.error("  node scripts/admin-content-cleanup.mjs");
  console.error("");
  console.error("Required scopes: write_content, write_url_redirects");
  process.exit(1);
}

const endpoint = `https://${shop}/admin/api/2025-01/graphql.json`;

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
 * List all blogs in the store
 */
async function listBlogs() {
  const query = `
    query ListBlogs($first: Int!) {
      blogs(first: $first) {
        nodes {
          id
          handle
          title
        }
      }
    }
  `;

  const data = await gql(query, { first: 50 });
  return data.blogs?.nodes || [];
}

/**
 * Delete a blog by ID
 */
async function deleteBlog(id) {
  const mutation = `
    mutation DeleteBlog($id: ID!) {
      blogDelete(id: $id) {
        deletedBlogId
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const data = await gql(mutation, { id });
    const result = data.blogDelete;
    const errors = result.userErrors || [];

    if (errors.length > 0) {
      const msg = errors.map(e => e.message).join(" | ");
      console.warn(`  [WARN] Failed to delete blog ${id}: ${msg}`);
      return { status: "error", id, error: msg };
    }

    console.log(`  [OK]   Deleted blog: ${result.deletedBlogId}`);
    return { status: "deleted", id: result.deletedBlogId };

  } catch (err) {
    console.error(`  [ERR]  Failed to delete blog ${id}: ${err.message}`);
    return { status: "error", id, error: err.message };
  }
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
  console.log("Shopify Admin Content Cleanup");
  console.log("=".repeat(60));
  console.log(`Store: ${shop}`);
  console.log("");

  // ============================================
  // STEP 1: DELETE ALL BLOGS
  // ============================================
  console.log("STEP 1: Deleting all blogs...");
  console.log("-".repeat(40));

  let blogs = await listBlogs();
  console.log(`Found ${blogs.length} blog(s):`);
  blogs.forEach(b => console.log(`  - ${b.handle} (${b.title})`));

  if (blogs.length === 0) {
    console.log("  No blogs to delete.");
  } else {
    for (const blog of blogs) {
      await deleteBlog(blog.id);
    }

    // Verify all blogs are deleted
    const remainingBlogs = await listBlogs();
    if (remainingBlogs.length > 0) {
      console.log(`  Retrying deletion for ${remainingBlogs.length} remaining blog(s)...`);
      for (const blog of remainingBlogs) {
        await deleteBlog(blog.id);
      }
    }
  }

  console.log("");

  // ============================================
  // STEP 2: CREATE URL REDIRECTS
  // ============================================
  console.log("STEP 2: Creating URL redirects...");
  console.log("-".repeat(40));

  const redirects = [
    // Blog redirects (now that blog is deleted)
    { path: "/blogs/news", target: "/pages/about" },
    { path: "/blogs/news/the-ultimate-water-bottle-maintenance-guide", target: "/pages/care-instructions" },
    { path: "/blogs/news/luxurious-bridesmaid-robes-the-perfect-getting-ready-gift-for-your-bridal-party", target: "/collections/bridesmaid" },
    { path: "/blogs/news/the-best-travel-jewelry-organizers-for-destination-weddings-honeymoons-2025", target: "/collections/wedding" },
    { path: "/blogs/news/the-best-bridal-party-gifts-under-50-2025-guide", target: "/collections/bridesmaid" },
    { path: "/blogs/news/top-25-bachelorette-weekend-essentials", target: "/collections/bachelorette" },
    { path: "/blogs/news/how-to-personalize-gifts-like-a-pro-fonts-cricut-templates", target: "/" },
    { path: "/blogs/news/what-to-put-in-a-bridesmaid-proposal-box-2025-guide", target: "/collections/bridesmaid-proposal" },

    // Legacy page redirects
    { path: "/pages/about-us", target: "/pages/about" },
    { path: "/pages/shipping-returns", target: "/pages/shipping" },
  ];

  const results = [];
  for (const { path, target } of redirects) {
    const result = await createRedirect(path, target);
    results.push(result);
  }

  console.log("");

  // ============================================
  // SUMMARY
  // ============================================
  console.log("=".repeat(60));
  console.log("Summary");
  console.log("=".repeat(60));

  const blogsDeleted = blogs.length;
  const redirectsCreated = results.filter(r => r.status === "created").length;
  const redirectsExisting = results.filter(r => r.status === "exists").length;
  const redirectsErrors = results.filter(r => r.status === "error").length;

  console.log(`Blogs deleted: ${blogsDeleted}`);
  console.log(`Redirects created: ${redirectsCreated}`);
  console.log(`Redirects already existed: ${redirectsExisting}`);
  console.log(`Redirect errors: ${redirectsErrors}`);
  console.log("");

  if (redirectsErrors > 0) {
    console.log("Some redirects failed. Check your API token permissions.");
    console.log("Required scopes: write_content, write_url_redirects");
  }

  console.log("Done!");
  console.log("");
  console.log("Next steps:");
  console.log("1. Verify /pages/care-instructions page exists in Shopify Admin");
  console.log("2. Test the redirects by visiting the old URLs");
  console.log("3. Submit updated sitemap to Google Search Console");
}

main().catch((err) => {
  console.error("");
  console.error("Fatal error:", err.message);
  process.exit(1);
});
