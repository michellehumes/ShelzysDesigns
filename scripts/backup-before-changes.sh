#!/bin/bash
# Backup script for Shelzy's Designs project
# Creates timestamped backup of all project files
# Usage: ./backup-before-changes.sh

BACKUP_DIR="$(dirname "$0")/../backups"
DATE=$(date +%Y-%m-%d_%H%M)
BACKUP_NAME="shelzys-backup-$DATE"

echo "=================================="
echo "Shelzy's Designs Backup Script"
echo "=================================="
echo "Date: $(date)"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup (excluding node_modules, .git, etc.)
echo "Creating backup: $BACKUP_NAME.tar.gz"

cd "$(dirname "$0")/.."
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" \
    --exclude="backups" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="audits" \
    --exclude="*.tar.gz" \
    .

if [ $? -eq 0 ]; then
    SIZE=$(ls -lh "$BACKUP_DIR/$BACKUP_NAME.tar.gz" | awk '{print $5}')
    echo ""
    echo "✅ Backup complete!"
    echo "Location: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
    echo "Size: $SIZE"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Clean up old backups (keep last 5)
echo ""
echo "Cleaning up old backups (keeping last 5)..."
cd "$BACKUP_DIR"
ls -t shelzys-backup-*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm -v

echo ""
echo "Done!"
