# Shelzy's Designs - Recommendations

## Priority 1: CRITICAL (Do This Week)

### 1.1 Restock Out-of-Stock Products
**Products affected:**
- Signature Personalized Bottle
- Bridesmaid Proposal Bottle  
- Everyday Custom Bottle

**Impact:** 37% of catalog unavailable = significant lost revenue

**Action:** Update inventory in Shopify Admin > Products

---

### 1.2 Fix Broken Collection URLs
**Broken links (returning 404):**
- /collections/stainless-steel
- /collections/couples
- /collections/gifts

**Fix options:**
1. Create these collections if they should exist
2. Set up redirects to valid collections
3. Remove links from navigation/homepage

**Shopify Admin:** Online Store > Navigation > URL Redirects

---

### 1.3 Update Navigation Menu
**Current:** Missing key pages
**Should include:**
- Home
- Shop (dropdown with all collections)
- About
- How It Works
- FAQ
- Contact

**Shopify Admin:** Online Store > Navigation > Main Menu

---

## Priority 2: HIGH (Next 2 Weeks)

### 2.1 Add Product Recommendations
**What:** "Pairs Well With" or "Complete Your Order" section on product pages

**Why:** Increase AOV by 15-25%

**Options:**
- Use Impulse theme's built-in related products
- Install Rebuy or Candy Rack app
- Manual "You May Also Like" section

---

### 2.2 Improve Product Pages
**Add to each product:**
- 6+ images (front, angle, close-up, lifestyle)
- Shipping timeline ("Ships in 3-5 business days")
- FAQ accordion (common questions)
- Size/specs section
- Trust badges

---

### 2.3 Fix Typography
**Current:** Fahkwang font
**Brand Guide:** Playfair Display (headings) + Inter (body)

**Shopify Admin:** Online Store > Themes > Customize > Theme Settings > Typography

---

### 2.4 Create Business Email
**Current:** michelle.e.humes@gmail.com (personal)
**Recommended:** hello@shelzysdesigns.com or support@shelzysdesigns.com

**Options:**
- Google Workspace ($6/month)
- Zoho Mail (free tier available)
- Shopify Email forwarding

---

## Priority 3: MEDIUM (Next Month)

### 3.1 Add Trust Badges
**Where:** Product pages, cart, footer

**Badges to add:**
- "Permanent Sublimation - Won't Peel"
- "Ships in 3-5 Days"
- "Secure Checkout"
- Payment method icons

---

### 3.2 Remove Blog & Set Up Redirects
**Decision:** Remove blog to simplify site and focus on products

**Steps:**
1. Import `shopify/blog-redirects.csv` to redirect all blog URLs
2. Remove blog from navigation menus
3. Delete all blog posts
4. Delete the blog

**See:** `shopify/REMOVE_BLOG.md` for detailed instructions

---

### 3.3 Improve Bulk/Corporate Page
**Add:**
- Minimum order quantities (10+)
- Pricing tiers (10-24, 25-49, 50-99, 100+)
- Quote request form with file upload
- Use case examples
- Testimonials if available

---

### 3.4 Enhance Collection Pages
**Add to each collection:**
- Banner image
- Collection description
- Filter options (color, price, style)
- Sort functionality

---

## Priority 4: NICE TO HAVE

### 4.1 Performance Optimization
- Compress all images
- Enable lazy loading
- Minimize app scripts
- Run Lighthouse audit monthly

### 4.2 Analytics Setup
- Verify Google Analytics 4
- Set up Facebook Pixel
- Configure conversion tracking
- Consider Microsoft Clarity (free heatmaps)

### 4.3 Email Automation
- Welcome series (3-5 emails)
- Abandoned cart recovery
- Post-purchase follow-up
- Review request automation

---

## Revenue Impact Estimates

| Action | Estimated Impact |
|--------|-----------------|
| Restock products | +30-40% revenue recovery |
| Fix 404 errors | Reduce bounce rate 10-20% |
| Add product recommendations | +15-25% AOV |
| Improve product pages | +10-15% conversion rate |
| Remove blog | Simplified site, less maintenance |

---

## Quick Wins (< 1 Hour Each)

1. Update navigation menu
2. Set up URL redirects for broken links
3. Add shipping info to product descriptions
4. Update contact email display
5. Add "Why Sublimation" section to homepage

---

See IMPLEMENTATION_PLAN.md for step-by-step execution guide.
