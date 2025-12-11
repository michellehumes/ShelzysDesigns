# Shopify Snippets Guide for Shelzy's Designs

## Overview
This guide documents all 55 custom Liquid snippets available in the Shelzy's Designs codebase. These snippets are production-ready and can be deployed directly to your Shopify theme.

---

## Quick Reference: Snippet Categories

| Category | Snippets | Priority |
|----------|----------|----------|
| **Foundation** | settings, css-variables, fonts, master-styles | Must Deploy |
| **Navigation & Layout** | nav-header, footer-v2, breadcrumbs, skip-links | Must Deploy |
| **Product Pages** | personalization-form, product-badges, product-extras, product-faq, product-schema | High |
| **Conversion** | popup-premium, cart-upsell, free-shipping-bar, urgency, sticky-atc | High |
| **Trust & Social Proof** | trust-badges, trust-strip, social-proof-section, testimonials, reviews-carousel | High |
| **Homepage** | hero-v2, hero-premium, bestsellers-premium, occasion-tiles | Medium |
| **Collections** | collection-header, collection-hero, occasion-grid | Medium |
| **Content** | sublimation-explainer, why-choose-us, proof-process | Medium |
| **Utility** | back-to-top, recently-viewed, quick-view, delivery-estimator | Low |
| **SEO** | head-seo, faq-schema | High |
| **Analytics** | vercel-analytics | Medium |

---

## Foundation Snippets

### shelzys-settings.liquid
**Purpose:** Centralized configuration values used across all templates.

**Usage:**
```liquid
{% render 'shelzys-settings' %}
```

**Variables Provided:**
| Variable | Value | Description |
|----------|-------|-------------|
| `shelzys_free_shipping_threshold` | 7500 | Free shipping threshold in cents ($75) |
| `shelzys_free_shipping_display` | "$75" | Display format |
| `shelzys_processing_days` | "3–5" | Standard processing time |
| `shelzys_shipping_days` | "3–7" | Shipping transit time |
| `shelzys_email` | hello@shelzysdesigns.com | Contact email |
| `shelzys_tagline` | Premium Personalized... | Brand tagline |

**Where to Use:** Render in theme.liquid before any other snippets to make variables available globally.

---

### shelzys-css-variables.liquid
**Purpose:** Single source of truth for all CSS custom properties (colors, fonts, spacing).

**Usage:**
```liquid
{% comment %} Add to theme.liquid in <head> section {% endcomment %}
{% render 'shelzys-css-variables' %}
```

**Key Variables:**
```css
--sz-primary: #8BAA88;        /* Sage Green - CTAs */
--sz-primary-hover: #4E5F4A;  /* Dark Sage - hover */
--sz-beige: #F7F4EF;          /* Background */
--sz-font-heading: 'Playfair Display', serif;
--sz-font-body: 'Inter', sans-serif;
```

**Important:** This snippet includes base typography and button styles. Ensure no conflicting CSS in theme.

---

### shelzys-fonts.liquid
**Purpose:** Google Fonts imports for brand typography.

**Usage:**
```liquid
{% comment %} Add to theme.liquid before </head> {% endcomment %}
{% render 'shelzys-fonts' %}
```

**Fonts Loaded:**
- Playfair Display (headings)
- Inter (body text)
- Montserrat (accents)

---

### shelzys-master-styles.liquid
**Purpose:** Additional global styles beyond css-variables.

**Usage:**
```liquid
{% render 'shelzys-master-styles' %}
```

---

## Navigation & Layout Snippets

### shelzys-nav-header.liquid
**Purpose:** Main navigation header with logo, menu, cart icon.

**Usage:**
```liquid
{% comment %} Replace default header in theme.liquid or header section {% endcomment %}
{% render 'shelzys-nav-header' %}
```

---

### shelzys-footer-v2.liquid
**Purpose:** Branded footer with links, newsletter, social icons.

**Usage:**
```liquid
{% comment %} Replace default footer {% endcomment %}
{% render 'shelzys-footer-v2' %}
```

---

### shelzys-breadcrumbs.liquid
**Purpose:** Breadcrumb navigation for products and collections.

**Usage:**
```liquid
{% comment %} Add at top of product/collection templates {% endcomment %}
{% render 'shelzys-breadcrumbs' %}
```

---

