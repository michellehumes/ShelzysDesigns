#!/bin/bash

# ================================================
# SHELZY'S DESIGNS - THEME DEPLOYMENT SCRIPT
# ================================================
# This script deploys your custom sections and assets to Shopify
#
# Prerequisites:
# 1. Shopify CLI installed (shopify version)
# 2. Logged in to your store (shopify login --store your-store.myshopify.com)
# 3. In your theme directory
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh
# ================================================

echo "🚀 Shelzy's Designs - Theme Deployment"
echo "======================================="
echo ""

# Check if Shopify CLI is installed
if ! command -v shopify &> /dev/null; then
    echo "❌ Shopify CLI not found. Please install it first:"
    echo "   npm install -g @shopify/cli @shopify/theme"
    exit 1
fi

echo "✅ Shopify CLI found"
echo ""

# Check if we're in a Shopify theme directory
if [ ! -f "config/settings_schema.json" ]; then
    echo "⚠️  Not in a Shopify theme directory"
    echo "   Please run this script from your theme's root directory"
    echo ""
    read -p "Do you want to pull your Impulse theme first? (y/n): " pull_theme

    if [ "$pull_theme" = "y" ]; then
        echo "📥 Pulling theme from Shopify..."
        shopify theme pull
    else
        echo "❌ Aborted. Please navigate to your theme directory first."
        exit 1
    fi
fi

echo "📂 Current directory appears to be a Shopify theme"
echo ""

# Create directories if they don't exist
echo "📁 Creating directories..."
mkdir -p sections
mkdir -p snippets
mkdir -p assets

# Copy sections
echo ""
echo "📋 Copying custom sections..."
cp -v shopify-theme/sections/shelzy-hero.liquid sections/ 2>/dev/null || echo "⚠️  shelzy-hero.liquid not found"
cp -v shopify-theme/sections/shelzy-why-sublimation.liquid sections/ 2>/dev/null || echo "⚠️  shelzy-why-sublimation.liquid not found"
cp -v shopify-theme/sections/shelzy-how-it-works.liquid sections/ 2>/dev/null || echo "⚠️  shelzy-how-it-works.liquid not found"
cp -v shopify-theme/sections/shelzy-email-signup.liquid sections/ 2>/dev/null || echo "⚠️  shelzy-email-signup.liquid not found"

# Copy snippets
echo ""
echo "📋 Copying custom snippets..."
cp -v shopify-theme/snippets/product-personalization.liquid snippets/ 2>/dev/null || echo "⚠️  product-personalization.liquid not found"

# Copy assets
echo ""
echo "📋 Copying custom CSS..."
cp -v shopify-theme/assets/shelzy-custom.css assets/ 2>/dev/null || echo "⚠️  shelzy-custom.css not found"

echo ""
echo "======================================="
echo "✅ Files copied to theme directories"
echo ""
echo "📤 Pushing to Shopify..."
echo ""

# Push to Shopify
shopify theme push

echo ""
echo "======================================="
echo "🎉 Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Go to your Shopify admin"
echo "2. Navigate to Online Store > Themes > Customize"
echo "3. Add the new sections to your homepage"
echo "4. Update theme.liquid to include shelzy-custom.css"
echo ""
echo "For detailed instructions, see DEPLOY_GUIDE.md"
echo "======================================="
