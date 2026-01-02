-- Check Row Level Security status on Piccolo tables

SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename LIKE 'piccolo%'
ORDER BY tablename;

-- Also check if there are any policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename LIKE 'piccolo%'
ORDER BY tablename, policyname;
