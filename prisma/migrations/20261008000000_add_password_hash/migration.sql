-- Add password authentication support
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
