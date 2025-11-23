# Shelzy's Designs - Shopify Automation Scripts

Automated scripts to set up your Shopify store. These scripts use the Shopify Admin API to:

- Create missing collections (Corporate, Everyday)
- Create/update pages (Contact, Shipping, Why Sublimation)
- Update all product descriptions with sublimation messaging
- Verify everything is configured correctly

## Quick Start

### 1. Get Your Shopify API Credentials

1. Go to your Shopify Admin: https://admin.shopify.com/store/shelzys-designs
2. Navigate to: **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **"Create an app"**
4. Name it: `Store Automation`
5. Click **"Configure Admin API scopes"**
6. Enable these scopes:
   - `write_products` (Products)
   - `write_content` (Online Store pages)
   - `write_themes` (Themes)
   - `read_products`
   - `read_content`
7. Click **"Save"**
8. Click **"Install app"**
9. Click **"Reveal token once"** and copy the Admin API access token

### 2. Set Up Environment

```bash
# Navigate to automation folder
cd ~/Desktop/ShelzysDesigns/automation

# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Edit .env and add your access token
nano .env
# OR
open -e .env
```

Your `.env` file should look like:
```
SHOPIFY_STORE_URL=shelzys-designs.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Run the Setup

```bash
# Run everything at once
npm run setup

# OR run individual scripts
npm run collections   # Create Corporate & Everyday collections
npm run pages         # Create Contact, Shipping, Why Sublimation pages
npm run products      # Update all product descriptions
npm run verify        # Verify everything is set up correctly
```

## What Each Script Does

### `create-collections.js`
- Creates "Corporate & Bulk Orders" collection at `/collections/corporate`
- Creates "Everyday Bottles" collection at `/collections/everyday`
- Automatically adds relevant products to each collection

### `create-pages.js`
- Creates/updates "Contact Us" page
- Creates "Shipping Information" page
- Creates "Why Sublimation" page explaining your differentiator

### `update-products.js`
- Updates all water bottle product titles to include "Sublimation"
- Replaces descriptions with improved copy emphasizing:
  - Sublimation vs vinyl benefits
  - Product details
  - Shipping information
  - Trust elements
- Skips Canva template products (you should remove these manually)

### `verify-setup.js`
- Checks all required collections exist
- Checks all required pages exist
- Verifies products have sublimation messaging
- Reports any issues found

## Manual Tasks (Cannot Be Automated)

These must be done in Shopify Admin:

1. **Update Announcement Bar**
   - Go to: Online Store → Themes → Customize
   - Remove "500+ 5-Star Reviews" claim
   - Replace with: "Free Shipping $50+ • Permanent Sublimation Printing"

2. **Update Shipping Policy**
   - Go to: Settings → Policies → Shipping policy
   - Content is in `PASTE-READY/03-shipping-policy.txt`

3. **Install Judge.me Reviews**
   - Go to: Apps → Shopify App Store
   - Search: Judge.me
   - Install free plan

4. **Set Up Professional Email**
   - Set up hello@shelzysdesigns.com
   - Update email in all policies and contact pages

## Troubleshooting

### "Missing environment variables"
Make sure you created `.env` file with your credentials.

### "401 Unauthorized"
Your access token is invalid or expired. Create a new one in Shopify Admin.

### "403 Forbidden"
The app doesn't have the required scopes. Go back to App Setup and enable all required scopes.

### "404 Not Found"
The API endpoint might have changed. Check Shopify API version in `api-client.js`.

## File Structure

```
automation/
├── package.json          # Dependencies and scripts
├── .env.example          # Template for credentials
├── .env                  # Your credentials (don't commit!)
├── README.md             # This file
└── scripts/
    ├── api-client.js     # Shared Shopify API utilities
    ├── create-collections.js
    ├── create-pages.js
    ├── update-products.js
    ├── verify-setup.js
    └── setup-all.js      # Master script that runs everything
```

## Support

If you have issues:
1. Check the error message in terminal
2. Verify your API credentials
3. Make sure all scopes are enabled
4. Try running individual scripts to isolate the problem

---

**Time to run:** ~2 minutes
**Expected result:** All 404 errors fixed, sublimation messaging everywhere
