-- Create companies table for tracking Fortune 500 and other companies
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  country TEXT,
  state TEXT,
  employee_count INTEGER,
  funding_stage TEXT,
  logo_url TEXT,
  website_url TEXT,
  fortune_500_rank INTEGER,
  stock_symbol TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create layoffs table for tracking layoff events
CREATE TABLE public.layoffs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  date_announced DATE NOT NULL,
  employees_laid_off INTEGER,
  percentage_laid_off DECIMAL(5,2),
  reason TEXT,
  source_url TEXT,
  source_name TEXT,
  job_titles_affected TEXT[],
  departments_affected TEXT[],
  severance_offered BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_company_watchlist for users to track companies
CREATE TABLE public.user_company_watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  notification_email BOOLEAN DEFAULT true,
  notification_push BOOLEAN DEFAULT false,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Create layoff_alerts for tracking sent notifications
CREATE TABLE public.layoff_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  layoff_id UUID NOT NULL REFERENCES public.layoffs(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  alert_type TEXT NOT NULL DEFAULT 'email'
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_company_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layoff_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for companies (public read access)
CREATE POLICY "Companies are viewable by everyone" 
ON public.companies 
FOR SELECT 
USING (true);

-- Create policies for layoffs (public read access)
CREATE POLICY "Layoffs are viewable by everyone" 
ON public.layoffs 
FOR SELECT 
USING (true);

-- Create policies for user_company_watchlist
CREATE POLICY "Users can view their own watchlist" 
ON public.user_company_watchlist 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add companies to their watchlist" 
ON public.user_company_watchlist 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove companies from their watchlist" 
ON public.user_company_watchlist 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for layoff_alerts
CREATE POLICY "Users can view their own alerts" 
ON public.layoff_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_companies_industry ON public.companies(industry);
CREATE INDEX idx_layoffs_company_id ON public.layoffs(company_id);
CREATE INDEX idx_layoffs_date ON public.layoffs(date_announced);
CREATE INDEX idx_watchlist_user_id ON public.user_company_watchlist(user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_layoffs_updated_at
BEFORE UPDATE ON public.layoffs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();