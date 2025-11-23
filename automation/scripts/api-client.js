/**
 * Shopify Admin API Client
 * Shared utilities for all automation scripts
 */

import 'dotenv/config';

const STORE_URL = process.env.SHOPIFY_STORE_URL;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!STORE_URL || !ACCESS_TOKEN) {
  console.error('❌ Missing environment variables!');
  console.error('   Copy .env.example to .env and add your credentials');
  process.exit(1);
}

const BASE_URL = `https://${STORE_URL}/admin/api/2024-01`;

/**
 * Make a REST API request to Shopify
 */
export async function shopifyRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify API Error (${response.status}): ${error}`);
  }

  // Handle empty responses (like DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Make a GraphQL request to Shopify
 */
export async function shopifyGraphQL(query, variables = {}) {
  const url = `https://${STORE_URL}/admin/api/2024-01/graphql.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify GraphQL Error (${response.status}): ${error}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL Errors: ${JSON.stringify(result.errors, null, 2)}`);
  }

  return result.data;
}

/**
 * Get all products
 */
export async function getProducts() {
  const data = await shopifyRequest('/products.json?limit=250');
  return data.products;
}

/**
 * Get all collections
 */
export async function getCollections() {
  const [custom, smart] = await Promise.all([
    shopifyRequest('/custom_collections.json'),
    shopifyRequest('/smart_collections.json'),
  ]);
  return [...custom.custom_collections, ...smart.smart_collections];
}

/**
 * Get all pages
 */
export async function getPages() {
  const data = await shopifyRequest('/pages.json');
  return data.pages;
}

export { STORE_URL, ACCESS_TOKEN };
