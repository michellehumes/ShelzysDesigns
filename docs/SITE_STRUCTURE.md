# Shelzy's Designs Site Structure & Navigation

**Complete site architecture, page hierarchy, and UX specifications.**

---

## MAIN NAVIGATION

```
┌─────────────────────────────────────────────────────┐
│  LOGO    Home    Shop ▼    About    How It Works    │
│                             FAQ    Contact           │
└─────────────────────────────────────────────────────┘
```

### Navigation Items

1. **Home** → `/`
2. **Shop** (dropdown) → `/collections/all`
   - Best Sellers → `/collections/best-sellers`
   - Personalized Bottles → `/collections/personalized-bottles`
   - Bridesmaid & Bridal Party → `/collections/bridesmaid-bridal-party`
   - Proposal Gift Boxes → `/collections/proposal-gift-boxes`
   - Kids Bottles → `/collections/kids-bottles`
   - Holiday Collection → `/collections/holiday-collection`
   - Bulk & Corporate → `/pages/bulk-corporate`
3. **About** → `/pages/about`
4. **How It Works** → `/pages/how-it-works`
5. **FAQ** → `/pages/faq`
6. **Contact** → `/pages/contact`

### Mobile Navigation
- Hamburger menu (top right)
- Same structure, stacked vertically
- "Shop" expands to show sub-categories

---

## HOMEPAGE STRUCTURE

```
┌──────────────────────────────────────────┐
│           NAVIGATION BAR                 │
├──────────────────────────────────────────┤
│                                          │
│         HERO SECTION                     │
│   [Large hero image + headline + CTA]   │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│      BEST SELLERS SECTION               │
│   [Product grid/carousel - 4-8 items]   │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   BRIDAL & BRIDESMAID HIGHLIGHT         │
│   [Image left | Copy right + CTA]       │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│    PROPOSAL GIFT BOX FEATURE            │
│   [Image right | Copy left + CTA]       │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│      WHY SUBLIMATION SECTION            │
│   [Icon/image + 5 bullets + CTA]        │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│       HOW IT WORKS SECTION              │
│   [3 columns: Step 1, 2, 3]             │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│         REVIEWS SECTION                 │
│   [Star ratings + testimonials]         │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     ABOUT SHELZY'S TEASER               │
│   [Short story + link to About page]    │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│       EMAIL SIGNUP SECTION              │
│   [10% off first order]                 │
│                                          │
├──────────────────────────────────────────┤
│              FOOTER                      │
└──────────────────────────────────────────┘
```

### Section Details

#### 1. Hero Section
**Layout:** Full-width background image with overlay text
**Content:**
- Headline: "Premium Personalized Sublimation Water Bottles"
- Subheadline: "Custom-made bottles for bridesmaids, weddings, holidays, and every day in between."
- CTA Button: "Shop Best Sellers"
**Image:** Hero product shot (white or sage bottle with elegant personalization)
**Background:** Brushed beige or white
**Height:** 600-800px desktop, 500px mobile

---

#### 2. Best Sellers Section
**Layout:** Grid (4 columns desktop, 2 columns tablet, 1-2 mobile) OR carousel
**Content:**
- Section Title: "Best Sellers"
- Optional Subheadline: "Our most-loved personalized bottles"
- 4-8 product cards showing:
  - Product image
  - Product name
  - Price
  - "Quick View" or "Shop Now" CTA
**Products Featured:**
1. Signature Personalized Bottle
2. Bridesmaid Proposal Bottle
3. Bridesmaid Proposal Gift Box
4. Bridal Party Bottle Set
5. Everyday Custom Bottle
6. Kids Bottle
7. Holiday Bottle (seasonal)

**CTA:** "View All Products" button linking to `/collections/all`

---

#### 3. Bridal & Bridesmaid Highlight
**Layout:** Two-column split (image left, copy right)
**Image:** Bridesmaid proposal box or bridal suite scene
**Copy:**
- Headline: "Bridesmaid & Bridal Party Gifts"
- Body: Short paragraph (3-4 sentences) about personalized bridal gifts
- CTA Button: "Shop Bridal Collection" → `/collections/bridesmaid-bridal-party`
**Background:** White or subtle beige
**Padding:** Generous whitespace

---

