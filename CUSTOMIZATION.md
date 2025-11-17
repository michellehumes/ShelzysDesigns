# Quick Reference Guide

## 🎨 Common Customizations

### Change Primary Brand Color

**File:** `assets/water-bottle-conversion.css`  
**Line:** 21

```css
--primary-color: #0066cc;  /* Change to your brand color */
```

**Affects:**
- Add to cart button
- Links and highlights
- Bulk pricing highlights
- Email popup button

---

### Change Email Popup Delay

**File:** `assets/water-bottle-conversion.js`  
**Line:** 16

```javascript
this.delay = 5000; // Change to milliseconds (3000 = 3 seconds)
```

---

### Change Bulk Discount Tiers

**File:** `assets/water-bottle-conversion.js`  
**Line:** 230-236

```javascript
getDiscount(qty) {
  if (qty >= 10) return 20;  // 10+ bottles = 20% off
  if (qty >= 5) return 15;   // 5+ bottles = 15% off
  if (qty >= 3) return 10;   // 3+ bottles = 10% off
  return 0;
}
```

**Also Update:** `snippets/bulk-pricing.liquid` lines 15-36

---

### Change Character Limit for Personalization

**File:** `snippets/personalization-preview.liquid`  
**Line:** 19

```liquid
maxlength="15"  <!-- Change to desired character limit -->
```

**Also Update:** Line 20 for display
```liquid
<span class="char-count">0/15</span>  <!-- Update number -->
```

---

### Add More Personalization Colors

**File:** `snippets/personalization-preview.liquid`  
**After Line:** 42

```liquid
<input type="radio" id="color-purple" name="properties[Text Color]" value="Purple" data-personalization-color>
<label for="color-purple" class="color-option" style="background-color: #9b59b6;" title="Purple"></label>
```

**Also Update:** `assets/water-bottle-conversion.js` lines 175-183
```javascript
const colorMap = {
  // ... existing colors
  'Purple': '#9b59b6'  // Add new color
};
```

---

### Add More Font Options

**File:** `snippets/personalization-preview.liquid`  
**After Line:** 29

```liquid
<option value="Elegant">Elegant</option>
```

**Also Update:** `assets/water-bottle-conversion.js` lines 167-173
```javascript
const fontMap = {
  // ... existing fonts
  'Elegant': 'Georgia, serif'  // Add new font
};
```

---

### Change Rush Shipping Prices

**File:** `snippets/rush-shipping-option.liquid`

**Line 24:** Standard shipping
```liquid
data-shipping-price="0"  <!-- Free -->
```

**Line 38:** Rush shipping
```liquid
data-shipping-price="9.99"  <!-- Change price -->
<span class="shipping-price">+$9.99</span>  <!-- Update display -->
```

**Line 52:** Express shipping
```liquid
data-shipping-price="14.99"  <!-- Change price -->
<span class="shipping-price">+$14.99</span>  <!-- Update display -->
```

---

### Add/Remove Upsell Products

**File:** `snippets/product-upsells.liquid`

**To Add:** Copy lines 14-36 and modify:

```liquid
<div class="upsell-item">
  <div class="upsell-image">
    <div class="placeholder-image">🎒</div>  <!-- Change emoji -->
  </div>
  <div class="upsell-info">
    <h4 class="upsell-name">Your Product Name</h4>
    <p class="upsell-description">Product description</p>
    <div class="upsell-price">$XX.XX</div>
  </div>
  <div class="upsell-action">
    <label class="upsell-checkbox">
      <input type="checkbox" name="properties[Add Your Product]" value="Yes" data-upsell-price="XX.XX">
      <span class="checkbox-custom"></span>
      <span class="checkbox-label">Add to order</span>
    </label>
  </div>
</div>
```

---

### Add/Edit FAQ Questions

**File:** `snippets/faq-section.liquid`

**To Add:** Copy lines 8-18 and modify:

```liquid
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span>Your question here?</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <p>Your answer here. Can include <strong>HTML</strong>.</p>
  </div>
</div>
```

---

### Change Email Popup Discount

**File:** `snippets/email-popup.liquid`  
**Line 12:**

```liquid
<h2 class="popup-title">Get 15% Off Your First Order!</h2>
<!-- Change 15% to your desired discount -->
```

---

### Change Countdown Timer Cutoff

**File:** `assets/water-bottle-conversion.js`  
**Line:** 528

```javascript
const cutoffHour = 14; // 2 PM = 14 in 24-hour format
```

For 5 PM cutoff:
```javascript
const cutoffHour = 17; // 5 PM = 17
```

