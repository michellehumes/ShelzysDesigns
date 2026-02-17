# One-Click Site Deployment Guide

## Deploy Everything in Under 5 Minutes

This guide will deploy ALL improvements to your live Shopify store automatically.

---

## What Gets Deployed

When you run the full deployment, here's what happens automatically:

### Pages Created/Fixed
- About page (no more 404!)
- Contact page with form
- FAQ page with all questions
- How It Works page
- Bulk & Corporate page

### Collections Created
- Best Sellers
- Personalized Bottles
- Bridesmaid & Bridal Party
- Proposal Gift Boxes
- Kids Bottles
- Holiday Collection

### Conversion Features
- Free shipping progress bar
- Cart upsell section
- Trust badges
- Urgency countdown timer
- Social proof section
- Email popup enhancements

### Blog Posts (12+ with Amazon Affiliate Links)
- Best Bridesmaid Gift Ideas 2025
- Wedding Planning Essentials
- Best Kids Water Bottles for School
- How to Plan a Bridal Shower
- Personalized Gifts Guide
- And more...

### Brand Styling
- Custom CSS deployed
- Font imports
- Color scheme applied

---

## Step 1: Set Up GitHub Secrets (One Time Only)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

| Secret Name | Where to Get It |
|-------------|-----------------|
| `SHOPIFY_STORE_URL` | Your myshopify.com URL (e.g., `shelzys-designs.myshopify.com`) |
| `SHOPIFY_ACCESS_TOKEN` | Shopify Admin → Apps → Develop apps → Create app → Admin API access token |
| `AMAZON_ASSOCIATE_TAG` | Amazon Associates account (e.g., `shelzysdesigns-20`) |

### Getting Your Shopify Access Token

1. Go to Shopify Admin
2. Click **Settings** → **Apps and sales channels**
3. Click **Develop apps** (top right)
4. Click **Create an app**
5. Name it "Claude Automation"
6. Click **Configure Admin API scopes**
7. Enable these scopes:
   - `write_content` (for pages)
   - `write_themes` (for snippets)
   - `write_products` (for collections)
   - `read_themes`
   - `read_products`
8. Click **Save** → **Install app**
9. Click **Reveal token once** and copy it
10. Add to GitHub secrets as `SHOPIFY_ACCESS_TOKEN`

---

## Step 2: Run the Deployment

### Option A: Full Deployment (Recommended)

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Deploy Site Improvements** (left sidebar)
4. Click **Run workflow** button (right side)
5. Select **full** from dropdown
6. Click green **Run workflow** button

**Wait 2-5 minutes.** Done!

### Option B: Partial Deployments

| Option | What It Does |
|--------|--------------|
| `full` | Everything (recommended first time) |
| `pages-only` | Just creates/fixes pages |
| `snippets-only` | Just injects theme snippets |
| `blogs-only` | Just publishes blog posts |
| `dry-run` | Test without making changes |
| `fix-conflicts` | Fix any snippet conflicts |

---

## Step 3: Verify Deployment

After deployment completes:

1. Check your pages:
   - https://shelzysdesigns.com/pages/about
   - https://shelzysdesigns.com/pages/contact
   - https://shelzysdesigns.com/pages/faq
   - https://shelzysdesigns.com/pages/how-it-works

2. Check your collections:
   - https://shelzysdesigns.com/collections/best-sellers
   - https://shelzysdesigns.com/collections/bridesmaid-bridal-party

3. Check your blog:
   - https://shelzysdesigns.com/blogs/blog

---

## Step 4: Add Snippets to Theme (Manual - 5 min)

Some features need to be added to your theme manually. This is a one-time setup.

### In Shopify Admin:

1. Go to **Online Store** → **Themes**
2. Click **Customize** on your active theme
3. Or: Click **...** → **Edit code**

### Add Free Shipping Bar

In `theme.liquid`, before `</body>`:
```liquid
{% render 'sz-free-shipping-bar' %}
```

### Add Cart Upsells

In your cart template (e.g., `cart.liquid` or `main-cart.liquid`), before the checkout button:
```liquid
{% render 'sz-cart-upsell' %}
```

### Add Trust Badges to Product Pages

In your product template, below the Add to Cart button:
```liquid
{% render 'sz-trust-badges' %}
```

### Add Urgency Timer to Product Pages

In your product template, above the Add to Cart button:
```liquid
{% render 'sz-urgency' %}
```

### Add Social Proof to Homepage

In your homepage template:
```liquid
{% render 'sz-social-proof' %}
```

---

## Troubleshooting

### "SHOPIFY_ACCESS_TOKEN not set"
→ Add the secret to GitHub (see Step 1)

### Pages already exist error
→ This is fine! The script will skip existing pages

### Deployment failed
→ Check the Actions log for specific errors
→ Try running `fix-conflicts` first

### Snippets not showing
→ Make sure you added them to theme templates (Step 4)

---

## Weekly Maintenance (Automated)

The repository includes automatic weekly maintenance that runs every Sunday:
- Audits Amazon affiliate links
- Checks page health
- Generates maintenance report

View reports in GitHub Actions.

---

## Need Help?

1. Check the detailed documentation in `COMPREHENSIVE_SITE_AUDIT_2025.md`
2. Review error logs in GitHub Actions
3. Contact developer with specific error messages

---

**That's it! Your site improvements are now live.**
