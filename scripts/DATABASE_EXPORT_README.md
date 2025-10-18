# Database Export Scripts

This folder contains scripts to export your Supabase database in different formats.

## Prerequisites

Install PostgreSQL client tools:

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-client
```

**macOS:**
```bash
brew install postgresql
```

**Windows:**
Download from: https://www.postgresql.org/download/windows/

## Get Your Database Password

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings** → **Database**
4. Scroll to **Connection String** section
5. Click **Show** next to the URI connection string
6. Copy the password (between `:` and `@`)

Example URI:
```
postgresql://postgres.jhugrvpaizlzeemazuna:[YOUR_PASSWORD]@db.jhugrvpaizlzeemazuna.supabase.co:5432/postgres
```

## Available Export Scripts

### 1. Export Schema Only (No Data)

Exports table structures, indexes, constraints, but NO data.

**Usage:**
```bash
./scripts/export-schema-only.sh
```

**Output:**
- File: `database-schema-YYYYMMDD-HHMMSS.sql`
- Contains: Table definitions, indexes, constraints, functions
- Use for: Setting up new environments, version control

---

### 2. Export Full Database (Schema + Data)

Exports everything: tables, data, indexes, constraints.

**Usage:**
```bash
./scripts/export-with-data.sh
```

**Output:**
- File: `database-full-YYYYMMDD-HHMMSS.sql`
- Contains: Everything (schema + all data)
- Use for: Full backups, migration to new database

---

### 3. Export Data Only (No Schema)

Exports only the data (INSERT statements), no table structures.

**Usage:**
```bash
./scripts/export-data-only.sh
```

**Output:**
- File: `database-data-YYYYMMDD-HHMMSS.sql`
- Contains: Only INSERT statements with data
- Use for: Seeding databases, testing with real data

---

## Examples

### Daily Backup (Full Database)
```bash
# Run this daily to backup everything
./scripts/export-with-data.sh

# Optional: Upload to cloud storage
# rsync database-full-*.sql user@backup-server:/backups/
```

### Version Control Schema
```bash
# Export schema for git tracking
./scripts/export-schema-only.sh

# Rename to standard name
mv database-schema-*.sql database-schema.sql

# Commit to git
git add database-schema.sql
git commit -m "Update database schema"
```

### Migrate to New Environment
```bash
# 1. Export from production
./scripts/export-with-data.sh

# 2. Import to new database
psql -h new-host -U postgres -d new_database -f database-full-*.sql
```

---

## Alternative: Using Supabase Dashboard

### Export via Dashboard:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Database** → **Backups**
4. Click **Download** on any backup point
5. Get a `.sql.gz` file (compressed SQL dump)

### Restore from Dashboard Backup:

```bash
# Decompress
gunzip backup.sql.gz

# Import
psql -h db.jhugrvpaizlzeemazuna.supabase.co -U postgres.jhugrvpaizlzeemazuna -d postgres -f backup.sql
```

---

## Troubleshooting

### Error: "pg_dump: command not found"
Install PostgreSQL client tools (see Prerequisites above)

### Error: "password authentication failed"
- Make sure you're using the correct database password
- Get it from: Supabase Dashboard → Settings → Database → Connection String

### Error: "connection refused"
- Check your internet connection
- Verify database host is correct: `db.jhugrvpaizlzeemazuna.supabase.co`
- Make sure Supabase project is active

### Export is taking too long
- Large databases may take several minutes
- Be patient, let it complete
- Check file size: `du -h database-*.sql`

---

## Automated Daily Backups

Add to crontab for automatic daily backups:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * cd /path/to/your/project && DB_PASSWORD=your-password ./scripts/export-with-data.sh
```

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit database dumps with real data to git
- Add `database-*.sql` to `.gitignore`
- Store backups securely (encrypted cloud storage)
- Rotate/delete old backups regularly

---

## File Sizes (Approximate)

| Export Type | Example Size | Notes |
|-------------|--------------|-------|
| Schema only | 10-50 KB | Small, safe for git |
| Data only | 100 KB - 10 MB | Depends on data volume |
| Full backup | 100 KB - 10 MB | Complete backup |

---

## Questions?

- **Supabase Docs**: https://supabase.com/docs/guides/database/backups
- **PostgreSQL pg_dump**: https://www.postgresql.org/docs/current/app-pgdump.html
