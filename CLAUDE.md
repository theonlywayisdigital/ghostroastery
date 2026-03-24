# Roastery Platform — Claude Code Instructions

## Supabase Migrations

ALWAYS run Supabase migrations programmatically. Never ask the user to do it manually.

The correct process every time is:

1. Generate the migration file:
```bash
supabase migration new <migration_name>
```

2. Write the SQL into the generated file in /supabase/migrations/

3. Push to remote:
```bash
supabase db push
```

4. Confirm the migration applied successfully before moving on.

Do NOT:
- Ask the user to run SQL manually in the Supabase dashboard
- Skip migration files and apply SQL directly
- Use the Supabase dashboard to make schema changes
- Give up and tell the user to do it manually

If a migration fails, debug it and fix the SQL. Do not hand it back to the user.

## Supabase Connection

- Project ref: `zaryzynzbpxmscggufdc`
- Region: eu-west-2
- DB password is stored in `SUPABASE_DB_PASSWORD` in `.env.local`
- Direct connection: `postgresql://postgres.zaryzynzbpxmscggufdc:[password]@aws-0-eu-west-2.pooler.supabase.com:5432/postgres`

## General Rules
- Always use the Supabase CLI for schema changes
- Always generate migration files — never raw SQL without a migration
- If Docker is not running for local dev, push directly to remote with `supabase db push`
