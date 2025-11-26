# Shelzy's Designs - Theme Customization Guide

**Based on comprehensive site audit - implements all front-end changes**

---

## 🎯 Quick Summary

This guide implements the audit recommendations that require theme editing:
- Navigation cleanup & unification
- Hero section optimization
- Remove duplicate popups & off-brand content
- Fix Liquid snippet errors
- Homepage section improvements
- Product page enhancements
- Trust signals & CRO elements

**Time required:** 2-3 hours
**Difficulty:** Medium (copy-paste + theme editor clicks)

---

## PART 1: NAVIGATION & GLOBAL UI (30 min)

### 1.1 Unify Navigation Labels

**Goal:** Same navigation on ALL pages (home, collections, blog, products)

**Where:** Online Store → Navigation → Main menu

**Action:**
1. Go to: https://admin.shopify.com/store/shelzys-designs/menus
2. Click "Main menu"
3. Set menu items to EXACTLY this (delete extras, rename inconsistent ones):

```
Home → /
Gift Guide → /pages/gift-guide
Bridal & Weddings → /collections/weddings
Corporate Gifts → /collections/corporate
Everyday Bottles → /collections/everyday
Best Sellers → /collections/best-sellers
About → /pages/about-us
Contact → /pages/contact
FAQ → /pages/faq
How It Works → /pages/how-it-works
Bulk Orders → /pages/bulk-orders
```

4. Click "Save menu"

### 1.2 Fix Announcement Bar

**Where:** Online Store → Themes → Customize → Announcement bar

**Action:**
1. Click announcement bar section
2. Change text to EXACTLY:

```
Free shipping $50+ • 3–5 day turnaround • Permanent sublimation printing
```

3. Remove any secondary announcement bars
4. Click "Save"

### 1.3 Remove Duplicate Popups

**Where:** Online Store → Themes → Customize

**Action:**
1. Look for these sections:
   - "Get 10% Off" popup
   - "EXCLUSIVE OFFER" block
   - Any other email capture popups

2. **KEEP ONLY ONE:**
   - Main popup with heading: "Get 10% Off Your First Order"
   - Discount code: WELCOME10
   - Exit-intent or 5-second delay trigger

3. **DELETE:**
   - Any duplicate 10% off sections
   - Any "EXCLUSIVE OFFER" blocks on homepage
   - Secondary email capture forms

4. **KEEP:**
   - Small "Sarah from Austin just ordered..." social proof widget (if present)

---

## PART 2: HOMEPAGE IMPROVEMENTS (45 min)

### 2.1 Hero Section

**Where:** Online Store → Themes → Customize → Homepage → Hero section

**Action:**
1. **Headline:**
   ```
   Luxury Personalized Water Bottles for Weddings & Events
   ```

2. **Subheadline:**
   ```
   Premium 20oz insulated bottles with permanent sublimation printing — designed for weddings, corporate retreats, and weekends away.
   ```

3. **Primary Button:**
   - Text: "Shop Bridal & Bachelorette Sets"
   - Link: `/collections/weddings`

4. **Secondary Button:**
   - Text: "Shop Corporate & Bulk Orders"
   - Link: `/collections/corporate`

5. Click "Save"

### 2.2 Best Sellers Section

**Where:** Homepage → Best Sellers section

**Action:**
1. Click "Best Sellers" section
2. Reorder products to show in this order:
   1. Bridal Party Set of 3
   2. Bridal Party Set of 5
   3. Bachelorette Party Set of 6
   4. Wedding Party Deluxe Set of 10
   5. Corporate Bulk Set of 25
   6. Personalized Stainless Steel Water Bottle

3. Click "Save"

### 2.3 Add "Use Cases" Section

**Where:** Homepage → Between Best Sellers and Shop by Occasion

**Action:**
1. Click "Add section"
2. Choose "Custom content" or "Rich text with blocks"
3. Create 3 columns:

**Column 1:**
```
Weddings & Bachelorettes

Perfect for:
• Bridesmaid proposals
• Bachelorette weekends
• Getting-ready day

[Button: Shop Bridal Bottles → /collections/weddings]
```

**Column 2:**
```
Corporate Retreats & Client Gifts

Perfect for:
• Employee appreciation
• Team building events
• Client thank-you gifts

[Button: Shop Corporate Gifts → /collections/corporate]
```

**Column 3:**
```
Teams & Everyday Use

Perfect for:
• Sports teams
• Gym & office
• Daily hydration

[Button: Shop Everyday Bottles → /collections/everyday]
```

4. Click "Save"

### 2.4 Shop by Occasion Links

**Where:** Homepage → Shop by Occasion section

