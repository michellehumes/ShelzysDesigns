#!/bin/bash

# ================================================
# SHELZY'S DESIGNS - AUTOMATED DEPLOYMENT
# Run this on YOUR local machine
# ================================================

echo "🚀 Shelzy's Designs - Automated Deployment"
echo "============================================="
echo ""

STORE="shelzys-designs.myshopify.com"

# Step 1: Check CLI
echo "📋 Step 1: Checking Shopify CLI..."
if ! command -v shopify &> /dev/null; then
    echo "❌ Shopify CLI not found. Installing..."
    npm install -g @shopify/cli @shopify/theme
else
    echo "✅ Shopify CLI found"
fi
echo ""

# Step 2: Login
echo "📋 Step 2: Logging into Shopify..."
echo "   A browser window will open for authentication"
shopify auth login --store=$STORE
echo ""

# Step 3: List themes
echo "📋 Step 3: Finding your Impulse theme..."
shopify theme list --store=$STORE
echo ""
echo "⚠️  Look at the list above and find your Impulse theme ID"
read -p "Enter your theme ID (or press Enter for live theme): " THEME_ID

if [ -z "$THEME_ID" ]; then
    THEME_FLAG="--live"
else
    THEME_FLAG="--theme=$THEME_ID"
fi

# Step 4: Create temp directory
TEMP_DIR=$(mktemp -d)
echo ""
echo "📋 Step 4: Creating temporary directory..."
echo "   Using: $TEMP_DIR"
cd $TEMP_DIR

# Step 5: Pull theme
echo ""
echo "📋 Step 5: Pulling your theme from Shopify..."
shopify theme pull $THEME_FLAG --store=$STORE

# Step 6: Copy custom files
echo ""
echo "📋 Step 6: Adding Shelzy's custom sections..."

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copy files
cp "$SCRIPT_DIR/sections/"*.liquid sections/ 2>/dev/null
cp "$SCRIPT_DIR/snippets/"*.liquid snippets/ 2>/dev/null
cp "$SCRIPT_DIR/assets/"*.css assets/ 2>/dev/null

echo "✅ Custom files copied"
echo ""

# Step 7: Show what's being added
echo "📋 Step 7: Files added to your theme:"
echo ""
echo "Sections:"
ls -1 sections/shelzy-*.liquid 2>/dev/null || echo "  (none found - check paths)"
echo ""
echo "Snippets:"
ls -1 snippets/product-personalization.liquid 2>/dev/null || echo "  (none found - check paths)"
echo ""
echo "Assets:"
ls -1 assets/shelzy-custom.css 2>/dev/null || echo "  (none found - check paths)"
echo ""

# Step 8: Confirm push
read -p "Ready to push these changes to Shopify? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

# Step 9: Push to Shopify
echo ""
echo "📋 Step 8: Pushing to Shopify..."
shopify theme push $THEME_FLAG --store=$STORE

echo ""
echo "============================================="
echo "✅ Deployment Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Go to: https://admin.shopify.com/store/shelzys-designs"
echo "2. Navigate to: Online Store > Themes > Customize"
echo "3. Add sections to homepage:"
echo "   - Shelzy Hero"
echo "   - Shelzy Why Sublimation"
echo "   - Shelzy How It Works"
echo "   - Shelzy Email Signup"
echo ""
echo "4. Link CSS in theme.liquid:"
echo "   - Go to: Edit code > Layout > theme.liquid"
echo "   - Add before </head>:"
echo "     {{ 'shelzy-custom.css' | asset_url | stylesheet_tag }}"
echo ""
echo "5. Enable personalization:"
echo "   - Go to: Edit code > Sections > product-template.liquid"
echo "   - Add before Add to Cart button:"
echo "     {% render 'product-personalization', product: product %}"
echo ""
echo "6. Tag products with: personalized, custom, sublimation"
echo ""
echo "============================================="
