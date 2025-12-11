#!/bin/bash
# =============================================================================
# Shelzy's Designs - SEO Meta Tag Generator
# =============================================================================
# Generates optimized meta tags for products, collections, and pages
# Output format: CSV or JSON for easy import
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Brand constants
BRAND_NAME="Shelzy's Designs"
BRAND_SUFFIX="Premium Personalized Bottles"
DEFAULT_KEYWORDS="personalized water bottles, sublimation bottles, custom bottles, bridesmaid gifts"

# Output file
OUTPUT_FILE="${1:-seo-meta-tags.csv}"

# Initialize CSV
init_csv() {
    echo "type,handle,title,meta_description,og_title,og_description,keywords" > "$OUTPUT_FILE"
    echo -e "${BLUE}Initialized: $OUTPUT_FILE${NC}"
}

# Generate product meta
generate_product_meta() {
    local name="$1"
    local handle="$2"
    local category="$3"
    local price="$4"

    # Title: Product Name | Brand (under 60 chars)
    local title="${name} | ${BRAND_NAME}"
    if [ ${#title} -gt 60 ]; then
        title="${name:0:45}... | ${BRAND_NAME}"
    fi

    # Meta description (150-160 chars)
    local meta_desc="Shop ${name} from ${BRAND_NAME}. Premium sublimation printing that never peels or fades. Starting at \$${price}. Free shipping on orders \$75+."
    if [ ${#meta_desc} -gt 160 ]; then
        meta_desc="${meta_desc:0:157}..."
    fi

    # OG Title (more descriptive)
    local og_title="${name} - ${BRAND_SUFFIX}"

    # OG Description
    local og_desc="Premium personalized ${category} with permanent sublimation printing. Customize with your name or text. Perfect for gifts!"

    # Keywords
    local keywords="${category}, personalized ${category}, custom ${category}, ${DEFAULT_KEYWORDS}"

    # Output CSV row
    echo "product,${handle},\"${title}\",\"${meta_desc}\",\"${og_title}\",\"${og_desc}\",\"${keywords}\"" >> "$OUTPUT_FILE"
}

# Generate collection meta
generate_collection_meta() {
    local name="$1"
    local handle="$2"
    local description="$3"

    local title="${name} Collection | ${BRAND_NAME}"
    local meta_desc="Shop our ${name} collection. ${description} Free shipping on orders \$75+."

    if [ ${#meta_desc} -gt 160 ]; then
        meta_desc="${meta_desc:0:157}..."
    fi

    local og_title="${name} - ${BRAND_NAME}"
    local og_desc="${description}"
    local keywords="${name,,}, ${name,,} gifts, ${DEFAULT_KEYWORDS}"

    echo "collection,${handle},\"${title}\",\"${meta_desc}\",\"${og_title}\",\"${og_desc}\",\"${keywords}\"" >> "$OUTPUT_FILE"
}

# Generate page meta
generate_page_meta() {
    local name="$1"
    local handle="$2"
    local description="$3"

    local title="${name} | ${BRAND_NAME}"
    local meta_desc="${description}"

    if [ ${#meta_desc} -gt 160 ]; then
        meta_desc="${meta_desc:0:157}..."
    fi

    echo "page,${handle},\"${title}\",\"${meta_desc}\",\"${title}\",\"${description}\",\"${DEFAULT_KEYWORDS}\"" >> "$OUTPUT_FILE"
}

# Main generation
main() {
    echo ""
    echo "============================================"
    echo "  Shelzy's Designs - SEO Meta Generator"
    echo "============================================"
    echo ""

    init_csv

    echo -e "${BLUE}Generating product meta tags...${NC}"

    # Products
    generate_product_meta "Personalized 20oz Sublimation Bottle" "personalized-sublimation-bottle" "water bottle" "29"
    generate_product_meta "Bridesmaid Proposal Bottle" "bridesmaid-proposal-bottle" "bridesmaid gift" "32"
    generate_product_meta "Bridesmaid Proposal Gift Box" "bridesmaid-proposal-gift-box" "bridesmaid gift box" "65"
    generate_product_meta "Bridal Party Bottle Set" "bridal-party-bottle-set" "bridal party gifts" "125"
    generate_product_meta "Everyday Custom Bottle" "everyday-custom-bottle" "water bottle" "29"
    generate_product_meta "Kids Personalized Bottle" "kids-personalized-bottle" "kids water bottle" "27"
    generate_product_meta "Holiday Sublimation Bottle" "holiday-sublimation-bottle" "holiday gift" "32"
    generate_product_meta "Bulk Corporate Bottles" "bulk-corporate-bottles" "corporate gifts" "24"

    echo -e "${BLUE}Generating collection meta tags...${NC}"

    # Collections
    generate_collection_meta "Best Sellers" "best-sellers" "Our most loved personalized bottles, chosen by thousands of happy customers."
    generate_collection_meta "Personalized Bottles" "personalized-bottles" "Custom sublimation bottles with your name. Permanent printing that never peels."
    generate_collection_meta "Bridesmaid & Bridal Party" "bridesmaid-bridal-party" "Perfect personalized gifts for your wedding party. Bottles, gift boxes, and sets."
    generate_collection_meta "Proposal Gift Boxes" "proposal-gift-boxes" "Stunning bridesmaid proposal boxes with personalized bottle, card, and extras."
    generate_collection_meta "Kids Bottles" "kids-bottles" "Fun personalized bottles for kids. Durable and perfect for school, sports, and play."
    generate_collection_meta "Holiday Collection" "holiday-collection" "Festive personalized bottles for the holiday season. Perfect for gifting."
    generate_collection_meta "Bundles" "bundles" "Save with our curated bottle bundles. Perfect for bridal parties and groups."

    echo -e "${BLUE}Generating page meta tags...${NC}"

    # Pages
    generate_page_meta "About Us" "about" "Learn the story behind Shelzy's Designs. Premium personalized sublimation bottles made with care."
    generate_page_meta "How It Works" "how-it-works" "See how we create your personalized bottle. Choose design, add your name, we create and ship."
    generate_page_meta "FAQ" "faq" "Frequently asked questions about our personalized sublimation bottles, ordering, and shipping."
    generate_page_meta "Contact" "contact" "Get in touch with Shelzy's Designs. Questions about orders, customization, or bulk pricing."
    generate_page_meta "Bulk & Corporate" "bulk-corporate" "Corporate and bulk order pricing for personalized bottles. Perfect for teams, events, and gifts."

    echo ""
    echo -e "${GREEN}Generated meta tags for:${NC}"
    echo "  - 8 products"
    echo "  - 7 collections"
    echo "  - 5 pages"
    echo ""
    echo -e "${GREEN}Output: $OUTPUT_FILE${NC}"
}

main "$@"
