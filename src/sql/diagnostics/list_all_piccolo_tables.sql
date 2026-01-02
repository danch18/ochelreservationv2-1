-- List all tables that start with 'piccolo'

SELECT
  table_name,
  'EXISTS ✓' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'piccolo%'
ORDER BY table_name;