### shelzys-skip-links.liquid
**Purpose:** Accessibility skip links for keyboard navigation.

**Usage:**
```liquid
{% comment %} Add immediately after <body> tag {% endcomment %}
{% render 'shelzys-skip-links' %}
```

---

### shelzys-announcement-bar.liquid / shelzys-announcement-unified.liquid / shelzys-announcement-clean.liquid
**Purpose:** Announcement bar variations for promotions.

**Usage:**
```liquid
{% comment %} Choose ONE variant, add before header {% endcomment %}
{% render 'shelzys-announcement-unified' %}
```

---

## Product Page Snippets

### shelzys-personalization-form.liquid
**Purpose:** Interactive personalization form with live preview for customizing bottles.

**Usage:**
```liquid
{% comment %} Add to product form, above Add to Cart button {% endcomment %}
{% render 'shelzys-personalization-form' %}
```

**Features:**
- Name input with character counter
- Font style selector (Script, Classic, Modern)
- Color picker for text
- Live bottle preview
- Multi-name support for sets
- Design proof request option

**Data Collected:**
- `properties[Name]` or `properties[Names]`
- `properties[Font]`
- `properties[Text Color]`
- `properties[Request Proof]`

---

### shelzys-product-badges.liquid
**Purpose:** Display badges like "Best Seller", "New", "Sale" on product cards.

**Usage:**
```liquid
{% render 'shelzys-product-badges', product: product %}
```

---

### shelzys-product-extras.liquid
**Purpose:** Additional product details (shipping info, guarantees).

**Usage:**
```liquid
{% comment %} Add below Add to Cart button {% endcomment %}
{% render 'shelzys-product-extras' %}
```

---

### shelzys-product-faq.liquid
**Purpose:** Collapsible FAQ section for common product questions.

**Usage:**
```liquid
{% comment %} Add after product description {% endcomment %}
{% render 'shelzys-product-faq' %}
```

---

### shelzys-product-schema.liquid
**Purpose:** Structured data (JSON-LD) for product rich snippets in Google.

**Usage:**
```liquid
{% comment %} Add to product template {% endcomment %}
{% render 'shelzys-product-schema', product: product %}
```

---

### shelzys-sticky-atc.liquid
**Purpose:** Mobile sticky Add to Cart bar that appears on scroll.

**Usage:**
```liquid
{% comment %} Add at bottom of product template {% endcomment %}
{% render 'shelzys-sticky-atc', product: product %}
```

---

### shelzys-urgency.liquid
**Purpose:** Urgency messaging ("Order in X hours to ship tomorrow!").

**Usage:**
```liquid
{% render 'shelzys-urgency' %}
```

---

### shelzys-delivery-estimator.liquid
**Purpose:** Estimated delivery date calculator.

**Usage:**
```liquid
{% render 'shelzys-delivery-estimator' %}
```

---

### shelzys-price-per-bottle.liquid
**Purpose:** Shows per-bottle price for multi-packs.

**Usage:**
```liquid
{% render 'shelzys-price-per-bottle', product: product %}
```

---

## Conversion Snippets

### shelzys-popup-premium.liquid
**Purpose:** Email capture popup with WELCOME10 discount code.

**Usage:**
```liquid
{% comment %} Add before </body> in theme.liquid {% endcomment %}
{% render 'shelzys-popup-premium' %}
```

**Behavior:**
- Shows after 25 seconds OR on exit intent
- Only shows once per session
- Doesn't show on cart/checkout pages
- Saves subscription status to localStorage

---

### shelzys-cart-upsell.liquid
**Purpose:** Smart cart upsells based on cart contents.

**Usage:**
```liquid
{% comment %} Add to cart drawer or cart page after items {% endcomment %}
{% render 'shelzys-cart-upsell' %}
```

**Logic:**
- Bridal item + single bottle → Suggests gift box upgrade
- Single bottle → Suggests bundles
- 3+ items → Suggests bulk order discounts
- Default → Shop best sellers

---

### shelzys-free-shipping-bar.liquid
**Purpose:** Progress bar showing how far from free shipping threshold ($75).

**Usage:**
```liquid
{% comment %} Add to cart drawer or page {% endcomment %}
{% render 'shelzys-free-shipping-bar' %}
```

**Features:**
- Dynamic progress bar
- Celebration animation when threshold reached
- Updates via JavaScript when cart changes

---

