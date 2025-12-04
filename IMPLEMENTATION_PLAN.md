# Shelzy's Designs - Implementation Plan

## Overview

This plan prioritizes automation where possible. Each task specifies:
- **Executor:** Who/what performs the task
- **Manual:** Whether human intervention needed
- **Commands:** Exact steps or scripts

---

## Sprint 1: Critical Fixes

### Task 1.1: Fix Broken Collection Redirects

**Executor:** Shopify Admin (Manual)
**Manual:** Yes
**Time:** 10 minutes

**Steps:**
1. Go to Shopify Admin > Online Store > Navigation
2. Click "URL Redirects" 
3. Add redirects:
   - `/collections/stainless-steel` → `/collections/personalized-bottles`
   - `/collections/couples` → `/collections/bridesmaid-bridal`
   - `/collections/gifts` → `/collections/proposal-gift-boxes`

**Verification:** Visit old URLs, confirm they redirect

---

### Task 1.2: Update Main Navigation

**Executor:** Shopify Admin (Manual)
**Manual:** Yes
**Time:** 15 minutes

**Steps:**
1. Shopify Admin > Online Store > Navigation > Main Menu
2. Add/update menu items:
   - Home → /
   - Shop → /collections/all
     - Best Sellers → /collections/best-sellers
     - Personalized Bottles → /collections/personalized-bottles
     - Bridesmaid & Bridal → /collections/bridesmaid-bridal
     - Gift Boxes → /collections/proposal-gift-boxes
     - Kids Bottles → /collections/kids-bottles
     - Holiday → /collections/holiday
     - Bulk & Corporate → /pages/bulk-corporate
   - About → /pages/about
   - How It Works → /pages/how-it-works
   - FAQ → /pages/faq
   - Contact → /pages/contact

---

### Task 1.3: Restock Products

**Executor:** Shopify Admin (Manual)
**Manual:** Yes - requires inventory action
**Time:** Varies based on stock availability

**Products to restock:**
- Signature Personalized Bottle
- Bridesmaid Proposal Bottle
- Everyday Custom Bottle

**Steps:**
1. Shopify Admin > Products
2. Select each out-of-stock product
3. Update inventory quantity
4. Ensure "Track quantity" is enabled

---

## Sprint 2: Product Page Improvements

### Task 2.1: Add Shipping Info to Products

**Executor:** Shopify Bulk Editor or Script
**Manual:** Partial - can use bulk edit
**Time:** 30 minutes

**Add to each product description:**
```
📦 SHIPPING & PROCESSING
• Processing time: 3-5 business days
• Shipping: 2-5 business days after processing
• Free shipping on orders over $75
```

**Shopify Admin:** Products > Select All > Bulk Edit > Description

---

### Task 2.2: Enable Related Products

**Executor:** Theme Customizer
**Manual:** Yes
**Time:** 15 minutes

**Steps:**
1. Online Store > Themes > Customize
2. Navigate to Product Page template
3. Add "Related Products" section
4. Configure to show 4 products
5. Save

---

### Task 2.3: Add Trust Badges Section

**Executor:** Theme Customizer
**Manual:** Yes
**Time:** 20 minutes

**Steps:**
1. Online Store > Themes > Customize
2. Add "Icon with text" or "Multicolumn" section
3. Add badges:
   - 🔒 Secure Checkout
   - ✨ Permanent Sublimation
   - 📦 Ships in 3-5 Days
   - ↩️ Easy Returns
4. Place below Add to Cart button

---

## Sprint 3: Content & SEO

### Task 3.1: Update Typography in Theme

**Executor:** Theme Customizer
**Manual:** Yes
**Time:** 10 minutes

**Steps:**
1. Online Store > Themes > Customize
2. Theme Settings > Typography
3. Set Headings: Playfair Display
4. Set Body: Inter
5. Save

---

### Task 3.2: Add Blog CTAs

**Executor:** Claude Code Script
**Manual:** No - automated
**Time:** 5 minutes to run

**Script location:** `scripts/add-blog-ctas.js`

This would add a CTA block to blog posts linking to relevant products.

---

### Task 3.3: Fix Blog Author

**Executor:** Shopify Admin
**Manual:** Yes
**Time:** 5 minutes

