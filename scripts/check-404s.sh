#!/bin/bash
# Check for 404 errors on Shelzy's Designs
# Usage: ./check-404s.sh

echo "=================================="
echo "Shelzy's Designs 404 Checker"
echo "=================================="
echo "Date: $(date)"
echo ""

# Define URLs to check
URLS=(
    "https://shelzysdesigns.com/"
    "https://shelzysdesigns.com/collections/all"
    "https://shelzysdesigns.com/collections/best-sellers"
    "https://shelzysdesigns.com/collections/personalized-bottles"
    "https://shelzysdesigns.com/collections/bridesmaid-bridal"
    "https://shelzysdesigns.com/collections/proposal-gift-boxes"
    "https://shelzysdesigns.com/collections/kids-bottles"
    "https://shelzysdesigns.com/collections/holiday"
    "https://shelzysdesigns.com/collections/bulk-corporate"
    "https://shelzysdesigns.com/pages/about"
    "https://shelzysdesigns.com/pages/contact"
    "https://shelzysdesigns.com/pages/faq"
    "https://shelzysdesigns.com/pages/how-it-works"
    "https://shelzysdesigns.com/pages/bulk-corporate"
    "https://shelzysdesigns.com/pages/shipping-policy"
    "https://shelzysdesigns.com/products/signature-personalized-bottle"
    "https://shelzysdesigns.com/products/bridesmaid-proposal-bottle-1"
    "https://shelzysdesigns.com/products/bridal-party-bottle-set-5-pack"
    "https://shelzysdesigns.com/products/kids-personalized-bottle"
)

# Counters
PASS=0
FAIL=0

echo "Checking ${#URLS[@]} URLs..."
echo ""

for url in "${URLS[@]}"; do
    status=$(curl -o /dev/null -s -w "%{http_code}" -L "$url")
    
    if [ "$status" = "200" ]; then
        echo "✅ $status - $url"
        ((PASS++))
    elif [ "$status" = "301" ] || [ "$status" = "302" ]; then
        echo "↪️  $status - $url (redirect)"
        ((PASS++))
    else
        echo "❌ $status - $url"
        ((FAIL++))
    fi
done

echo ""
echo "=================================="
echo "Results: $PASS passed, $FAIL failed"
echo "=================================="

if [ $FAIL -gt 0 ]; then
    exit 1
fi
