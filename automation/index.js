require('dotenv').config();
const Shopify = require('shopify-api-node');

// Initialize Shopify client
const shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN
});

// Example: List all products
async function listProducts() {
  try {
    const products = await shopify.product.list({ limit: 10 });
    console.log('Products:');
    products.forEach(product => {
      console.log(`- ${product.title} (ID: ${product.id})`);
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
}

// Example: Update product inventory
async function updateInventory(productId, variantId, newQuantity) {
  try {
    const inventoryItem = await shopify.inventoryLevel.set({
      inventory_item_id: variantId,
      available: newQuantity,
      location_id: process.env.SHOPIFY_LOCATION_ID
    });
    console.log(`Updated inventory for variant ${variantId} to ${newQuantity}`);
    return inventoryItem;
  } catch (error) {
    console.error('Error updating inventory:', error.message);
    throw error;
  }
}

// Example: Get all orders
async function getOrders(status = 'any') {
  try {
    const orders = await shopify.order.list({ status, limit: 50 });
    console.log(`Found ${orders.length} orders with status: ${status}`);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw error;
  }
}

// Example: Get shop information
async function getShopInfo() {
  try {
    const shop = await shopify.shop.get();
    console.log('Shop Info:');
    console.log(`- Name: ${shop.name}`);
    console.log(`- Domain: ${shop.domain}`);
    console.log(`- Email: ${shop.email}`);
    return shop;
  } catch (error) {
    console.error('Error fetching shop info:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('Shelzy\'s Designs - Shopify Automation\n');

  // Verify connection by getting shop info
  await getShopInfo();
  console.log('\n---\n');

  // List products
  await listProducts();
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Export functions for use as a module
module.exports = {
  shopify,
  listProducts,
  updateInventory,
  getOrders,
  getShopInfo
};
