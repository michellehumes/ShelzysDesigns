#!/bin/bash
# Double-click this file to deploy all features to your Shopify store

cd "$(dirname "$0")"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 SHELZY'S DESIGNS - DEPLOYING TO SHOPIFY                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

export SHOPIFY_ACCESS_TOKEN="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"
export SHOPIFY_STORE_URL="shelzys-designs.myshopify.com"

node shopify/scripts/deploy-and-inject.js

echo ""
echo "Press any key to close..."
read -n 1
