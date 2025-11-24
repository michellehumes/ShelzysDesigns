# Shelzy's Designs Website Audit Implementation Guide

**Based on:** Comprehensive Site Audit (November 2025)
**Site:** shelzysdesigns.com (Shopify-based)
**Business:** Custom personalized water bottles for weddings, corporate events, and everyday use

---

## Priority Action Plan Overview

| Week | Focus Area | Status |
|------|-----------|--------|
| Week 1 | Critical Fixes | Pending |
| Week 2 | Trust & Conversion | Pending |
| Week 3 | Technical SEO | Pending |
| Week 4 | Growth Features | Pending |

---

## WEEK 1: CRITICAL FIXES

### 1.1 Fix About Page 404

**Issue:** `/pages/about` returns 404 error - major trust issue for customers

**Solution:**
1. Go to **Shopify Admin > Online Store > Pages**
2. Check if "About" page exists but is unpublished
3. If missing, create new page:
   - Title: "About"
   - Handle: `about`
   - Content: Use HTML from `/shopify/static-pages.html` (About Page section)
4. Click **Show HTML** editor and paste the About page code
5. Set visibility to **Visible**
6. Save and verify at `yourstore.com/pages/about`

**Verification:**
```
curl -I https://shelzysdesigns.com/pages/about
# Should return 200 OK, not 404
```

---

### 1.2 Fix Product Page URLs

**Issue:** Individual product pages returning 404 errors

**Diagnosis Steps:**
1. Go to **Shopify Admin > Products**
2. Click any product
3. Check the URL handle in **Search engine listing preview**
4. Verify handle matches expected URL

**Common Fixes:**
- Product handle contains special characters - edit to remove
- Product is in Draft status - change to Active
- Product is hidden from Online Store sales channel - enable it

**Bulk URL Check:**
```javascript
// Run in browser console on your Shopify admin
// Go to Products > All Products first
document.querySelectorAll('a[href*="/products/"]').forEach(a => console.log(a.href));
```

---

### 1.3 Update Social Media Links

**Issue:** Social links point to generic Shopify URLs, not actual business accounts

**Location:** Theme settings or footer section

**Steps:**
1. Go to **Online Store > Themes > Customize**
2. Click **Theme Settings** (bottom left)
3. Find **Social Media** section
4. Update with actual URLs:

| Platform | Current (Wrong) | Correct Format |
|----------|-----------------|----------------|
| Instagram | `shopify.com/instagram` | `https://instagram.com/shelzysdesigns` |
| Facebook | `shopify.com/facebook` | `https://facebook.com/shelzysdesigns` |
| Pinterest | `shopify.com/pinterest` | `https://pinterest.com/shelzysdesigns` |
| TikTok | N/A | `https://tiktok.com/@shelzysdesigns` |

**If editing footer directly:**
1. Go to **Online Store > Themes > Customize**
2. Navigate to Footer section
3. Edit social links in section settings
4. Save

---

### 1.4 Remove Contact Page Placeholder Text

**Issue:** Contact page shows "Use this text to share information about your brand with your customers"

**Solution:**
1. Go to **Online Store > Pages**
2. Find "Contact" page
3. Click to edit
4. Replace placeholder text with actual content from `/shopify/static-pages.html` (Contact section)
5. Ensure form is functional
6. Save

**Required Contact Information:**
- Email: hello@shelzysdesigns.com
- Response time: Within 1 business day
- Business hours: Monday-Friday, 9 AM - 5 PM EST
- Subject options: General Question, Custom Order, Bulk/Corporate, Order Issue, Other

---

### 1.5 Fix Free Shipping Threshold Inconsistency

**Issue:** Homepage says $50 free shipping, cart says $75

**Steps to Fix:**
1. Go to **Settings > Shipping and Delivery**
2. Check actual free shipping threshold
3. Decide on amount (recommend $50 to match homepage)
4. Update shipping rate conditions
5. Update all mentions across site:
   - Homepage hero/banner
   - Announcement bar
   - Cart page messaging
   - Footer (if mentioned)
   - Product pages

---

## WEEK 2: TRUST & CONVERSION

### 2.1 Add Trust Badges

**Implementation File:** See `/shopify/trust-badges.liquid`

**Placement Locations:**
- Below hero section on homepage
- Product page (near Add to Cart button)
- Cart page (before checkout button)
- Footer

