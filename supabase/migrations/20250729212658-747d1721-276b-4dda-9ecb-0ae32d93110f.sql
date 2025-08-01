-- Add missing columns to layoffs table for CSV import
ALTER TABLE public.layoffs 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS county text,
ADD COLUMN IF NOT EXISTS industry text;