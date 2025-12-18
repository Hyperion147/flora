# Database Migration Guide

## Current Schema Updates

The schema has been updated to include:
- ✅ `category` field in plants table (varchar, 100 characters)
- ✅ Index on category field for better query performance

## Migration Commands

### 1. Generate Migration Files

First, generate the migration files based on your schema changes:

```bash
npx drizzle-kit generate
```

This will create migration files in the `./drizzle` directory.

### 2. Apply Migrations to Supabase

You have two options to apply migrations:

#### Option A: Using Drizzle Push (Recommended for Development)

```bash
npx drizzle-kit push
```

This directly applies schema changes to your database without creating migration files.

#### Option B: Using Migration Files (Recommended for Production)

```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

### 3. Verify Migration

Check if the migration was successful:

```bash
npx drizzle-kit introspect
```

## Environment Setup

Make sure your `.env` file has the correct DATABASE_URL:

```env
DATABASE_URL=your_supabase_database_url_here
```

You can find this in your Supabase dashboard under:
Settings → Database → Connection string → URI

## Drizzle Studio (Optional)

To visually inspect your database:

```bash
npx drizzle-kit studio
```

This opens a web interface at `https://local.drizzle.studio`

## Common Commands

```bash
# Generate migration files only
npx drizzle-kit generate

# Push schema changes directly (no migration files)
npx drizzle-kit push

# Apply existing migration files
npx drizzle-kit migrate

# Inspect current database schema
npx drizzle-kit introspect

# Open Drizzle Studio
npx drizzle-kit studio

# Check migration status
npx drizzle-kit check
```

## Troubleshooting

### If you get connection errors:
1. Check your DATABASE_URL in `.env`
2. Ensure your Supabase project is running
3. Verify your database credentials

### If migrations fail:
1. Check if the table already exists in Supabase
2. Manually add the `category` column if needed:
   ```sql
   ALTER TABLE plants ADD COLUMN category VARCHAR(100);
   CREATE INDEX idx_plants_category ON plants(category);
   ```

### Manual SQL (if needed):
If automatic migration fails, you can run this SQL directly in Supabase SQL Editor:

```sql
-- Add category column if it doesn't exist
ALTER TABLE plants ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_plants_category ON plants(category);
```

## Next Steps

After migration:
1. Test the plant form with category selection
2. Verify AI-generated categories are being saved
3. Check that existing plants still work correctly