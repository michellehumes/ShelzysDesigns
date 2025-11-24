# Shelzy's Designs - Impulse Theme Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the CRO improvements and custom sections created for Shelzy's Designs on the Impulse theme.

**Important:** All edits should be made on a DUPLICATED theme (not the live theme) until fully tested.

---

## Step 1: Duplicate Your Theme

1. Go to **Shopify Admin → Online Store → Themes**
2. Click **Actions → Duplicate** on your live Impulse theme
3. Rename the copy to: `Impulse – Shelzys Redesign (Working Copy)`
4. All edits below go into this working copy

---

## Step 2: Add Custom Sections

Copy each file from the `sections/` folder to your theme:

### Via Shopify Admin:
1. Go to **Online Store → Themes → Actions → Edit code**
2. Under **Sections**, click **Add a new section**
3. Name it (without `.liquid`) and paste the contents

### Files to add:

| File | Purpose |
|------|---------|
| `shelzys-trust-strip.liquid` | Trust badges below hero |
| `shelzys-shop-by-occasion.liquid` | 4-tile occasion navigation |
| `shelzys-customer-photos.liquid` | UGC/social proof gallery |
| `shelzys-product-faq.liquid` | Expandable FAQs for products |
| `shelzys-email-popup.liquid` | Email capture popup |

---

## Step 3: Add Snippets

Copy each file from the `snippets/` folder:

### Via Shopify Admin:
1. Under **Snippets**, click **Add a new snippet**
2. Name it (without `.liquid`) and paste the contents

### Files to add:

| File | Purpose | Where to include |
|------|---------|------------------|
| `shelzys-live-preview.liquid` | Live name preview on product page | In product form |
| `shelzys-upsell-banner.liquid` | Set upgrade upsell | Above Add to Cart |
| `shelzys-cart-upsell.liquid` | Free shipping + add-ons | In cart template/drawer |
| `shelzys-analytics.liquid` | GA4 + Hotjar tracking | In `theme.liquid` before `</head>` |

---

## Step 4: Add CSS File

1. Under **Assets**, click **Add a new asset**
2. Create: `shelzys-mobile-fixes.css`
3. Paste the contents from `assets/shelzys-mobile-fixes.css`
4. In `theme.liquid`, add before `</head>`:

```liquid
{{ 'shelzys-mobile-fixes.css' | asset_url | stylesheet_tag }}
```

---

## Step 5: Create Corporate Landing Page Template

1. Under **Templates**, click **Add a new template**
2. Choose **page** and name it `corporate-bulk-orders`
3. Paste contents from `templates/page.corporate-bulk-orders.liquid`
4. In **Shopify Admin → Pages**, create a page with handle `corporate-bulk-orders`
5. Assign the new template to this page

---

## Step 6: Configure Homepage Sections

Open the Theme Customizer and arrange the homepage:

### Recommended Section Order:
1. **Announcement bar** (existing)
2. **Slideshow/Hero** (existing - update content per below)
3. **Shelzys Trust Strip** (new)
4. **Shelzys Shop by Occasion** (new)
5. **Featured collection** (existing - set to Best Sellers)
6. **Shelzys Customer Photos** (new)
7. **Testimonials** (if available)
8. **Newsletter** (existing)
9. **Footer** (existing)

### Hero Section Content:
- **Heading:** `Personalized Stainless-Steel Water Bottles`
- **Subheading:** `Free name, font & color customization. Made with sublimation ink (no vinyl) for a design that never peels.`
- **Button Text:** `Shop Best Sellers`
- **Button Link:** `/collections/best-sellers`

---

## Step 7: Set Up Collections

Create/update these collections in **Products → Collections**:

| Collection | Handle | Products to Include |
|------------|--------|---------------------|
| Best Sellers | `best-sellers` | Top 8-12 selling products |
| Weddings & Bridal | `weddings` | All wedding/bridal products |
| Corporate | `corporate` | Bulk-friendly products |
| Everyday Bottles | `everyday-bottles` | Single bottles, daily use |
| Gifts | `gifts` | Gift-appropriate products |
| Bridal Sets | `bridal-sets` | Multi-bottle sets |

### Add SEO descriptions from `config/navigation-structure.json`

---

## Step 8: Update Navigation

In **Online Store → Navigation**, update menus per `config/navigation-structure.json`:

