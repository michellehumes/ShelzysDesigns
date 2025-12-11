#!/bin/bash
# =============================================================================
# Shelzy's Designs - Image Optimization Script
# =============================================================================
# This script optimizes images for web performance by:
# 1. Converting images to WebP format
# 2. Compressing JPG/PNG files
# 3. Generating responsive image sizes
#
# Prerequisites:
# - cwebp (brew install webp)
# - jpegoptim (brew install jpegoptim)
# - optipng (brew install optipng)
# - ImageMagick (brew install imagemagick)
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INPUT_DIR="${1:-./images}"
OUTPUT_DIR="${2:-./images/optimized}"
WEBP_QUALITY=80
JPEG_QUALITY=85
RESPONSIVE_SIZES=(400 800 1200 1600)

# Check dependencies
check_dependencies() {
    echo -e "${BLUE}Checking dependencies...${NC}"

    local deps=("cwebp" "jpegoptim" "optipng" "convert")
    local missing=()

    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done

    if [ ${#missing[@]} -gt 0 ]; then
        echo -e "${RED}Missing dependencies: ${missing[*]}${NC}"
        echo "Install with: brew install webp jpegoptim optipng imagemagick"
        exit 1
    fi

    echo -e "${GREEN}All dependencies installed${NC}"
}

# Create output directory
setup_directories() {
    echo -e "${BLUE}Setting up directories...${NC}"
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR/webp"
    mkdir -p "$OUTPUT_DIR/responsive"
    echo -e "${GREEN}Directories ready${NC}"
}

# Convert to WebP
convert_to_webp() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local output="$OUTPUT_DIR/webp/${name}.webp"

    if [ -f "$output" ]; then
        echo -e "${YELLOW}Skipping (exists): $output${NC}"
        return
    fi

    echo -e "${BLUE}Converting to WebP: $filename${NC}"
    cwebp -q $WEBP_QUALITY "$file" -o "$output" 2>/dev/null

    # Calculate savings
    local original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
    local new_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output")
    local savings=$(( (original_size - new_size) * 100 / original_size ))

    echo -e "${GREEN}Saved ${savings}%: $output${NC}"
}

# Compress JPEG files
compress_jpeg() {
    local file="$1"
    local filename=$(basename "$file")
    local output="$OUTPUT_DIR/$filename"

    echo -e "${BLUE}Compressing JPEG: $filename${NC}"
    cp "$file" "$output"
    jpegoptim --max=$JPEG_QUALITY --strip-all --quiet "$output"

    local original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
    local new_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output")
    local savings=$(( (original_size - new_size) * 100 / original_size ))

    echo -e "${GREEN}Saved ${savings}%: $output${NC}"
}

# Compress PNG files
compress_png() {
    local file="$1"
    local filename=$(basename "$file")
    local output="$OUTPUT_DIR/$filename"

    echo -e "${BLUE}Compressing PNG: $filename${NC}"
    cp "$file" "$output"
    optipng -o2 -quiet "$output"

    local original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
    local new_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output")
    local savings=$(( (original_size - new_size) * 100 / original_size ))

    echo -e "${GREEN}Saved ${savings}%: $output${NC}"
}

# Generate responsive sizes
generate_responsive() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"

    echo -e "${BLUE}Generating responsive images: $filename${NC}"

    for size in "${RESPONSIVE_SIZES[@]}"; do
        local output="$OUTPUT_DIR/responsive/${name}-${size}w.${ext}"

        if [ -f "$output" ]; then
            continue
        fi

        convert "$file" -resize "${size}x>" "$output"

        # Also create WebP version
        local webp_output="$OUTPUT_DIR/responsive/${name}-${size}w.webp"
        cwebp -q $WEBP_QUALITY "$output" -o "$webp_output" 2>/dev/null
    done

    echo -e "${GREEN}Responsive images generated${NC}"
}

# Main processing function
process_images() {
    echo -e "${BLUE}Processing images in: $INPUT_DIR${NC}"

    local total=0
    local processed=0

    # Count total files
    total=$(find "$INPUT_DIR" -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | wc -l | tr -d ' ')

    if [ "$total" -eq 0 ]; then
        echo -e "${YELLOW}No images found in $INPUT_DIR${NC}"
        exit 0
    fi

    echo -e "${BLUE}Found $total images to process${NC}"
    echo ""

    # Process each image
    find "$INPUT_DIR" -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r file; do
        processed=$((processed + 1))
        echo -e "${BLUE}[$processed/$total] Processing: $(basename "$file")${NC}"

        # Convert to WebP
        convert_to_webp "$file"

        # Compress original format
        case "${file,,}" in
            *.jpg|*.jpeg)
                compress_jpeg "$file"
                ;;
            *.png)
                compress_png "$file"
                ;;
        esac

        # Generate responsive sizes
        generate_responsive "$file"

        echo ""
    done
}

# Generate summary report
generate_report() {
    echo -e "${BLUE}=== Image Optimization Report ===${NC}"
    echo ""

    local original_size=0
    local optimized_size=0

    # Calculate total sizes
    if [ -d "$INPUT_DIR" ]; then
        original_size=$(find "$INPUT_DIR" -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -exec stat -f%z {} + 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo 0)
    fi

    if [ -d "$OUTPUT_DIR" ]; then
        optimized_size=$(find "$OUTPUT_DIR" -type f -exec stat -f%z {} + 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo 0)
    fi

    echo "Original size: $(( original_size / 1024 )) KB"
    echo "Optimized size: $(( optimized_size / 1024 )) KB"

    if [ "$original_size" -gt 0 ]; then
        local savings=$(( (original_size - optimized_size) * 100 / original_size ))
        echo "Total savings: ${savings}%"
    fi

    echo ""
    echo -e "${GREEN}Optimization complete!${NC}"
    echo "Output directory: $OUTPUT_DIR"
}

# Main execution
main() {
    echo ""
    echo "============================================"
    echo "  Shelzy's Designs - Image Optimizer"
    echo "============================================"
    echo ""

    check_dependencies
    setup_directories
    process_images
    generate_report
}

# Run main
main "$@"
