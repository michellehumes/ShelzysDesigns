#!/bin/bash
#
# Comet Campaign Deployment Script
# Deploys a campaign pack to Shopify theme
#
# Usage: ./deploy-campaign.sh <campaign_slug> [--preview]
#

set -e

CAMPAIGN_SLUG=$1
PREVIEW_MODE=$2

if [ -z "$CAMPAIGN_SLUG" ]; then
  echo "Error: Please provide a campaign slug"
  echo "Usage: ./deploy-campaign.sh <campaign_slug> [--preview]"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CAMPAIGN_PATH="$PROJECT_ROOT/ops/comet_packs/$CAMPAIGN_SLUG"

echo ""
echo "🚀 Comet Campaign Deployment"
echo "=================================="
echo "Campaign: $CAMPAIGN_SLUG"
echo "Project: $PROJECT_ROOT"
echo ""

# Validate campaign
echo "Step 1: Validating campaign..."
node "$SCRIPT_DIR/validate-campaign.js" "$CAMPAIGN_SLUG"
if [ $? -ne 0 ]; then
  echo "❌ Validation failed. Aborting deployment."
  exit 1
fi

# Generate mutations
echo ""
echo "Step 2: Generating data mutations..."
node "$SCRIPT_DIR/ingest-campaign.js" "$CAMPAIGN_SLUG"

# Check for Shopify CLI
if ! command -v shopify &> /dev/null; then
  echo ""
  echo "⚠ Shopify CLI not found. Manual deployment required."
  echo ""
  echo "To complete deployment:"
  echo "1. Install Shopify CLI: npm install -g @shopify/cli @shopify/theme"
  echo "2. Authenticate: shopify auth login --store your-store.myshopify.com"
  echo "3. Run: shopify theme push --path $PROJECT_ROOT"
  echo "4. Apply metafield mutations from: $CAMPAIGN_PATH/generated-mutations.json"
  echo ""
  exit 0
fi

# Create preview theme or push to development
if [ "$PREVIEW_MODE" == "--preview" ]; then
  echo ""
  echo "Step 3: Creating preview theme..."
  THEME_NAME="Campaign Preview: $CAMPAIGN_SLUG ($(date +%Y-%m-%d))"

  # Push to preview theme
  shopify theme push --unpublished --json --path "$PROJECT_ROOT" 2>&1 | tee /tmp/theme-push-output.json

  # Extract preview URL
  PREVIEW_URL=$(cat /tmp/theme-push-output.json | grep -o '"preview_url":"[^"]*"' | cut -d'"' -f4)

  if [ -n "$PREVIEW_URL" ]; then
    echo ""
    echo "✅ Preview theme created!"
    echo "🔗 Preview URL: $PREVIEW_URL"
    echo ""

    # Save preview URL to campaign
    echo "{\"preview_url\": \"$PREVIEW_URL\", \"created_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$CAMPAIGN_PATH/preview-theme.json"
  fi
else
  echo ""
  echo "Step 3: Pushing to development theme..."
  shopify theme push --development --path "$PROJECT_ROOT"
fi

echo ""
echo "Step 4: Apply metafield mutations..."
echo "⚠ Metafield mutations must be applied via Shopify Admin API or GraphiQL"
echo "   See: $CAMPAIGN_PATH/generated-mutations.json"
echo ""

echo "=================================="
echo "✅ Campaign deployment complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Review preview theme (if created)"
echo "2. Apply metafield mutations via Admin API"
echo "3. Upload media files to Shopify Files"
echo "4. Test all sections and templates"
echo "5. Publish theme when ready"
echo ""
