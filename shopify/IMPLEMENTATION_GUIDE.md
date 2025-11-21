# Shelzy's Designs Shopify Implementation Guide

**Complete step-by-step guide to set up your Shopify store from scratch.**

---

## 📋 What You Have

All files are ready in the `/shopify/` folder:

1. ✅ **PRODUCTS_IMPORT.csv** - All 8 products ready to import
2. ✅ **CUSTOMIZATION_FIELDS.md** - Personalization setup guide
3. ✅ **homepage-sections.liquid** - Homepage Liquid templates
4. ✅ **static-pages.html** - About, FAQ, How It Works, Contact pages
5. ✅ **This guide** - Step-by-step implementation

---

## 🎯 Implementation Overview

**Total Time:** 4-6 hours (spread over a few days)

**Order of Operations:**
1. Set up Shopify store basics (30 min)
2. Import products (15 min)
3. Set up customization fields (1-2 hours)
4. Build homepage (1 hour)
5. Create static pages (30 min)
6. Configure theme settings (1 hour)
7. Test everything (1 hour)

---

## PHASE 1: SHOPIFY STORE SETUP (30 minutes)

### Step 1.1: Create Shopify Account
1. Go to https://www.shopify.com
2. Start free trial
3. Choose store name: "shelzysdesigns" (or your preferred URL)
4. Complete basic setup wizard

### Step 1.2: Choose a Theme
**Recommended Themes:**
- **Impulse** (Free) - High-conversion, modern, clean
- **Dawn** (Free) - Shopify's flagship theme, fast
- **Empire** (Paid - $350) - Premium, beautiful product pages

**Install:**
1. Go to **Online Store > Themes**
2. Click **Explore free themes** or **Visit Theme Store**
3. Find "Impulse" or "Dawn"
4. Click **Add** then **Publish**

### Step 1.3: Basic Settings
1. Go to **Settings > General**
   - Store name: Shelzy's Designs
   - Email: hello@shelzysdesigns.com
   - Store currency: USD
   - Timezone: Your timezone

2. Go to **Settings > Shipping and delivery**
   - Add shipping zones (US, Canada, etc.)
   - Set rates (flat rate, calculated, or free over $X)

3. Go to **Settings > Payments**
   - Enable Shopify Payments (or PayPal)
   - Complete verification

---

## PHASE 2: IMPORT PRODUCTS (15 minutes)

