# Shelzy's Designs - Codebase Structure

## Overview

This repository contains all Shopify theme customizations, deployment scripts, and documentation for Shelzy's Designs.

## Directory Structure

```
ShelzysDesigns/
├── shopify/
│   ├── snippets/           # Liquid template snippets (40 files)
│   ├── pages/              # Static page HTML (5 files)
│   ├── scripts/            # Deployment scripts
│   │   ├── deploy-master.js    # Primary deployment script
│   │   ├── archived/           # Legacy/one-off scripts
│   │   └── ...utilities
│   ├── sections/           # Theme sections
│   ├── assets/             # CSS/JS assets
│   └── emails/             # Email templates
├── audit-reports/          # Site audit findings
├── implementation/         # Implementation guides
├── brand/                  # Brand assets
└── .github/workflows/      # CI/CD pipelines
```

## Snippets Organization

All snippets follow the `shelzys-` naming convention:

### SEO & Performance
- `shelzys-head-seo.liquid` - Meta tags, Open Graph, canonical URLs
- `shelzys-css-variables.liquid` - Brand CSS custom properties
- `shelzys-fonts.liquid` - Font loading optimization
- `shelzys-skip-links.liquid` - Accessibility skip links
- `shelzys-faq-schema.liquid` - FAQ structured data
- `shelzys-product-schema.liquid` - Product structured data

### Navigation & UI
- `shelzys-announcement-bar.liquid` - Top announcement banner
- `shelzys-free-shipping-bar.liquid` - Dynamic shipping progress
- `shelzys-back-to-top.liquid` - Scroll to top button

### Homepage Sections
- `shelzys-hero-premium.liquid` - Hero banner
- `shelzys-bestsellers-premium.liquid` - Featured products
- `shelzys-occasion-tiles.liquid` - Shop by occasion grid
- `shelzys-why-choose-us.liquid` - Value propositions
- `shelzys-sublimation-explainer.liquid` - Sublimation vs vinyl
- `shelzys-testimonials.liquid` - Customer testimonials
- `shelzys-newsletter-premium.liquid` - Email signup

### Product Page
- `shelzys-personalization.liquid` - Name customization form
- `shelzys-personalization-form.liquid` - Alternative form
- `shelzys-product-badges.liquid` - Sale/new badges
- `shelzys-product-faq.liquid` - Product Q&A
- `shelzys-sticky-atc.liquid` - Sticky add to cart
- `shelzys-trust-badges.liquid` - Trust indicators
- `shelzys-urgency.liquid` - Low stock indicators

### Cart & Conversion
- `shelzys-cart-upsell.liquid` - Cart upsells
- `shelzys-upsell-sets.liquid` - Bundle offers
- `shelzys-upsell-frequently-bought.liquid` - Frequently bought together
- `shelzys-price-per-bottle.liquid` - Bulk pricing

### Social & Marketing
- `shelzys-popup-premium.liquid` - Email capture popup
- `shelzys-social-proof-section.liquid` - Reviews & trust section
- `shelzys-proof-band.liquid` - Social proof banner
- `shelzys-instagram-feed.liquid` - Instagram integration
- `shelzys-recently-viewed.liquid` - Recently viewed products

### Collections
- `shelzys-collection-header.liquid` - Collection page headers
- `shelzys-quick-view.liquid` - Quick view modal

### Utilities
- `shelzys-countdown.liquid` - Sale countdown timer
- `shelzys-bulk-bar.liquid` - Bulk order banner
- `shelzys-bulk-page.liquid` - Bulk order page
- `shelzys-settings.liquid` - Theme settings

## Deployment

### Primary Script

```bash
# Deploy everything
node shopify/scripts/deploy-master.js

# Dry run (preview only)
node shopify/scripts/deploy-master.js --dry-run

# Deploy specific components
node shopify/scripts/deploy-master.js --snippets
node shopify/scripts/deploy-master.js --pages
node shopify/scripts/deploy-master.js --theme
```

### Environment Variables

```bash
export SHOPIFY_STORE_URL="shelzys-designs.myshopify.com"
export SHOPIFY_ACCESS_TOKEN="your-token-here"
```

### Using Shopify CLI

```bash
# Authenticate
shopify theme list --store=shelzys-designs.myshopify.com

# Push theme files
shopify theme push --store=shelzys-designs.myshopify.com
```

## Brand Guidelines

### Colors
- Primary: `#8BAA88` (Sage Green)
- Primary Dark: `#4E5F4A` (Dark Sage)
- Accent Gold: `#D1C7A1` (Champagne)
- Background: `#FAF9F6` (Warm White)
- Text: `#2B2B2B` (Charcoal)

### Typography
- Headings: Playfair Display, 600 weight
- Body: Inter, 400 weight
- Accent: Montserrat, 600 weight

## Pages

| Page | Handle | File |
|------|--------|------|
| About | /pages/about | about-page.html |
| Contact | /pages/contact | contact-page.html |
| FAQ | /pages/faq | faq-page-accordion.html |
| Privacy Policy | /pages/privacy-policy | privacy-policy.html |
| Terms of Service | /pages/terms-of-service | terms-of-service.html |

## Documentation

- `MASTER-RECOMMENDATIONS.md` - Prioritized improvement list
- `implementation/KLAVIYO-SETUP-GUIDE.md` - Email automation setup
- `shopify/INJECTION_GUIDE.md` - Theme integration guide

## Archived Scripts

Legacy and one-off scripts are in `shopify/scripts/archived/`. These are kept for reference but not actively used.

---
*Last Updated: December 2025*
