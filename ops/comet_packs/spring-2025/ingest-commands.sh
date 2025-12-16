#!/bin/bash
# Shopify CLI Commands for Spring Collection 2025
# Generated: 2025-12-16T05:58:04.127Z

# 1. Create metafield definitions (run once)
echo "Creating metafield definitions..."
# shopify app function run --path config/metafields/

# 2. Update product metafields
echo "Updating product metafields..."
# shopify product update --handle spring-floral-bottle --metafield shelzys.selling_points='Permanent sublimation printing|Double-wall insulated|24hr cold / 12hr hot|BPA-free and durable' --metafield shelzys.badges='new,limited'
# shopify product update --handle cherry-blossom-bottle --metafield shelzys.selling_points='Delicate cherry blossom design|Permanent sublimation print|Premium insulated steel|Gift-ready packaging' --metafield shelzys.badges='new,bestseller'
# shopify product update --handle lavender-fields-bottle --metafield shelzys.selling_points='Calming lavender aesthetic|Permanent sublimation|Keeps drinks cold 24hrs|Scratch-resistant finish' --metafield shelzys.badges='new'
# shopify product update --handle pastel-rainbow-bottle --metafield shelzys.selling_points='Soft rainbow gradient|Permanent personalization|Double-wall insulated|Perfect for everyday' --metafield shelzys.badges='new'
# shopify product update --handle mint-green-botanical --metafield shelzys.selling_points='Fresh botanical design|Premium insulated steel|Permanent sublimation|No vinyl ever' --metafield shelzys.badges='new,limited'
# shopify product update --handle peach-blossom-bottle --metafield shelzys.selling_points='Elegant peach florals|24hr cold retention|Permanent design|Handcrafted with care' --metafield shelzys.badges='new'
# shopify product update --handle wildflower-meadow-bottle --metafield shelzys.selling_points='Vibrant wildflower print|Dishwasher safe|Permanent sublimation|Gallery-quality finish' --metafield shelzys.badges='new,bestseller'
# shopify product update --handle baby-blue-daisy-bottle --metafield shelzys.selling_points='Sweet daisy design|Soft baby blue|Permanent printing|Perfect spring gift' --metafield shelzys.badges='new'

# 3. Update collection metafields
echo "Updating collection metafields..."
# shopify collection update --handle spring-2025 --metafield shelzys.hero_image='spring-collection-hero.jpg'
# shopify collection update --handle floral-designs --metafield shelzys.hero_image='floral-collection-hero.jpg'
# shopify collection update --handle pastel-collection --metafield shelzys.hero_image='pastel-collection-hero.jpg'

# 4. Set announcement bar
echo "Setting announcement bar..."
# shopify metafield set --namespace shelzys --key announcement_bar --value "Spring Collection is HERE! Free shipping on orders $50+ | Use code SPRING25 for 15% off"

echo "Done! Campaign spring-2025 data ingested."
