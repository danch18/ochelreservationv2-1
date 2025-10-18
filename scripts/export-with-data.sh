#!/bin/bash
# Export database schema + data (full backup)
# Usage: ./scripts/export-with-data.sh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Exporting full database (schema + data)...${NC}"

# Check if pg_dump is installed
if ! command -v pg_dump &> /dev/null; then
    echo "❌ pg_dump is not installed!"
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  macOS: brew install postgresql"
    exit 1
fi

# Database connection details
DB_HOST="db.jhugrvpaizlzeemazuna.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres.jhugrvpaizlzeemazuna"

# Prompt for password if not set
if [ -z "$DB_PASSWORD" ]; then
    echo "Enter your Supabase database password:"
    echo "(Find it at: Supabase Dashboard → Settings → Database → Connection String)"
    read -s DB_PASSWORD
    export PGPASSWORD="$DB_PASSWORD"
fi

# Output file
OUTPUT_FILE="database-full-$(date +%Y%m%d-%H%M%S).sql"

echo -e "${YELLOW}⏳ Exporting... This may take a few minutes.${NC}"

# Export full database (schema + data)
pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --no-owner \
  --no-acl \
  --file="$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database exported successfully!${NC}"
    echo "File: $OUTPUT_FILE"
    echo "Size: $(du -h "$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "This file contains:"
    echo "  ✓ All table schemas"
    echo "  ✓ All data"
    echo "  ✓ Indexes, constraints, triggers"
else
    echo "❌ Export failed!"
    exit 1
fi