### shelzys-upsell-frequently-bought.liquid
**Purpose:** "Frequently Bought Together" upsell section.

**Usage:**
```liquid
{% render 'shelzys-upsell-frequently-bought', product: product %}
```

---

### shelzys-upsell-sets.liquid
**Purpose:** Set/bundle upsell options.

**Usage:**
```liquid
{% render 'shelzys-upsell-sets' %}
```

---

### shelzys-newsletter-premium.liquid
**Purpose:** Standalone newsletter signup section (for homepage/footer).

**Usage:**
```liquid
{% render 'shelzys-newsletter-premium' %}
```

---

## Trust & Social Proof Snippets

### shelzys-trust-badges.liquid
**Purpose:** 4-column trust badges (Secure Checkout, Free Shipping, Permanent Print, Made With Care).

**Usage:**
```liquid
{% comment %} Add above footer or on product pages {% endcomment %}
{% render 'shelzys-trust-badges' %}
```

---

### shelzys-trust-strip.liquid
**Purpose:** Horizontal strip with trust icons.

**Usage:**
```liquid
{% render 'shelzys-trust-strip' %}
```

---

### shelzys-social-proof-badge.liquid
**Purpose:** Small social proof badge ("500+ Happy Customers").

**Usage:**
```liquid
{% render 'shelzys-social-proof-badge' %}
```

---

### shelzys-social-proof-section.liquid
**Purpose:** Full social proof section with stats.

**Usage:**
```liquid
{% render 'shelzys-social-proof-section' %}
```

---

### shelzys-testimonials.liquid
**Purpose:** Customer testimonials display.

**Usage:**
```liquid
{% render 'shelzys-testimonials' %}
```

---

### shelzys-reviews-carousel.liquid
**Purpose:** Scrollable reviews carousel.

**Usage:**
```liquid
{% render 'shelzys-reviews-carousel' %}
```

---

### shelzys-proof-band.liquid
**Purpose:** Proof band (alternative social proof display).

**Usage:**
```liquid
{% render 'shelzys-proof-band' %}
```

---

### shelzys-proof-process.liquid
**Purpose:** Visual process/workflow proof section.

**Usage:**
```liquid
{% render 'shelzys-proof-process' %}
```

---

## Homepage Snippets

### shelzys-hero-v2.liquid / shelzys-hero-premium.liquid
**Purpose:** Hero banner sections for homepage.

**Usage:**
```liquid
{% comment %} Use in index.liquid or homepage section {% endcomment %}
{% render 'shelzys-hero-premium' %}
```

---

### shelzys-bestsellers-premium.liquid
**Purpose:** Featured best sellers product grid.

**Usage:**
```liquid
{% render 'shelzys-bestsellers-premium' %}
```

---

### shelzys-occasion-tiles.liquid / shelzys-occasion-grid.liquid
**Purpose:** Shop by occasion grid (Weddings, Birthdays, Teacher Gifts, etc.).

**Usage:**
```liquid
{% render 'shelzys-occasion-tiles' %}
```

---

### shelzys-instagram-feed.liquid
**Purpose:** Instagram feed display (requires API setup).

**Usage:**
```liquid
{% render 'shelzys-instagram-feed' %}
```

---

## Collection Snippets

### shelzys-collection-header.liquid / shelzys-collection-hero.liquid
**Purpose:** Collection page headers with image and description.

**Usage:**
```liquid
{% comment %} Add at top of collection template {% endcomment %}
{% render 'shelzys-collection-hero', collection: collection %}
```

---

## Content Snippets

### shelzys-sublimation-explainer.liquid
**Purpose:** Explains sublimation vs vinyl difference (key differentiator).

**Usage:**
```liquid
{% comment %} Add to product pages or FAQ {% endcomment %}
{% render 'shelzys-sublimation-explainer' %}
```

---

### shelzys-why-choose-us.liquid
**Purpose:** "Why Choose Shelzy's" value proposition section.

**Usage:**
```liquid
{% render 'shelzys-why-choose-us' %}
```

---

### shelzys-bulk-bar.liquid / shelzys-bulk-page.liquid
**Purpose:** Bulk order information and quote request.

**Usage:**
```liquid
{% render 'shelzys-bulk-bar' %}
```

---

### shelzys-countdown.liquid
**Purpose:** Countdown timer for promotions.

