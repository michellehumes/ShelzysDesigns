#!/bin/bash
# Lighthouse Performance Audit Script for Shelzy's Designs
# Usage: ./audit-performance.sh

URL="https://shelzysdesigns.com"
OUTPUT_DIR="$(dirname "$0")/../audits"
DATE=$(date +%Y-%m-%d_%H%M)

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "=================================="
echo "Shelzy's Designs Performance Audit"
echo "=================================="
echo "Date: $(date)"
echo "URL: $URL"
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "Lighthouse not found. Installing..."
    npm install -g lighthouse
fi

# Run Lighthouse audit
echo "Running Lighthouse audit..."
lighthouse "$URL" \
    --output=html,json \
    --output-path="$OUTPUT_DIR/lighthouse-$DATE" \
    --chrome-flags="--headless --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo

# Check if audit succeeded
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Audit complete!"
    echo "Reports saved to:"
    echo "  - $OUTPUT_DIR/lighthouse-$DATE.html"
    echo "  - $OUTPUT_DIR/lighthouse-$DATE.json"
    echo ""
    echo "Opening HTML report..."
    open "$OUTPUT_DIR/lighthouse-$DATE.html" 2>/dev/null || echo "Open manually: $OUTPUT_DIR/lighthouse-$DATE.html"
else
    echo "❌ Audit failed. Check error messages above."
fi
