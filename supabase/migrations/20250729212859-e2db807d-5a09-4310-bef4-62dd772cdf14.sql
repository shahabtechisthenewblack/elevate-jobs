-- Fix column names and types to match CSV format exactly
-- Add missing columns with exact case-sensitive names
ALTER TABLE public.layoffs 
ADD COLUMN IF NOT EXISTS "Company" text,
ADD COLUMN IF NOT EXISTS "City" text,
ADD COLUMN IF NOT EXISTS "Region" text,
ADD COLUMN IF NOT EXISTS "Industry" text;

-- Also keep the lowercase versions for compatibility
ALTER TABLE public.layoffs 
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS city_name text,
ADD COLUMN IF NOT EXISTS region_name text,
ADD COLUMN IF NOT EXISTS industry_name text;