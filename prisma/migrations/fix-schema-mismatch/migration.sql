-- This migration fixes the schema mismatch by removing references to columns that don't exist

-- AlterTable
ALTER TABLE "Bot" DROP COLUMN IF EXISTS "discordServerId";
ALTER TABLE "Bot" DROP COLUMN IF EXISTS "discordChannelId";
ALTER TABLE "Bot" DROP COLUMN IF EXISTS "lastSuccessfulRun";
ALTER TABLE "Bot" DROP COLUMN IF EXISTS "failureCount";
ALTER TABLE "Bot" DROP COLUMN IF EXISTS "deactivationReason";

-- Add missing columns if they don't exist
ALTER TABLE "Bot" ADD COLUMN IF NOT EXISTS "paidUpTillEpoch" INTEGER;
ALTER TABLE "Bot" ADD COLUMN IF NOT EXISTS "lastRunEpoch" INTEGER;
