# Shelzy's Designs Profitability Review

**Review Date:** November 2025
**Site:** shelzysdesigns.com
**Purpose:** Identify changes to increase profitability with implementation instructions for Comet

---

## Executive Summary

Shelzy's Designs has a solid foundation with quality branding, a functional Shopify store, and an Amazon affiliate strategy in place. However, several high-impact opportunities exist to significantly increase profitability:

| Priority | Opportunity | Estimated Impact | Effort |
|----------|-------------|------------------|--------|
| 1 | Fix AOV (Average Order Value) Leaks | +25-40% revenue | Medium |
| 2 | Streamline Product Catalog | -15% costs, +10% conversion | Low |
| 3 | Optimize Amazon Affiliate Integration | +$200-500/mo passive income | Low |
| 4 | Improve Conversion Rate | +15-30% sales | Medium |
| 5 | Email Marketing Automation | +20% repeat purchases | Medium |
| 6 | Remove Unprofitable Elements | -$50-100/mo costs | Low |

---

## Part 1: Front-End Changes

### 1.1 HIGH PRIORITY: Homepage Optimization

#### Current Issues Identified:
- Hero slideshow has 3 rotating banners (too many = decision paralysis)
- "Shop by Occasion" has 4 categories but bridal is buried
- Blog section on homepage takes valuable real estate from products
- Trust signals ("500+ 5-Star Reviews") need more prominence

#### CHANGES TO MAKE:

**A. Simplify Hero Section**
```
CURRENT: 3 rotating slideshow banners
CHANGE TO: Single static hero OR 2-slide max

Implementation:
1. Shopify Admin > Online Store > Themes > Customize
2. Navigate to Homepage > Slideshow section
3. Remove slides 2 and 3
4. Keep only the strongest CTA: "Shop Bridal Gifts"
5. Add urgency text: "Ships in 5-7 Days"
```

**B. Prioritize Bridal Above-the-Fold**
```
CURRENT: Generic "Shop by Occasion" section
CHANGE TO: Dedicated "Bridesmaid Proposal" feature section

Implementation:
1. Add new section after hero: "Image with text"
2. Image: Proposal gift box lifestyle shot
3. Headline: "The Perfect Bridesmaid Proposal"
4. Body: "Make the moment unforgettable with our best-selling proposal boxes"
5. CTA: "Shop Proposal Boxes"
6. Move "Shop by Occasion" lower on page
```

**C. Move Blog Section to Footer or Remove from Homepage**
```
CURRENT: 3 blog posts on homepage (takes ~300px vertical space)
CHANGE TO: Remove from homepage entirely

Implementation:
1. Shopify Admin > Themes > Customize > Homepage
2. Delete or hide "Blog posts" section
3. Replace with: "As Seen On" social proof section OR customer photo gallery
4. Blog can be accessed via navigation menu only
```

**D. Enhance Trust Signals**
```
ADD these elements prominently:
- "4.9/5 Stars from 500+ Happy Customers" (with star icons)
- "Free Shipping on Orders $50+"
- "Permanent Sublimation - Never Peels"
- Secure checkout badges

Implementation:
1. Add announcement bar with rotating messages
2. Add trust badge section below hero
3. Use app like "Trust Badge Master" (free) or add custom HTML
```

---

### 1.2 MEDIUM PRIORITY: Product Page Optimization

#### Current Issues:
- Customization flow may cause friction
- No urgency elements
- Upsells not prominent enough
- Missing social proof on product pages

#### CHANGES TO MAKE:

**A. Add Urgency Elements**
```
ADD to each product page:
- "Order by [day] for delivery by [date]"
- "X people viewing this item" (if app supports)
- Stock scarcity: "Only 3 left at this price"

Implementation:
1. Install "Urgency Bear" or "Hurrify" app (free versions available)
2. Configure countdown timer for shipping cutoff
3. Add to product template
```

**B. Improve Upsell Positioning**
```
CURRENT: Upsells may be below the fold
CHANGE TO: Upsell on product page AND in cart drawer

Implementation:
1. Install "Frequently Bought Together" app OR
2. Use theme's built-in product recommendations
3. Configure:
   - Bridesmaid Bottle -> Suggest Proposal Box (+$25 value)
   - Single Bottle -> Suggest 3-pack (-10% bundle)
   - Kids Bottle -> Suggest Sibling Bundle
4. Add to cart drawer: "Add Gift Box - Save 15%"
```

