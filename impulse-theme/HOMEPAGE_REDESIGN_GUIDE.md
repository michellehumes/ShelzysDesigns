# Shelzy's Designs - Homepage Redesign Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the complete homepage redesign for Shelzy's Designs on the Impulse theme.

**Theme:** Impulse
**Color Palette:** Sage Green (#8B9D77) + White base, soft blush accent
**Brand Vibe:** Chic, modern, bridal-adjacent, elevated

---

## Step 1: Duplicate Your Theme (SAFETY FIRST)

1. Go to **Shopify Admin → Online Store → Themes**
2. Click **Actions → Duplicate** on your live Impulse theme
3. Rename the duplicate to: `Impulse - Homepage Redesign (Shelzy)`
4. **All edits go into this duplicate only**

---

## Step 2: Add Section Files

Copy each section file to your theme via **Edit code**:

### Via Shopify Admin:
1. Go to **Online Store → Themes → Actions → Edit code**
2. Under **Sections**, click **Add a new section**
3. Name it exactly as shown (without `.liquid`)
4. Paste the full contents

### Sections to Add (10 total):

| File Name | Section Purpose |
|-----------|-----------------|
| `shelzys-hero` | Homepage hero banner with dual CTAs |
| `shelzys-brand-promise` | 3-column trust badges below hero |
| `shelzys-shop-occasion` | Shop by Occasion (3 tiles) |
| `shelzys-best-sellers` | Best sellers product grid |
| `shelzys-how-it-works` | 3-step process section |
| `shelzys-featured-wedding` | Featured wedding split section |
| `shelzys-testimonials` | Customer testimonials grid |
| `shelzys-social-proof-bar` | Stats and trust indicators |
| `shelzys-blog-preview` | Blog posts preview |
| `shelzys-email-signup` | Email newsletter signup |

---

## Step 3: Add CSS File

1. Under **Assets**, click **Add a new asset**
2. Choose **Create a blank file** → name it `shelzys-branding.css`
3. Paste contents from `assets/shelzys-branding.css`
4. In `layout/theme.liquid`, add before `</head>`:

```liquid
{{ 'shelzys-branding.css' | asset_url | stylesheet_tag }}
```

---

## Step 4: Configure Homepage via Theme Customizer

Open **Theme Customizer** on your duplicated theme:

### Remove Existing Sections
- Remove or hide any default Impulse homepage sections you don't need
- Keep the header and footer

### Add Sections in This Order:

1. **Shelzys Hero**
   - Upload hero image (bridal party with bottles recommended)
   - Set heading: "Personalized Bottles for Every Moment"
   - Set subheading: "Custom stainless-steel bottles that elevate weddings, events & everyday life."
   - Primary CTA: "Shop Custom Bottles" → `/collections/all`
   - Secondary CTA: "Bridal Party Sets" → `/collections/weddings`

2. **Shelzys Brand Promise**
   - Uses preset content (sublimation, hand-checked, wedding-ready)
   - Customize icons/text as needed

3. **Shelzys Shop by Occasion**
   - Upload images for each tile:
     - Weddings: Bridesmaids photo
     - Corporate: Team/event photo
     - Everyday: Lifestyle photo
   - Link to appropriate collections

4. **Shelzys Best Sellers**
   - Select your "Best Sellers" collection
   - Show 8 products

5. **Shelzys How It Works**
   - Uses preset 3-step content
   - Add CTA linking to main collection

6. **Shelzys Featured Wedding**
   - Upload bridal party hero image
   - Select wedding collection for featured products
   - Customize heading/text as needed

7. **Shelzys Testimonials**
   - Replace placeholder testimonials with real reviews
   - Add customer photos if available

8. **Shelzys Social Proof Bar**
   - Update stats with real numbers
   - Add "As Seen On" logos if available

9. **Shelzys Blog Preview**
   - Select your blog
   - Will auto-populate with latest 3 posts

10. **Shelzys Email Signup**
    - Form connects to Shopify newsletter
    - Customize discount offer text

---

## Step 5: Required Collections

Ensure these collections exist (create if needed):

| Collection | Handle | Description |
|------------|--------|-------------|
| Best Sellers | `best-sellers` | Top 8-12 selling products |
| Weddings | `weddings` | All bridal/wedding products |
| Everyday | `everyday-bottles` | Daily use bottles |
| Corporate | `corporate` | Bulk/corporate products |

---

## Step 6: Navigation Updates

In **Online Store → Navigation**, update main menu:

```
Shop
├── Best Sellers (/collections/best-sellers)
├── Weddings & Bridal (/collections/weddings)
├── Corporate & Bulk (/pages/corporate-bulk-orders)
├── Everyday (/collections/everyday-bottles)
└── View All (/collections/all)
About (/pages/about)
Contact (/pages/contact)
```

---

## Step 7: Footer Updates

In Theme Customizer → Footer:

1. Organize links into columns:
   - Shop: Wedding, Corporate, Everyday, Best Sellers
   - Help: FAQ, Shipping, Returns, Contact
   - Company: About, Reviews, Privacy, Terms

2. Ensure Instagram link is visible

3. Add tagline: "Custom bottles, built for moments that matter."

---

## Step 8: Testing Checklist

Before publishing, verify on both desktop and mobile:

### Desktop
- [ ] Hero displays full width with readable text
- [ ] All section backgrounds alternate properly (white/gray)
- [ ] Best sellers grid shows 4 products per row
- [ ] How it works shows 3 steps horizontally
- [ ] Featured wedding split layout is balanced
- [ ] Testimonials show 3 cards per row
- [ ] All CTAs link to correct pages

### Mobile
- [ ] Hero text is centered and readable
- [ ] CTAs stack vertically
- [ ] Shop by Occasion tiles stack single-column
- [ ] Best sellers show 2 per row
- [ ] How it works steps stack vertically
- [ ] Featured wedding image shows above content
- [ ] Email form inputs are tappable (48px+ height)
- [ ] No horizontal scrolling

---

## Step 9: Images to Prepare

For best results, prepare these images:

| Location | Recommended Size | Content |
|----------|------------------|---------|
| Hero | 2000x1200px | Bridal party or group with bottles |
| Shop by Occasion - Weddings | 800x600px | Bridesmaids holding bottles |
| Shop by Occasion - Corporate | 800x600px | Team/event setup |
| Shop by Occasion - Everyday | 800x600px | Lifestyle/gym/travel |
| Featured Wedding | 1200x800px | Editorial bridal party shot |
| Testimonials | 100x100px (optional) | Customer headshots |

---

## Step 10: Go Live

Once all testing passes:

1. Preview the redesigned theme one final time
2. Check mobile responsive one more time
3. In Themes, click **Actions → Publish** on your working copy
4. Your old theme becomes the backup automatically

---

## Files Summary

### Sections (10 files)
```
shelzys-hero.liquid
shelzys-brand-promise.liquid
shelzys-shop-occasion.liquid
shelzys-best-sellers.liquid
shelzys-how-it-works.liquid
shelzys-featured-wedding.liquid
shelzys-testimonials.liquid
shelzys-social-proof-bar.liquid
shelzys-blog-preview.liquid
shelzys-email-signup.liquid
```

### Assets (1 file)
```
shelzys-branding.css
```

### Templates (1 file)
```
templates/index.json (reference for section order)
```

---

## Color Reference

| Color | Hex | Usage |
|-------|-----|-------|
| Sage Green | `#8B9D77` | Primary buttons, links, accents |
| Sage Dark | `#7A8C68` | Hover states |
| Sage Light | `#E8EDE4` | Light backgrounds, badges |
| Off White | `#FAFAF8` | Section backgrounds |
| Cream | `#F9F7F4` | Featured wedding background |
| Text | `#1a1a1a` | Main text |
| Text Muted | `#666666` | Secondary text |

---

## Troubleshooting

### Sections not appearing in customizer
- Ensure files are named correctly (no extra spaces)
- Check for Liquid syntax errors in the file

### Colors not applying
- Verify `shelzys-branding.css` is linked in `theme.liquid`
- Clear browser cache and Shopify preview cache

### Mobile layout issues
- Check viewport meta tag exists in theme.liquid
- Use browser dev tools to test specific breakpoints

### Forms not submitting
- Verify form action URLs are correct
- Check for JavaScript errors in console

---

## Support

For theme-specific questions:
- Impulse theme documentation
- Shopify Liquid reference
- Shopify community forums

---

*Generated for Shelzy's Designs Homepage Redesign*
*Theme: Impulse | Palette: Sage Green*
