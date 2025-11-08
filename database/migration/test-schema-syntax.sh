#!/bin/bash
# Quick syntax validation
echo "Checking for common SQL errors..."

echo -n "1. Invalid REFERENCES null(null): "
if grep -q "REFERENCES null(null)" schema.sql | grep -v "^--"; then
  echo "❌ FOUND"
  grep -n "REFERENCES null(null)" schema.sql | grep -v "^--"
else
  echo "✅ NONE"
fi

echo -n "2. Trailing commas before );: "
if grep -B1 "^);" schema.sql | grep ",$" | grep -v "FOREIGN KEY\|UNIQUE\|CHECK" | grep -q .; then
  echo "❌ FOUND"
  grep -B1 "^);" schema.sql | grep -n ",$" | grep -v "FOREIGN KEY\|UNIQUE\|CHECK"
else
  echo "✅ NONE"
fi

echo -n "3. Duplicate constraints: "
DUPES=$(grep "UNIQUE\|PRIMARY KEY" schema.sql | grep -v "^--" | sort | uniq -d)
if [ -n "$DUPES" ]; then
  echo "❌ FOUND"
  echo "$DUPES"
else
  echo "✅ NONE"
fi

echo ""
echo "Schema file size: $(wc -l < schema.sql) lines"
echo "Tables defined: $(grep -c "^-- Table:" schema.sql)"
echo "Functions defined: $(grep -c "CREATE OR REPLACE FUNCTION" schema.sql)"
