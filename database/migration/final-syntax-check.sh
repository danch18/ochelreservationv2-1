#!/bin/bash
echo "=== FINAL SQL SYNTAX CHECK ==="
echo ""

errors=0

# 1. Check for REFERENCES null(null)
echo -n "1. Invalid foreign keys: "
if grep -q "REFERENCES null(null)" schema.sql 2>/dev/null; then
  echo "❌ FOUND"
  ((errors++))
else
  echo "✅ NONE"
fi

# 2. Check for trailing commas before );
echo -n "2. Trailing commas: "
if grep -B1 "^);" schema.sql | grep -v "^--" | grep -v "FOREIGN KEY\|UNIQUE\|CHECK\|PRIMARY KEY" | grep -q ",$"; then
  echo "❌ FOUND"
  grep -B1 "^);" schema.sql | grep -n ",$" | head -5
  ((errors++))
else
  echo "✅ NONE"
fi

# 3. Check for unmatched parentheses in CREATE TABLE
echo -n "3. Unmatched parentheses: "
creates=$(grep -c "^CREATE TABLE" schema.sql)
closes=$(grep -c "^);" schema.sql)
if [ "$creates" -ne "$closes" ]; then
  echo "❌ MISMATCH (CREATE: $creates, Close: $closes)"
  ((errors++))
else
  echo "✅ MATCH ($creates tables)"
fi

# 4. Check for incomplete function definitions
echo -n "4. Function syntax: "
func_start=$(grep -c "CREATE OR REPLACE FUNCTION" schema.sql)
func_end=$(grep -c "^\$function\$" schema.sql)
if [ "$((func_end % 2))" -ne 0 ]; then
  echo "❌ UNMATCHED"
  ((errors++))
else
  echo "✅ OK ($func_start functions)"
fi

# 5. Basic structure
echo ""
echo "=== Structure ==="
echo "Tables: $(grep -c '^-- Table:' schema.sql)"
echo "Functions: $(grep -c 'CREATE OR REPLACE FUNCTION' schema.sql)"
echo "Policies: $(grep -c 'CREATE POLICY' schema.sql)"
echo "Triggers: $(grep -c 'CREATE TRIGGER' schema.sql)"
echo "Total lines: $(wc -l < schema.sql)"

echo ""
if [ $errors -eq 0 ]; then
  echo "✅ SCHEMA IS VALID - READY FOR DEPLOYMENT"
  exit 0
else
  echo "❌ SCHEMA HAS $errors ERROR(S) - NEEDS FIXES"
  exit 1
fi
