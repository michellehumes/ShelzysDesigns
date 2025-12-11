# Launch Day Checklist for Shelzy's Designs

## Overview
This comprehensive checklist ensures a smooth launch of all site improvements. Use this before, during, and after deploying changes.

---

## Pre-Launch Checklist (Day Before)

### Theme Backup
- [ ] Download full theme backup from Shopify Admin
- [ ] Save backup with date: `shelzys-backup-YYYY-MM-DD.zip`
- [ ] Verify backup includes all assets, snippets, templates

### Staging/Preview
- [ ] Create duplicate theme for testing
- [ ] Apply all changes to duplicate first
- [ ] Test on desktop (Chrome, Safari, Firefox)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Share preview link with stakeholder for approval

### Content Verification
- [ ] All product images uploaded and optimized
- [ ] Product descriptions finalized
- [ ] Collection descriptions updated
- [ ] About page content accurate
- [ ] FAQ answers complete
- [ ] Contact information correct

### Technical Setup
- [ ] SSL certificate active (https://)
- [ ] Custom domain connected and verified
- [ ] Email forwarding configured
- [ ] DNS records properly set

---

## Launch Day Checklist

### 1. Foundation Deploy (Morning - 9:00 AM)

#### CSS & Settings
- [ ] Upload `shelzys-settings.liquid` to /snippets/
- [ ] Upload `shelzys-css-variables.liquid` to /snippets/
- [ ] Upload `shelzys-fonts.liquid` to /snippets/
- [ ] Add to theme.liquid `<head>`:
  ```liquid
  {% render 'shelzys-fonts' %}
  {% render 'shelzys-css-variables' %}
  {% render 'shelzys-settings' %}
  ```
- [ ] Verify fonts loading correctly
- [ ] Check colors match brand guidelines

#### Verification
- [ ] Homepage loads without errors
- [ ] No broken styling
- [ ] Console shows no JavaScript errors

---

### 2. Navigation & Layout Deploy (Morning - 10:00 AM)

- [ ] Upload `shelzys-nav-header.liquid`
- [ ] Upload `shelzys-footer-v2.liquid`
- [ ] Upload `shelzys-announcement-unified.liquid`
- [ ] Upload `shelzys-breadcrumbs.liquid`
- [ ] Upload `shelzys-skip-links.liquid`

#### Integration
- [ ] Update header section to use new nav
- [ ] Update footer section to use new footer
- [ ] Add announcement bar to theme.liquid
- [ ] Add skip-links after `<body>` tag

#### Verification
- [ ] All menu links work
- [ ] Cart icon shows correct count
- [ ] Mobile menu opens/closes
- [ ] Footer links work
- [ ] Social icons link correctly
- [ ] Announcement bar displays

---

### 3. SEO Deploy (Morning - 10:30 AM)

- [ ] Upload `shelzys-head-seo.liquid`
- [ ] Upload `shelzys-product-schema.liquid`
- [ ] Upload `shelzys-faq-schema.liquid`
- [ ] Add head-seo to theme.liquid `<head>`

#### Verification
- [ ] Run Google Rich Results Test on homepage
- [ ] Run Google Rich Results Test on product page
- [ ] Verify meta descriptions show correctly
- [ ] Check Open Graph tags with Facebook Debugger
- [ ] Verify favicon displays

---

### 4. Product Page Deploy (Late Morning - 11:00 AM)

- [ ] Upload `shelzys-personalization-form.liquid`
- [ ] Upload `shelzys-product-badges.liquid`
- [ ] Upload `shelzys-product-extras.liquid`
- [ ] Upload `shelzys-product-faq.liquid`
- [ ] Upload `shelzys-sticky-atc.liquid`
- [ ] Upload `shelzys-urgency.liquid`
- [ ] Upload `shelzys-sublimation-explainer.liquid`
- [ ] Upload `shelzys-trust-badges.liquid`

#### Integration
- [ ] Add personalization form to product template
- [ ] Add badges to product cards
- [ ] Add trust badges below Add to Cart
- [ ] Add FAQ section
- [ ] Add sticky ATC for mobile

#### Verification
- [ ] Personalization form submits correctly
- [ ] Live preview updates properly
- [ ] Badges display on correct products
- [ ] All accordions expand/collapse
- [ ] Sticky ATC appears on scroll (mobile)
- [ ] Add to Cart works with personalization

---

### 5. Cart & Conversion Deploy (Early Afternoon - 1:00 PM)

- [ ] Upload `shelzys-cart-upsell.liquid`
- [ ] Upload `shelzys-free-shipping-bar.liquid`
- [ ] Upload `shelzys-popup-premium.liquid`

#### Integration
- [ ] Add upsell to cart drawer/page
- [ ] Add free shipping bar to cart
- [ ] Add popup before `</body>` in theme.liquid

#### Verification
- [ ] Free shipping bar shows correct threshold ($75)
- [ ] Progress updates when items added
- [ ] Upsells display appropriate recommendations
- [ ] Popup appears after 25 seconds
- [ ] Popup captures email correctly
- [ ] WELCOME10 code displays after signup

---

### 6. Homepage Deploy (Afternoon - 2:00 PM)

- [ ] Upload `shelzys-hero-premium.liquid`
- [ ] Upload `shelzys-bestsellers-premium.liquid`
- [ ] Upload `shelzys-occasion-tiles.liquid`
- [ ] Upload `shelzys-why-choose-us.liquid`
- [ ] Upload `shelzys-testimonials.liquid`
- [ ] Upload `shelzys-social-proof-section.liquid`

#### Integration
- [ ] Configure homepage sections in Shopify customizer
- [ ] Upload hero images
- [ ] Set best seller collection
- [ ] Configure occasion links

#### Verification
- [ ] Hero image loads and looks good
- [ ] CTA buttons work
- [ ] Best sellers products display
- [ ] Occasion tiles link correctly
- [ ] Testimonials slider works
- [ ] Mobile layout looks good

---

### 7. Collection Pages Deploy (Afternoon - 3:00 PM)

- [ ] Upload `shelzys-collection-hero.liquid`
- [ ] Add collection images and descriptions
- [ ] Configure sorting options

#### Verification
- [ ] Collection headers display correctly
- [ ] Product grid displays properly
- [ ] Filters work (if applicable)
- [ ] Pagination works

---

### 8. Final Utilities (Late Afternoon - 4:00 PM)

- [ ] Upload `shelzys-back-to-top.liquid`
- [ ] Upload `shelzys-recently-viewed.liquid`
- [ ] Add analytics codes (GA4, Meta Pixel, Pinterest)

#### Verification
- [ ] Back to top button appears on scroll
- [ ] Recently viewed tracks products
- [ ] Analytics fires (check browser devtools)

---

## Post-Launch Verification

### Functional Testing (30 minutes after go-live)

#### Navigation
- [ ] All main menu links work
- [ ] All footer links work
- [ ] Search functions correctly
- [ ] Mobile menu works

#### Products
- [ ] Can view any product
- [ ] Images load properly
- [ ] Personalization form works
- [ ] Add to cart works
- [ ] Quantity selector works

#### Cart & Checkout
- [ ] Can add products to cart
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Free shipping bar updates
- [ ] Can proceed to checkout
- [ ] Discount codes work (test WELCOME10)

#### Complete Test Order
- [ ] Place test order with Shopify Bogus Gateway
- [ ] Verify order appears in admin
- [ ] Verify customer receives confirmation email
- [ ] Verify personalization details captured

---

### Cross-Browser Testing

| Browser | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Chrome | [ ] | [ ] | |
| Safari | [ ] | [ ] | |
| Firefox | [ ] | [ ] | |
| Edge | [ ] | [ ] | |

---

### Performance Check

- [ ] Run Google PageSpeed Insights
  - Mobile score target: 70+
  - Desktop score target: 85+
- [ ] Run GTmetrix test
- [ ] Verify Largest Contentful Paint < 2.5s
- [ ] Verify Cumulative Layout Shift < 0.1

---

### Analytics Verification

- [ ] GA4 real-time shows visitors
- [ ] Page views tracking
- [ ] Add to cart events firing
- [ ] Purchase event (after test order)
- [ ] Meta Pixel events (use Pixel Helper extension)
- [ ] Pinterest Tag events (use Tag Helper)

---

## Rollback Plan

If critical issues arise:

### Quick Rollback
1. Go to Shopify Admin → Online Store → Themes
2. Find backup theme
3. Click "..." → Publish
4. Theme reverts immediately

### Partial Rollback
1. Identify problematic snippet
2. Edit theme code
3. Comment out or remove render statement:
   ```liquid
   {% comment %}{% render 'problematic-snippet' %}{% endcomment %}
   ```
4. Save and verify fix

### Emergency Contacts
- Shopify Support: support@shopify.com
- Theme issues: Check Shopify Community
- Developer backup: [Add contact info]

---

## Launch Announcements

### Social Media Posts
- [ ] Instagram story announcing updates
- [ ] Instagram feed post
- [ ] Facebook post
- [ ] Pinterest pins for new products

### Email
- [ ] Send announcement to email list
- [ ] Highlight new features
- [ ] Include WELCOME10 code reminder

---

## Week 1 Post-Launch Monitoring

### Daily Checks
- [ ] Check for 404 errors (Google Search Console)
- [ ] Review analytics for unusual drops
- [ ] Monitor customer support inquiries
- [ ] Check email signup conversions

### Day 3 Review
- [ ] Conversion rate vs baseline
- [ ] Average order value
- [ ] Cart abandonment rate
- [ ] Email signup rate

### Day 7 Review
- [ ] Full analytics report
- [ ] Customer feedback summary
- [ ] Bug/issue log review
- [ ] Prioritize Week 2 optimizations

---

## Success Metrics

Track these metrics to measure launch success:

| Metric | Pre-Launch | Launch Day | Week 1 | Target |
|--------|------------|------------|--------|--------|
| Sessions | | | | +20% |
| Conversion Rate | | | | 2.5%+ |
| AOV | | | | $45+ |
| Cart Abandonment | | | | <65% |
| Email Signups | | | | 100+ |
| Page Speed (Mobile) | | | | 70+ |

---

## Notes Section

Use this space to document any issues or observations during launch:

### Issues Encountered
```
Date:
Issue:
Resolution:
```

### Deferred Items
```
Item:
Reason Deferred:
Target Date:
```

### Customer Feedback
```
Feedback:
Source:
Action:
```

---

*Created: December 2025*
*Last Updated: [Update on launch day]*
