# 🎯 Quick Reference Guide

## One-Page Cheat Sheet for Shelzy's Designs Components

---

## 📦 Installation Commands

### Upload All Snippets at Once
1. Go to: `Shopify Admin → Online Store → Themes → Edit Code`
2. Click: `Snippets` folder
3. For each `.liquid` file:
   - Click `Add a new snippet`
   - Name it (without `.liquid` extension)
   - Copy-paste content
   - Save

---

## 🔗 Render Statements

### Product Page
```liquid
{% comment %} INSIDE product form {% endcomment %}
{% form 'product', product %}
  {%- render 'custom-personalization-form' -%}
  <button type="submit">Add to Cart</button>
{% endform %}

{% comment %} AFTER product form {% endcomment %}
{%- render 'urgency-indicators' -%}
{%- render 'rush-order-upgrade' -%}
{%- render 'upsell-cross-sell' -%}
{%- render 'conversion-focused-faq' -%}
```

### Homepage (index.liquid or index.json)
```liquid
{%- render 'enhanced-hero-section' -%}
{%- render 'bulk-pricing-comparison' -%}
{%- render 'trust-badges' -%}
{%- render 'instagram-feed' -%}
```

### Collection Page
```liquid
{% for product in collection.products %}
  {%- render 'enhanced-product-card', product: product -%}
{% endfor %}
```

### Theme Layout (theme.liquid)
```liquid
<!-- Before </body> tag -->
{%- render 'email-capture-popup' -%}
</body>
```

---

## ⚙️ Common Customizations

### Email Popup Delay
**File:** `email-capture-popup.liquid`  
**Line:** ~247
```javascript
setTimeout(function() {
  popup.classList.add('active');
}, 15000); // Change 15000 to desired milliseconds
```

### Email Popup Cookie Duration
**File:** `email-capture-popup.liquid`  
**Line:** ~224
```javascript
const cookieDays = 7; // Change to desired days
```

### Bulk Pricing Values
**File:** `bulk-pricing-comparison.liquid`  
**Lines:** 176, 203, 230
```liquid
<div class="pricing-price">$24.99</div> <!-- Update price -->
<div class="pricing-quantity">5</div>    <!-- Update quantity -->
```

### Rush Shipping Prices
**File:** `rush-order-upgrade.liquid`  
**Lines:** 77, 96
```liquid
<div class="rush-option" data-price="15">  <!-- Change 15 to new price -->
<div class="rush-option" data-price="35">  <!-- Change 35 to new price -->
```

### Rush Order Cutoff Time
**File:** `rush-order-upgrade.liquid`  
**Line:** ~325
```javascript
cutoff.setHours(17, 0, 0, 0); // 17 = 5 PM (24-hour format)
```

### Instagram Handle
**File:** `instagram-feed.liquid`  
**Lines:** 122, 367
```liquid
<a href="https://instagram.com/shelzysdesigns">  <!-- Update handle -->
@shelzysdesigns  <!-- Update display name -->
```

### Trust Badge Statistics
**File:** `trust-badges.liquid`  
**Lines:** 167-186
```liquid
<div class="trust-stat-number" data-target="10000">  <!-- Change target value -->
```

### Urgency Indicator Ranges
**File:** `urgency-indicators.liquid`  
**Lines:** 178, 188, 194
```javascript
const stockLevel = getRandomInt(2, 8);    // Min: 2, Max: 8
const viewers = getRandomInt(5, 25);       // Min: 5, Max: 25
const orders = getRandomInt(1, 8);         // Min: 1, Max: 8
```

---

## 🎨 Color Schemes

### Primary Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Secondary Gradient (Pink)
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Accent Gradient (Blue)
```css
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

### Success Green
```css
color: #4caf50;
```

### Warning/Urgency Red
```css
color: #ff6b6b;
```

### Gold (Bestseller)
```css
background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First (base styles) */
.component { /* 320px+ */ }

/* Tablet */
@media (max-width: 768px) { /* 768px and below */ }

/* Desktop */
@media (max-width: 1024px) { /* 1024px and below */ }

/* Large Desktop */
@media (min-width: 1025px) { /* 1025px+ */ }
```

---

## 🔍 Testing Checklist (Quick)

### Before Launch
- [ ] Test personalization form saves to cart
- [ ] Verify email popup appears after 15s
- [ ] Check all prices are correct
- [ ] Test on mobile (iPhone, Android)
- [ ] Verify no JavaScript errors (F12 console)
- [ ] Test checkout with custom properties
- [ ] Check all links work

### After Launch
- [ ] Monitor email signups
- [ ] Check conversion rates
- [ ] Review cart abandonment
- [ ] Monitor page speed
- [ ] Check for errors in browser console

---

## 🐛 Common Issues & Fixes

### Issue: Personalization doesn't save
**Fix:** Ensure `custom-personalization-form` is INSIDE `{% form 'product' %}`

### Issue: Email popup shows every time
**Fix:** Check cookies are enabled, test in incognito mode first

### Issue: Mobile layout broken
**Fix:** Check for theme CSS conflicts, add media queries

### Issue: Preview doesn't update
**Fix:** Check JavaScript console for errors, verify DOMContentLoaded wrapper

### Issue: Components don't appear
**Fix:** Verify render statement syntax: `{%- render 'component-name' -%}`

---

## 🔗 Important Links

- **Shopify Liquid Docs:** https://shopify.dev/docs/themes/liquid/reference
- **Theme Kit:** https://shopify.dev/docs/themes/tools/theme-kit
- **Ajax Cart API:** https://shopify.dev/docs/api/ajax
- **Theme Architecture:** https://shopify.dev/docs/themes/architecture

---

## 📋 File Locations in Shopify

```
Online Store → Themes → Edit Code

