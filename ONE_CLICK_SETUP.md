# ONE-CLICK SETUP GUIDE

**Total time: 10 minutes of your time, then everything is automated forever.**

---

## What You'll Get (Automatically)

After setup, this system will deploy:

- **Fixed Pages:** About, Contact, FAQ, How It Works
- **All Collections:** Best Sellers, Bridesmaid, Kids, Holiday, etc.
- **Conversion Optimization:**
  - Free shipping progress bar
  - Exit-intent email popup (10% off)
  - Trust badges on products
  - Urgency countdown timer
  - Cart upsell section
  - Announcement bar
- **12 Blog Posts** with Amazon affiliate links for passive income
- **Weekly Maintenance** runs automatically every Sunday

---

## STEP 1: Get Your Shopify API Token (5 minutes)

1. Go to: **https://shelzys-designs.myshopify.com/admin/settings/apps/development**

2. Click **"Create an app"**

3. Name it: `Site Automation`

4. Click **"Configure Admin API scopes"**

5. Enable these permissions (check the boxes):
   - `read_themes` + `write_themes`
   - `read_content` + `write_content`
   - `read_products` + `write_products`

6. Click **Save** → **Install app** → **Install**

7. Go to **API credentials** tab

8. Click **"Reveal token once"** and **COPY IT** (you only see it once!)

---

## STEP 2: Add Secrets to GitHub (3 minutes)

1. Go to your GitHub repository: **https://github.com/michellehumes/ShelzysDesigns**

2. Click **Settings** (top right, gear icon)

3. Click **Secrets and variables** → **Actions**

4. Click **"New repository secret"** and add:

| Name | Value |
|------|-------|
| `SHOPIFY_STORE_URL` | `shelzys-designs.myshopify.com` |
| `SHOPIFY_ACCESS_TOKEN` | (paste the token you copied) |
| `AMAZON_ASSOCIATE_TAG` | `shelzysdesigns-20` (or your tag) |

---

## STEP 3: Run the Automation (2 minutes)

1. Go to **Actions** tab in your GitHub repo

2. Click **"Deploy Site Improvements"** in the left sidebar

3. Click **"Run workflow"** button (right side)

4. Select **"full"** from the dropdown

5. Click the green **"Run workflow"** button

6. **Wait 3-5 minutes** - watch the progress

7. Done! Your site is now fully optimized.

---

## What Happens Automatically After Setup

| What | When | Your Effort |
|------|------|-------------|
| All pages deployed | Once (now) | None |
| All blog posts published | Once (now) | None |
| Conversion features active | Once (now) | None |
| Weekly health check | Every Sunday | None |
| Affiliate link audit | Every Sunday | None |

---

## Optional: Amazon Associates (For Passive Income)

The blog posts have affiliate links ready. To earn from them:

1. Go to: **https://affiliate-program.amazon.com**
2. Sign up (free)
3. Get your Associate Tag
4. Update the `AMAZON_ASSOCIATE_TAG` secret in GitHub

**Expected earnings: $200-800/month** once traffic builds

---

## Optional: Pinterest (For Free Traffic)

1. Sign up for **Tailwind** (https://tailwindapp.com)
2. Connect your Pinterest account
3. Schedule pins from your blog posts
4. Set to 10-15 pins/day on autopilot

**Expected traffic: 500-2000 visitors/month**

---

## Troubleshooting

### "Workflow failed"
- Check that secrets are set correctly (no extra spaces)
- Make sure Shopify app has correct permissions

### "Pages already exist"
- That's fine! The script skips existing pages

### "Token doesn't work"
- Create a new app in Shopify
- Copy the token exactly (no spaces)

---

## Need to Re-run?

Just go to Actions → Deploy Site Improvements → Run workflow

You can run it anytime to update or fix things.

---

## Summary

1. Create Shopify app, copy token
2. Add 3 secrets to GitHub
3. Click "Run workflow"
4. Done forever!

**Your site will be fully optimized in under 10 minutes.**
