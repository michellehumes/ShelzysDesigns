# Shelzy's Designs - Conversion Optimization Package

**Comprehensive upgrade package to increase revenue, conversions, and email subscribers.**

Based on a full site audit of shelzysdesigns.com, this package addresses critical issues and adds high-impact conversion features.

---

## 📊 Expected Results

| Metric | Expected Impact |
|--------|-----------------|
| Email Subscribers | +300/month |
| Conversion Rate | +15-25% |
| Average Order Value | +10-20% |
| Cart Recovery | +5-15% |
| Organic Traffic | +20-50% (over 90 days) |

---

## 📁 Package Contents

```
shopify/
├── snippets/
│   ├── email-popup.liquid          # 10% off email capture popup
│   ├── trust-badges.liquid         # Product page trust indicators
│   ├── free-shipping-bar.liquid    # Cart progress bar
│   ├── faq-schema.liquid           # SEO schema markup
│   ├── upsell-frequently-bought.liquid  # Bundle upsells
│   ├── personalization-form.liquid # Live preview customization
│   └── instagram-feed.liquid       # Social proof feed
├── sections/
│   ├── featured-products.liquid    # Homepage product grid
│   └── bulk-order-form.liquid      # B2B quote request form
├── pages/
│   ├── contact-page.html           # Updated contact page
│   ├── about-page.html             # Enhanced about page
│   └── faq-page-accordion.html     # Accordion FAQ with search
└── emails/
    ├── abandoned-cart-sequence.html # 3-email recovery series
    └── review-request.html          # Post-purchase review email
```

---

## 🚨 CRITICAL FIXES (Do First!)

### 1. Remove "Example Product" Placeholders

**Problem:** Homepage shows placeholder products, destroying credibility.

**Fix:**
1. Shopify Admin → Online Store → Themes → Customize
2. Find "Popular Picks" section on homepage
3. Change collection to "Best Sellers"
4. Save

### 2. Fix Social Media Links

**Problem:** Social links go to Shopify demo pages.

**Fix:**
1. Themes → Customize → Footer
2. Update URLs:
   - Instagram: `https://instagram.com/shelzysdesigns`
   - Facebook: `https://facebook.com/shelzysdesigns`
   - Pinterest: `https://pinterest.com/shelzysdesigns`

### 3. Fix Footer Location

**Problem:** Says "Toronto, Canada" but About page says "Encinitas, California"

**Fix:**
1. Themes → Customize → Footer
2. Change to: "Encinitas, California"

### 4. Update Contact Page

**Problem:** Shows placeholder text "Use this text to share information..."

**Fix:**
1. Online Store → Pages → Contact
2. Click "Show HTML"
3. Delete all content
4. Copy/paste from `pages/contact-page.html`
5. Save

---

## 📧 PHASE 1: Email Capture Setup

### Step 1.1: Create Discount Code

1. Shopify Admin → Discounts → Create discount
2. Settings:
   - Code: `WELCOME10`
   - Type: Percentage
   - Value: 10%
   - Applies to: Entire order
   - Limit: One per customer
3. Save

### Step 1.2: Install Email Popup

1. Online Store → Themes → Actions → Edit code
2. Under "Snippets", click "Add a new snippet"
3. Name: `email-popup`
4. Copy all content from `snippets/email-popup.liquid`
5. Paste and Save

6. Open "Layout" → `theme.liquid`
7. Find `</body>` at the bottom
8. Add this line BEFORE `</body>`:
```liquid
{% render 'email-popup' %}
```
9. Save

**Test:** Visit your site in incognito mode. Popup should appear after 5 seconds.

---

## 🛒 PHASE 2: Abandoned Cart Recovery

### Step 2.1: Create Recovery Discount

1. Discounts → Create discount
2. Settings:
   - Code: `COMEBACK10`
   - Type: Percentage - 10%
   - One per customer
3. Save

### Step 2.2: Enable Shopify's Built-in Recovery (Basic)

1. Settings → Notifications → Checkout
2. Enable "Abandoned checkout"
3. Set timing: 1 hour
4. Save

### Step 2.3: Advanced Setup with Klaviyo (Recommended)

1. Install Klaviyo from App Store (free up to 250 contacts)
2. Create Flow → Abandoned Cart
3. Set up 3-email sequence using templates from `emails/abandoned-cart-sequence.html`:
   - Email 1: 1 hour delay (gentle reminder)
   - Email 2: 24 hours delay (social proof)
   - Email 3: 72 hours delay (10% discount)

---

## ⭐ PHASE 3: Reviews & Social Proof

### Step 3.1: Install Judge.me

1. Apps → Shopify App Store
2. Search "Judge.me"
3. Install free version
4. Enable automatic review requests (7 days after delivery)

### Step 3.2: Request Reviews from Past Customers

1. In Judge.me → Reviews → Import
2. Send review request to past customers
3. Consider offering 15% off for photo reviews

### Step 3.3: Add Trust Badges

1. Edit code → Snippets → Add new snippet
2. Name: `trust-badges`
3. Paste from `snippets/trust-badges.liquid`
4. Save

