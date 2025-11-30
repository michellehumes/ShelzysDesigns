# Automated Deployment Guide for Shelzy's Designs

**Minimum Effort Setup for Maximum Results**

This guide shows you how to deploy all improvements with as little manual work as possible.

---

## Quick Overview

| What | How | Your Effort |
|------|-----|-------------|
| Fix missing pages | Run script | 5 minutes |
| Add blog posts | Run script | 2 minutes |
| Deploy brand styles | Run script | 2 minutes |
| GitHub automation | Set secrets | 10 minutes |
| Amazon affiliate | Sign up once | 15 minutes |
| Pinterest automation | Set up Tailwind | 30 minutes |

**Total setup time: ~1 hour**
**Then: Fully automated!**

---

## STEP 1: Get Your Shopify Access Token (10 minutes)

You need an API access token to run the automation scripts.

### Create a Private App:

1. Go to your Shopify Admin: https://shelzys-designs.myshopify.com/admin
2. Click **Settings** (bottom left)
3. Click **Apps and sales channels**
4. Click **Develop apps**
5. Click **Create an app**
6. Name it: "Site Automation"
7. Click **Configure Admin API scopes**
8. Enable these scopes:
   - `read_themes` / `write_themes`
   - `read_content` / `write_content`
   - `read_products` / `write_products`
   - `read_publications` / `write_publications`
9. Click **Save**
10. Click **Install app**
11. Go to **API credentials** tab
12. Copy the **Admin API access token**

**Save this token - you'll need it!**

---

## STEP 2: Run the Master Script (5 minutes)

### Option A: Run Locally

Open your terminal and run:

```bash
# Set your credentials
export SHOPIFY_STORE_URL="shelzys-designs.myshopify.com"
export SHOPIFY_ACCESS_TOKEN="shpat_your_token_here"

# Navigate to the project
cd /path/to/ShelzysDesigns

# Run all improvements
node shopify/scripts/master-site-improvement.js --phase=all
```

### Option B: Run via GitHub Actions (Recommended)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   - `SHOPIFY_STORE_URL`: shelzys-designs.myshopify.com
   - `SHOPIFY_ACCESS_TOKEN`: your_token_here

4. Go to **Actions** tab
5. Click **Deploy Site Improvements**
6. Click **Run workflow**
7. Select phase: `all`
8. Click **Run workflow**

**Done! The script will:**
- Create/fix About, Contact, FAQ, How It Works pages
- Set up all collections
- Deploy brand CSS
- Publish blog posts with affiliate links
- Create upsell and social proof snippets

---

## STEP 3: Add Snippets to Theme (15 minutes)

The script creates snippets, but you need to add them to your theme templates.

### Easy Method (Theme Editor):

1. Go to **Online Store** → **Themes** → **Customize**
2. Use the built-in sections to add content
3. The CSS styling will already be applied

### Advanced Method (Code):

1. Go to **Online Store** → **Themes** → **Actions** → **Edit code**

2. In `theme.liquid`, add before `</body>`:
```liquid
{% render 'sz-free-shipping-bar' %}
```

3. In your cart template, add:
```liquid
{% render 'sz-cart-upsell' %}
```

4. In your product template, add:
```liquid
{% render 'sz-trust-badges' %}
{% render 'sz-urgency' %}
```

5. On homepage sections, add:
```liquid
{% render 'sz-social-proof' %}
```

---

## STEP 4: Set Up Amazon Associates (15 minutes)

This is the passive income stream!

### Sign Up:

1. Go to: https://affiliate-program.amazon.com
2. Click **Sign Up**
3. Enter your website: shelzysdesigns.com
4. Choose tracking ID: `shelzysdesigns-20`
5. Complete application

### Update Links:

The blog posts created by the script have placeholder affiliate links like:
- `https://amzn.to/bridesmaids-robes`
- `https://amzn.to/wedding-planner`