**C. Add Customer Photos to Product Pages**
```
CHANGE: Enable photo reviews prominently

Implementation:
1. Judge.me or Yotpo settings
2. Enable "Photo Reviews" section on product page
3. Send post-purchase email requesting photo review
4. Offer 10% discount for photo submission
```

---

### 1.3 LOW PRIORITY: Navigation Cleanup

#### CHANGES TO MAKE:

**A. Simplify Navigation Menu**
```
CURRENT: Home, Shop All, Weddings, Corporate, About Us, Contact, Everyday
CHANGE TO: Shop (dropdown), Bridal, About, FAQ

Implementation:
1. Shopify Admin > Online Store > Navigation
2. Edit Main Menu:
   - Shop (dropdown: Best Sellers, All Products, Kids, Holiday)
   - Bridal & Wedding (highlight with colored text if theme supports)
   - About
   - FAQ
3. Move Contact to footer only
4. Remove "Everyday" (merge into Shop All)
```

---

## Part 2: Back-End Changes

### 2.1 HIGH PRIORITY: Product Catalog Streamlining

#### Current Issue:
8 core products + variants = complexity that increases production costs and inventory headaches.

#### ANALYSIS:

| Product | Keep/Modify/Delete | Reason |
|---------|-------------------|--------|
| Signature Personalized Bottle | KEEP | Hero product, high margin |
| Bridesmaid Proposal Bottle | MERGE | Duplicate of Signature with title |
| Proposal Gift Box | KEEP | Highest AOV, best margin |
| Bridal Party Set (5/8/10-pack) | SIMPLIFY | Offer 5-pack only, others custom quote |
| Everyday Custom Bottle | MERGE | Same as Signature, different positioning |
| Kids Personalized Bottle | KEEP | Different audience, good margin |
| Holiday Collection | SEASONAL | Only create 4-6 weeks before holiday |
| Bulk & Corporate | KEEP AS QUOTE | Remove from main catalog, quote-only |

#### CHANGES TO MAKE:

**A. Merge Duplicate Products**
```
DELETE: "Bridesmaid Proposal Bottle" as separate product
DELETE: "Everyday Custom Bottle" as separate product
KEEP: "Signature Personalized Bottle" with variant options

Implementation:
1. Shopify Admin > Products
2. Edit "Signature Personalized Bottle"
3. Add variant: "Style" with options:
   - Classic Script
   - Bridesmaid (adds "Bridesmaid" text)
   - Maid of Honor
   - Custom Title
4. Archive duplicate products (don't delete, hide from sales channels)
5. Set up URL redirects from old products to new
```

**B. Simplify Bridal Party Sets**
```
CURRENT: 5-pack, 8-pack, 10-pack options
CHANGE TO: 5-pack standard, others via contact form

Implementation:
1. Keep only "Bridal Party 5-Pack" as purchasable product
2. Add note: "Need 8+ bottles? Contact us for custom pricing"
3. Add contact form link on product page
4. This reduces inventory complexity and increases custom quote margins
```

**C. Make Bulk/Corporate Quote-Only**
```
CURRENT: May be listed as product
CHANGE TO: Landing page with quote form only

Implementation:
1. Create page: /pages/bulk-orders
2. Remove any Bulk product from Shop All collection
3. Add quote request form (Shopify Forms or Typeform)
4. Keep in navigation under "Corporate" but link to quote page
```

---

### 2.2 HIGH PRIORITY: Pricing Optimization

#### Current Pricing Analysis:
Based on homepage showing "Best Sellers" with prices ranging $24.99-$249.90

#### CHANGES TO MAKE:

**A. Implement Psychological Pricing**
```
CURRENT: Various price points
CHANGE TO: Strategic anchor pricing

Implementation:
1. Set Proposal Gift Box at $79 or $89 (anchor high)
2. Set Single Bottles at $34-39 (makes box feel like better value)
3. Set 5-Pack at $149 (shows savings vs. 5x individual)
4. Always show "Compare at" price for bundles

Example:
- Single Bottle: $36
- Proposal Box: $79 (was $95) - "Save $16!"
- 5-Pack: $149 (was $180) - "Save $31!"
```

**B. Add Tiered Free Shipping**
```
CURRENT: Free shipping at $50
CHANGE TO: Progress bar showing distance to free shipping

Implementation:
1. Install "Free Shipping Bar" app (free)
2. Configure threshold: $50
3. Show message: "You're $XX away from FREE shipping!"
4. This increases AOV as customers add items to reach threshold
```

---

### 2.3 MEDIUM PRIORITY: Amazon Affiliate Integration