5. Find your product template (usually `sections/main-product.liquid`)
6. Add after the add-to-cart button:
```liquid
{% render 'trust-badges' %}
```

---

## 💰 PHASE 4: Conversion Optimization

### Step 4.1: Free Shipping Progress Bar

1. Snippets → Add new snippet
2. Name: `free-shipping-bar`
3. Paste from `snippets/free-shipping-bar.liquid`
4. Save

5. Find your cart template/drawer
6. Add at top of cart:
```liquid
{% render 'free-shipping-bar' %}
```

### Step 4.2: Upsell Component

1. Snippets → Add new snippet
2. Name: `upsell-frequently-bought`
3. Paste from `snippets/upsell-frequently-bought.liquid`
4. Save

5. Add to product template after add-to-cart:
```liquid
{% render 'upsell-frequently-bought', product: product %}
```

### Step 4.3: Enhanced Personalization Form

1. Snippets → Add new snippet
2. Name: `personalization-form`
3. Paste from `snippets/personalization-form.liquid`
4. Save

5. Replace existing personalization fields in product template with:
```liquid
{% render 'personalization-form', product: product %}
```

---

## 🏠 PHASE 5: Homepage Optimization

### Step 5.1: Replace Featured Products Section

1. Sections → Add new section
2. Name: `featured-products`
3. Paste from `sections/featured-products.liquid`
4. Save

5. Customize → Homepage
6. Add section → Select "Featured Products"
7. Configure:
   - Title: "Customer Favorites"
   - Collection: Best Sellers
   - Products: 6
8. Remove old placeholder section
9. Save

---

## 📝 PHASE 6: Content Updates

### Step 6.1: Update About Page

1. Pages → About
2. Show HTML
3. Replace all with content from `pages/about-page.html`
4. Add your photos where indicated
5. Update statistics with real numbers
6. Save

### Step 6.2: Update FAQ Page

1. Pages → FAQ
2. Show HTML
3. Replace with content from `pages/faq-page-accordion.html`
4. Save

---

## 🔍 PHASE 7: SEO Improvements

### Step 7.1: Add Schema Markup

1. Snippets → Add new snippet
2. Name: `faq-schema`
3. Paste from `snippets/faq-schema.liquid`
4. Save

5. Open Layout → theme.liquid
6. Add BEFORE `</head>`:
```liquid
{% render 'faq-schema' %}
```

### Step 7.2: Update Meta Descriptions

**Homepage:**
- Title: `Shelzy's Designs | Personalized Water Bottles`
- Description: `Premium personalized water bottles with permanent sublimation print. Perfect for weddings, bachelorette parties & events. Free shipping $100+.`

**About:**
- Title: `About Shelzy's Designs | Handcrafted in California`
- Description: `Discover our story. Premium sublimation-printed water bottles handcrafted in California. Quality that won't peel or fade.`

---

## 💼 PHASE 8: B2B Lead Generation

### Step 8.1: Add Bulk Quote Form

1. Sections → Add new section
2. Name: `bulk-order-form`
3. Paste from `sections/bulk-order-form.liquid`
4. Save

5. Pages → Bulk Orders
6. Add section reference or embed form HTML directly

---

## ✅ Implementation Checklist

### Critical Fixes (Day 1)
- [ ] Remove placeholder products
- [ ] Fix social media links
- [ ] Fix footer location
- [ ] Update contact page
- [ ] Create WELCOME10 discount

### Email & Recovery (Day 2)
- [ ] Install email popup
- [ ] Create COMEBACK10 discount
- [ ] Enable abandoned cart emails
- [ ] Install Judge.me

### Conversion Features (Day 3)
- [ ] Add trust badges
- [ ] Add free shipping bar
- [ ] Add upsell component
- [ ] Update personalization form

### Content & SEO (Day 4)
- [ ] Update About page
- [ ] Update FAQ page
- [ ] Add schema markup
- [ ] Update meta descriptions

---

## 🧪 Testing Checklist

After implementation, test:

- [ ] Email popup appears (incognito mode)
- [ ] WELCOME10 code works
- [ ] Trust badges show on products
- [ ] Shipping bar updates in cart
- [ ] Upsells appear on products
- [ ] FAQ accordion works
- [ ] Mobile site functions properly
- [ ] Page speed is acceptable

---

## 📈 Measuring Success

Track these metrics weekly:

1. **Email Signups:** Check Klaviyo or Shopify customer list
2. **Conversion Rate:** Shopify Analytics → Conversion rate
3. **Average Order Value:** Reports → Sales
4. **Abandoned Cart Recovery:** Klaviyo → Flow performance
5. **Review Count:** Judge.me dashboard

---

## 🆘 Troubleshooting

### Popup not showing
- Check if cookie is set (clear cookies/incognito)
- Verify snippet is rendered in theme.liquid

### Trust badges not appearing
- Check if snippet name matches render call
- Verify placement in product template

### Schema not working
- Test with Google Rich Results Test
- Verify FAQ page handle matches schema code

### Upsells not showing
- Ensure product has related products in same collection
- Check JavaScript console for errors

---

**Questions?** Contact hello@shelzysdesigns.com

---

*Package Version: 2.0*
*Last Updated: November 2024*
