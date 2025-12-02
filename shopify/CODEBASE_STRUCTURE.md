# Shelzy's Designs - Shopify Theme Codebase Structure

This document provides a quick reference for navigating the Shopify theme code in this repository.

---

## Directory Structure

```
/shopify/
├── assets/                    # CSS files
│   ├── shelzys-brand.css      # Core brand styles (colors, typography)
│   └── shelzys-premium.css    # Enhanced UI component styles
│
├── emails/                    # Email templates (HTML)
│   ├── abandoned-cart-sequence.html
│   └── review-request.html
│
├── pages/                     # Static page HTML templates
│   ├── about-page.html        # About Us page
│   ├── contact-page.html      # Contact form page
│   └── faq-page-accordion.html # FAQ with accordion
│
├── sections/                  # Shopify sections (can be added via theme editor)
│   ├── bulk-order-form.liquid # Bulk/corporate order request form
│   └── featured-products.liquid # Product showcase grid
│
├── snippets/                  # Reusable Liquid snippets
│   ├── shelzys-settings.liquid      # ⭐ CENTRALIZED SETTINGS (thresholds, timelines)
│   ├── shelzys-sublimation-explainer.liquid # Reusable sublimation explanation
│   ├── shelzys-free-shipping-bar.liquid     # Cart shipping progress bar
│   ├── shelzys-announcement-bar.liquid      # Rotating announcement bar
│   ├── shelzys-announcement-clean.liquid    # Simple announcement bar
│   ├── shelzys-trust-badges.liquid          # Trust signals grid
│   └── ... (additional conversion snippets)
│
├── scripts/                   # Deployment & automation scripts (Node.js)
│   ├── master-site-improvement.js    # Main deployment orchestrator
│   ├── deploy-all-improvements.js    # Full site deployment
│   └── ... (feature-specific scripts)
│
├── homepage-sections.liquid   # Complete homepage section templates
├── static-pages.html          # All static page templates in one file
├── PRODUCTS_IMPORT.csv        # Product import data
└── CODEBASE_STRUCTURE.md      # This file
```

---

## Key Files Reference

### Centralized Settings

**`/snippets/shelzys-settings.liquid`**

Contains site-wide values that should be changed in one place:

| Setting | Current Value | Usage |
|---------|---------------|-------|
| `shelzys_free_shipping_threshold` | 7500 (cents) | Cart shipping bar |
| `shelzys_free_shipping_display` | "$75" | Display text |
| `shelzys_processing_days` | "3–5" | Product/checkout messaging |
| `shelzys_shipping_days` | "3–7" | Shipping estimates |
| `shelzys_bulk_processing_days` | "5–7" | Bulk order timeline |
| `shelzys_email` | hello@shelzysdesigns.com | Contact pages |

### Copy & Content Sources

| Content Type | Source File |
|--------------|-------------|
| Homepage copy | `/copy/COPY_BANK.md` |
| Product descriptions | `/products/SHOPIFY_PRODUCT_DESCRIPTIONS.md` |
| FAQ entries | `/copy/COPY_BANK.md` (FAQ section) |
| Brand voice | `/brand/BRAND_GUIDE.md` |
| Site structure | `/structure/SITE_STRUCTURE.md` |

### Snippet Usage Examples

```liquid
{%- comment -%} Include centralized settings {%- endcomment -%}
{% render 'shelzys-settings' %}

{%- comment -%} Add free shipping progress bar to cart {%- endcomment -%}
{% render 'shelzys-free-shipping-bar' %}

{%- comment -%} Add sublimation explainer (full, compact, or inline) {%- endcomment -%}
{% render 'shelzys-sublimation-explainer', variant: 'full', show_cta: true %}
{% render 'shelzys-sublimation-explainer', variant: 'compact' %}
{% render 'shelzys-sublimation-explainer', variant: 'inline' %}

{%- comment -%} Add trust badges {%- endcomment -%}
{% render 'shelzys-trust-badges' %}

{%- comment -%} Add announcement bar {%- endcomment -%}
{% render 'shelzys-announcement-bar' %}
```

---

## Brand Colors (CSS Variables)

```css
:root {
  --sz-sage: #9CAE8C;           /* Primary CTA */
  --sz-sage-dark: #7C9F8C;      /* Hover states */
  --sz-beige: #F7F4EF;          /* Background */
  --sz-black: #111111;          /* Text */
  --sz-blush: #F8D9C5;          /* Accent */
  --sz-sand: #D8CFC4;           /* Neutral */
}
```

---

## Deployment

### GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy-improvements.yml` | Manual | Deploy all site improvements |
| `daily-blog-post.yml` | Scheduled | Auto-publish blog content |
| `weekly-maintenance.yml` | Scheduled | Health checks & cleanup |

### Local Deployment

```bash
# Requires: SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN in .env

# Deploy all improvements
node shopify/scripts/master-site-improvement.js

# Deploy specific features
node shopify/scripts/deploy-conversion-package.js
```

---

## Navigation Structure

```
Main Nav:
├── Home (/)
├── Shop (dropdown)
│   ├── Best Sellers (/collections/best-sellers)
│   ├── Personalized Bottles (/collections/personalized-bottles)
│   ├── Bridesmaid & Bridal (/collections/bridesmaid-bridal-party)
│   ├── Proposal Gift Boxes (/collections/proposal-gift-boxes)
│   ├── Kids Bottles (/collections/kids-bottles)
│   ├── Holiday Collection (/collections/holiday-collection)
│   └── Bulk & Corporate (/pages/bulk-corporate)
├── About (/pages/about)
├── How It Works (/pages/how-it-works)
├── FAQ (/pages/faq)
└── Contact (/pages/contact)
```

---

## Important Business Values

| Value | Standard |
|-------|----------|
| Free shipping threshold | $75 |
| Processing time | 3–5 business days |
| Shipping time | 3–7 business days |
| Total delivery | 6–12 business days |
| Bulk order processing | 5–7 business days |
| Bulk minimum | 10 bottles |
| Response time | 1 business day |

---

## Cleanup Notes

The theme includes scripts that automatically hide/remove legacy demo content:

- Clothing/apparel references (`site-overhaul-phase2.js`)
- Summer sale promotions (`site-cleanup-comprehensive.js`)
- Luxette theme remnants (CSS hiding rules)

---

**Last Updated:** December 2025