#### Current State:
- Amazon Associates ID: shelzysdesigns-20
- 25+ blog posts live
- Pinterest strategy documented but unclear execution

#### CHANGES TO MAKE:

**A. Add Affiliate Content to Shopify Store**
```
CURRENT: Blog exists but may not be optimized for affiliate revenue
CHANGE TO: Strategic affiliate integration

Implementation:
1. Create new blog collection: "Gift Guides & Finds"
2. Ensure all Amazon links use tag: ?tag=shelzysdesigns-20
3. Add "Shop My Favorites" page with curated Amazon picks
4. Cross-link: Blog posts should mention Shelzy's products too
   Example: "Love personalized gifts? See our custom bottles here"
```

**B. Optimize Existing Blog Posts**
```
For each of the 25+ blog posts:
1. Verify all Amazon links have affiliate tag
2. Add "Shop Shelzy's" CTA at bottom of each post
3. Add email capture popup on blog pages
4. Add internal links between related posts

Implementation:
1. Audit each post in Shopify Admin > Blog Posts
2. Find/replace Amazon links without tag
3. Add standard footer section to blog template
```

**C. Create Dedicated "Amazon Finds" Landing Page**
```
CREATE: /pages/amazon-finds

Content:
- "Shop My Favorite Finds" headline
- Category buttons: Bridal | Home | Beauty | Travel
- Grid of top 20 products with affiliate links
- Updated monthly

Implementation:
1. Shopify Admin > Pages > Add Page
2. Use custom HTML or page builder app
3. Add to footer navigation
```

---

### 2.4 MEDIUM PRIORITY: Email Marketing Setup

#### Current State:
Email capture exists but automation unclear.

#### CHANGES TO MAKE:

**A. Essential Email Flows (Klaviyo)**
```
MUST HAVE flows:

1. Welcome Series (3 emails)
   - Email 1: Welcome + 10% off code (immediate)
   - Email 2: Why Sublimation Matters (Day 2)
   - Email 3: Best Sellers showcase (Day 5)

2. Abandoned Cart (3 emails)
   - Email 1: "You left something..." (1 hour)
   - Email 2: "Still thinking?" (24 hours)
   - Email 3: "Last chance" + 10% off (72 hours)

3. Post-Purchase
   - Email 1: Order confirmation + care instructions (immediate)
   - Email 2: Review request (7 days after delivery)
   - Email 3: "Order again" for consumables/gifts (60 days)

Implementation:
1. Klaviyo > Flows > Create from template
2. Copy email content from /copy/COPY_BANK.md
3. Enable and test each flow
```

**B. Bridal-Specific Email Segment**
```
CREATE: Bridal customer segment

Trigger: Anyone who purchases bridal product
Emails:
- "Thank you, bride-to-be!"
- "Getting ready essentials" (Amazon affiliate)
- "Bridal party bundle reminder" (upsell)

Implementation:
1. Klaviyo > Lists & Segments > Create Segment
2. Condition: "Has placed order containing [bridal products]"
3. Create dedicated campaign flow
```

---

### 2.5 LOW PRIORITY: Cost Reduction - What to Delete

#### ITEMS TO DELETE OR ARCHIVE:

**A. Unused Apps**
```
AUDIT: Shopify Admin > Apps

DELETE if not generating value:
- Apps with <$100/mo ROI
- Duplicate functionality apps
- Apps not used in 30+ days

KEEP essential only:
- Personalization app (Bold/Native)
- Reviews (Judge.me free tier is fine)
- Email (Klaviyo free up to 250)
- Analytics (free)
```

**B. Unused Pages**
```
AUDIT: Shopify Admin > Pages

ARCHIVE/DELETE:
- Duplicate About pages
- Test pages
- Unused landing pages
- Old seasonal content

KEEP:
- About Us
- FAQ
- Contact
- How It Works
- Bulk/Corporate (quote form)
- Shipping & Returns
- Privacy/Terms
```

**C. Unused Products**
```
AUDIT: Shopify Admin > Products

ARCHIVE (don't delete):
- Products with 0 sales in 90 days
- Duplicate variants
- Old seasonal items

Implementation:
1. Products > Filter by "0 orders"
2. Bulk select > More actions > Archive
3. This improves site speed and reduces customer confusion
```

---

## Part 3: Implementation Plan for Comet

### Phase 1: Quick Wins (Week 1) - 4-6 hours

