-- ============================================================================
-- COMPREHENSIVE admin_roles EXTRACTION QUERY
-- Extracts: Schema, Constraints, Indexes, Triggers, Policies, Permissions, Subscriptions
-- ============================================================================

SELECT jsonb_build_object(
  'table_name', 'admin_roles',
  'schema', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'column_name', column_name,
        'data_type', data_type,
        'udt_name', udt_name,
        'character_maximum_length', character_maximum_length,
        'is_nullable', is_nullable,
        'column_default', column_default,
        'ordinal_position', ordinal_position
      ) ORDER BY ordinal_position
    )
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'admin_roles'
  ),

  'constraints', (
    SELECT jsonb_object_agg(
      constraint_type,
      constraints_list
    )
    FROM (
      SELECT
        tc.constraint_type,
        jsonb_agg(
          jsonb_build_object(
            'constraint_name', tc.constraint_name,
            'column_name', kcu.column_name,
            'foreign_table', ccu.table_name,
            'foreign_column', ccu.column_name,
            'update_rule', rc.update_rule,
            'delete_rule', rc.delete_rule,
            'check_clause', cc.check_clause
          )
        ) as constraints_list
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      LEFT JOIN information_schema.referential_constraints rc
        ON tc.constraint_name = rc.constraint_name
        AND tc.table_schema = rc.constraint_schema
      LEFT JOIN information_schema.check_constraints cc
        ON tc.constraint_name = cc.constraint_name
        AND tc.table_schema = cc.constraint_schema
      WHERE tc.table_schema = 'public' AND tc.table_name = 'admin_roles'
      GROUP BY tc.constraint_type
    ) constraints_grouped
  ),

  'indexes', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'index_name', indexname,
        'index_definition', indexdef
      )
    )
    FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'admin_roles'
  ),

  'triggers', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'trigger_name', trigger_name,
        'event_manipulation', event_manipulation,
        'action_timing', action_timing,
        'action_statement', action_statement
      )
    )
    FROM information_schema.triggers
    WHERE event_object_schema = 'public' AND event_object_table = 'admin_roles'
  ),

  'rls_enabled', (
    SELECT relrowsecurity
    FROM pg_class
    WHERE relname = 'admin_roles' AND relnamespace = 'public'::regnamespace
  ),

  'policies', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'policy_name', policyname,
        'permissive', permissive,
        'roles', roles,
        'cmd', cmd,
        'qual', qual,
        'with_check', with_check
      )
    )
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admin_roles'
  ),

  'permissions', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'grantee', grantee,
        'privilege_type', privilege_type,
        'is_grantable', is_grantable
      )
    )
    FROM information_schema.table_privileges
    WHERE table_schema = 'public' AND table_name = 'admin_roles'
  ),

  'related_functions', (
    SELECT jsonb_agg(
      jsonb_build_object(
        'function_name', routine_name,
        'routine_definition', routine_definition,
        'data_type', data_type,
        'security_type', security_type
      )
    )
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND (
      routine_definition ILIKE '%admin_roles%'
      OR routine_name ILIKE '%admin%'
    )
  ),

  'realtime_subscription', (
    SELECT jsonb_build_object(
      'publication_exists', EXISTS(
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'admin_roles'
      ),
      'publication_name', 'supabase_realtime'
    )
  ),

  'table_exists', (
    SELECT EXISTS(
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'admin_roles'
    )
  ),

  'table_size', (
    SELECT CASE
      WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_roles')
      THEN pg_size_pretty(pg_total_relation_size('public.admin_roles'))
      ELSE 'Table does not exist'
    END
  ),

  'row_count', (
    SELECT CASE
      WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_roles')
      THEN (SELECT count(*)::text FROM public.admin_roles)
      ELSE '0'
    END
  )
) as admin_roles_full_info;