**Recommended Badges:**
- Secure Checkout (SSL)
- Free Shipping Over $50
- Satisfaction Guarantee
- Made in USA (if applicable)
- Payment icons (Visa, MC, Amex, PayPal, Apple Pay)

---

### 2.2 Install Review App

**Recommended Apps (in order of preference):**

1. **Judge.me** (Free - $15/mo)
   - Best free option
   - Photo reviews
   - SEO-friendly
   - Automatic review requests

2. **Loox** ($9.99/mo)
   - Photo-focused reviews
   - Beautiful galleries
   - Referral program

3. **Stamped.io** (Free - $23/mo)
   - Full-featured
   - NPS surveys
   - Photo reviews

**Installation:**
1. Go to **Apps > Shopify App Store**
2. Search for chosen app
3. Install and connect
4. Configure settings:
   - Enable automatic review request emails (7 days post-delivery)
   - Enable photo reviews
   - Add review widget to product pages
   - Add review carousel to homepage

---

### 2.3 Set Up Klaviyo Email Flows

**App:** Klaviyo (Free up to 250 contacts)

**Required Flows:**

#### Welcome Series (3 emails)
| Email | Timing | Subject Line | Content |
|-------|--------|--------------|---------|
| 1 | Immediate | Welcome to Shelzy's! Here's 10% off | Discount code, brand intro, bestsellers |
| 2 | Day 3 | The story behind every bottle | Brand story, why sublimation |
| 3 | Day 7 | See why customers love us | Reviews, social proof, shop CTA |

#### Abandoned Cart (3 emails)
| Email | Timing | Subject Line | Content |
|-------|--------|--------------|---------|
| 1 | 1 hour | Did you forget something? | Cart items, checkout link |
| 2 | 24 hours | Your cart is waiting | Urgency, limited stock |
| 3 | 72 hours | Last chance: 10% off to complete | Discount offer |

#### Post-Purchase (3 emails)
| Email | Timing | Subject Line | Content |
|-------|--------|--------------|---------|
| 1 | Immediate | Thank you for your order! | Order confirmation, what to expect |
| 2 | 7 days | How's your new bottle? Leave a review | Review request |
| 3 | 14 days | You might also love... | Cross-sell recommendations |

**See:** `/shopify/email-templates/` for ready-to-use HTML templates

---

### 2.4 Add FAQ Page

**Status:** Already created in `/shopify/static-pages.html`

**Deployment:**
1. Go to **Online Store > Pages > Add page**
2. Title: "FAQ"
3. Click **Show HTML**
4. Paste FAQ page code from `static-pages.html`
5. Save
6. Add to main navigation:
   - Go to **Online Store > Navigation > Main menu**
   - Add link: FAQ → /pages/faq
   - Save

---

### 2.5 Improve Product Descriptions

**Current Issues:**
- Too focused on specs, not benefits
- Missing emotional copy
- No use-case scenarios

**Template for Better Descriptions:**

```html
<div class="product-description">
  <!-- Emotional Hook -->
  <p class="description-intro">
    [Emotional benefit statement that connects with the buyer's intent]
  </p>

  <!-- Key Benefits (not features) -->
  <h3>Why You'll Love It</h3>
  <ul class="benefits-list">
    <li>Keeps drinks cold for 24 hours (perfect for all-day events)</li>
    <li>Smooth, permanent personalization (no peeling ever)</li>
    <li>Makes the perfect bridesmaid proposal gift</li>
  </ul>

  <!-- Use Cases -->
  <h3>Perfect For</h3>
  <ul class="use-cases">
    <li>Bridesmaid proposals & wedding parties</li>
    <li>Birthday gifts & celebrations</li>
    <li>Gym & daily hydration</li>
    <li>Teacher appreciation gifts</li>
  </ul>

  <!-- Specs (collapsed or secondary) -->
  <details>
    <summary>Product Specifications</summary>
    <ul class="specs-list">
      <li>Capacity: 20oz</li>
      <li>Material: BPA-free stainless steel</li>
      <li>Insulation: Double-wall vacuum</li>
      <li>Finish: Powder-coated with sublimation</li>
    </ul>
  </details>
</div>
```

---

## WEEK 3: TECHNICAL SEO

### 3.1 Add Structured Data/Schema