| Task | Priority | Time | Instructions |
|------|----------|------|--------------|
| Remove blog from homepage | High | 15 min | Themes > Customize > Delete blog section |
| Simplify slideshow to 1-2 slides | High | 15 min | Themes > Customize > Slideshow |
| Add trust badges below hero | High | 30 min | Add custom HTML section or install Trust Badge app |
| Merge duplicate products | High | 1 hr | See Section 2.1A above |
| Add free shipping progress bar | High | 30 min | Install Free Shipping Bar app |
| Clean up navigation | Medium | 30 min | See Section 1.3A above |
| Audit and archive unused pages | Low | 30 min | Pages > Archive unused |

### Phase 2: Revenue Optimization (Week 2) - 6-8 hours

| Task | Priority | Time | Instructions |
|------|----------|------|--------------|
| Set up cart upsells | High | 1 hr | Install upsell app, configure per Section 1.2B |
| Add urgency elements | High | 1 hr | Install countdown timer app |
| Optimize product pricing | High | 1 hr | Update all prices per Section 2.2A |
| Add "Proposal Box" feature section to homepage | High | 30 min | Themes > Customize > Add Image with Text |
| Enable photo reviews | Medium | 30 min | Judge.me settings |
| Create Amazon Finds page | Medium | 2 hr | See Section 2.3C |
| Audit blog affiliate links | Medium | 2 hr | Check all 25+ posts have affiliate tag |

### Phase 3: Email Automation (Week 3) - 4-6 hours

| Task | Priority | Time | Instructions |
|------|----------|------|--------------|
| Set up Welcome Series | High | 2 hr | Klaviyo > Flows (copy from COPY_BANK.md) |
| Set up Abandoned Cart flow | High | 1 hr | Klaviyo > Flows |
| Set up Post-Purchase flow | Medium | 1 hr | Klaviyo > Flows |
| Create Bridal segment | Medium | 30 min | Klaviyo > Segments |
| Add email popup to blog pages | Medium | 30 min | Klaviyo > Signup Forms |

### Phase 4: Ongoing Optimization (Monthly)

| Task | Frequency | Time |
|------|-----------|------|
| Review and archive low-performing products | Monthly | 1 hr |
| Update Amazon affiliate content | Monthly | 2 hr |
| Send email campaigns (not flows) | 2x/month | 2 hr |
| Review analytics and adjust | Monthly | 1 hr |
| Update seasonal collections | Quarterly | 2 hr |

---

## Part 4: Metrics to Track

### Weekly Dashboard

| Metric | Target | How to Check |
|--------|--------|--------------|
| Conversion Rate | 2-4% | Shopify Analytics > Overview |
| Average Order Value | $60+ | Shopify Analytics > Overview |
| Cart Abandonment Rate | <70% | Shopify Analytics > Behavior |
| Email Capture Rate | 3-5% | Klaviyo > Lists |

### Monthly Dashboard

| Metric | Target | How to Check |
|--------|--------|--------------|
| Amazon Affiliate Revenue | $200+/mo | Amazon Associates Dashboard |
| Email Revenue | 20% of total | Klaviyo > Analytics |
| Returning Customer Rate | 15%+ | Shopify Analytics > Customers |
| Product Page Views to Cart | 10%+ | Shopify Analytics > Behavior |

---

## Part 5: What NOT to Do

### Avoid These Common Mistakes:

1. **Don't add more products** - Focus on selling existing products better
2. **Don't redesign the entire site** - Incremental improvements beat overhauls
3. **Don't ignore mobile** - Test all changes on mobile first
4. **Don't discount too heavily** - Protect margins; use bundles instead
5. **Don't add too many apps** - Each app adds cost and site speed penalty
6. **Don't neglect email** - It's the highest ROI marketing channel

---

## Summary: Top 10 Actions for Maximum Profitability

1. **Remove blog from homepage** - Immediate, takes 15 min
2. **Add cart upsells** - +20% AOV potential
3. **Merge duplicate products** - Reduces confusion, simplifies ops
4. **Install free shipping progress bar** - +10-15% AOV
5. **Set up abandoned cart emails** - Recovers 5-15% of lost sales
6. **Add trust badges prominently** - +5-10% conversion
7. **Create Amazon Finds page** - Additional passive revenue
8. **Add urgency elements** - +10-20% conversion
9. **Simplify navigation** - Reduces bounce rate
10. **Audit and archive unused items** - Improves site speed

---

**Document Version:** 1.0
**Created:** November 2025
**For:** Comet Implementation
**Review Again:** January 2026

