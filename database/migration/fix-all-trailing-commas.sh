#!/bin/bash
# Find and fix all trailing commas before );

echo "Checking for trailing commas before table closures..."

# Get all line numbers where we have ); 
while IFS= read -r linenum; do
  prevline=$((linenum - 1))
  line_content=$(sed -n "${prevline}p" schema.sql)
  
  # Check if previous line ends with comma
  if echo "$line_content" | grep -q ",$"; then
    # Check if it's a valid comma (before FOREIGN KEY, UNIQUE, CHECK, etc)
    if ! echo "$line_content" | grep -qE "FOREIGN KEY|^  [a-z_]+ "; then
      echo "Line $prevline: $line_content"
      # Remove the trailing comma
      sed -i "${prevline}s/,$//" schema.sql
      echo "  → Fixed"
    fi
  fi
done < <(grep -n "^);" schema.sql | cut -d: -f1)

echo "✅ All trailing commas fixed"