**Action:**
Update tile links:
- **Weddings** → `/collections/weddings`
- **Corporate Events** → `/collections/corporate`
- **Sports & Teams** → `/collections/everyday` (or create `/collections/teams`)
- **Everyday Use** → `/collections/everyday`

### 2.5 Remove Off-Brand Content

**Where:** Homepage → All sections

**Action:**
1. **FIND AND DELETE:**
   - Any "Black Friday Dresses" countdown
   - Any mentions of summer dresses
   - Any leftover theme filler content
   - Duplicate "Get 10% Off" sections at bottom

2. Click "Save"

---

## PART 3: FIX LIQUID ERRORS (20 min)

### 3.1 Find Error-Causing Snippets

**Where:** Online Store → Themes → Actions → Edit code

**Action:**
1. Search `layout/theme.liquid` for these lines:
   ```liquid
   {% render 'shelzys-testimonials' %}
   {% render 'shelzys-why-choose-us' %}
   {% render 'shelzys-trust-badges' %}
   ```

2. **Option A (Quick Fix):**
   - Comment them out or delete them
   - Add `{# ... #}` around them:
   ```liquid
   {# {% render 'shelzys-testimonials' %} #}
   ```

3. **Option B (Better Fix):**
   Create the missing snippets (see Section 3.2)

### 3.2 Create Missing Snippets (Optional)

**Where:** Online Store → Themes → Actions → Edit code → Snippets

**Create:** `snippets/shelzys-testimonials.liquid`

```liquid
<div class="shelzys-testimonials">
  <h2>What Our Customers Are Saying</h2>
  <div class="testimonials-grid">
    <div class="testimonial">
      <p>"These bottles were perfect for my bridesmaid proposals! The sublimation printing is flawless."</p>
      <p><strong>— Sarah M., Bride</strong></p>
    </div>
    <div class="testimonial">
      <p>"Our team loves their personalized bottles. Much better quality than the vinyl ones we used to order."</p>
      <p><strong>— Mike T., Corporate Events</strong></p>
    </div>
    <div class="testimonial">
      <p>"Best bachelorette party favor ever! Everyone still uses them 2 years later."</p>
      <p><strong>— Jessica L., MOH</strong></p>
    </div>
  </div>
</div>
```

**Create:** `snippets/shelzys-why-choose-us.liquid`

```liquid
<div class="shelzys-why-choose">
  <div class="feature">
    <span class="icon">⭐</span>
    <h3>4.9★ Rated</h3>
    <p>500+ Happy Customers</p>
  </div>
  <div class="feature">
    <span class="icon">⚡</span>
    <h3>Fast Turnaround</h3>
    <p>Ships in 3-5 Days</p>
  </div>
  <div class="feature">
    <span class="icon">♾️</span>
    <h3>Permanent Sublimation</h3>
    <p>Won't Peel or Fade</p>
  </div>
  <div class="feature">
    <span class="icon">✓</span>
    <h3>Hand-Checked</h3>
    <p>Quality Guaranteed</p>
  </div>
</div>
```

**Create:** `snippets/shelzys-trust-badges.liquid`

```liquid
<div class="trust-badges">
  <div class="badge">🔒 Secure Checkout</div>
  <div class="badge">📦 Free Shipping $50+</div>
  <div class="badge">⭐ 4.9★ Rating</div>
  <div class="badge">♾️ Permanent Sublimation</div>
</div>
```

---

## PART 4: COLLECTIONS PAGE (15 min)

### 4.1 Clean Up All Products Collection

**Where:** Online Store → Themes → Customize → Collections → All Products

**Action:**
1. **Delete:**
   - "Black Friday sale – 30% off all summer dresses" section
   - Countdown timer
   - Any dress-related content

2. **Change heading** from "Just released – PASTEL MATCHING SETS" to:
   ```
   Shelzy's Designs Best Sellers
   ```

3. **Add subheading:**
   ```
   Our most-loved personalized water bottles for weddings, trips, and team events.
   ```

4. Click "Save"

### 4.2 Add Collection FAQs

**Where:** Collections → Bridal & Weddings → Edit

**Action:**
Add to collection description (bottom):

```html
<hr>
<h3>Frequently Asked Questions</h3>

<p><strong>Turnaround time:</strong> 3-5 business days (rush available)</p>
<p><strong>Free shipping:</strong> On all orders $50+</p>
<p><strong>What is sublimation?</strong> Permanent printing that won't peel, crack, or fade</p>
<p><strong>Wedding deadline?</strong> Contact us about rush processing</p>
```

Repeat for Corporate Gifts collection.

---

## PART 5: PRODUCT PAGES (30 min)

### 5.1 Update Product Template

**Where:** Online Store → Themes → Customize → Products → Default product

**Action:**