**Usage:**
```liquid
{% render 'shelzys-countdown', end_date: '2025-12-25' %}
```

---

## Utility Snippets

### shelzys-back-to-top.liquid
**Purpose:** Back to top button.

**Usage:**
```liquid
{% comment %} Add before </body> {% endcomment %}
{% render 'shelzys-back-to-top' %}
```

---

### shelzys-recently-viewed.liquid
**Purpose:** Recently viewed products section.

**Usage:**
```liquid
{% render 'shelzys-recently-viewed' %}
```

---

### shelzys-quick-view.liquid
**Purpose:** Quick view modal for product cards.

**Usage:**
```liquid
{% render 'shelzys-quick-view' %}
```

---

## SEO Snippets

### shelzys-head-seo.liquid
**Purpose:** SEO meta tags, Open Graph, Twitter cards.

**Usage:**
```liquid
{% comment %} Add to <head> in theme.liquid {% endcomment %}
{% render 'shelzys-head-seo' %}
```

---

### shelzys-faq-schema.liquid
**Purpose:** FAQ structured data for rich snippets.

**Usage:**
```liquid
{% render 'shelzys-faq-schema' %}
```

---

### shelzys-blog-edit.liquid
**Purpose:** Blog post formatting and styling.

**Usage:**
```liquid
{% render 'shelzys-blog-edit' %}
```

---

## Analytics Snippets

### shelzys-vercel-analytics.liquid
**Purpose:** Vercel Web Analytics integration.

**Usage:**
```liquid
{% comment %} Add before </body> {% endcomment %}
{% render 'shelzys-vercel-analytics' %}
```

---

## Deployment Checklist

### Phase 1: Foundation (Day 1)
- [ ] `shelzys-settings.liquid`
- [ ] `shelzys-css-variables.liquid`
- [ ] `shelzys-fonts.liquid`
- [ ] `shelzys-skip-links.liquid`
- [ ] `shelzys-head-seo.liquid`

### Phase 2: Layout (Day 1-2)
- [ ] `shelzys-nav-header.liquid`
- [ ] `shelzys-footer-v2.liquid`
- [ ] `shelzys-announcement-unified.liquid`
- [ ] `shelzys-breadcrumbs.liquid`

### Phase 3: Product Pages (Day 2-3)
- [ ] `shelzys-personalization-form.liquid`
- [ ] `shelzys-product-badges.liquid`
- [ ] `shelzys-product-extras.liquid`
- [ ] `shelzys-product-faq.liquid`
- [ ] `shelzys-product-schema.liquid`
- [ ] `shelzys-sticky-atc.liquid`
- [ ] `shelzys-urgency.liquid`
- [ ] `shelzys-sublimation-explainer.liquid`

### Phase 4: Conversion (Day 3-4)
- [ ] `shelzys-popup-premium.liquid`
- [ ] `shelzys-cart-upsell.liquid`
- [ ] `shelzys-free-shipping-bar.liquid`
- [ ] `shelzys-trust-badges.liquid`
- [ ] `shelzys-testimonials.liquid`

### Phase 5: Homepage (Day 4-5)
- [ ] `shelzys-hero-premium.liquid`
- [ ] `shelzys-bestsellers-premium.liquid`
- [ ] `shelzys-occasion-tiles.liquid`
- [ ] `shelzys-why-choose-us.liquid`

### Phase 6: Polish (Day 5+)
- [ ] `shelzys-recently-viewed.liquid`
- [ ] `shelzys-back-to-top.liquid`
- [ ] `shelzys-vercel-analytics.liquid`
- [ ] Test all snippets on mobile
- [ ] Verify no CSS conflicts

---

## Troubleshooting

### Snippet Not Rendering
1. Check file is in `/snippets/` directory
2. Verify exact filename matches render call
3. Check for syntax errors in Liquid code

### CSS Conflicts
1. Ensure `shelzys-css-variables.liquid` loads first
2. Check for duplicate class names
3. Use browser DevTools to identify conflicting styles

### JavaScript Not Working
1. Check browser console for errors
2. Verify script loads after DOM ready
3. Check for jQuery dependency (most snippets use vanilla JS)

### Mobile Display Issues
1. Check media queries in snippet styles
2. Test with actual device, not just browser resize
3. Verify viewport meta tag in theme.liquid

---

*Last Updated: December 2025*