### Main Menu:
```
Shop
├── Best Sellers
├── Everyday Bottles
├── Weddings & Bridal Parties
├── Corporate & Bulk
├── Sets & Bundles
└── View All
Weddings
├── Bridesmaid Bottles
├── Bridal Party Sets
├── Bachelorette
└── Groomsmen
Corporate
About
Contact
```

---

## Step 9: Configure Snippets in Theme Code

### Add Live Preview to Product Form

In your product template section, find the product form and add:

```liquid
{% render 'shelzys-live-preview' %}
```

### Add Upsell Banner to Product Page

Above the Add to Cart button:

```liquid
{% render 'shelzys-upsell-banner', product: product %}
```

### Add Cart Upsells

In your cart template or cart drawer:

```liquid
{% render 'shelzys-cart-upsell' %}
```

### Add Analytics Tracking

In `theme.liquid`, before `</head>`:

```liquid
{% render 'shelzys-analytics' %}
```

**Important:** Replace placeholder IDs:
- `GA4_MEASUREMENT_ID` → Your actual GA4 ID (e.g., `G-XXXXXXXXXX`)
- `HOTJAR_ID` → Your Hotjar site ID (e.g., `1234567`)

---

## Step 10: Configure Email Popup

1. Add `shelzys-email-popup` section to your theme
2. In Theme Customizer, configure:
   - Enable popup: ✓
   - Delay: 10 seconds
   - Exit intent: ✓
   - Days hidden: 7

---

## Step 11: Product Page Enhancements

### Add FAQ Section

In Theme Customizer for product template:
1. Add `Shelzys Product FAQ` section below the main product content
2. Configure the default FAQ items or customize

### Ensure Option Order

In product form, verify options appear in this order:
1. Color
2. Font
3. Name/Personalization
4. Quantity

---

## Step 12: Testing Checklist

Before publishing, test these flows on mobile AND desktop:

### Homepage
- [ ] Hero displays correctly with CTA button
- [ ] Trust strip shows 4 items
- [ ] Shop by Occasion shows 4 tiles
- [ ] Featured collection shows products
- [ ] Email popup triggers after delay

### Product Page
- [ ] All variant options are selectable
- [ ] Live preview updates with name input
- [ ] Upsell banner shows (for single bottles)
- [ ] FAQ accordion expands/collapses
- [ ] Add to cart works

### Cart
- [ ] Free shipping progress bar shows
- [ ] Add-on products appear (if collection exists)
- [ ] Gift packaging checkbox works
- [ ] Checkout button works

### Corporate Page
- [ ] Form displays all fields
- [ ] Form submission works
- [ ] Confirmation message appears

### Mobile Specific
- [ ] Buttons are easily tappable (48px+ height)
- [ ] No horizontal scroll
- [ ] Text is readable (16px+ body text)
- [ ] Forms don't zoom on iOS

---

## Step 13: Go Live

Once testing is complete:

1. Preview the working copy theme
2. Test the checkout process
3. In Themes, click **Actions → Publish** on the working copy
4. Monitor analytics for first 24-48 hours

---

## Files Summary

### Sections (6 files)
- `shelzys-trust-strip.liquid`
- `shelzys-shop-by-occasion.liquid`
- `shelzys-customer-photos.liquid`
- `shelzys-product-faq.liquid`
- `shelzys-email-popup.liquid`

### Snippets (4 files)
- `shelzys-live-preview.liquid`
- `shelzys-upsell-banner.liquid`
- `shelzys-cart-upsell.liquid`
- `shelzys-analytics.liquid`

### Templates (1 file)
- `page.corporate-bulk-orders.liquid`

### Assets (1 file)
- `shelzys-mobile-fixes.css`

### Config (1 file)
- `navigation-structure.json` (reference only, not uploaded)

---

## Troubleshooting

### Popup not showing
- Check browser console for JS errors
- Clear localStorage: `localStorage.removeItem('shelzys_popup_closed')`
- Verify section is enabled in customizer

### Live preview not working
- Ensure your product form has inputs with names containing "name", "font", or "color"
- Check browser console for errors

### Analytics not tracking
- Replace placeholder IDs with real GA4/Hotjar IDs
- Use GA4 DebugView to verify events
- Check for ad blockers

### Mobile layout issues
- Verify `shelzys-mobile-fixes.css` is loaded
- Clear theme cache
- Test in incognito mode

---

## Support

For questions about this implementation, refer to:
- Shopify Impulse theme documentation
- Shopify Liquid reference
- GA4 documentation for event tracking

---

*Generated for Shelzy's Designs - Impulse Theme CRO Implementation*