#### 4. Proposal Gift Box Feature
**Layout:** Two-column split (image right, copy left) - reversed from section 3
**Image:** Open proposal gift box (hero shot)
**Copy:**
- Headline: "The Ultimate Bridesmaid Proposal"
- Body: Short paragraph about the unboxing experience
- CTA Button: "Shop Proposal Boxes" → `/collections/proposal-gift-boxes`
**Background:** Brushed beige (#F7F4EF)

---

#### 5. Why Sublimation Section
**Layout:** Centered text with icon/graphic + bullet points
**Content:**
- Section Title: "Why Our Bottles Don't Peel, Crack, or Fade"
- Short paragraph explaining sublimation vs. vinyl
- 5 bullet points:
  - No raised edges
  - No peeling
  - No cracking
  - No fading
  - Smooth, permanent finish
- Optional graphic: Before/after or process illustration
**Background:** White
**CTA:** "Learn More About Our Process" → `/pages/how-it-works`

---

#### 6. How It Works Section
**Layout:** 3 equal columns (stack on mobile)
**Content:**
Each column contains:
- Step number (1, 2, 3)
- Icon or small graphic
- Step title
- Short description (2-3 sentences)

**Step 1:** Choose Your Bottle
**Step 2:** Add Your Personalization
**Step 3:** We Sublimate, Pack, and Ship

**Background:** Brushed beige (#F7F4EF)
**CTA:** "See Full Process" → `/pages/how-it-works`

---

#### 7. Reviews Section
**Layout:** Carousel or grid of review cards
**Content:**
- Section Title: "What Our Customers Are Saying"
- 3-6 customer reviews (via Judge.me or Yotpo app)
- Each review shows:
  - Star rating
  - Review text
  - Customer name + photo (optional)
**Background:** White
**Integration:** Reviews app widget

---

#### 8. About Shelzy's Teaser
**Layout:** Centered text block with optional small image
**Content:**
- Section Title: "Made With Care, One Bottle at a Time"
- Short paragraph (4-5 sentences) - use copy from copy bank
- CTA Link: "Learn More About Us" → `/pages/about`
**Background:** White or beige

---

#### 9. Email Signup Section
**Layout:** Centered form with headline
**Content:**
- Headline: "Get 10% Off Your First Order"
- Subheadline: "Join our email list for exclusive offers, new designs, and hydration inspiration."
- Email input field
- Submit button: "Sign Me Up"
**Background:** Sage green (#9CAE8C) with white text
**Integration:** Klaviyo or Shopify email app

---

## COLLECTION PAGES

### Layout Structure

```
┌──────────────────────────────────────────┐
│           NAVIGATION BAR                 │
├──────────────────────────────────────────┤
│                                          │
│      COLLECTION BANNER                   │
│   [Title + Description]                  │
│                                          │
├──────────────────────────────────────────┤
│  FILTERS     │      PRODUCT GRID         │
│  (sidebar)   │   [2-4 columns]           │
│              │                           │
│  - Color     │   [Product cards...]      │
│  - Style     │                           │
│  - Use       │                           │
│              │                           │
└──────────────────────────────────────────┘
```

### Collection Banner
**Content:**
- Collection title (H1)
- Short description (2-3 sentences) - use copy from copy bank
- Optional: Collection-specific image

**Background:** Brushed beige or white

### Filters (Sidebar or Top Bar)

**Filter Options:**

1. **Color**
   - All Colors
   - White
   - Sage Green
   - Blush Pink
   - Matte Black

2. **Style** (Personalization)
   - All Styles
   - Script Name
   - Block Name
   - Name + Icon
   - Vertical Name

3. **Use Case**
   - All
   - Wedding/Bridal
   - Everyday
   - Kids
   - Holiday
   - Corporate

4. **Price**
   - All Prices
   - Under $35
   - $35 - $50
   - $50 - $75
   - $75+

### Product Grid
**Layout:** 3-4 columns desktop, 2 columns tablet, 1-2 mobile
**Product Card Contents:**
- Product image (hover shows second image)
- Product name
- Price (or starting price for variants)
- Star rating (if reviews exist)
- "Quick View" button (optional)

---

## PRODUCT PAGES

### Layout Structure

```
┌──────────────────────────────────────────┐
│           NAVIGATION BAR                 │
├──────────────────────────────────────────┤
│                                          │
│   PRODUCT IMAGES  │  PRODUCT INFO        │
│   [Gallery/       │  - Title             │
│    Carousel]      │  - Price             │
│                   │  - Star Reviews      │
│   [Main Image]    │  - Short Description │
│   [Thumbnails]    │                      │
│                   │  CUSTOMIZATION       │
│                   │  - Name Input        │
│                   │  - Font Choice       │
│                   │  - Color Choice      │
│                   │  - Icon (optional)   │
│                   │                      │
│                   │  [Add to Cart]       │
│                   │                      │
│                   │  - Shipping Info     │
│                   │  - Personalization   │
│                   │    Instructions      │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│       PRODUCT DESCRIPTION TABS           │
│   [Description | Shipping | Reviews]    │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│         "PAIRS WELL WITH"                │
│   [Recommended products/upsells]         │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│        CUSTOMER REVIEWS                  │
│   [Review widget from app]               │
│                                          │
└──────────────────────────────────────────┘
```

### Product Image Gallery
**Requirements:**
- 6+ images per product
- Zoomable images
- Carousel or thumbnail navigation
- Mobile swipe-friendly
**Images:**
1. Front-facing product
2. ¾ angle
3. Close-up of personalization
4. Lid detail
5. In-hand scale
6. Lifestyle shot

### Product Info Section

**Elements (in order):**
1. **Breadcrumb:** Home > Shop > Collection Name > Product Name
2. **Product Title (H1)**
3. **Star Rating + Review Count** (linked to reviews section)
4. **Price** (or "From $XX" for variants)
5. **Short Description** (2-3 sentences)
6. **Customization Fields:**
   - Bottle Color (dropdown or swatches)
   - Name for Personalization (text input)
   - Font Style (dropdown: Script, Block, Vertical)
   - Text Color (dropdown: Black, Sage, Blush, Gold)
   - Add Icon? (dropdown: None, Heart, Star, etc.)
7. **Quantity Selector**
8. **Add to Cart Button** (large, prominent, sage green)
9. **Accordion Sections:**
   - Product Details (bullets from product description)
   - Customization Instructions
   - Shipping & Processing
   - Returns & Exchanges

### "Pairs Well With" Section
**Content:**
- Section title: "Complete Your Order" or "Pairs Well With"
- 2-4 recommended products
- Bundle discount if applicable

**Examples:**
- For Bridesmaid Bottle → suggest Proposal Gift Box
- For single bottle → suggest multi-pack
- For Kids Bottle → suggest sibling set

---

## STATIC PAGES

### About Page (`/pages/about`)

**Layout:**
```
┌──────────────────────────────────────────┐
│           NAVIGATION BAR                 │
├──────────────────────────────────────────┤
│                                          │
│         PAGE HEADER                      │
│   "About Shelzy's Designs"              │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   IMAGE        │      STORY COPY         │
│   [Brand       │   "Made With Care..."   │
│    photo or    │                         │
│    bottle      │   [Full copy from       │
│    lifestyle]  │    copy bank]           │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│         "OUR PROCESS"                    │
│   [6 steps with icons/numbers]          │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│    "WHY SUBLIMATION?"                    │
│   [Repeat from homepage or expand]      │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│         CTA SECTION                      │
│   "Ready to create something special?"  │
│   [Shop Now Button]                      │
│                                          │
└──────────────────────────────────────────┘
```

---

### How It Works Page (`/pages/how-it-works`)

**Layout:**
```
┌──────────────────────────────────────────┐
│           NAVIGATION BAR                 │
├──────────────────────────────────────────┤
│                                          │
│         PAGE HEADER                      │
│   "How It Works"                         │
│   [Short intro paragraph]               │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   STEP 1: CHOOSE YOUR BOTTLE            │
│   [Icon + description]                   │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   STEP 2: ADD PERSONALIZATION           │
│   [Icon + description]                   │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   STEP 3: WE SUBLIMATE, PACK, SHIP      │
│   [Icon + description]                   │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     "WHAT IS SUBLIMATION?"              │
│   [Explainer section with visual]       │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     TIMELINE/FAQ                         │
│   "How long will it take?"              │
│   "Can I rush my order?"                │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│         CTA SECTION                      │
│   [Shop Now Button]                      │
│                                          │
└──────────────────────────────────────────┘
```

---

### FAQ Page (`/pages/faq`)

**Layout:**
```
┌──────────────────────────────────────────┐
│           NAVIGATION BAR                 │
├──────────────────────────────────────────┤
│                                          │
│         PAGE HEADER                      │
│   "Frequently Asked Questions"          │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   FAQ CATEGORIES (Jump Links)           │
│   - General Questions                    │
│   - Ordering & Customization            │
│   - Shipping & Delivery                 │
│   - Bulk & Corporate                    │
│   - Returns & Exchanges                 │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   ACCORDION FAQ SECTIONS                │
│   [Each question expandable]            │
│                                          │
│   Q: Is the personalization vinyl?      │
│   A: [Answer from copy bank]            │
│                                          │
│   Q: Will it peel or fade?              │
│   A: [Answer from copy bank]            │
│                                          │
│   [Continue with all FAQs...]           │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     "STILL HAVE QUESTIONS?"             │
│   [Contact Us Button]                    │
│                                          │
└──────────────────────────────────────────┘
```

**UX Notes:**
- Accordion-style (expand/collapse)
- Search bar at top (optional but recommended)
- Jump links to category sections
- Each FAQ has anchor link for direct sharing

---

### Contact Page (`/pages/contact`)

**Layout:**
```
┌──────────────────────────────────────────┐
│           NAVIGATION BAR                 │
├──────────────────────────────────────────┤
│                                          │
│         PAGE HEADER                      │
│   "Contact Us"                           │
│   [Short intro: "We're here to help"]  │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│   CONTACT FORM     │   CONTACT INFO      │
│                    │                     │
│   - Name           │   Email:            │
│   - Email          │   hello@...         │
│   - Subject        │                     │
│   - Message        │   Response Time:    │
│   - Order #        │   1 business day    │
│   [Submit]         │                     │
│                                          │
└──────────────────────────────────────────┘
```

**Form Fields:**
- Name (text, required)
- Email (email, required)
- Subject (dropdown: General Question, Custom Order, Bulk Inquiry, Order Issue, Other)
- Message (textarea, required)
- Order Number (text, optional)
- Submit Button: "Send Message"

**Integration:** Shopify contact form or Klaviyo

---

### Bulk & Corporate Page (`/pages/bulk-corporate`)

**Layout:**
```
┌──────────────────────────────────────────┐
│           NAVIGATION BAR                 │
├──────────────────────────────────────────┤
│                                          │
│         PAGE HEADER                      │
│   "Bulk & Corporate Personalized        │
│    Bottles"                              │
│   [Hero image of corporate bottles]     │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     WHAT'S INCLUDED                      │
│   [Bullet points of offerings]          │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     USE CASES                            │
│   [Icons/examples: Corporate, Events,   │
│    Weddings, Nonprofits]                │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     PRICING TIERS                        │
│   10-24: Standard                        │
│   25-49: 10% off                         │
│   50-99: 15% off                         │
│   100+: 20% off                          │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│     "REQUEST A QUOTE" FORM              │
│   - Full Name                            │
│   - Email                                │
│   - Company Name                         │
│   - Quantity                             │
│   - Details / List of Names             │
│   - Upload Logo (file upload)           │
│   [Submit Quote Request]                │
│                                          │
└──────────────────────────────────────────┘
```

---

## FOOTER

**Layout:** 4-column grid (stack on mobile)

### Column 1: About
- Logo
- Short tagline (1-2 sentences)
- Social media icons (Instagram, Pinterest, Facebook)

### Column 2: Quick Links
- Shop
- About
- How It Works
- FAQ
- Contact
- Bulk & Corporate

### Column 3: Customer Service
- Shipping & Returns
- FAQ
- Contact Us
- Track Your Order
- Privacy Policy
- Terms of Service

### Column 4: Newsletter Signup (Optional)
- "Stay in Touch"
- Email input + submit button
- (Or move to homepage only)

### Bottom Bar
- Copyright: "© 2025 Shelzy's Designs. All rights reserved."
- Payment icons (Visa, Mastercard, AmEx, PayPal, etc.)

---

## CART & CHECKOUT

### Cart Drawer (Slide-out)

**Layout:**
```
┌──────────────────────────────┐
│        YOUR CART       [X]   │
├──────────────────────────────┤
│                              │
│  [Product Image]             │
│  Product Name                │
│  Personalization: Sarah      │
│  $32.00   [Qty: 1] [Remove]  │
│                              │
├──────────────────────────────┤
│                              │
│  💡 UPSELL SUGGESTION        │
│  "Add a Gift Box - Save 15%" │
│  [Add to Cart]               │
│                              │
├──────────────────────────────┤
│                              │
│  Subtotal: $32.00            │
│  [Checkout Button]           │
│  [Continue Shopping]         │
│                              │
└──────────────────────────────┘
```

**Upsell Logic:**
- If single bottle → suggest multi-pack or gift box
- If bridesmaid bottle → suggest upgrade to proposal box
- If 3+ items → suggest bulk discount

---

## MOBILE NAVIGATION & UX

### Mobile Menu
- Hamburger icon (top right)
- Slide-out menu with:
  - Home
  - Shop (expandable)
  - About
  - How It Works
  - FAQ
  - Contact
- Cart icon (top right, separate from hamburger)

### Mobile Product Pages
- Images stack vertically
- Swipeable image carousel
- Sticky "Add to Cart" button at bottom
- Customization fields below images

### Mobile Homepage
- All sections stack vertically
- Hero text overlay may be removed for readability
- Product grids: 2 columns (or 1 for small screens)

---

## SEO & META STRUCTURE

### Homepage
**Meta Title:** `Shelzy's Designs | Premium Personalized Sublimation Water Bottles`
**Meta Description:** `Custom 20oz sublimation water bottles for bridesmaids, weddings, gifts, and everyday use. No vinyl, no peeling. Permanent personalization. Shop now.`

### Collection Pages
**Meta Title:** `[Collection Name] | Shelzy's Designs`
**Meta Description:** Use collection description from copy bank (truncate to 155 chars)

### Product Pages
**Meta Title:** `[Product Name] | Shelzy's Designs`
**Meta Description:** Short product description focusing on sublimation, use case, and benefits (155 chars max)

---

## SITE-WIDE UX SPECIFICATIONS

### Buttons
**Primary CTA:**
- Background: Sage Green (#9CAE8C)
- Text: White (#FFFFFF)
- Font: Poppins SemiBold
- Padding: 14px 28px
- Border-radius: 4px
- Hover: Dusty Seagrass (#7C9F8C)

**Secondary CTA:**
- Background: Transparent
- Border: 2px solid Soft Black (#111111)
- Text: Soft Black
- Hover: Background Soft Black, Text White

### Typography Scale
- **H1:** 48-64px (homepage hero), 36-48px (other pages)
- **H2:** 36-42px
- **H3:** 24-28px
- **Body:** 16-18px
- **Small:** 14px

### Spacing
- Section padding: 80px top/bottom (desktop), 40px (mobile)
- Container max-width: 1200px
- Gutter: 20px

### Speed Optimization
- Lazy load images below the fold
- Compress all images (WebP format preferred)
- Minimize CSS/JS
- Use CDN for assets

---

## APPS & INTEGRATIONS REQUIRED

### Must-Have Apps
1. **Product Personalization** (e.g., Bold Product Options, Infinite Options)
   - Text inputs for names
   - Dropdowns for fonts, colors, icons
   - Optional: Live preview

2. **Reviews** (Judge.me or Yotpo)
   - Star ratings
   - Photo reviews
   - Review request emails

3. **Email Marketing** (Klaviyo recommended)
   - Welcome series
   - Abandoned cart emails
   - Post-purchase follow-up
   - Newsletter campaigns

4. **Cart Upsell** (e.g., Candy Rack, Rebuy)
   - Suggest gift box upgrade
   - Bundle discounts
   - "Frequently bought together"

5. **Contact/Quote Form** (Shopify native or Formidable)
   - For bulk/corporate inquiries
   - File upload for logos

### Nice-to-Have Apps
- **Loyalty/Rewards** (if planning repeat customers)
- **Live Chat** (for customer support)
- **Instagram Feed** (social proof on homepage)

---

## CONVERSION OPTIMIZATION CHECKLIST

### Homepage
- [ ] Clear value proposition in hero
- [ ] Multiple CTAs throughout
- [ ] Social proof (reviews)
- [ ] Trust signals (sublimation quality, no vinyl)
- [ ] Email capture incentive

### Product Pages
- [ ] Multiple high-quality images
- [ ] Clear personalization instructions
- [ ] Shipping timeline visible
- [ ] Reviews visible
- [ ] Upsell/cross-sell recommendations
- [ ] FAQ/accordion for objections

### Checkout
- [ ] Guest checkout enabled
- [ ] Progress indicator
- [ ] Trust badges (secure checkout)
- [ ] Abandoned cart recovery emails

---

**Version:** 1.0
**Last Updated:** November 2025
