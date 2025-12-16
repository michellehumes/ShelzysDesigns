# Spring 2025 Campaign Deployment Guide

## Campaign Overview
- **Campaign Name**: Spring Collection 2025
- **Campaign Slug**: spring-2025
- **Start Date**: March 1, 2025
- **End Date**: May 31, 2025

## Files Created

### Sections (in `/sections/`)
- `sz-hero.liquid` - Campaign hero with image/video support
- `sz-badges.liquid` - Dynamic badges from metafields
- `sz-collection-tiles.liquid` - Responsive collection grid

### Templates (in `/templates/`)
- `index.spring-2025.json` - Campaign homepage template
- `collection.spring-2025.json` - Campaign collection template
- `product.spring-2025.json` - Campaign product template

### Metafield Definitions (in `/config/metafields/`)
- `product_metafields.json` - selling_points, badges
- `collection_metafields.json` - hero_image
- `shop_metafields.json` - announcement_bar

## Theme Preview Setup

### Option 1: Shopify CLI (Recommended)
```bash
# Install Shopify CLI if not already installed
npm install -g @shopify/cli @shopify/theme

# Authenticate with your store
shopify auth login --store your-store.myshopify.com

# Create preview theme
shopify theme push --unpublished

# Or use the deploy script
./scripts/comet/deploy-campaign.sh spring-2025 --preview
```

### Option 2: Manual Upload
1. Go to Shopify Admin > Online Store > Themes
2. Click "Add theme" > "Upload zip file"
3. Upload the theme files
4. Preview before publishing

## Data Ingestion

### Apply Metafield Definitions
Run these GraphQL mutations in Shopify Admin > Settings > Custom data:

1. **Product Metafields**
   - `shelzys.selling_points` (list.single_line_text_field)
   - `shelzys.badges` (list.single_line_text_field)

2. **Collection Metafields**
   - `shelzys.hero_image` (file_reference)

3. **Shop Metafields**
   - `shelzys.announcement_bar` (single_line_text_field)

### Populate Product Data
See `generated-mutations.json` for complete GraphQL mutations.

Quick reference for products:
| Handle | Badges | Collections |
|--------|--------|-------------|
| spring-floral-bottle | new, limited | spring-2025, floral-designs |
| cherry-blossom-bottle | new, bestseller | spring-2025, floral-designs |
| lavender-fields-bottle | new | spring-2025, floral-designs, pastel-collection |
| pastel-rainbow-bottle | new | spring-2025, pastel-collection |
| mint-green-botanical | new, limited | spring-2025, pastel-collection, floral-designs |
| peach-blossom-bottle | new | spring-2025, floral-designs, pastel-collection |
| wildflower-meadow-bottle | new, bestseller | spring-2025, floral-designs |
| baby-blue-daisy-bottle | new | spring-2025, floral-designs, pastel-collection |

## Media Files Required

Upload to Shopify Files (Settings > Files):

### Hero Images
- [ ] `spring-hero-2025.jpg` (2400x1200px)

### Collection Images
- [ ] `spring-tile.jpg` (800x800px)
- [ ] `floral-tile.jpg` (800x800px)
- [ ] `pastel-tile.jpg` (800x800px)
- [ ] `wedding-tile.jpg` (800x800px)
- [ ] `spring-collection-hero.jpg` (1600x800px)
- [ ] `floral-collection-hero.jpg` (1600x800px)
- [ ] `pastel-collection-hero.jpg` (1600x800px)

## Announcement Bar

Set this text in the shop metafield:
```
Spring Collection is HERE! Free shipping on orders $50+ | Use code SPRING25 for 15% off
```

## Template Assignment

After theme is live, assign templates:
1. Homepage: Use `index.spring-2025` template
2. Spring 2025 Collection: Use `collection.spring-2025` template
3. Spring Products: Use `product.spring-2025` template

## Checklist

- [ ] Theme files uploaded
- [ ] Preview tested
- [ ] Metafield definitions created
- [ ] Product metafields populated
- [ ] Collection metafields populated
- [ ] Shop metafield (announcement) set
- [ ] Media files uploaded
- [ ] Templates assigned
- [ ] Final QA complete
- [ ] Theme published

## Support

For issues with this campaign, check:
- `scripts/comet/validate-campaign.js` for validation
- `generated-mutations.json` for API mutations
- `ingest-commands.sh` for CLI commands
