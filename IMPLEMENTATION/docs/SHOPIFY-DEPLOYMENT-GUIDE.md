# Shopify Deployment Guide

## Overview
This guide covers deploying Shelzy's Designs improvements to Shopify.

---

## Prerequisites

### 1. Shopify Admin Access
- Staff account with theme editor permissions
- Access to Online Store > Themes
- App installation permissions (for Klaviyo, Judge.me)

### 2. Development Tools
```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# OR install Theme Kit
brew tap shopify/shopify
brew install themekit
```

### 3. Store Credentials
```bash
# Set environment variables
export SHOPIFY_STORE_URL="shelzysdesigns.myshopify.com"
export SHOPIFY_THEME_ID="your-theme-id"
```

---

## Deployment Workflow

### Step 1: Create Backup
```bash
# Run backup script
./IMPLEMENTATION/scripts/backup-theme.sh

# Or manual backup in Shopify
# Themes > Actions > Duplicate
```

### Step 2: Preview Changes
```bash
# Pull current theme
shopify theme pull --store "$SHOPIFY_STORE_URL"

# Start development server
shopify theme dev --store "$SHOPIFY_STORE_URL"
```

### Step 3: Deploy Snippets
```bash
# Deploy critical snippets first
./IMPLEMENTATION/scripts/deploy-snippets.sh --critical

# Test in preview

# Deploy remaining snippets
./IMPLEMENTATION/scripts/deploy-snippets.sh --all
```

### Step 4: Verify Deployment
1. Check homepage loads correctly
2. Test cart functionality
3. Verify email popup
4. Test on mobile device
5. Complete test purchase

---

## Snippet Installation Locations

### Theme.liquid (Head Section)
```liquid
{% comment %} Add before </head> {% endcomment %}
{% render 'shelzys-css-variables' %}
{% render 'shelzys-fonts' %}
{% render 'shelzys-head-seo' %}
```

### Theme.liquid (Body End)
```liquid
{% comment %} Add before </body> {% endcomment %}
{% render 'shelzys-back-to-top' %}
{% render 'shelzys-popup-premium' %}
```

### Header Section
```liquid
{% render 'shelzys-announcement-unified' %}
{% render 'shelzys-nav-header' %}
```

### Product Page Template
```liquid
{% comment %} In product form {% endcomment %}
{% render 'shelzys-personalization-form' %}
{% render 'shelzys-urgency' %}
{% render 'shelzys-trust-badges' %}
{% render 'shelzys-delivery-estimator' %}

{% comment %} Below product form {% endcomment %}
{% render 'shelzys-product-faq' %}
{% render 'shelzys-upsell-frequently-bought' %}
```

### Cart Page/Drawer
```liquid
{% render 'shelzys-free-shipping-bar' %}
{% render 'shelzys-cart-upsell' %}
{% render 'shelzys-trust-badges' %}
```

### Collection Page Template
```liquid
{% render 'shelzys-collection-header' %}
{% render 'shelzys-breadcrumbs' %}
```

### Footer Section
```liquid
{% render 'shelzys-footer-v2' %}
```

---

## Troubleshooting

### Snippet Not Rendering
1. Check snippet file exists in theme
2. Verify render syntax is correct
3. Check for Liquid syntax errors
4. Clear browser cache

### Styles Not Applying
1. Ensure CSS variables snippet is loaded
2. Check for conflicting theme styles
3. Use browser inspector to debug

### JavaScript Errors
1. Check browser console for errors
2. Verify jQuery loaded (if required)
3. Check for script conflicts

---

## Rollback Procedure

### Method 1: Theme Duplicate
1. Go to Online Store > Themes
2. Find previous theme version
3. Click "Publish"

### Method 2: Git Restore
```bash
# Restore from backup
./IMPLEMENTATION/scripts/backup-theme.sh restore backups/shelzys-theme-XXXXXX.tar.gz
```

### Method 3: Manual Revert
1. Remove problematic snippets
2. Restore original code from backup
3. Re-deploy

---

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works on desktop
- [ ] Navigation works on mobile
- [ ] Product pages display correctly
- [ ] Personalization form works
- [ ] Add to cart functions
- [ ] Cart page loads
- [ ] Cart upsells display
- [ ] Free shipping bar calculates correctly
- [ ] Checkout completes
- [ ] Email popup triggers
- [ ] Mobile responsive
- [ ] No console errors