├── Layout
│   └── theme.liquid (Add email popup here)
│
├── Templates
│   ├── product.liquid (Add product components)
│   ├── index.liquid (Add homepage components)
│   └── collection.liquid (Add product cards)
│
├── Snippets (Upload all .liquid files here)
│   ├── custom-personalization-form.liquid
│   ├── email-capture-popup.liquid
│   └── [all other components]
│
└── Assets
    └── [CSS/JS files if needed]
```

---

## 🎯 Priority Order for Implementation

### Phase 1: Core Conversion (Day 1)
1. Custom Personalization Form
2. Email Capture Popup
3. Urgency Indicators

### Phase 2: Revenue Optimization (Day 2)
4. Bulk Pricing Comparison
5. Rush Order Upgrade
6. Upsell Cross-Sell

### Phase 3: Trust Building (Day 3)
7. Trust Badges
8. Enhanced Hero Section
9. Conversion-Focused FAQ

### Phase 4: Polish (Day 4)
10. Instagram Feed
11. Enhanced Product Card

---

## 💡 Pro Tips

### Performance
- Lazy load images: `loading="lazy"`
- Minify CSS/JS in production
- Use Shopify's image optimization
- Enable Shopify CDN

### SEO
- FAQ component includes schema markup
- Use semantic HTML5 elements
- Add alt text to all images
- Optimize meta descriptions

### Conversion
- Test email popup timing (try 10s, 15s, 30s)
- A/B test bulk pricing visibility
- Monitor rush shipping uptake
- Track upsell conversion rates

### Mobile
- Test on real devices, not just browser resize
- Check touch target sizes (min 44x44px)
- Verify no horizontal scroll
- Test in both portrait and landscape

---

## 🔧 JavaScript Debugging

### Check for Errors
```javascript
// Open browser console (F12)
// Look for red error messages
// Common issues:
// - Element not found (check IDs)
// - Syntax errors (check commas, brackets)
// - Undefined variables (check scope)
```

### Test Event Listeners
```javascript
// In browser console:
console.log('Testing component...');
document.getElementById('your-element-id');
// Should not be null
```

---

## 📊 Analytics Events to Track

### Google Analytics
```javascript
// Email signup
gtag('event', 'email_signup', { method: 'popup' });

// Bulk pricing click
gtag('event', 'bulk_pricing_click', { tier: '5-pack' });

// Rush shipping select
gtag('event', 'rush_shipping_select', { type: 'express' });

// Upsell add
gtag('event', 'upsell_add', { product_id: 'bundle' });
```

---

## 🎨 CSS Variables

If your theme supports CSS variables:

```css
:root {
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-accent: #f093fb;
  --color-success: #4caf50;
  --color-warning: #ff6b6b;
  --font-primary: 'Helvetica Neue', sans-serif;
}
```

Then use in components:
```css
color: var(--color-primary);
font-family: var(--font-primary);
```

---

## 🚀 Deployment Checklist

- [ ] Test in theme preview mode
- [ ] Update all placeholder content
- [ ] Configure email integration
- [ ] Set correct pricing
- [ ] Update Instagram handle
- [ ] Test checkout flow
- [ ] Verify mobile experience
- [ ] Check page speed (Lighthouse)
- [ ] Set up analytics tracking
- [ ] Create theme backup
- [ ] Publish to live theme

---

## 📞 Emergency Contacts

### If Something Breaks
1. **Revert to backup theme** (Shopify → Themes → Actions → Restore)
2. **Check browser console** for errors (F12)
3. **Review recent changes** in theme editor history
4. **Test in incognito mode** to rule out caching issues
5. **Contact Shopify Support** if theme is broken

---

## 🎓 Learning Resources

### Beginner
- Shopify Partner Academy
- Liquid basics tutorial
- Theme Kit installation

### Intermediate
- Ajax Cart implementation
- Custom sections creation
- App integration

### Advanced
- Theme optimization
- Headless Shopify
- Custom Shopify apps

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Support:** See INTEGRATION-GUIDE.md for detailed help

---

*Print this page and keep it handy during implementation! 📄*
