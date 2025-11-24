# Quick Deployment Guide

Step-by-step instructions to deploy audit fixes to shelzysdesigns.com

---

## Step 1: Fix the About Page (5 minutes)

1. Log into Shopify Admin: `shelzysdesigns.myshopify.com/admin`
2. Go to **Online Store > Pages**
3. Click **Add page**
4. Title: `About`
5. Click **Show HTML** button (</> icon in editor toolbar)
6. Copy everything between `<!-- PAGE 1: ABOUT PAGE -->` and `<!-- PAGE 2: HOW IT WORKS PAGE -->` from `/shopify/static-pages.html`
7. Paste into the HTML editor
8. Click **Save**
9. Verify at: `shelzysdesigns.com/pages/about`

---

## Step 2: Deploy FAQ Page (5 minutes)

1. In Shopify Admin, go to **Online Store > Pages**
2. Click **Add page**
3. Title: `FAQ`
4. Click **Show HTML**
5. Copy the FAQ section from `/shopify/static-pages.html`
6. Paste and **Save**
7. Verify at: `shelzysdesigns.com/pages/faq`

---

## Step 3: Deploy Other Pages

Repeat the same process for:
- **How It Works** (from `static-pages.html`)
- **Contact** (from `static-pages.html`)
- **Size Guide** (from `additional-pages.html`)
- **Care Instructions** (from `additional-pages.html`)
- **Bulk & Corporate** (from `additional-pages.html`)

---

## Step 4: Add Pages to Navigation (5 minutes)

1. Go to **Online Store > Navigation**
2. Click **Main menu**
3. Click **Add menu item**
4. Add links:
   - Name: `About` | Link: `/pages/about`
   - Name: `FAQ` | Link: `/pages/faq`
   - Name: `How It Works` | Link: `/pages/how-it-works`
   - Name: `Bulk Orders` | Link: `/pages/bulk-corporate`
5. Click **Save menu**

---

## Step 5: Fix Social Media Links (2 minutes)

1. Go to **Online Store > Themes**
2. Click **Customize**
3. Click **Theme settings** (bottom left)
4. Find **Social media** section
5. Update URLs:
   - Instagram: `https://instagram.com/shelzysdesigns`
   - Facebook: `https://facebook.com/shelzysdesigns`
   - Pinterest: `https://pinterest.com/shelzysdesigns`
6. Click **Save**

---

## Step 6: Add Trust Badges to Theme (10 minutes)

1. Go to **Online Store > Themes**
2. Click **Actions > Edit code**
3. In the left sidebar, find **Snippets** folder
4. Click **Add a new snippet**
5. Name it: `trust-badges`
6. Copy the trust badges strip code from `/shopify/trust-badges.liquid`
7. Paste and **Save**
8. To display it:
   - Find your homepage template (usually `templates/index.json` or `sections/`)
   - Add: `{% render 'trust-badges' %}` where you want it to appear

---

## Step 7: Add Schema Markup for SEO (5 minutes)

1. In theme editor, find **Layout > theme.liquid**
2. Find the `</head>` tag
3. Just BEFORE `</head>`, paste the Organization and Website schema from `/shopify/schema-markup.liquid`
4. Click **Save**

---

## Step 8: Set Up Email Marketing

1. Install **Klaviyo** from Shopify App Store
2. Create account and connect to Shopify
3. Go to **Flows** in Klaviyo
4. Create flows and paste email HTML from:
   - `/shopify/email-templates/welcome-series.html`
   - `/shopify/email-templates/abandoned-cart.html`
   - `/shopify/email-templates/post-purchase.html`

---

## Verification Checklist

After deployment, verify:
- [ ] `shelzysdesigns.com/pages/about` loads (no 404)
- [ ] `shelzysdesigns.com/pages/faq` loads
- [ ] Social links go to actual profiles
- [ ] Navigation shows new pages
- [ ] Test Rich Results: https://search.google.com/test/rich-results

---

## Need Help?

If you get stuck:
1. Check Shopify Help Center: https://help.shopify.com
2. For complex theme edits, consider hiring a Shopify Expert
3. The `AUDIT_IMPLEMENTATION.md` file has detailed explanations

---

**Estimated Total Time:** 30-45 minutes for critical fixes
