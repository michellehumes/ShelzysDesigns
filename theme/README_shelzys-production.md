# Shelzy's Designs - Production Workflow

Internal documentation for order fulfillment and theme maintenance.

---

## Order Flow: Personalization to Shipping

### 1. How Line Item Properties Work

When customers add personalized bottles to cart, their customizations are stored as **line item properties** (not variants). This keeps SKU count manageable.

**Example order line item in Shopify Admin:**
```
Bridesmaid Water Bottle - White × 1
  - Name: "Sarah"
  - Font: "Elegant Script"
  - Text Color: "Rose Gold"
```

These properties appear:
- In the Shopify Admin order details
- On packing slips (if template is configured)
- In order exports (CSV/API)

### 2. Daily Order Review Process

**Morning Routine (9 AM):**
1. Open Shopify Admin → Orders → filter by "Unfulfilled"
2. Review each order for:
   - Spelling accuracy on personalized names
   - Rush order flags (check order notes)
   - Corporate/bulk orders (10+ items)
3. Flag any orders needing customer clarification

**Red Flags to Watch:**
- Names with unusual characters → Confirm with customer
- Blank personalization fields → Check if intentional
- "Gift message" notes → May need separate packaging

### 3. Batching for Production

Group orders by:
1. **Bottle color** (minimize material changes)
2. **Font style** (group Elegant Script together, etc.)
3. **Rush vs standard** (prioritize rush orders)

**Batch Size:** 10-15 bottles per print run is optimal.

### 4. Sublimation Printing Checklist

Before printing each batch:
- [ ] Verify names match order (double-check spelling)
- [ ] Confirm font selection
- [ ] Test print color matches order
- [ ] Check bottle is clean and lint-free

**Print Settings (reference only):**
- Temperature: [Your equipment settings]
- Time: [Your equipment settings]
- Pressure: [Your equipment settings]

### 5. Quality Control (QC)

After printing, check each bottle:
- [ ] Name is spelled correctly
- [ ] Print is centered and aligned
- [ ] No bubbles, wrinkles, or color bleeding
- [ ] Bottle has no dents or scratches

**QC Fail?** Set aside for reprint. Update order notes.

### 6. Packing & Shipping

1. Wrap bottle in tissue paper
2. Add thank-you card (optional: include discount code for next order)
3. Place in shipping box with padding
4. Print shipping label from Shopify
5. Mark order as "Fulfilled" in Shopify

**Shipping Timeline:**
- Standard: 5-7 business days production + transit
- Rush: 48-hour production + expedited transit

---

## Theme Customization Guide

### File Markers

All Shelzy's customizations are marked with comments:
```liquid
<!-- SHELZYS_DESIGNS: START section-name -->
  ... custom code ...
<!-- SHELZYS_DESIGNS: END section-name -->
```

**Safe to edit:** Anything between these markers.
**Do not edit:** Dawn base theme code outside markers.

### Key Theme Files

| File | Purpose |
|------|---------|
| `sections/hero-enhanced.liquid` | Homepage hero with 3 CTAs |
| `sections/main-product-enhanced.liquid` | Product page with live preview |
| `snippets/exit-intent-popup.liquid` | Email capture popup |
| `sections/main-cart-enhanced.liquid` | Cart with upsells & free shipping bar |
| `config/settings_schema.json` | Theme settings definitions |

### Adding New Fonts to Live Preview

Edit `main-product-enhanced.liquid`, find the `fontMap` object:
```javascript
const fontMap = {
  'Elegant Script': "'Great Vibes', cursive",
  'Your New Font': "'Font Family Name', fallback",
  // Add new fonts here
};
```

Also update the font dropdown in the `personalization-fields` section.

### Adding New Text Colors

Find the color `<select>` in `main-product-enhanced.liquid`:
```html
<option value="rose-gold" data-hex="#B76E79">Rose Gold</option>
<!-- Add new colors with data-hex attribute -->
```

---

## Analytics Events Reference

The theme fires these events to `window.dataLayer` (for GTM/GA4):

| Event | When Fired |
|-------|------------|
| `shelzys_page_view` | Every page load |
| `shelzys_view_item` | Product page view |
| `shelzys_add_to_cart` | Item added to cart |
| `shelzys_begin_checkout` | Checkout button clicked |
| `shelzys_cta_click` | Hero/section CTA clicked |
| `shelzys_email_signup` | Email form submitted |
| `shelzys_quote_form_submit` | Corporate/bridal quote submitted |
| `shelzys_upsell_click` | Cart upsell product clicked |
| `shelzys_exit_popup_shown` | Exit popup displayed |
| `shelzys_personalization_updated` | Customer changes personalization field |

**Debug Mode:** Enable in Theme Settings → Analytics → "Enable analytics debug logging" to see events in browser console.

---

## Troubleshooting

### "Personalization not showing on order"
- Check that `properties[]` inputs have correct `name` attributes
- Verify form is submitting to `/cart/add.js` (not direct add)

### "Live preview not updating"
- Check browser console for JavaScript errors
- Ensure font families are loaded in theme.liquid

### "Exit popup showing repeatedly"
- Clear browser localStorage: `localStorage.removeItem('shelzys_exit_popup_shown')`
- Check if user has ad blocker interfering

### "Free shipping bar stuck"
- Verify `free_shipping_threshold` is set in Theme Settings
- Check that cart total is updating via JavaScript

---

## Contact

For theme issues: Review this documentation first, then contact developer.

For order issues: Check Shopify Help Center or contact Shopify Support.

---

*Last updated: November 2025*
