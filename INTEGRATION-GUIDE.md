# 🚀 Shelzy's Designs Shopify Integration Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Component Overview](#component-overview)
3. [Installation Instructions](#installation-instructions)
4. [Integration Patterns](#integration-patterns)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Shopify store (any plan)
- Access to theme editor
- Basic understanding of Shopify Liquid

### Installation Time
⏱️ **1.5-2 hours** for complete implementation

### What You'll Get
- ✨ 11 professional Liquid components
- 📱 Fully responsive design
- 🎨 Customizable styling
- 🚀 Performance optimized
- ♿ Accessibility compliant

---

## Component Overview

### 1️⃣ Custom Personalization Form
**File:** `custom-personalization-form.liquid`

**Purpose:** Live preview for bottle customization (name, font, color)

**Location:** Product page, INSIDE product form

**Features:**
- Real-time preview updates
- 6 color options (Black, White, Gold, Rose Gold, Pink, Blue)
- 5 font styles
- Saves to cart as product properties

**Integration:**
```liquid
{% form 'product', product %}
  {%- render 'custom-personalization-form' -%}
  <!-- Your add to cart button here -->
{% endform %}
```

⚠️ **CRITICAL:** Must be placed INSIDE the product form, BEFORE the Add to Cart button.

---

### 2️⃣ Email Capture Popup
**File:** `email-capture-popup.liquid`

**Purpose:** Modal popup for email collection with 10% discount incentive

**Location:** theme.liquid, before `</body>`

**Features:**
- Shows after 15 seconds
- Cookie-based (once per 7 days)
- 10% discount incentive
- Success message animation

**Integration:**
```liquid
{%- render 'email-capture-popup' -%}
```

**Customization:**
- Delay: Line 247 (`setTimeout(function() { popup.classList.add('active'); }, 15000);`)
- Cookie duration: Line 224 (`const cookieDays = 7;`)
- Cookie name: Line 223 (`const cookieName = 'shelzys_email_popup_shown';`)

---

### 3️⃣ Bulk Pricing Comparison
**File:** `bulk-pricing-comparison.liquid`

**Purpose:** Pricing table showing bulk discounts (21-24% savings)

**Location:** Homepage or product page

**Features:**
- 3 pricing tiers (1, 5, 10 bottles)
- Animated hover effects
- Responsive grid layout

**Integration:**
```liquid
{%- render 'bulk-pricing-comparison' -%}
```

**Customization:**
- Prices: Lines 176, 203, 230 (update price values)
- Quantities: Lines 168, 195, 222 (update quantity numbers)
- Savings: Lines 178, 205, 232 (update discount percentages)

---

### 4️⃣ Upsell Cross-Sell
**File:** `upsell-cross-sell.liquid`

**Purpose:** Dynamic product bundles with real-time pricing

**Location:** Product page, after product form

**Features:**
- Checkbox selection
- 5% discount for 2+ items
- Real-time price calculation
- Dynamic total updates

**Integration:**
```liquid
{% endform %} <!-- End of product form -->
{%- render 'upsell-cross-sell' -%}
```

**Customization:**
- Products: Lines 193-284 (update product info)
- Discount percentage: Line 414 (`discount = subtotal * 0.05;`)
- Minimum items for discount: Line 413 (`if (selectedCount >= 2)`)

---

### 5️⃣ Rush Order Upgrade
**File:** `rush-order-upgrade.liquid`

**Purpose:** Premium shipping options and wedding date calculator

**Location:** Product page, after product form

**Features:**
- Live countdown to 5 PM cutoff
- 3 shipping options (Standard, Rush +$15, Express +$35)
- Wedding date calculator
- Auto-recommendation based on date

**Integration:**
```liquid
{%- render 'rush-order-upgrade' -%}
```

**Customization:**
- Cutoff time: Line 325 (`cutoff.setHours(17, 0, 0, 0);`) - Currently 5 PM
- Shipping prices: Lines 77, 96 (data-price attributes)
- Delivery times: Lines 80, 99, 118

---

### 6️⃣ Enhanced Hero Section
**File:** `enhanced-hero-section.liquid`

**Purpose:** Homepage hero with animated gradients and social proof

**Location:** Homepage, top of main content

**Features:**
- Animated gradient background
- Floating elements
- Trust badges
- Responsive statistics

**Integration:**
```liquid
{%- render 'enhanced-hero-section' -%}
```

**Customization:**
- Stats: Lines 240-254 (update numbers)
- CTA buttons: Lines 257-262 (update URLs)
- Colors: Lines 11-18 (gradient colors)

---

### 7️⃣ Urgency Indicators
**File:** `urgency-indicators.liquid`

**Purpose:** Scarcity signals (low stock, viewer count, recent orders)

**Location:** Product page, near Add to Cart

**Features:**
- Low stock warning
- Current viewer count
- Recent order notifications
- Optional flash sale timer

**Integration:**
```liquid
{%- render 'urgency-indicators' -%}
```

**Customization:**
- Stock levels: Line 178 (`const stockLevel = getRandomInt(2, 8);`)
- Viewer range: Line 188 (`const viewers = getRandomInt(5, 25);`)
- Order range: Line 194 (`const orders = getRandomInt(1, 8);`)

---

### 8️⃣ Trust Badges
**File:** `trust-badges.liquid`

**Purpose:** Animated statistics and credibility indicators

**Location:** Homepage or about page

**Features:**
- Counter animations
- Trust badge cards
- Star ratings
- Responsive grid

**Integration:**
```liquid
{%- render 'trust-badges' -%}
```

**Customization:**
- Statistics: Lines 167-186 (data-target attributes)
- Counter duration: Line 413 (`const duration = 2000;`)
- Badge content: Lines 195-246

---

### 9️⃣ Conversion-Focused FAQ
**File:** `conversion-focused-faq.liquid`

**Purpose:** Accordion-style FAQ with search and filtering

**Location:** Product page, FAQ page, or homepage

**Features:**
- Accordion functionality
- Live search
- Category filtering
- Schema.org markup for SEO

**Integration:**
```liquid
{%- render 'conversion-focused-faq' -%}
```

**Customization:**
- Questions: Lines 215-399 (add/edit FAQ items)
- Categories: Lines 199-203 (add/edit category buttons)
- CTA button: Line 409 (update contact URL)

---

### 🔟 Enhanced Product Card
**File:** `enhanced-product-card.liquid`

**Purpose:** Modern product cards with hover effects and badges

**Location:** Collection pages, featured products

**Features:**
- Secondary image on hover
- Quick view button
- Wishlist toggle
- Color swatches
- Animated pricing

**Integration:**
```liquid
{%- render 'enhanced-product-card' -%}
```

**Note:** This is a demo template. In production, you'll loop through actual products:
```liquid
{% for product in collection.products %}
  {%- render 'enhanced-product-card', product: product -%}
{% endfor %}
```

---

### 1️⃣1️⃣ Instagram Feed
**File:** `instagram-feed.liquid`

**Purpose:** Social proof gallery

**Location:** Homepage, footer, or dedicated section

**Features:**
- Responsive grid
- Hover effects with stats
- Direct links to Instagram
- Clickable posts

**Integration:**
```liquid
{%- render 'instagram-feed' -%}
```

**Customization:**
- Instagram handle: Lines 122, 367 (update @shelzysdesigns)
- Images: Lines 137-272 (update image sources with real Instagram photos)
- Stats: Lines 144-145, 168-169, etc. (update likes/comments)

---

## Installation Instructions

### For JSON-Based Themes (Dawn, Sense, etc.)

1. **Upload Snippets:**
   - Go to: Online Store → Themes → Customize → Edit code
   - Navigate to: Snippets folder
   - Click: Add a new snippet
   - Copy-paste content from each `.liquid` file
   - Save each snippet

2. **Add to Templates:**
   - Navigate to: Templates folder
   - Open the appropriate template (e.g., `product.json`, `index.json`)
   - Add a new section: Custom Liquid
   - Insert render statement: `{% render 'snippet-name' %}`
   - Save

3. **Configure in Theme Editor:**
   - Go back to: Customize theme
   - You'll see your new sections/components
   - Adjust settings as needed

### For Traditional Themes

1. **Upload Snippets:** Same as above

2. **Edit Template Files:**
   - Navigate to: Templates folder
   - Open template file (e.g., `product.liquid`, `index.liquid`)
   - Insert render statements in appropriate locations
   - Save

### Critical Placement Rules

| Component | Placement | Example |
|-----------|-----------|---------|
| Personalization Form | INSIDE product form | `{% form 'product' %}...{% render 'custom-personalization-form' %}...{% endform %}` |
| Email Popup | In theme.liquid, before `</body>` | `{% render 'email-capture-popup' %}` |
| Product Components | AFTER product form | `{% endform %}{% render 'component' %}` |
| Homepage Components | Main content area | `{% render 'component' %}` |

---

## Integration Patterns

### Product Page Setup

```liquid
<!-- Product Images -->
{{ product.featured_image }}

<!-- Product Info -->
<h1>{{ product.title }}</h1>
<div class="product-price">{{ product.price | money }}</div>

<!-- Product Form with Personalization -->
{% form 'product', product %}
  {%- render 'custom-personalization-form' -%}
  
  <button type="submit">Add to Cart</button>
{% endform %}

<!-- After Form: Upsells, Rush, Urgency -->
{%- render 'urgency-indicators' -%}
{%- render 'rush-order-upgrade' -%}
{%- render 'upsell-cross-sell' -%}

<!-- FAQ Section -->
{%- render 'conversion-focused-faq' -%}
```

### Homepage Setup

```liquid
<!-- Hero Section -->
{%- render 'enhanced-hero-section' -%}

<!-- Bulk Pricing -->
{%- render 'bulk-pricing-comparison' -%}

<!-- Trust Badges -->
{%- render 'trust-badges' -%}

<!-- Instagram Feed -->
{%- render 'instagram-feed' -%}

<!-- Email Popup (in theme.liquid) -->
{%- render 'email-capture-popup' -%}
```

---

## Troubleshooting

### Issue: Personalization doesn't save to cart

**Cause:** Form inputs are outside the product form

**Solution:**
1. Verify `custom-personalization-form.liquid` is INSIDE `{% form 'product' %}`
2. Check input names have format: `name="properties[Field Name]"`
3. Test by adding to cart and checking cart properties

### Issue: Preview doesn't update

**Cause:** JavaScript loading before HTML elements

**Solution:**
- All scripts use `DOMContentLoaded` event
- Ensure snippets are rendering completely
- Check browser console for errors

### Issue: Email popup shows every page load

**Cause:** Cookies not working

**Solution:**
1. Test in incognito mode first
2. Check cookie name is unique: `shelzys_email_popup_shown`
3. Verify domain allows cookies
4. Check if third-party cookie blockers are active

### Issue: Mobile layout breaks

**Cause:** Missing or conflicting responsive CSS

**Solution:**
1. All components include mobile breakpoints
2. Test on real devices (375px - 428px)
3. Check for theme CSS conflicts
4. Add `!important` if needed for overrides

### Issue: Components don't appear

**Cause:** Render statement incorrect or missing

**Solution:**
1. Verify snippet name matches file name exactly
2. Check for typos in render statement
3. Ensure file is in snippets folder
4. Clear theme cache and refresh

### Issue: Animations not working

**Cause:** CSS animations disabled or conflicts

**Solution:**
1. Check user's prefers-reduced-motion setting
2. Verify no conflicting CSS
3. Test in different browsers
4. Check console for JavaScript errors

---

## Performance Notes

- All components use vanilla JavaScript (no jQuery dependency)
- CSS animations use GPU-accelerated properties
- Images should be lazy-loaded
- Total package size: ~200KB (pre-compression)
- No external dependencies required

---

## Browser Support

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Accessibility

All components include:
- Keyboard navigation support
- ARIA labels where needed
- Focus states
- Screen reader compatibility
- Semantic HTML5

---

## Need Help?

If you encounter issues not covered in this guide:
1. Check component-specific comments in the code
2. Review browser console for error messages
3. Test in theme preview mode first
4. Contact Shopify support for theme-specific questions

---

**Version:** 1.0.0
**Last Updated:** 2024
**License:** Proprietary - Shelzy's Designs