**Implementation File:** See `/shopify/schema-markup.liquid`

**Required Schema Types:**
1. **Organization** - Brand info, logo, social profiles
2. **Product** - Price, availability, reviews
3. **FAQ** - For FAQ page
4. **BreadcrumbList** - Navigation path

**Installation:**
1. Go to **Online Store > Themes > Edit code**
2. Find `theme.liquid` or `layout/theme.liquid`
3. Add schema code before `</head>` tag
4. Test with Google's Rich Results Test

---

### 3.2 Optimize Meta Titles/Descriptions

**Homepage:**
- Title: `Shelzy's Designs | Premium Personalized Sublimation Water Bottles`
- Description: `Custom 20oz sublimation water bottles for bridesmaids, weddings, gifts, and everyday use. No vinyl, no peeling. Permanent personalization. Free shipping over $50.`

**Collection Pages Pattern:**
- Title: `[Collection Name] | Personalized Water Bottles | Shelzy's Designs`
- Description: `Shop our [collection name]. Custom sublimation water bottles with your choice of name, font, and color. Perfect for [use case]. Free shipping over $50.`

**Product Pages Pattern:**
- Title: `[Product Name] | Custom Personalized Bottle | Shelzy's Designs`
- Description: `Personalize your [product name] with any name. Sublimation printing means no peeling or fading. Keeps drinks cold 24hrs. Starting at $[price].`

**Where to Edit:**
1. **Homepage:** Settings > Preferences
2. **Collections/Products:** Edit individual item > Search engine listing preview > Edit

---

### 3.3 Add Alt Text to Images

**Process:**
1. Go to **Settings > Files** (for media library images)
2. Or edit each product individually
3. Add descriptive alt text following this format:
   - Product images: `[Color] personalized 20oz sublimation water bottle with [design element]`
   - Lifestyle images: `Woman holding sage green personalized water bottle at gym`
   - Process images: `Sublimation printing process showing heat press on water bottle`

**Bulk Alt Text Template:**
```
[Product Name] - [Color] - [Angle/View]
Example: Signature Bottle - White - Front view with name "Sarah" personalization
```

---

### 3.4 Speed Optimization

**Quick Wins:**
1. **Compress Images:**
   - Use TinyPNG.com before uploading
   - Target: <200KB per product image
   - Use WebP format when possible

2. **Enable Lazy Loading:**
   - Go to **Theme Settings > Performance**
   - Enable lazy loading for images

3. **Minimize Apps:**
   - Audit installed apps
   - Remove unused apps
   - Apps to keep: Reviews, Klaviyo, Product Options
   - Remove: Duplicate functionality apps

4. **Reduce Theme Code:**
   - Remove unused sections
   - Minimize custom CSS/JS
   - Use theme's built-in features when possible

**Testing:**
- Use Google PageSpeed Insights
- Target: 50+ mobile score, 70+ desktop score
- Use GTmetrix for detailed analysis

---

### 3.5 Set Up Analytics & Tracking

**Required Tracking:**

1. **Google Analytics 4 (GA4)**
   ```
   Settings > Sales channels > Online Store > Preferences > Google Analytics
   ```

2. **Google Search Console**
   - Verify domain ownership
   - Submit sitemap: `yoursite.com/sitemap.xml`

3. **Facebook Pixel**
   ```
   Settings > Sales channels > Online Store > Preferences > Facebook Pixel
   ```

4. **Conversion API (CAPI)**
   - Install Facebook & Instagram app
   - Enable Conversions API for better iOS14+ tracking

---

## WEEK 4: GROWTH FEATURES

### 4.1 Install Live Chat

**Recommended Apps:**
1. **Shopify Inbox** (Free) - Built-in, simple
2. **Tidio** (Free tier) - AI chatbot included
3. **Gorgias** ($60/mo) - Full helpdesk, great for scaling

**Configuration:**
- Enable on product pages and cart
- Set business hours
- Create FAQ quick responses
- Add after-hours auto-reply

---

### 4.2 Add Personalization Preview Tool

**Options:**

1. **Customily** ($19.99/mo)
   - Live preview of personalization
   - Multiple fonts/colors
   - Great for sublimation products

2. **Inkybay** ($19.99/mo)
   - Product customizer
   - Live text preview
   - Font selection