Replace these with your actual affiliate links:

1. Search for product on Amazon
2. Use SiteStripe (the bar at top of Amazon when logged into Associates)
3. Click **Get Link** → **Short Link**
4. Replace placeholder with your link

**Tip:** Run the link audit script to find all affiliate links:
```bash
node shopify/scripts/audit-blog-amazon-links.js
```

---

## STEP 5: Set Up Pinterest Automation (30 minutes)

Pinterest drives free traffic to your blog posts and products!

### Setup Tailwind (Recommended):

1. Sign up at: https://www.tailwindapp.com
2. Connect your Pinterest account
3. Set up SmartSchedule
4. Add pins from your blog posts
5. Schedule 10-15 pins per day

### Pin Templates:

See `/amazon-affiliate/pinterest/` for:
- Board structure recommendations
- Pin descriptions
- Weekly pinning tracker

---

## STEP 6: Set Up Email Marketing (20 minutes)

### Install Klaviyo:

1. Go to Shopify App Store
2. Search "Klaviyo"
3. Install (free up to 250 contacts)

### Create Flows:

Use the email templates in `/copy/COPY_BANK.md`:

1. **Welcome Series** (3 emails)
2. **Abandoned Cart** (3 emails)
3. **Post-Purchase** (2 emails)

---

## Ongoing Automation Schedule

Once set up, here's what runs automatically:

| Task | Frequency | How |
|------|-----------|-----|
| Site updates | On-demand | GitHub Actions |
| Affiliate link audit | Weekly | GitHub Actions |
| Pinterest pins | Daily | Tailwind |
| Email flows | Triggered | Klaviyo |

### Monthly Tasks (15 min/month):

1. Check Amazon affiliate earnings
2. Review Pinterest analytics
3. Publish 2-4 new blog posts (use templates in repo)
4. Review email performance

---

## Files Reference

### Scripts to Run:

| Script | Purpose | Command |
|--------|---------|---------|
| `master-site-improvement.js` | All improvements | `node shopify/scripts/master-site-improvement.js` |
| `publish-to-shopify.js` | Blog posts | `node amazon-affiliate/scripts/publish-to-shopify.js` |
| `audit-blog-amazon-links.js` | Check affiliate links | `node shopify/scripts/audit-blog-amazon-links.js` |

### Documentation:

| File | Contents |
|------|----------|
| `SITE_REVIEW_AND_RECOMMENDATIONS.md` | Full site analysis |
| `shopify/IMPLEMENTATION_GUIDE.md` | Step-by-step Shopify setup |
| `amazon-affiliate/README.md` | Passive income guide |
| `amazon-affiliate/pinterest/AUTOMATION_SETUP.md` | Pinterest automation |

---

## Troubleshooting

### "SHOPIFY_ACCESS_TOKEN not set"
```bash
export SHOPIFY_ACCESS_TOKEN="your_token"
```

### "404 Error on API"
- Check your store URL is correct
- Ensure API scopes are enabled

### "Page already exists"
- The script skips existing pages
- To recreate, delete the page first in Shopify Admin

### "Collection not showing products"
- Check product tags match collection conditions
- Products need tags like "bridesmaid", "kids", "holiday"

---

## Support

### Shopify Help:
- https://help.shopify.com
- 24/7 chat support in admin

### Script Issues:
- Run with `--dry-run` to test without making changes
- Check script output for specific errors

---

## Expected Results

After full implementation:

| Metric | Before | After (Expected) |
|--------|--------|------------------|
| Pages | Some 404s | All working |
| Blog posts | 0 | 6+ with affiliate links |
| Email capture | Basic popup | Optimized popup + flows |
| Conversion elements | None | Trust badges, urgency, upsells |
| Passive income | $0 | $200-800/month potential |

---

**You're ready! Run the script and watch your site transform.**

```bash
node shopify/scripts/master-site-improvement.js --phase=all
```
