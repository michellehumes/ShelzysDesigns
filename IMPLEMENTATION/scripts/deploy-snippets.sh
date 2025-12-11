#!/bin/bash
# =============================================================================
# Shelzy's Designs - Shopify Snippet Deployment Script
# =============================================================================
# Deploys Liquid snippets to Shopify theme using Theme Kit or CLI
#
# Prerequisites:
# - Shopify CLI installed (npm install -g @shopify/cli @shopify/theme)
# - OR Theme Kit installed (brew tap shopify/shopify && brew install themekit)
# - Store credentials configured
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SNIPPETS_DIR="${1:-./shopify/snippets}"
STORE_URL="${SHOPIFY_STORE_URL:-shelzysdesigns.myshopify.com}"
THEME_ID="${SHOPIFY_THEME_ID:-}"

# Snippet categories for selective deployment
CRITICAL_SNIPPETS=(
    "shelzys-cart-upsell.liquid"
    "shelzys-trust-badges.liquid"
    "shelzys-free-shipping-bar.liquid"
    "shelzys-urgency.liquid"
)

HIGH_PRIORITY_SNIPPETS=(
    "shelzys-product-faq.liquid"
    "shelzys-sticky-atc.liquid"
    "shelzys-delivery-estimator.liquid"
    "shelzys-breadcrumbs.liquid"
)

ENHANCEMENT_SNIPPETS=(
    "shelzys-recently-viewed.liquid"
    "shelzys-instagram-feed.liquid"
    "shelzys-quick-view.liquid"
    "shelzys-back-to-top.liquid"
)

# Check for Shopify CLI or Theme Kit
check_cli() {
    if command -v shopify &> /dev/null; then
        echo -e "${GREEN}Found: Shopify CLI${NC}"
        CLI_TYPE="shopify"
    elif command -v theme &> /dev/null; then
        echo -e "${GREEN}Found: Theme Kit${NC}"
        CLI_TYPE="themekit"
    else
        echo -e "${RED}Error: Neither Shopify CLI nor Theme Kit found${NC}"
        echo "Install with: npm install -g @shopify/cli @shopify/theme"
        echo "Or: brew tap shopify/shopify && brew install themekit"
        exit 1
    fi
}