---

### Disable Email Popup Exit Intent

**File:** `assets/water-bottle-conversion.js`  
**Line:** 17

```javascript
this.exitIntentEnabled = false; // Set to false to disable
```

---

### Change Button Text

**File:** `sections/custom-water-bottle.liquid`

**Add to Cart Button (Line 101-107):**
```liquid
<span class="btn-text">
  {% if product.selected_or_first_available_variant.available %}
    Add to Cart  <!-- Change this text -->
  {% else %}
    Sold Out  <!-- Change this text -->
  {% endif %}
</span>
```

---

### Modify Mobile Breakpoints

**File:** `assets/water-bottle-conversion.css`

**Tablet (Line 631):**
```css
@media (min-width: 768px) {
  /* Change 768px to your desired breakpoint */
}
```

**Desktop (Line 648):**
```css
@media (min-width: 1024px) {
  /* Change 1024px to your desired breakpoint */
}
```

---

## 🔧 Advanced Customizations

### Integrate with Email Service

**File:** `assets/water-bottle-conversion.js`  
**Line:** 75-85

Replace the `subscribeEmail` function:

```javascript
async subscribeEmail(email) {
  // Klaviyo example
  const response = await fetch('YOUR_KLAVIYO_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      list_id: 'YOUR_LIST_ID'
    })
  });
  return response.json();
}
```

---

### Add Google Analytics Tracking

**File:** `assets/water-bottle-conversion.js`

**After Line 70 (Email signup):**
```javascript
gtag('event', 'email_signup', {
  'event_category': 'lead_generation',
  'event_label': 'popup_form'
});
```

**After Line 155 (Personalization):**
```javascript
gtag('event', 'personalization_used', {
  'event_category': 'engagement',
  'event_label': 'custom_text',
  'value': text.length
});
```

**After Line 275 (Upsell added):**
```javascript
gtag('event', 'upsell_added', {
  'event_category': 'ecommerce',
  'event_label': checkbox.name,
  'value': parseFloat(checkbox.getAttribute('data-upsell-price'))
});
```

---

### Use Real Product Images in Gallery

**File:** `sections/custom-water-bottle.liquid`  
**Lines 7-22:** Already configured to use Shopify product images

Just upload images in Shopify admin → Products → Your Product → Media

---

### Customize Trust Badges

**File:** `snippets/trust-badges.liquid`

Replace the badge items (lines 6-50) with your own:

```liquid
<div class="badge-item">
  <svg width="24" height="24"><!-- Your icon --></svg>
  <div class="badge-text">
    <strong>Your Heading</strong>
    <span>Your subtext</span>
  </div>
</div>
```

---

## 📝 Quick Find - File Locations

| Component | File Location | Purpose |
|-----------|--------------|---------|
| Main Section | `sections/custom-water-bottle.liquid` | Product page structure |
| Personalization | `snippets/personalization-preview.liquid` | Custom text preview |
| Email Popup | `snippets/email-popup.liquid` | Email capture |
| Bulk Pricing | `snippets/bulk-pricing.liquid` | Volume discounts |
| Upsells | `snippets/product-upsells.liquid` | Additional products |
| Rush Shipping | `snippets/rush-shipping-option.liquid` | Shipping options |
| FAQ | `snippets/faq-section.liquid` | Questions & answers |
| Gallery | `snippets/product-gallery.liquid` | Product images |
| Reviews | `snippets/product-reviews.liquid` | Customer reviews |
| Trust Badges | `snippets/trust-badges.liquid` | Security badges |
| JavaScript | `assets/water-bottle-conversion.js` | All functionality |
| CSS | `assets/water-bottle-conversion.css` | All styles |

---

## 🎯 Most Common Changes

1. **Brand Colors** → `assets/water-bottle-conversion.css` line 21
2. **Discount Tiers** → `assets/water-bottle-conversion.js` line 230-236
3. **Email Popup Text** → `snippets/email-popup.liquid` line 12
4. **FAQ Content** → `snippets/faq-section.liquid` lines 8+
5. **Upsell Products** → `snippets/product-upsells.liquid` lines 14+

---

## ⚠️ Important Notes

- Always test changes in preview mode before going live
- Clear browser cache after CSS changes
- Clear localStorage after JavaScript changes
- Keep backup of original files
- Test on mobile after every change

---

## 🔍 Need More Help?

- See full documentation: `README.md`
- Installation guide: `INSTALLATION.md`
- Live demo: `demo.html`
- Test locally before deploying to live store
