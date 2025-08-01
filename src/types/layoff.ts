export interface Company {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  state: string | null;
  employee_count: number | null;
  funding_stage: string | null;
  logo_url: string | null;
  website_url: string | null;
  fortune_500_rank: number | null;
  stock_symbol: string | null;
  founded_year: number | null;
  headquarters: string | null;
  created_at: string;
  updated_at: string;
}

export interface Layoff {
  id: string;
  company_id?: string;
  date_announced: string;
  employees_laid_off: number | null;
  percentage_laid_off: number | null;
  reason: string | null;
  source_url: string | null;
  source_name: string | null;
  job_titles_affected: string[] | null;
  departments_affected: string[] | null;
  severance_offered: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  companies?: Company;
  // Additional fields from CSV import
  city?: string | null;
  City?: string | null;
  city_name?: string | null;
  company?: string[] | null;
  Company?: string | null;
  company_name?: string | null;
  county?: string | null;
  industry?: string | null;
  Industry?: string | null;
  industry_name?: string | null;
  region?: string[] | null;
  Region?: string | null;
  region_name?: string | null;
  State?: string | null;
}

export interface WatchedCompany {
  id: string;
  user_id: string;
  company_id: string;
  notification_email: boolean;
  notification_push: boolean;
  added_at: string;
  companies?: Company;
}

export interface LayoffAlert {
  id: string;
  user_id: string;
  layoff_id: string;
  sent_at: string;
  alert_type: string;
  layoffs?: Layoff;
}

export interface LayoffTrend {
  date: string;
  total_layoffs: number;
  companies_affected: number;
  employees_affected: number;
}

export interface IndustryAnalysis {
  industry: string;
  total_layoffs: number;
  companies_count: number;
  employees_affected: number;
  risk_score: number;
}

export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high';
  industry_risk: number;
  company_risk: number;
  market_trend: 'stable' | 'declining' | 'volatile';
  recommendations: string[];
}