**Steps:**
1. Settings > Users and permissions
2. Update staff account name to "Shelzy's Designs" or founder name
3. Or edit blog posts to show custom author

---

## Sprint 4: Performance & Analytics

### Task 4.1: Run Lighthouse Audit

**Executor:** Terminal Script
**Manual:** No
**Commands:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://shelzysdesigns.com --output=html --output-path=./lighthouse-report.html

# View report
open lighthouse-report.html
```

---

### Task 4.2: Compress Images

**Executor:** Terminal Script or TinyPNG
**Manual:** Partial

**Option A - TinyPNG API:**
```bash
# Requires TinyPNG API key
# Script: scripts/compress-images.sh
```

**Option B - Shopify:**
Images are auto-compressed by Shopify CDN

---

### Task 4.3: Verify Analytics

**Executor:** Manual Check
**Manual:** Yes
**Time:** 15 minutes

**Checklist:**
- [ ] Google Analytics 4 installed
- [ ] Enhanced ecommerce enabled
- [ ] Facebook Pixel active
- [ ] Shopify Analytics working

**Shopify Admin:** Online Store > Preferences > Google Analytics

---

## Automation Scripts

### scripts/audit-performance.sh
```bash
#!/bin/bash
# Run Lighthouse audit on Shelzy's Designs

URL="https://shelzysdesigns.com"
OUTPUT_DIR="./audits"
DATE=$(date +%Y-%m-%d)

mkdir -p $OUTPUT_DIR

echo "Running Lighthouse audit..."
lighthouse $URL \
  --output=html,json \
  --output-path="$OUTPUT_DIR/lighthouse-$DATE" \
  --chrome-flags="--headless"

echo "Audit complete. Report saved to $OUTPUT_DIR/"
```

### scripts/check-404s.sh
```bash
#!/bin/bash
# Check for 404 errors on key pages

URLS=(
  "https://shelzysdesigns.com/"
  "https://shelzysdesigns.com/collections/all"
  "https://shelzysdesigns.com/collections/best-sellers"
  "https://shelzysdesigns.com/collections/bridesmaid-bridal"
  "https://shelzysdesigns.com/pages/about"
  "https://shelzysdesigns.com/pages/faq"
  "https://shelzysdesigns.com/pages/contact"
)

echo "Checking URLs for 404 errors..."
for url in "${URLS[@]}"; do
  status=$(curl -o /dev/null -s -w "%{http_code}" "$url")
  if [ "$status" != "200" ]; then
    echo "❌ $status - $url"
  else
    echo "✅ $status - $url"
  fi
done
```

---

## Shopify API Automation (Advanced)

For bulk updates via Shopify API, you'll need:
1. Private app or custom app credentials
2. Admin API access token
3. Store domain

**Example: Bulk update product descriptions**
```javascript
// scripts/update-products.js
// Requires: npm install @shopify/shopify-api

const addShippingInfo = async (productId) => {
  const shippingText = `
📦 SHIPPING & PROCESSING
• Processing: 3-5 business days
• Shipping: 2-5 business days
• Free shipping on orders $75+
  `;
  // API call to update product
};
```

---

## GitHub Actions (Optional CI/CD)

### .github/workflows/lighthouse-ci.yml
```yaml
name: Lighthouse CI

on:
  schedule:
    - cron: '0 9 * * 1' # Weekly on Monday 9am
  workflow_dispatch:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://shelzysdesigns.com/
            https://shelzysdesigns.com/collections/all
          uploadArtifacts: true
```

---

## Execution Checklist

### Week 1: Critical
- [ ] Fix 3 broken collection redirects
- [ ] Update main navigation
- [ ] Restock out-of-stock products
- [ ] Run initial Lighthouse audit

### Week 2: Product Pages
- [ ] Add shipping info to all products
- [ ] Enable related products section
- [ ] Add trust badges
- [ ] Update typography

### Week 3: Content
- [ ] Add CTAs to top 10 blog posts
- [ ] Fix blog author name
- [ ] Update collection descriptions
- [ ] Add collection banner images

### Week 4: Analytics & Monitoring
- [ ] Verify GA4 setup
- [ ] Configure conversion tracking
- [ ] Set up weekly Lighthouse monitoring
- [ ] Create dashboard for KPIs

---

See MONITORING_SETUP.md for ongoing tracking configuration.
