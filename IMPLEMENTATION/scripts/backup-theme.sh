#!/bin/bash
# =============================================================================
# Shelzy's Designs - Theme Backup Script
# =============================================================================
# Creates timestamped backups of the current Shopify theme
# Supports both local file backup and Shopify theme download
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="shelzys-theme-$TIMESTAMP"

# Directories to backup
BACKUP_PATHS=(
    "./shopify"
    "./brand"
    "./products"
    "./implementation"
    "./amazon-affiliate"
)

# Create backup directory
setup_backup() {
    mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
    echo -e "${BLUE}Created backup directory: $BACKUP_DIR/$BACKUP_NAME${NC}"
}

# Backup local files
backup_local() {
    echo -e "${BLUE}Backing up local files...${NC}"

    for path in "${BACKUP_PATHS[@]}"; do
        if [ -d "$path" ] || [ -f "$path" ]; then
            cp -r "$path" "$BACKUP_DIR/$BACKUP_NAME/"
            echo -e "${GREEN}Backed up: $path${NC}"
        else
            echo -e "${YELLOW}Skipped (not found): $path${NC}"
        fi
    done
}

# Backup Shopify theme (if CLI available)
backup_shopify() {
    if ! command -v shopify &> /dev/null; then
        echo -e "${YELLOW}Shopify CLI not found, skipping theme download${NC}"
        return
    fi

    echo -e "${BLUE}Downloading current Shopify theme...${NC}"

    local theme_dir="$BACKUP_DIR/$BACKUP_NAME/shopify-live-theme"
    mkdir -p "$theme_dir"

    shopify theme pull --path "$theme_dir" || {
        echo -e "${YELLOW}Could not download Shopify theme${NC}"
    }
}

# Create backup manifest
create_manifest() {
    local manifest="$BACKUP_DIR/$BACKUP_NAME/MANIFEST.txt"

    echo "Shelzy's Designs Theme Backup" > "$manifest"
    echo "==============================" >> "$manifest"
    echo "Created: $(date)" >> "$manifest"
    echo "Backup ID: $BACKUP_NAME" >> "$manifest"
    echo "" >> "$manifest"
    echo "Contents:" >> "$manifest"

    find "$BACKUP_DIR/$BACKUP_NAME" -type f | while read -r file; do
        echo "  - ${file#$BACKUP_DIR/$BACKUP_NAME/}" >> "$manifest"
    done

    echo -e "${GREEN}Created manifest: $manifest${NC}"
}

# Compress backup
compress_backup() {
    echo -e "${BLUE}Compressing backup...${NC}"

    cd "$BACKUP_DIR"
    tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"

    local size=$(du -h "$BACKUP_NAME.tar.gz" | cut -f1)
    echo -e "${GREEN}Created: $BACKUP_DIR/$BACKUP_NAME.tar.gz ($size)${NC}"

    # Optionally remove uncompressed directory
    rm -rf "$BACKUP_NAME"
}

# Clean old backups (keep last 5)
clean_old_backups() {
    echo -e "${BLUE}Cleaning old backups (keeping last 5)...${NC}"

    cd "$BACKUP_DIR"
    ls -t *.tar.gz 2>/dev/null | tail -n +6 | while read -r file; do
        rm -f "$file"
        echo -e "${YELLOW}Removed: $file${NC}"
    done
}

# List existing backups
list_backups() {
    echo -e "${BLUE}Existing backups:${NC}"
    echo ""

    if [ -d "$BACKUP_DIR" ]; then
        ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo "No backups found"
    else
        echo "Backup directory not found"
    fi
}

# Restore from backup
restore_backup() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        echo "Usage: $0 restore <backup-file.tar.gz>"
        return 1
    fi

    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}Backup file not found: $backup_file${NC}"
        return 1
    fi

    echo -e "${YELLOW}WARNING: This will overwrite current files!${NC}"
    read -p "Continue? (y/N): " confirm

    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Restore cancelled"
        return 0
    fi

    echo -e "${BLUE}Restoring from: $backup_file${NC}"

    # Extract to temp directory
    local temp_dir=$(mktemp -d)
    tar -xzf "$backup_file" -C "$temp_dir"

    # Copy files back
    local extracted_dir=$(ls "$temp_dir")
    cp -r "$temp_dir/$extracted_dir"/* ./

    rm -rf "$temp_dir"

    echo -e "${GREEN}Restore complete${NC}"
}

# Main
main() {
    echo ""
    echo "============================================"
    echo "  Shelzy's Designs - Theme Backup"
    echo "============================================"
    echo ""

    case "${1:-backup}" in
        backup)
            setup_backup
            backup_local
            backup_shopify
            create_manifest
            compress_backup
            clean_old_backups
            echo ""
            echo -e "${GREEN}Backup complete: $BACKUP_DIR/$BACKUP_NAME.tar.gz${NC}"
            ;;
        list)
            list_backups
            ;;
        restore)
            restore_backup "$2"
            ;;
        *)
            echo "Usage: $0 [backup|list|restore <file>]"
            ;;
    esac
}

main "$@"
