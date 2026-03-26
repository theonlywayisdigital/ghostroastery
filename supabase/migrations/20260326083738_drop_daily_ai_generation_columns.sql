-- Drop legacy daily AI generation tracking columns
-- These are replaced by the unified monthly credit system (ai_credit_ledger + monthly_ai_credits_used)
ALTER TABLE partner_roasters DROP COLUMN IF EXISTS ai_generations_today;
ALTER TABLE partner_roasters DROP COLUMN IF EXISTS ai_generation_reset_at;
