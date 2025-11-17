# Installation Guide - Shopify Conversion Package

## 📋 Prerequisites

- Shopify store (any plan)
- Admin access to Shopify
- Basic understanding of Shopify themes
- Product(s) created in Shopify

---

## 🚀 Step-by-Step Installation

### Step 1: Access Theme Editor

1. Log in to your Shopify admin
2. Go to **Online Store** → **Themes**
3. On your active theme, click **Actions** → **Edit code**

### Step 2: Upload Assets

Navigate to the **Assets** folder and upload:

1. Click **Add a new asset**
2. Upload `water-bottle-conversion.js`
3. Upload `water-bottle-conversion.css`

**Files to upload:**
- `assets/water-bottle-conversion.js`
- `assets/water-bottle-conversion.css`

### Step 3: Upload Snippets

Navigate to the **Snippets** folder:

1. Click **Add a new snippet**
2. Name it exactly as shown below
3. Copy and paste the content from each file

**Snippets to create:**
- `personalization-preview.liquid`
- `email-popup.liquid`
- `bulk-pricing.liquid`
- `product-upsells.liquid`
- `rush-shipping-option.liquid`
- `faq-section.liquid`
- `product-gallery.liquid`
- `product-reviews.liquid`
- `product-reviews-summary.liquid`
- `trust-badges.liquid`

### Step 4: Upload Section

Navigate to the **Sections** folder:

1. Click **Add a new section**
2. Name it `custom-water-bottle`
3. Copy and paste the content from `sections/custom-water-bottle.liquid`

### Step 5: Update Theme Layout

Navigate to the **Layout** folder:

1. Open `theme.liquid`
2. Add these lines in the `<head>` section:

```liquid
<script src="{{ 'water-bottle-conversion.js' | asset_url }}" defer="defer"></script>
<link rel="stylesheet" href="{{ 'water-bottle-conversion.css' | asset_url }}" media="all">
```

3. Add this line before the closing `</body>` tag:

```liquid
{% render 'email-popup' %}
```

### Step 6: Create Product Template (Optional)

If you want a dedicated template for water bottles:

Navigate to the **Templates** folder:

1. Click **Add a new template**
2. Select **product** as the type
3. Name it `product.water-bottle`
4. Copy and paste the content from `templates/product.liquid`

### Step 7: Assign Template to Products

1. Go to **Products** in Shopify admin
2. Select your water bottle product(s)
3. Scroll to **Theme templates**
4. Select `product.water-bottle` from the dropdown
5. Save the product

---

## ⚙️ Configuration

### Email Popup Settings

To change popup behavior, edit `assets/water-bottle-conversion.js`:

```javascript
// Line ~15-17
this.delay = 5000; // Show after 5 seconds (5000ms)
this.exitIntentEnabled = true; // Enable/disable exit intent
```

### Bulk Pricing Tiers

To modify discount tiers, edit `assets/water-bottle-conversion.js`:

```javascript
// Line ~230-236
getDiscount(qty) {
  if (qty >= 10) return 20;  // 20% off for 10+ bottles
  if (qty >= 5) return 15;   // 15% off for 5+ bottles
  if (qty >= 3) return 10;   // 10% off for 3+ bottles
  return 0;
}
```

### Customizing Colors

Edit `assets/water-bottle-conversion.css`:

```css
/* Line ~20-29 */
:root {
  --primary-color: #0066cc;      /* Your brand color */
  --primary-hover: #0052a3;      /* Hover state */
  --success-color: #00aa00;      /* Success messages */
  --danger-color: #cc0000;       /* Error messages */
  /* ... more variables */
}
```

---

## ✅ Testing Checklist

After installation, test the following:

### Email Popup
- [ ] Popup appears after 5 seconds
- [ ] Popup closes when X is clicked
- [ ] Popup closes when overlay is clicked
- [ ] Email form submits successfully
- [ ] Popup doesn't reappear after submission

### Personalization
- [ ] Text input updates preview in real-time
- [ ] Character counter works (max 15)
- [ ] Font selector changes preview font
- [ ] Color selector changes preview color
- [ ] Icon selector adds icon to preview

### Bulk Pricing
- [ ] Tier highlights when quantity changes
- [ ] Price updates with quantity
- [ ] Savings message appears for 3+ bottles
- [ ] Discount calculates correctly

### Upsells
- [ ] Checkboxes can be selected
- [ ] Total updates when items are added
- [ ] Form properties are sent with order

### Rush Shipping
- [ ] Radio buttons select properly
- [ ] Countdown timer displays
- [ ] Shipping option is saved with order

### FAQ
- [ ] Accordion opens on click
- [ ] Only one FAQ open at a time
- [ ] Smooth animation

### Mobile Testing
- [ ] All components work on mobile (< 768px)
- [ ] Email popup is responsive
- [ ] Touch targets are large enough
- [ ] Forms are easy to use on mobile

