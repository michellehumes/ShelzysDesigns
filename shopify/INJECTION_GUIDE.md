# Shelzy's Designs - UX Upgrade Implementation Guide

This guide explains how to integrate all the new theme components into your Shopify theme.

## Quick Start

1. **Deploy snippets** (automated):
   ```bash
   SHOPIFY_STORE_URL="shelzys-designs.myshopify.com" \
   SHOPIFY_ACCESS_TOKEN="shpat_xxx" \
   node shopify/scripts/deploy-ux-upgrade.js
   ```

2. **Add render tags** to your theme templates (manual in Shopify admin)

---

## New Snippets Overview

| Snippet | Purpose | Location |
|---------|---------|----------|
| `shelzys-master-styles.liquid` | Unified CSS design system | theme.liquid `<head>` |
| `shelzys-announcement-unified.liquid` | Clean value-stack announcement bar | theme.liquid after `<body>` |
| `shelzys-nav-header.liquid` | Improved navigation with dropdowns | theme.liquid after announcement |
| `shelzys-hero-v2.liquid` | Conversion-focused hero section | Homepage |
| `shelzys-occasion-grid.liquid` | 6-card shop by occasion | Homepage |
| `shelzys-reviews-carousel.liquid` | Compact review carousel | Homepage |
| `shelzys-trust-strip.liquid` | Bottom trust badges | Homepage (above footer) |
| `shelzys-footer-v2.liquid` | Organized footer with newsletter | theme.liquid before `</body>` |
| `shelzys-collection-hero.liquid` | Collection page headers | Collection templates |
| `shelzys-product-extras.liquid` | Benefits, shipping, cross-sells | Product templates |

---

## Step-by-Step Integration

### 1. Theme.liquid - Head Section

Add inside `<head>`:

```liquid
{% render 'shelzys-master-styles' %}
{% render 'shelzys-head-seo' %}
```

This loads the unified design system CSS variables and base styles.

### 2. Theme.liquid - After Body Opening

Replace or add after `<body>`:

```liquid
{% render 'shelzys-skip-links' %}
{% render 'shelzys-announcement-unified' %}
{% render 'shelzys-nav-header' %}
```

**Note:** If your theme already has an announcement bar and header, you may want to:
- Comment out or remove the existing announcement bar code
- Keep the existing header but use our nav as a reference for menu structure

### 3. Homepage Template (index.liquid or sections)

Add these sections in order:

```liquid
{% render 'shelzys-hero-v2' %}
{% render 'shelzys-bestsellers-premium' %}
{% render 'shelzys-occasion-grid' %}
{% render 'shelzys-reviews-carousel' %}
{% render 'shelzys-sublimation-explainer' %}
{% render 'shelzys-trust-strip' %}
```

### 4. Collection Template

In `collection.liquid` or your collection sections, add at the top:

```liquid
{% render 'shelzys-collection-hero', collection: collection %}
```

This replaces or enhances the default collection header with:
- Dynamic banner image
- Collection title & description
- Product count
- Quick filter links (for "All" collection)

### 5. Product Template

In your product template, add:

**In the product info area:**
```liquid
{% render 'shelzys-product-extras', product: product %}
{% render 'shelzys-product-schema', product: product %}
{% render 'shelzys-personalization', product: product %}
{% render 'shelzys-sticky-atc', product: product %}
```

This includes:
- "Perfect for" contextual badge
- Key benefits (sublimation, double-walled, etc.)
- Shipping & turnaround info
- Cross-sell "Complete the Set" section

### 6. Cart Template

```liquid
{% render 'shelzys-cart-upsell' %}
{% render 'shelzys-trust-badges' %}
```

### 7. Footer & Before Body Close

Before `</body>` in theme.liquid:

```liquid
{% render 'shelzys-footer-v2' %}
{% render 'shelzys-popup-premium' %}
{% render 'shelzys-back-to-top' %}
```

---

## Component Details

### Announcement Bar (`shelzys-announcement-unified`)

**Desktop:** Shows all 3 messages side-by-side
**Mobile:** Rotates through messages every 4 seconds

Messages:
1. Free Shipping on Orders $75+
2. 3-5 Day Turnaround
3. Permanent Sublimation Printing

### Navigation (`shelzys-nav-header`)

Structure:
- **Shop All** → /collections/all
- **Weddings** (dropdown)
  - All Wedding Bottles
  - Bridesmaid Bottles
  - Bridal Party Sets
  - Bachelorette Party
  - etc.
- **Kids & Sports** (dropdown)
- **Corporate** → /pages/bulk-orders
- **Holiday** → /collections/holiday
- **FAQ** → /pages/faq

Mobile: Full-screen overlay with accordion menus.

### Hero (`shelzys-hero-v2`)

- Uses `collections['best-sellers']` image as background
- Two CTAs: "Shop Custom Bottles" + "Shop by Occasion"
- Mini trust badges at bottom

### Shop by Occasion (`shelzys-occasion-grid`)

6 cards:
1. Weddings & Bridesmaids → /collections/wedding
2. Bachelorette Parties → /collections/bachelorette
3. Kids & Sports → /collections/kids
4. Corporate Gifts → /pages/bulk-orders
5. Everyday Bottles → /collections/all
6. Holiday Bottles → /collections/holiday

### Reviews Carousel (`shelzys-reviews-carousel`)

- Shows 4.9★ rating badge
- 6 sample reviews in rotating carousel
- Auto-advances every 6 seconds

### Trust Strip (`shelzys-trust-strip`)

4 trust badges:
1. Free Shipping ($75+)
2. 3-5 Day Turnaround
3. Secure Checkout
4. Handcrafted in USA

---

## Collections Required

Ensure these collections exist in Shopify:

| Handle | Title |
|--------|-------|
| `wedding` | Wedding & Bridal |
| `bachelorette` | Bachelorette |
| `kids` | Kids |
| `holiday` | Holiday |
| `best-sellers` | Best Sellers |
| `all` | All Products |

If a collection doesn't exist, the components will use fallback gradients.

---

## Pages Required

These pages should exist:

- `/pages/faq` - FAQ
- `/pages/bulk-orders` - Corporate/Bulk Orders
- `/pages/about` - About Us
- `/pages/contact` - Contact
- `/pages/shipping` - Shipping Info

---

## Customization

### Changing Colors

Edit `shelzys-master-styles.liquid` CSS variables:

```css
:root {
  --sz-sage: #8BAA88;        /* Primary green */
  --sz-sage-dark: #4E5F4A;   /* Darker green */
  --sz-evergreen: #2C3E2D;   /* Darkest green */
  --sz-champagne: #B5A48A;   /* Gold accent */
  /* ... */
}
```

### Changing Reviews

Edit `shelzys-reviews-carousel.liquid` to update sample reviews or integrate with Judge.me/Yotpo.

### Changing Menu Items

Edit `shelzys-nav-header.liquid` to add/remove/reorder navigation links.

---

## Troubleshooting

**Snippets not showing:**
- Ensure `{% render 'snippet-name' %}` is correctly placed
- Check browser console for JavaScript errors

**Styling conflicts:**
- The `shelzys-master-styles` uses scoped class prefixes (`sz-`) to avoid conflicts
- If theme CSS overrides our styles, add `!important` selectively

**Mobile menu not working:**
- Ensure JavaScript at bottom of `shelzys-nav-header.liquid` is loading

---

## Performance Notes

- All images use lazy loading except hero
- CSS is inlined in snippets (no external file requests)
- JavaScript is vanilla (no jQuery dependencies)
- Snippets are modular - only include what you need

---

Generated: 2025-12-03