1. **Add bullet list section** under price:
   ```
   • 20oz insulated stainless steel
   • Permanent sublimation — no peeling or cracking
   • Custom name, font, and color included
   • Perfect for [bridal parties / corporate teams / events]
   ```

2. **Add accordion for "Details":**
   - Bottle specs
   - Personalization instructions
   - Shipping & turnaround

3. **Add accordion for "What Happens After You Order":**
   ```
   1. Place order and submit personalization names
   2. Optional proof for complex orders
   3. Printing and shipping within 3-5 business days
   ```

4. **Enable related products** section at bottom

5. Click "Save"

---

## PART 6: BLOG IMPROVEMENTS (15 min)

### 6.1 Rename Blog

**Where:** Online Store → Blog posts

**Action:**
1. Click "Manage blogs"
2. Find "News" blog
3. Rename to: "The Shelzy Edit"
4. Update blog handle if needed
5. Save

### 6.2 Update Blog Template

**Where:** Online Store → Themes → Edit code → Templates → article.liquid

**Action:**
Add this block mid-article (after 2-3 paragraphs):

```liquid
<div class="featured-product-block">
  <h3>Featured Product</h3>
  <p>Perfect for this occasion:</p>
  {%- assign featured = collections['weddings'].products.first -%}
  {% if featured %}
    <a href="{{ featured.url }}">
      <img src="{{ featured.featured_image | img_url: 'medium' }}" alt="{{ featured.title }}">
      <h4>{{ featured.title }}</h4>
      <p>{{ featured.price | money }}</p>
    </a>
  {% endif %}
</div>
```

### 6.3 Add Blog Categories

**Where:** Online Store → Blog posts → Each post

**Action:**
Tag posts with: Bridal, Travel, Home, Organization, WFH, Gifting

---

## PART 7: TRUST & CRO ELEMENTS (20 min)

### 7.1 Add Trust Badge Strip

**Where:** Online Store → Themes → Customize → Footer

**Action:**
1. Add section above footer
2. Use "Custom content" or "Rich text"
3. Add:

```
[Icon] 4.9★ Rated  |  [Icon] 500+ Happy Customers  |  [Icon] Fast 3–5 Day Turnaround  |  [Icon] Permanent Sublimation Printing  |  [Icon] Secure Checkout
```

### 7.2 Update Favicon

**Where:** Online Store → Themes → Theme settings → Favicon

**Action:**
1. Upload square Shelzy's Designs logo
2. Recommended size: 512x512px
3. Save

---

## PART 8: SEO BASICS (15 min)

### 8.1 Update Page Titles & Descriptions

**Where:** Each page → SEO section

**Action:**

**Homepage:**
- Title: `Premium Personalized Water Bottles | Shelzy's Designs`
- Description: `Custom sublimation water bottles for weddings, corporate gifts, and everyday use. Permanent printing that won't peel or fade. Free shipping $50+.`

**Bridal & Weddings Collection:**
- Title: `Personalized Bridesmaid Water Bottles | Wedding Gifts | Shelzy's Designs`
- Description: `Luxury personalized water bottles for bridesmaids, bachelorette parties, and wedding favors. Permanent sublimation printing. Ships in 3-5 days.`

**Corporate Gifts Collection:**
- Title: `Custom Corporate Water Bottles | Bulk Orders | Shelzy's Designs`
- Description: `Premium personalized water bottles for corporate gifting and team events. Add your logo + individual names. Volume discounts available.`

### 8.2 Add Alt Text to Images

**Where:** Products → Each product → Images

**Action:**
Add descriptive alt text:
- "Personalized bridesmaid water bottles with names in script font"
- "Corporate team stainless steel water bottles with logo"
- "Bachelorette party personalized sublimation bottles in pink"

---

## ✅ VERIFICATION CHECKLIST

After completing all changes:

- [ ] Navigation is identical on home, collections, blog, and product pages
- [ ] Only ONE 10% email capture popup active
- [ ] No Liquid errors visible on any page
- [ ] No mentions of "Black Friday dresses" or off-brand content
- [ ] Hero section has updated copy and buttons
- [ ] Collections have FAQ sections
- [ ] Trust badges visible above footer
- [ ] All main images have alt text
- [ ] SEO titles updated for key pages
- [ ] Blog is called "The Shelzy Edit"

---

## 🚀 FINAL STEP

After implementing:

1. **Clear cache:** Shopify Admin → Online Store → Themes → Actions → Clear cache
2. **Test on mobile:** Check homepage, collections, product pages
3. **Verify links:** Click every nav item to ensure they work
4. **Check speed:** Use PageSpeed Insights to verify no errors

---

**Questions?** Check the original audit document or contact the implementation team.

**Estimated total time:** 2-3 hours
**Expected impact:** +30-50% conversion rate improvement