# List available snippets
list_snippets() {
    echo -e "${BLUE}Available snippets in $SNIPPETS_DIR:${NC}"
    echo ""

    if [ -d "$SNIPPETS_DIR" ]; then
        local count=0
        for file in "$SNIPPETS_DIR"/*.liquid; do
            if [ -f "$file" ]; then
                local filename=$(basename "$file")
                echo "  - $filename"
                count=$((count + 1))
            fi
        done
        echo ""
        echo -e "${GREEN}Total: $count snippets${NC}"
    else
        echo -e "${RED}Directory not found: $SNIPPETS_DIR${NC}"
    fi
}

# Deploy single snippet
deploy_snippet() {
    local snippet_path="$1"
    local filename=$(basename "$snippet_path")

    if [ ! -f "$snippet_path" ]; then
        echo -e "${RED}Not found: $snippet_path${NC}"
        return 1
    fi

    echo -e "${BLUE}Deploying: $filename${NC}"

    if [ "$CLI_TYPE" = "shopify" ]; then
        shopify theme push --path "$snippet_path" --store "$STORE_URL" ${THEME_ID:+--theme "$THEME_ID"}
    else
        theme deploy "$snippet_path" --store "$STORE_URL" ${THEME_ID:+--themeid "$THEME_ID"}
    fi

    echo -e "${GREEN}Deployed: $filename${NC}"
}

# Deploy snippet category
deploy_category() {
    local category="$1"
    shift
    local snippets=("$@")

    echo ""
    echo -e "${BLUE}=== Deploying $category Snippets ===${NC}"
    echo ""

    for snippet in "${snippets[@]}"; do
        local path="$SNIPPETS_DIR/$snippet"
        if [ -f "$path" ]; then
            deploy_snippet "$path"
        else
            echo -e "${YELLOW}Skipping (not found): $snippet${NC}"
        fi
    done
}

# Deploy all snippets
deploy_all() {
    echo -e "${BLUE}Deploying all snippets...${NC}"

    if [ "$CLI_TYPE" = "shopify" ]; then
        shopify theme push --path "$SNIPPETS_DIR" --store "$STORE_URL" ${THEME_ID:+--theme "$THEME_ID"}
    else
        theme deploy "$SNIPPETS_DIR/*.liquid" --store "$STORE_URL" ${THEME_ID:+--themeid "$THEME_ID"}
    fi

    echo -e "${GREEN}All snippets deployed${NC}"
}

# Interactive mode
interactive_mode() {
    echo ""
    echo "Select deployment option:"
    echo "1) Deploy CRITICAL snippets (cart upsells, trust badges, etc.)"
    echo "2) Deploy HIGH PRIORITY snippets (product enhancements)"
    echo "3) Deploy ENHANCEMENT snippets (nice-to-haves)"
    echo "4) Deploy ALL snippets"
    echo "5) Deploy specific snippet"
    echo "6) List available snippets"
    echo "7) Exit"
    echo ""
    read -p "Enter choice [1-7]: " choice

    case $choice in
        1)
            deploy_category "CRITICAL" "${CRITICAL_SNIPPETS[@]}"
            ;;
        2)
            deploy_category "HIGH PRIORITY" "${HIGH_PRIORITY_SNIPPETS[@]}"
            ;;
        3)
            deploy_category "ENHANCEMENT" "${ENHANCEMENT_SNIPPETS[@]}"
            ;;
        4)
            deploy_all
            ;;
        5)
            read -p "Enter snippet filename: " filename
            deploy_snippet "$SNIPPETS_DIR/$filename"
            ;;
        6)
            list_snippets
            ;;
        7)
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            ;;
    esac
}

# Dry run mode
dry_run() {
    echo -e "${YELLOW}=== DRY RUN MODE ===${NC}"
    echo ""
    echo "Would deploy the following snippets:"
    echo ""

    echo "CRITICAL:"
    for snippet in "${CRITICAL_SNIPPETS[@]}"; do
        [ -f "$SNIPPETS_DIR/$snippet" ] && echo "  - $snippet"
    done

    echo ""
    echo "HIGH PRIORITY:"
    for snippet in "${HIGH_PRIORITY_SNIPPETS[@]}"; do
        [ -f "$SNIPPETS_DIR/$snippet" ] && echo "  - $snippet"
    done

    echo ""
    echo "ENHANCEMENTS:"
    for snippet in "${ENHANCEMENT_SNIPPETS[@]}"; do
        [ -f "$SNIPPETS_DIR/$snippet" ] && echo "  - $snippet"
    done
}

# Print usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --all           Deploy all snippets"
    echo "  --critical      Deploy critical snippets only"
    echo "  --high          Deploy high priority snippets"
    echo "  --enhancements  Deploy enhancement snippets"
    echo "  --snippet FILE  Deploy specific snippet"
    echo "  --list          List available snippets"
    echo "  --dry-run       Show what would be deployed"
    echo "  --interactive   Interactive mode"
    echo "  --help          Show this help"
    echo ""
    echo "Environment variables:"
    echo "  SHOPIFY_STORE_URL   Your Shopify store URL"
    echo "  SHOPIFY_THEME_ID    Theme ID to deploy to"
}

# Main
main() {
    echo ""
    echo "============================================"
    echo "  Shelzy's Designs - Snippet Deployment"
    echo "============================================"
    echo ""

    check_cli

    case "${1:-}" in
        --all)
            deploy_all
            ;;
        --critical)
            deploy_category "CRITICAL" "${CRITICAL_SNIPPETS[@]}"
            ;;
        --high)
            deploy_category "HIGH PRIORITY" "${HIGH_PRIORITY_SNIPPETS[@]}"
            ;;
        --enhancements)
            deploy_category "ENHANCEMENT" "${ENHANCEMENT_SNIPPETS[@]}"
            ;;
        --snippet)
            deploy_snippet "$SNIPPETS_DIR/$2"
            ;;
        --list)
            list_snippets
            ;;
        --dry-run)
            dry_run
            ;;
        --interactive)
            interactive_mode
            ;;
        --help)
            usage
            ;;
        *)
            interactive_mode
            ;;
    esac
}

main "$@"
