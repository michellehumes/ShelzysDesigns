#!/bin/bash
# Shelzy's Designs - Implementation Script
# Run this after reviewing MASTER-RECOMMENDATIONS.md

echo "=========================================="
echo "SHELZY'S DESIGNS IMPLEMENTATION"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo -e "${RED}Error: Please run this script from the ShelzysDesigns root directory${NC}"
    exit 1
fi

echo -e "${GREEN}Starting implementation...${NC}"
echo ""

# Phase 1: Create backup
echo "Phase 1: Creating backup..."
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r shopify "$BACKUP_DIR/" 2>/dev/null
cp -r brand "$BACKUP_DIR/" 2>/dev/null
echo -e "${GREEN}✓ Backup created at $BACKUP_DIR${NC}"
echo ""

# Phase 2: Verify file structure
echo "Phase 2: Verifying file structure..."
REQUIRED_DIRS=("shopify/snippets" "shopify/sections" "shopify/emails" "audit-reports" "implementation")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓ $dir exists${NC}"
    else
        echo -e "${YELLOW}! Creating $dir${NC}"
        mkdir -p "$dir"
    fi
done
echo ""

# Phase 3: Check for required files
echo "Phase 3: Checking required files..."
REQUIRED_FILES=(
    "shopify/snippets/shelzys-email-popup.liquid"
    "shopify/snippets/shelzys-trust-badges.liquid"
    "shopify/emails/abandoned-cart-sequence.html"
)
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
    else
        echo -e "${RED}✗ $file missing${NC}"
    fi
done
echo ""

# Phase 4: List audit reports
echo "Phase 4: Audit reports status..."
AUDIT_FILES=(
    "audit-reports/technical-seo-audit.md"
    "audit-reports/ux-navigation-audit.md"
    "audit-reports/visual-aesthetic-audit.md"
    "audit-reports/content-audit.md"
    "audit-reports/email-automation-audit.md"
    "audit-reports/revenue-optimization-audit.md"
)
for file in "${AUDIT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file missing${NC}"
    fi
done
echo ""

# Phase 5: Generate implementation checklist
echo "Phase 5: Generating implementation checklist..."
cat > implementation/CHECKLIST.md << 'EOF'
# Implementation Checklist

## Week 1: Critical (P0)

### Email Automation
- [ ] Install Klaviyo app from Shopify App Store
- [ ] Connect Shopify integration
- [ ] Create COMEBACK10 discount code (10% off)
- [ ] Create PHOTOREVIEW15 discount code (15% off)
- [ ] Import abandoned-cart-sequence.html templates
- [ ] Set up Abandoned Cart flow (1h, 24h, 72h timing)
- [ ] Test with test order

### SEO Fundamentals
- [ ] Add meta title tags to theme.liquid
- [ ] Add meta descriptions to theme.liquid
- [ ] Add canonical URL tag to theme.liquid
- [ ] Configure robots.txt in Shopify Admin
- [ ] Verify sitemap.xml is accessible

### Compliance
- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] Add policy links to footer

## Week 2: High Priority (P1)

### Conversion Optimization
- [ ] Add Judge.me review widget to product template
- [ ] Add trust badges to cart page
- [ ] Add payment icons to cart page
- [ ] Add price-per-unit display on bundles

### Accessibility
- [ ] Add skip links to theme.liquid
- [ ] Add ARIA labels to icon buttons
- [ ] Test keyboard navigation

### Performance
- [ ] Convert font @import to preconnect links
- [ ] Remove duplicate email-popup.liquid

### Brand Consistency
- [ ] Consolidate CSS variables (single source)
- [ ] Standardize heading font (Playfair Display)
- [ ] Remove conflicting inline styles

## Week 3-4: Medium Priority (P2)

### Schema Markup
- [ ] Add Product schema to product template
- [ ] Add Breadcrumb schema to collection/product templates
- [ ] Add Open Graph tags to theme.liquid
- [ ] Add Twitter Card tags to theme.liquid

### Email Flows
- [ ] Create Welcome Series (3 emails)
- [ ] Create Post-Purchase flow (4 emails)
- [ ] Create Win-Back flow (60 days)

### UX Enhancements
- [ ] Add collection page filters
- [ ] Add countdown timers to offers
- [ ] Create bundle showcase page

## Testing Checklist

- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Test on Desktop Chrome
- [ ] Test on Desktop Firefox
- [ ] Test checkout flow
- [ ] Test email signup
- [ ] Test personalization form
- [ ] Verify all links work
- [ ] Run Lighthouse audit (target: 80+)

## Go-Live Checklist

- [ ] All P0 items complete
- [ ] All P1 items complete
- [ ] Testing passed
- [ ] Backup available
- [ ] Rollback plan ready
EOF

echo -e "${GREEN}✓ Checklist created at implementation/CHECKLIST.md${NC}"
echo ""

# Summary
echo "=========================================="
echo "IMPLEMENTATION SUMMARY"
echo "=========================================="
echo ""
echo "Audit reports generated: 6"
echo "Master recommendations: MASTER-RECOMMENDATIONS.md"
echo "Implementation checklist: implementation/CHECKLIST.md"
echo ""
echo "Next steps:"
echo "1. Review MASTER-RECOMMENDATIONS.md"
echo "2. Follow implementation/CHECKLIST.md"
echo "3. Start with P0 (Critical) items"
echo ""
echo -e "${GREEN}Ready for implementation!${NC}"