---

## 🔍 Troubleshooting

### Email Popup Not Showing

**Solution:**
1. Clear browser cache and cookies
2. Clear localStorage: Open DevTools → Console → Type: `localStorage.clear()`
3. Refresh the page
4. Check that `{% render 'email-popup' %}` is in theme.liquid

### Properties Not Saving to Order

**Solution:**
1. Verify all property inputs are inside `{% form 'product' %}` tags
2. Check that snippet renders are between form open and close
3. Test by placing a real order and checking order details in admin

### Personalization Preview Not Updating

**Solution:**
1. Check browser console for JavaScript errors
2. Verify all element IDs match between HTML and JavaScript
3. Ensure `water-bottle-conversion.js` is loaded (check Network tab)

### Styling Issues

**Solution:**
1. Verify `water-bottle-conversion.css` is loaded
2. Check for CSS conflicts with theme styles
3. Use browser DevTools to inspect elements
4. Add `!important` to critical styles if needed

### Mobile Layout Problems

**Solution:**
1. Verify viewport meta tag: `<meta name="viewport" content="width=device-width,initial-scale=1">`
2. Test on actual devices, not just browser DevTools
3. Check for conflicting theme media queries

---

## 📊 Tracking Setup

### Google Analytics Events

Add these to `assets/water-bottle-conversion.js` for tracking:

```javascript
// After email signup (line ~70)
gtag('event', 'email_signup', {
  'event_category': 'lead_generation',
  'event_label': 'popup_form'
});

// After personalization used (line ~155)
gtag('event', 'personalization_used', {
  'event_category': 'engagement',
  'event_label': 'custom_text'
});

// After add to cart (line ~560)
gtag('event', 'add_to_cart', {
  'event_category': 'ecommerce',
  'value': totalPrice
});
```

### Shopify Analytics

The package automatically tracks:
- Product form submissions
- Cart additions
- Product properties

View in: **Analytics** → **Reports** → **Sales by product variant**

---

## 🎯 Optimization Tips

### Increase Email Capture Rate

1. Test different popup delays (3s, 5s, 10s)
2. Try different discount amounts (10%, 15%, 20%)
3. A/B test popup copy
4. Adjust exit-intent sensitivity

### Boost AOV

1. Highlight bulk discount savings
2. Add more upsell products
3. Test different upsell pricing
4. Show "Most Popular" badges on tiers

### Improve Conversion Rate

1. Add more customer reviews
2. Update FAQ with real questions
3. Add product videos
4. Show real personalization examples

---

## 🔐 Security Notes

- All form submissions use Shopify's native form handling (secure)
- Email validation prevents invalid submissions
- No external API calls (data stays in Shopify)
- localStorage only stores subscription status (no personal data)

---

## 📱 Mobile Optimization

The package is mobile-first, meaning:
- Designed for mobile screens first
- Enhanced for tablets and desktop
- Touch-friendly (44px+ tap targets)
- Fast loading (minimal JavaScript)
- No third-party dependencies

---

## 🆘 Support Resources

### Documentation
- Main README.md - Complete feature documentation
- This INSTALLATION.md - Setup instructions
- demo.html - Live preview of all components

### Testing
- Use Shopify's Preview mode before going live
- Test on multiple devices and browsers
- Place test orders to verify functionality

### Common Issues
- Properties not saving → Check form structure
- Popup not showing → Clear localStorage
- Styles broken → Check CSS file upload
- JavaScript errors → Check browser console

---

## 📈 Success Metrics

Track these metrics to measure success:

**Week 1-2:**
- Email signup rate
- Popup conversion rate
- Initial AOV changes

**Month 1:**
- 300+ emails captured
- 20%+ increase in AOV
- 15%+ increase in conversion rate

**Month 2-3:**
- 600+ total emails
- 30%+ sustained AOV increase
- 20-40% revenue increase

---

## ✨ Next Steps

After installation:

1. **Customize branding** - Update colors, fonts, copy
2. **Add real content** - Replace placeholder reviews, FAQs
3. **Set up email marketing** - Connect captured emails to Klaviyo/Mailchimp
4. **Create product variants** - Add sizes, colors, designs
5. **Test thoroughly** - Place test orders on all devices
6. **Launch** - Enable theme and monitor analytics
7. **Optimize** - A/B test and improve based on data

---

## 📞 Need Help?

If you encounter issues:

1. Review troubleshooting section above
2. Check browser console for errors
3. Verify file uploads and structure
4. Test in Shopify preview mode
5. Document the issue with screenshots

---

**Installation Time:** 30-45 minutes  
**Technical Level:** Intermediate  
**Shopify Plan:** Any (Basic, Shopify, Advanced, Plus)

Good luck with your conversion optimization! 🚀