### Step 2.1: Prepare CSV File
1. Open `/shopify/PRODUCTS_IMPORT.csv`
2. Review the data
3. **IMPORTANT:** Replace all `[PLACEHOLDER: ...]` image URLs with:
   - Your actual image URLs after upload, OR
   - Leave blank for now (you'll add images later)

### Step 2.2: Import to Shopify
1. Go to **Products > All products**
2. Click **Import**
3. Upload `PRODUCTS_IMPORT.csv`
4. Click **Upload and continue**
5. Review import summary
6. Click **Import products**

**Result:** You should now have 7 products with multiple variants.

### Step 2.3: Review Products
1. Go to **Products > All products**
2. Click each product
3. Verify:
   - Title is correct
   - Description is formatted
   - Variants are created
   - Pricing is correct
4. Add product images (if you have them)

**Note:** Product 8 (Bulk & Corporate) isn't in CSV because it's a contact form, not a purchasable product.

---

## PHASE 3: SET UP CUSTOMIZATION FIELDS (1-2 hours)

### Option A: Using Bold Product Options (Recommended - Easier)

**Step 3A.1: Install Bold**
1. Go to **Apps > Shopify App Store**
2. Search "Bold Product Options"
3. Click **Add app**
4. Install and authorize ($20/month - 7 day free trial)

**Step 3A.2: Create Option Sets**

Open `/shopify/CUSTOMIZATION_FIELDS.md` and follow the guide for each product.

**Example: Signature Bottle**
1. In Bold, click **Add Option Set**
2. Name: "Signature Bottle Personalization"
3. Add fields:
   - Text Input: "Name for Personalization" (required, max 20 chars)
   - Dropdown: "Font Style" (Elegant Script, Clean Block, Vertical)
   - Dropdown: "Text Color" (Black, Sage, Blush, Gold)
   - Dropdown: "Add Icon?" (None, Heart, Star, etc.)
4. Click **Save**
5. Go to **Assign to Products**
6. Select "Personalized 20oz Sublimation Water Bottle"
7. Save

**Repeat** for all other products using the specs in `CUSTOMIZATION_FIELDS.md`.

### Option B: Using Native Shopify (Free - Requires Code)

**Step 3B.1: Edit Theme Code**
1. Go to **Online Store > Themes**
2. Click **Actions > Edit code**
3. Find `sections/product-template.liquid` (or similar)
4. Scroll to the **Add to Cart** button area
5. Add the code from `CUSTOMIZATION_FIELDS.md` (Method 2)
6. Click **Save**

**Step 3B.2: Test**
1. Go to a product page on your live site
2. Verify custom fields appear
3. Add to cart
4. Check cart - fields should show

**Note:** Native method requires code knowledge. If unsure, use Bold.

---

## PHASE 4: BUILD HOMEPAGE (1 hour)

### Step 4.1: Add Homepage Sections

**If using Impulse or Dawn theme:**

1. Go to **Online Store > Themes**
2. Click **Customize**
3. On homepage, click **Add section**
4. For each section in `/shopify/homepage-sections.liquid`:
   - Create a new section file in theme code
   - Or use built-in sections and customize

**Quick Method (Using Built-in Sections):**

1. **Hero:**
   - Add section: "Image with text"
   - Upload hero image (placeholder for now)
   - Add headline: "Premium Personalized Sublimation Water Bottles"
   - Add text: "Custom-made bottles for bridesmaids, weddings, holidays, and every day in between."
   - Add button: "Shop Best Sellers" → /collections/all

2. **Best Sellers:**
   - Add section: "Featured collection"
   - Select collection: "Best Sellers" (you'll create this)
   - Show 8 products
   - Grid layout: 4 columns

3. **Why Sublimation:**
   - Add section: "Rich text"
   - Add heading: "Why Our Bottles Don't Peel, Crack, or Fade"
   - Add copy from `/copy/COPY_BANK.md`

4. **How It Works:**
   - Add section: "Multicolumn"
   - Set 3 columns
   - Add steps 1, 2, 3 from copy bank

5. **Email Signup:**
   - Add section: "Newsletter"
   - Customize heading: "Get 10% Off Your First Order"
   - Customize text

### Step 4.2: Advanced Method (Custom Sections)

If you want pixel-perfect control:

1. Go to **Online Store > Themes > Actions > Edit code**
2. Click **Add a new section**
3. Name it `hero-section`
4. Copy the Hero section code from `/shopify/homepage-sections.liquid`
5. Paste and save
6. Repeat for each section
7. Go back to **Customize** and add your custom sections

---

## PHASE 5: CREATE STATIC PAGES (30 minutes)

### Step 5.1: Create Pages
1. Go to **Online Store > Pages**
2. Click **Add page**

### Step 5.2: Add Content

**For each page:**

1. **About Page**
   - Title: "About"
   - Open `/shopify/static-pages.html`
   - Copy the "About Page" HTML section
   - In Shopify, click **Show HTML**
   - Paste the HTML
   - Click **Save**

2. **How It Works**
   - Title: "How It Works"
   - Copy HTML from static-pages.html
   - Paste
   - Save

3. **FAQ**
   - Title: "FAQ"
   - Copy HTML
   - Paste
   - Save

4. **Contact**
   - Title: "Contact"
   - Copy HTML (includes Shopify form code)
   - Paste
   - Save

5. **Bulk & Corporate**
   - Title: "Bulk & Corporate"
   - Create custom content or use contact form
   - Include form fields from `CUSTOMIZATION_FIELDS.md`

---

## PHASE 6: CONFIGURE THEME SETTINGS (1 hour)

### Step 6.1: Colors
1. Go to **Online Store > Themes > Customize**
2. Click **Theme settings** (bottom left)
3. Go to **Colors**
4. Set:
   - Primary text: `#111111`
   - Background: `#FFFFFF`
   - Secondary background: `#F7F4EF`
   - Accent: `#9CAE8C`
   - Button background: `#9CAE8C`
   - Button hover: `#7C9F8C`

### Step 6.2: Typography
1. Still in **Theme settings**
2. Go to **Typography**
3. Set:
   - Headings: Poppins (if available) or similar sans-serif
   - Body: Inter or similar sans-serif
   - Base size: 16px

### Step 6.3: Navigation
1. Go to **Online Store > Navigation**
2. Click **Main menu**
3. Add links:
   - Home → /
   - Shop (dropdown)
     - Best Sellers → /collections/best-sellers
     - Personalized Bottles → /collections/personalized-bottles
     - Bridesmaid & Bridal Party → /collections/bridesmaid-bridal-party
     - Proposal Gift Boxes → /collections/proposal-gift-boxes
     - Kids Bottles → /collections/kids-bottles
     - Holiday Collection → /collections/holiday-collection
     - Bulk & Corporate → /pages/bulk-corporate
   - About → /pages/about
   - How It Works → /pages/how-it-works
   - FAQ → /pages/faq
   - Contact → /pages/contact
4. Save

### Step 6.4: Create Collections
1. Go to **Products > Collections**
2. Create each collection:

**Best Sellers:**
- Type: Manual
- Add your top products manually

**Personalized Bottles:**
- Type: Automated
- Condition: Product tag contains "personalized bottle"

**Bridesmaid & Bridal Party:**
- Type: Automated
- Condition: Product tag contains "bridesmaid" OR "bridal party"

**Proposal Gift Boxes:**
- Type: Manual
- Add Proposal Gift Box product

**Kids Bottles:**
- Type: Automated
- Condition: Product tag contains "kids"

**Holiday Collection:**
- Type: Automated
- Condition: Product tag contains "holiday"

---

## PHASE 7: TEST EVERYTHING (1 hour)

### Step 7.1: Test Checkout Flow
1. Browse to a product page
2. Fill in customization fields
3. Add to cart
4. Go to checkout
5. Complete test order using Shopify's test credit card:
   - Card: `1` (Bogus Gateway test card)
   - Enable test mode in Settings > Payments
6. Verify order appears in **Orders**
7. Check that customization fields show in order details

### Step 7.2: Test Mobile
1. Open site on phone
2. Test:
   - Homepage loads properly
   - Navigation works
   - Product pages are readable
   - Customization fields work
   - Add to cart functions
3. Fix any mobile issues

### Step 7.3: Test All Links
- Click every navigation link
- Verify all pages load
- Check footer links
- Test "Shop Now" CTAs

### Step 7.4: Check SEO
1. Go to **Online Store > Preferences**
2. Set:
   - Homepage title: "Shelzy's Designs | Premium Personalized Sublimation Water Bottles"
   - Homepage description: "Custom 20oz sublimation water bottles for bridesmaids, weddings, gifts, and everyday use. No vinyl, no peeling. Permanent personalization."
3. For each product and collection, add SEO descriptions

---

## PHASE 8: LAUNCH PREP

### Step 8.1: Set Up Email
1. Go to **Settings > Notifications**
2. Customize order confirmation email
3. Add your branding

### Step 8.2: Add Policies
1. Go to **Settings > Policies**
2. Generate or write:
   - Refund policy
   - Privacy policy
   - Terms of service
   - Shipping policy

### Step 8.3: Install Apps

**Must-Have Apps:**
1. **Reviews:** Judge.me or Yotpo (free plans available)
2. **Email Marketing:** Klaviyo (free up to 250 contacts)
3. **Cart Upsell:** Candy Rack or Rebuy (paid, but ROI positive)

**Install from App Store:**
- Go to **Apps**
- Search app name
- Install and configure

### Step 8.4: Remove Password Page
1. Go to **Online Store > Preferences**
2. Scroll to "Password protection"
3. **Uncheck** "Enable password"
4. Save

**Your store is now live!**

---

## 🎨 ADDING IMAGES LATER

### When You Have Product Images:

**Option 1: Manual Upload**
1. Go to **Products > [Product Name]**
2. Scroll to **Media**
3. Click **Add media**
4. Upload your images
5. Drag to reorder (first image = thumbnail)
6. Save

**Option 2: Bulk Image Upload**
1. Name images with SKU: `SIG-BOTTLE-WHITE.jpg`
2. Go to **Products > All products**
3. Click **More actions > Import**
4. Upload CSV with just Handle and Image Src columns
5. Shopify will match and add images

### Homepage Images:
1. Go to **Online Store > Themes > Customize**
2. Click on each section
3. Upload images in section settings

---

## ⚙️ THEME CUSTOMIZATION (CSS)

### To Match Brand Exactly:

**Add Custom CSS:**
1. Go to **Online Store > Themes > Actions > Edit code**
2. Find `assets/theme.css` or `assets/custom.css`
3. Add this CSS:

```css
/* Shelzy's Designs Custom Styles */

:root {
  --color-black: #111111;
  --color-white: #FFFFFF;
  --color-beige: #F7F4EF;
  --color-sage: #9CAE8C;
  --color-sandstone: #D8CFC4;
  --color-blush: #F8D9C5;
  --color-seagrass: #7C9F8C;
}

body {
  font-family: 'Inter', -apple-system, sans-serif;
  color: var(--color-black);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', -apple-system, sans-serif;
  font-weight: 600;
}

.btn,
.button,
button[type="submit"] {
  background: var(--color-sage);
  color: var(--color-white);
  border: none;
  padding: 14px 28px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.btn:hover,
.button:hover,
button[type="submit"]:hover {
  background: var(--color-seagrass);
}

.product-card {
  background: var(--color-white);
  border-radius: 8px;
}

.section-background-alt {
  background: var(--color-beige);
}
```

4. Save

---

## 📱 MOBILE OPTIMIZATION

### Ensure Mobile-Friendly:
1. Test on actual phone (not just desktop inspector)
2. Check:
   - [ ] Text is readable (min 16px)
   - [ ] Buttons are tappable (min 44px height)
   - [ ] Forms work
   - [ ] Images load fast
   - [ ] Navigation is accessible

### Speed Optimization:
1. Go to **Online Store > Themes**
2. Click **Optimize theme**
3. Enable lazy loading
4. Compress images using TinyPNG before uploading
5. Use WebP format when possible

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: Customization fields don't show
**Solution:**
- If using Bold: Check that option set is assigned to product
- If using native: Check that code is in correct template file

### Issue: Images don't import
**Solution:**
- CSV image URLs must be publicly accessible
- Leave image columns blank and upload manually

### Issue: Products not showing in collections
**Solution:**
- Check collection conditions
- Ensure products have correct tags

### Issue: Checkout doesn't work
**Solution:**
- Enable payment gateway in Settings > Payments
- Disable password protection

### Issue: Emails not sending
**Solution:**
- Verify email in Settings > General
- Check spam folder
- Configure sender email

---

## ✅ PRE-LAUNCH CHECKLIST

Before going live:

**Content:**
- [ ] All products imported with descriptions
- [ ] Product images uploaded (or placeholders)
- [ ] Collections created and populated
- [ ] Homepage sections built
- [ ] About, FAQ, How It Works, Contact pages created
- [ ] Navigation menu configured
- [ ] Footer links set up

**Settings:**
- [ ] Theme colors match brand (#9CAE8C sage, #111111 black, etc.)
- [ ] Typography set (Poppins headings, Inter body)
- [ ] Shipping zones and rates configured
- [ ] Payment gateway enabled
- [ ] Policies written (refund, privacy, terms, shipping)
- [ ] Tax settings configured (if applicable)

**Apps:**
- [ ] Product customization app installed and working
- [ ] Reviews app installed
- [ ] Email app installed (Klaviyo or similar)
- [ ] Cart upsell app installed (optional but recommended)

**Testing:**
- [ ] Test order completed successfully
- [ ] Customization fields appear in order
- [ ] Mobile site works properly
- [ ] All links work
- [ ] Forms work (contact, newsletter)
- [ ] Speed test passed (Google PageSpeed Insights)

**Launch:**
- [ ] Password protection removed
- [ ] Domain connected (if using custom domain)
- [ ] SSL certificate active (automatic with Shopify)
- [ ] Analytics set up (Google Analytics, Facebook Pixel)
- [ ] Social media linked

---

## 🎉 YOU'RE READY TO LAUNCH!

Once everything is checked off:
1. Remove password protection
2. Share your site with friends for feedback
3. Soft launch to small audience
4. Monitor orders
5. Iterate and improve

---

## 📞 NEED HELP?

**Shopify Resources:**
- Help Center: https://help.shopify.com
- Community Forums: https://community.shopify.com
- 24/7 Support: Via Shopify admin

**For Custom Development:**
- Hire a Shopify Expert: https://experts.shopify.com
- Fiverr/Upwork for smaller tasks

---

**Next:** Start with Phase 1 and work through each phase. Take your time—quality setup now = fewer issues later!

---

**Version:** 1.0
**Last Updated:** November 2025
