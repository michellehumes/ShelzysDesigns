#!/bin/bash
# Shelzy's Designs - Image Optimization Script
# Requires: imagemagick, cwebp

echo "=========================================="
echo "IMAGE OPTIMIZATION SCRIPT"
echo "=========================================="

# Check for required tools
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Install with: brew install imagemagick"
    exit 1
fi

if ! command -v cwebp &> /dev/null; then
    echo "cwebp not found. Install with: brew install webp"
    exit 1
fi

# Create optimized directory
OPTIMIZED_DIR="assets/optimized"
mkdir -p "$OPTIMIZED_DIR"

# Find and optimize PNG files
echo "Optimizing PNG files..."
find ./assets -name "*.png" -type f | while read file; do
    filename=$(basename "$file")
    echo "Processing: $filename"

    # Compress PNG
    convert "$file" -quality 85 -strip "$OPTIMIZED_DIR/${filename}"

    # Create WebP version
    cwebp -q 80 "$file" -o "$OPTIMIZED_DIR/${filename%.png}.webp"
done

# Find and optimize JPG files
echo "Optimizing JPG files..."
find ./assets -name "*.jpg" -type f | while read file; do
    filename=$(basename "$file")
    echo "Processing: $filename"

    # Compress JPG
    convert "$file" -quality 85 -strip "$OPTIMIZED_DIR/${filename}"

    # Create WebP version
    cwebp -q 80 "$file" -o "$OPTIMIZED_DIR/${filename%.jpg}.webp"
done

# Generate responsive variants
echo "Creating responsive variants..."
find "$OPTIMIZED_DIR" -name "*.jpg" -o -name "*.png" | while read file; do
    filename=$(basename "$file")
    name="${filename%.*}"
    ext="${filename##*.}"

    # Create 400w, 800w, 1200w variants
    convert "$file" -resize 400x "$OPTIMIZED_DIR/${name}-400w.${ext}"
    convert "$file" -resize 800x "$OPTIMIZED_DIR/${name}-800w.${ext}"
    convert "$file" -resize 1200x "$OPTIMIZED_DIR/${name}-1200w.${ext}"
done

# Report savings
echo ""
echo "=========================================="
echo "OPTIMIZATION COMPLETE"
echo "=========================================="
echo "Optimized files saved to: $OPTIMIZED_DIR"

# Calculate savings
ORIGINAL_SIZE=$(find ./assets -name "*.png" -o -name "*.jpg" | xargs du -ch 2>/dev/null | tail -1 | cut -f1)
OPTIMIZED_SIZE=$(du -ch "$OPTIMIZED_DIR"/* 2>/dev/null | tail -1 | cut -f1)
echo "Original size: $ORIGINAL_SIZE"
echo "Optimized size: $OPTIMIZED_SIZE"