**Implementation Priority:** High - this is a major conversion driver for personalized products

---

### 4.3 Create Wholesale/Bulk Orders Page

**File:** See `/shopify/static-pages.html` (Bulk & Corporate section)

**Page Contents:**
- Bulk pricing tiers
- Minimum order quantities
- Logo/corporate branding options
- Quote request form
- Turnaround times
- Contact information

---

### 4.4 Set Up Abandoned Cart Recovery

**Shopify Built-in:**
1. Go to **Settings > Checkout**
2. Find **Abandoned checkouts**
3. Enable automatic emails
4. Customize template

**Klaviyo (Recommended for better results):**
1. Create abandoned cart flow in Klaviyo
2. Disable Shopify's built-in emails
3. Use 3-email sequence (see Week 2 section)

---

### 4.5 Add Post-Purchase Upsells

**Recommended App:** ReConvert ($7.99/mo)

**Setup:**
1. Install ReConvert
2. Create thank you page template
3. Add upsell widgets:
   - Related products
   - Bundle offers ("Add matching scrunchie for $5")
   - Discount on next order
4. Track conversion rate

---

## CONTENT UPDATES NEEDED

### New Pages to Create

| Page | Status | File |
|------|--------|------|
| About | ✅ Ready | `/shopify/static-pages.html` |
| FAQ | ✅ Ready | `/shopify/static-pages.html` |
| How It Works | ✅ Ready | `/shopify/static-pages.html` |
| Contact | ✅ Ready | `/shopify/static-pages.html` |
| Size Guide | ✅ Ready | `/shopify/additional-pages.html` |
| Care Instructions | ✅ Ready | `/shopify/additional-pages.html` |
| Bulk & Corporate | ✅ Ready | `/shopify/additional-pages.html` |

### Existing Pages to Update

| Page | Updates Needed |
|------|----------------|
| Homepage | Remove placeholder text, add video, improve social proof |
| Shipping Policy | Add carrier info (USPS, UPS, FedEx) |
| Refund Policy | Add clearer process steps |
| Blog Posts | Add internal links to products, improve CTAs |

---

## SHOPIFY APPS SUMMARY

### Must Install
| App | Purpose | Cost |
|-----|---------|------|
| Klaviyo | Email marketing | Free tier |
| Judge.me | Product reviews | Free tier |
| Bold Product Options | Product customization | $20/mo |

### Recommended
| App | Purpose | Cost |
|-----|---------|------|
| ReConvert | Post-purchase upsells | $7.99/mo |
| Infinite Options | Better customization | $9.99/mo |
| Lucky Orange | Heatmaps & recordings | Free tier |
| Tidio | Live chat | Free tier |

### Consider for Growth
| App | Purpose | Cost |
|-----|---------|------|
| Privy | Better popups | Free tier |
| Aftership | Order tracking | Free tier |
| Vitals | 40+ tools in one | $29.99/mo |

---

## SUCCESS METRICS

### Week 1 Goals
- [ ] All 404 errors fixed
- [ ] Social links working
- [ ] Placeholder text removed
- [ ] Free shipping threshold consistent

### Month 1 Goals
- [ ] Review app installed and collecting reviews
- [ ] Email automation flows live
- [ ] Trust badges visible
- [ ] FAQ page published

### Month 3 Goals
- [ ] 10+ product reviews
- [ ] 500+ email subscribers
- [ ] 15%+ email open rates
- [ ] Improved page speed scores

---

## IMPLEMENTATION FILES INDEX

```
/shopify/
├── AUDIT_IMPLEMENTATION.md (this file)
├── IMPLEMENTATION_GUIDE.md
├── static-pages.html (About, FAQ, How It Works, Contact)
├── additional-pages.html (Size Guide, Care Instructions, Bulk Orders)
├── homepage-sections.liquid
├── trust-badges.liquid
├── schema-markup.liquid
├── product-page-enhancements.liquid
├── cart-enhancements.liquid
├── mobile-optimizations.css
├── PRODUCTS_IMPORT.csv
├── CUSTOMIZATION_FIELDS.md
└── email-templates/
    ├── welcome-series.html
    ├── abandoned-cart.html
    └── post-purchase.html
```

---

**Version:** 1.0
**Last Updated:** November 2025
**Based On:** Comprehensive Site Audit
