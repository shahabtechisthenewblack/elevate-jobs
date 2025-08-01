import { useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, Building2, Users, Calendar, BarChart3, Globe, Eye, Filter, Download, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Company, Layoff, WatchedCompany, LayoffTrend } from '@/types/layoff';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { toast } from 'sonner';

const LayoffTracker = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [layoffs, setLayoffs] = useState<Layoff[]>([]);
  const [watchedCompanies, setWatchedCompanies] = useState<WatchedCompany[]>([]);
  const [trends, setTrends] = useState<LayoffTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [layoffSearchTerm, setLayoffSearchTerm] = useState('');
  const [layoffIndustryFilter, setLayoffIndustryFilter] = useState('all');
  const [layoffCompanyFilter, setLayoffCompanyFilter] = useState('all');
  const [severanceFilter, setSeveranceFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  // Sample data for demonstration
  const sampleCompanies: Company[] = [
    {
      id: '1',
      name: 'Meta',
      industry: 'Technology',
      country: 'United States',
      state: 'California',
      employee_count: 86482,
      funding_stage: 'Public',
      logo_url: 'https://logo.clearbit.com/meta.com',
      website_url: 'https://meta.com',
      fortune_500_rank: 31,
      stock_symbol: 'META',
      founded_year: 2004,
      headquarters: 'Menlo Park, CA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Amazon',
      industry: 'E-commerce',
      country: 'United States',
      state: 'Washington',
      employee_count: 1608000,
      funding_stage: 'Public',
      logo_url: 'https://logo.clearbit.com/amazon.com',
      website_url: 'https://amazon.com',
      fortune_500_rank: 2,
      stock_symbol: 'AMZN',
      founded_year: 1994,
      headquarters: 'Seattle, WA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Google',
      industry: 'Technology',
      country: 'United States',
      state: 'California',
      employee_count: 182502,
      funding_stage: 'Public',
      logo_url: 'https://logo.clearbit.com/google.com',
      website_url: 'https://google.com',
      fortune_500_rank: 29,
      stock_symbol: 'GOOGL',
      founded_year: 1998,
      headquarters: 'Mountain View, CA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const sampleLayoffs: Layoff[] = [
    {
      id: '1',
      company_id: '1',
      date_announced: '2024-03-15',
      employees_laid_off: 11000,
      percentage_laid_off: 13.0,
      reason: 'Cost reduction and restructuring',
      source_url: 'https://techcrunch.com/meta-layoffs',
      source_name: 'TechCrunch',
      job_titles_affected: ['Software Engineer', 'Product Manager', 'Data Scientist'],
      departments_affected: ['Engineering', 'Product', 'Marketing'],
      severance_offered: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      company_id: '2',
      date_announced: '2024-01-18',
      employees_laid_off: 18000,
      percentage_laid_off: 1.1,
      reason: 'Economic uncertainty and overstaffing',
      source_url: 'https://reuters.com/amazon-layoffs',
      source_name: 'Reuters',
      job_titles_affected: ['Operations Manager', 'Warehouse Associate', 'HR Specialist'],
      departments_affected: ['Operations', 'HR', 'Logistics'],
      severance_offered: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const sampleTrends: LayoffTrend[] = [
    { date: '2024-01', total_layoffs: 82743, companies_affected: 229, employees_affected: 82743 },
    { date: '2024-02', total_layoffs: 36291, companies_affected: 101, employees_affected: 36291 },
    { date: '2024-03', total_layoffs: 38816, companies_affected: 93, employees_affected: 38816 },
    { date: '2024-04', total_layoffs: 12672, companies_affected: 31, employees_affected: 12672 },
    { date: '2024-05', total_layoffs: 17688, companies_affected: 56, employees_affected: 17688 },
    { date: '2024-06', total_layoffs: 10488, companies_affected: 42, employees_affected: 10488 }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch real layoff data from Supabase
      const { data: layoffData, error: layoffError } = await supabase
        .from('layoffs')
        .select('*')
        .order('date_announced', { ascending: false });

      if (layoffError) {
        console.error('Error fetching layoffs:', layoffError);
        // Fallback to sample data
        setLayoffs(sampleLayoffs);
      } else {
        setLayoffs(layoffData || []);
      }

      // Fetch companies data
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
        setCompanies(sampleCompanies);
      } else {
        setCompanies(companiesData || []);
      }
      
      setTrends(sampleTrends);
      
      if (user) {
        fetchWatchedCompanies();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      // Use sample data as fallback
      setCompanies(sampleCompanies);
      setLayoffs(sampleLayoffs);
      setTrends(sampleTrends);
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchedCompanies = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_company_watchlist')
        .select(`
          *,
          companies (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setWatchedCompanies(data || []);
    } catch (error) {
      console.error('Error fetching watched companies:', error);
    }
  };

  const addToWatchlist = async (companyId: string) => {
    if (!user) {
      toast.error('Please sign in to add companies to your watchlist');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_company_watchlist')
        .insert({
          user_id: user.id,
          company_id: companyId,
          notification_email: true
        });

      if (error) throw error;
      
      toast.success('Company added to watchlist');
      fetchWatchedCompanies();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add company to watchlist');
    }
  };

  const removeFromWatchlist = async (companyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_company_watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('company_id', companyId);

      if (error) throw error;
      
      toast.success('Company removed from watchlist');
      fetchWatchedCompanies();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove company from watchlist');
    }
  };

  const isWatched = (companyId: string) => {
    return watchedCompanies.some(w => w.company_id === companyId);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    const matchesCountry = countryFilter === 'all' || company.country === countryFilter;
    return matchesSearch && matchesIndustry && matchesCountry;
  });

  const industries = [...new Set(companies.map(c => c.industry).filter(Boolean))];
  const countries = [...new Set(companies.map(c => c.country).filter(Boolean))];

  // Clean and normalize industry names
  const cleanIndustryName = (industry: string): string => {
    if (!industry) return 'Other';
    
    // Remove leading/trailing numbers and common patterns
    let cleaned = industry
      .replace(/^\d+\s*/, '') // Remove leading numbers
      .replace(/\s*\d+$/, '') // Remove trailing numbers
      .replace(/^\d+\.\s*/, '') // Remove "XX. " pattern
      .trim();

    // Industry mapping for similar/related industries
    const industryMapping: { [key: string]: string } = {
      // Technology & Software
      'Technology': 'Technology',
      'Software': 'Technology',
      'Information Technology': 'Technology',
      'Computer Systems': 'Technology',
      'Telecommunications': 'Technology',
      'Internet': 'Technology',
      
      // Healthcare
      'Healthcare and Social Assistance': 'Healthcare',
      'Healthcare': 'Healthcare',
      'Medical': 'Healthcare',
      'Pharmaceutical': 'Healthcare',
      'Biotechnology': 'Healthcare',
      
      // Retail & Consumer
      'Retail': 'Retail & Consumer',
      'E-commerce': 'Retail & Consumer',
      'Consumer Goods': 'Retail & Consumer',
      'Fashion': 'Retail & Consumer',
      'Food Service': 'Retail & Consumer',
      'Dining Establishments': 'Retail & Consumer',
      
      // Finance & Banking
      'Finance': 'Finance & Banking',
      'Banking': 'Finance & Banking',
      'Financial Services': 'Finance & Banking',
      'Insurance': 'Finance & Banking',
      'Investment': 'Finance & Banking',
      
      // Manufacturing & Industrial
      'Manufacturing': 'Manufacturing',
      'Industrial': 'Manufacturing',
      'Automotive': 'Manufacturing',
      'Materials': 'Manufacturing',
      
      // Real Estate & Property
      'Real Estate and Rental Leasing': 'Real Estate',
      'Real Estate': 'Real Estate',
      'Property Management': 'Real Estate',
      'Construction': 'Real Estate',
      
      // Professional Services
      'Administrative and Support and Waste Management and Remediation': 'Professional Services',
      'Professional Services': 'Professional Services',
      'Consulting': 'Professional Services',
      'Legal': 'Professional Services',
      'Accounting': 'Professional Services',
      
      // Media & Entertainment
      'Media': 'Media & Entertainment',
      'Entertainment': 'Media & Entertainment',
      'Gaming': 'Media & Entertainment',
      'Publishing': 'Media & Entertainment',
      
      // Transportation & Logistics
      'Transportation': 'Transportation & Logistics',
      'Logistics': 'Transportation & Logistics',
      'Shipping': 'Transportation & Logistics',
      'Airlines': 'Transportation & Logistics',
      
      // Energy & Utilities
      'Energy': 'Energy & Utilities',
      'Utilities': 'Energy & Utilities',
      'Oil & Gas': 'Energy & Utilities',
      'Renewable Energy': 'Energy & Utilities',
      
      // Education
      'Education': 'Education',
      'Universities': 'Education',
      'Training': 'Education',
      
      // Government & Non-Profit
      'Government': 'Government & Public',
      'Public Administration': 'Government & Public',
      'Non-Profit': 'Government & Public',
    };

    // Check for exact matches first
    if (industryMapping[cleaned]) {
      return industryMapping[cleaned];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(industryMapping)) {
      if (cleaned.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(cleaned.toLowerCase())) {
        return value;
      }
    }

    // Default fallback for unmatched industries
    return cleaned || 'Other';
  };

  // Process layoff industries with cleaning and merging
  const rawLayoffIndustries = [...new Set(layoffs.map(l => l.industry || l.Industry).filter(Boolean))];
  const cleanedLayoffIndustries = rawLayoffIndustries.map(cleanIndustryName);
  const layoffIndustries = [...new Set(cleanedLayoffIndustries)];
  
  const layoffCompanies = [...new Set(layoffs.map(l => l.company_name || l.Company).filter(Boolean))];

  const totalLayoffs = layoffs.reduce((sum, layoff) => sum + (layoff.employees_laid_off || 0), 0);
  const totalCompaniesAffected = new Set(layoffs.map(l => l.company_id || l.Company || l.company_name).filter(Boolean)).size;
  const avgLayoffPercentage = layoffs.reduce((sum, layoff) => sum + (layoff.percentage_laid_off || 0), 0) / layoffs.length;

  // Filter layoffs based on search and filters
  const filteredLayoffs = layoffs.filter(layoff => {
    const companyName = layoff.company_name || layoff.Company || '';
    const rawIndustry = layoff.industry || layoff.Industry || '';
    const industry = cleanIndustryName(rawIndustry);
    const city = layoff.city || layoff.City || '';
    const region = Array.isArray(layoff.region) ? layoff.region.join(', ') : 
                   Array.isArray(layoff.Region) ? layoff.Region.join(', ') :
                   layoff.region || layoff.Region || '';
    
    const matchesSearch = layoffSearchTerm === '' || 
      companyName.toLowerCase().includes(layoffSearchTerm.toLowerCase()) ||
      industry.toLowerCase().includes(layoffSearchTerm.toLowerCase()) ||
      city.toLowerCase().includes(layoffSearchTerm.toLowerCase()) ||
      region.toLowerCase().includes(layoffSearchTerm.toLowerCase()) ||
      (layoff.reason && layoff.reason.toLowerCase().includes(layoffSearchTerm.toLowerCase()));

    const matchesIndustry = layoffIndustryFilter === 'all' || cleanIndustryName(rawIndustry) === layoffIndustryFilter;
    const matchesCompany = layoffCompanyFilter === 'all' || companyName === layoffCompanyFilter;
    const matchesSeverance = severanceFilter === 'all' || 
      (severanceFilter === 'yes' && layoff.severance_offered) ||
      (severanceFilter === 'no' && !layoff.severance_offered);
    const matchesVerification = verificationFilter === 'all' ||
      (verificationFilter === 'verified' && layoff.is_verified) ||
      (verificationFilter === 'unverified' && !layoff.is_verified);

    let matchesDateRange = true;
    if (dateRangeFilter !== 'all' && layoff.date_announced) {
      const layoffDate = new Date(layoff.date_announced);
      const now = new Date();
      switch (dateRangeFilter) {
        case '30days':
          matchesDateRange = (now.getTime() - layoffDate.getTime()) <= (30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          matchesDateRange = (now.getTime() - layoffDate.getTime()) <= (90 * 24 * 60 * 60 * 1000);
          break;
        case '1year':
          matchesDateRange = (now.getTime() - layoffDate.getTime()) <= (365 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    return matchesSearch && matchesIndustry && matchesCompany && matchesSeverance && matchesVerification && matchesDateRange;
  });

  // Analytics for filtered layoffs
  const filteredTotalLayoffs = filteredLayoffs.reduce((sum, layoff) => sum + (layoff.employees_laid_off || 0), 0);
  const filteredCompaniesAffected = new Set(filteredLayoffs.map(l => l.company_name || l.Company).filter(Boolean)).size;
  const filteredAvgLayoffPercentage = filteredLayoffs.length > 0 ? 
    filteredLayoffs.reduce((sum, layoff) => sum + (layoff.percentage_laid_off || 0), 0) / filteredLayoffs.length : 0;

  const industryData = industries.map(industry => {
    const industryCompanies = companies.filter(c => c.industry === industry);
    const industryLayoffs = layoffs.filter(l => 
      industryCompanies.some(c => c.id === l.company_id)
    );
    const totalAffected = industryLayoffs.reduce((sum, l) => sum + (l.employees_laid_off || 0), 0);
    
    return {
      industry,
      layoffs: totalAffected,
      companies: industryLayoffs.length,
      fill: `hsl(var(--chart-${(industries.indexOf(industry) % 5) + 1}))`
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-text bg-clip-text text-transparent">
              Layoff Tracker
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed about layoff activities with real-time insights, AI-powered risk analysis, 
            and comprehensive workforce dynamics data to navigate career uncertainties.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-subtle border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Total Layoffs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLayoffs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Employees affected</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-subtle border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Companies</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompaniesAffected}</div>
              <p className="text-xs text-muted-foreground">Companies affected</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-subtle border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Avg Percentage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgLayoffPercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Workforce reduction</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-subtle border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchedCompanies.length}</div>
              <p className="text-xs text-muted-foreground">Companies tracked</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Trends Chart */}
            <Card className="bg-gradient-subtle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Layoff Trends (2024)
                </CardTitle>
                <CardDescription>
                  Monthly layoff data showing workforce reduction trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    employees_affected: {
                      label: "Employees Affected",
                      color: "hsl(var(--chart-1))",
                    },
                    companies_affected: {
                      label: "Companies",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="employees_affected" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="companies_affected" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Industry Analysis */}
            <Card className="bg-gradient-subtle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Industry Impact Analysis
                </CardTitle>
                <CardDescription>
                  Layoff distribution across different industries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    layoffs: {
                      label: "Layoffs",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={industryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="industry" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="layoffs" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            {/* Layoff Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-subtle border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Total Layoffs</span>
                  </div>
                  <div className="text-2xl font-bold">{filteredTotalLayoffs.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Employees affected</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-subtle border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Companies</span>
                  </div>
                  <div className="text-2xl font-bold">{filteredCompaniesAffected}</div>
                  <p className="text-xs text-muted-foreground">Companies affected</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-subtle border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Avg Percentage</span>
                  </div>
                  <div className="text-2xl font-bold">{filteredAvgLayoffPercentage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Workforce reduction</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-subtle border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Recent Events</span>
                  </div>
                  <div className="text-2xl font-bold">{filteredLayoffs.length}</div>
                  <p className="text-xs text-muted-foreground">Layoff events</p>
                </CardContent>
              </Card>
            </div>

            {/* Comprehensive Layoff Tracker Table */}
            <Card className="bg-gradient-subtle border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Company Layoff Tracker
                    </CardTitle>
                    <CardDescription>
                      Comprehensive database of recent layoffs with detailed information and analytics
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-muted/30 rounded-lg">
                  <Input
                    placeholder="Search layoffs..."
                    value={layoffSearchTerm}
                    onChange={(e) => setLayoffSearchTerm(e.target.value)}
                    className="col-span-1 lg:col-span-2"
                  />
                  
                  <Select value={layoffIndustryFilter} onValueChange={setLayoffIndustryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {layoffIndustries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={layoffCompanyFilter} onValueChange={setLayoffCompanyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {layoffCompanies.slice(0, 20).map(company => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={severanceFilter} onValueChange={setSeveranceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Severance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="yes">Severance Offered</SelectItem>
                      <SelectItem value="no">No Severance</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Data Table */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Company</TableHead>
                        <TableHead className="font-semibold">Industry</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Employees</TableHead>
                        <TableHead className="font-semibold">Percentage</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Reason</TableHead>
                        <TableHead className="font-semibold">Severance</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLayoffs.map((layoff) => (
                        <TableRow key={layoff.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            {layoff.company_name || layoff.Company || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {cleanIndustryName(layoff.industry || layoff.Industry || 'N/A')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <CalendarIcon className="h-3 w-3" />
                              {layoff.date_announced 
                                ? new Date(layoff.date_announced).toLocaleDateString()
                                : 'N/A'
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-semibold text-red-600">
                                {layoff.employees_laid_off?.toLocaleString() || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {layoff.percentage_laid_off ? (
                              <Badge variant="destructive" className="text-xs">
                                {layoff.percentage_laid_off}%
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {[layoff.city || layoff.City, layoff.region || layoff.Region]
                                .filter(Boolean)
                                .join(', ') || 'N/A'
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="text-xs text-muted-foreground truncate" title={layoff.reason || ''}>
                                {layoff.reason || 'Not specified'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={layoff.severance_offered ? "default" : "outline"}
                              className="text-xs"
                            >
                              {layoff.severance_offered ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={layoff.is_verified ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {layoff.is_verified ? 'Verified' : 'Unverified'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {layoff.source_url ? (
                              <Button variant="ghost" size="sm" asChild>
                                <a 
                                  href={layoff.source_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  {layoff.source_name || 'Source'}
                                </a>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs">N/A</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredLayoffs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No layoffs found matching your filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-subtle border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Industries Affected</span>
                  </div>
                  <div className="text-2xl font-bold">{layoffIndustries.length}</div>
                  <p className="text-xs text-muted-foreground">Different sectors</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-subtle border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">States Affected</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {[...new Set(layoffs.map(l => l.State).filter(Boolean))].length}
                  </div>
                  <p className="text-xs text-muted-foreground">Geographic spread</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-subtle border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Severance Rate</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round((layoffs.filter(l => l.severance_offered).length / layoffs.length) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Companies offering severance</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-subtle border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Avg. Impact</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round(layoffs.filter(l => l.employees_laid_off).reduce((sum, l) => sum + (l.employees_laid_off || 0), 0) / layoffs.filter(l => l.employees_laid_off).length) || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Employees per event</p>
                </CardContent>
              </Card>
            </div>

            {/* Industry Analysis Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Industry Distribution Pie Chart */}
              <Card className="bg-gradient-subtle border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Industry Distribution
                  </CardTitle>
                  <CardDescription>
                    Layoff events by industry sector
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      layoffs: {
                        label: "Layoffs",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={layoffIndustries.map((industry, index) => ({
                            name: industry,
                            value: layoffs.filter(l => cleanIndustryName(l.industry || l.Industry || '') === industry).length,
                            fill: `hsl(var(--chart-${(index % 5) + 1}))`
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card className="bg-gradient-subtle border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Geographic Impact
                  </CardTitle>
                  <CardDescription>
                    Layoffs by state/region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Layoff Events",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[...new Set(layoffs.map(l => l.State).filter(Boolean))].map(state => ({
                          state,
                          count: layoffs.filter(l => l.State === state).length,
                          employees: layoffs.filter(l => l.State === state).reduce((sum, l) => sum + (l.employees_laid_off || 0), 0)
                        })).sort((a, b) => b.count - a.count).slice(0, 10)}
                        layout="horizontal"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="state" type="category" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Layoff Reasons & Severance Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Layoff Reasons */}
              <Card className="bg-gradient-subtle border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Layoff Reasons
                  </CardTitle>
                  <CardDescription>
                    Primary causes of workforce reductions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Count",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[...new Set(layoffs.map(l => l.reason).filter(Boolean))].map(reason => ({
                          reason: reason?.length > 15 ? reason.substring(0, 15) + '...' : reason,
                          fullReason: reason,
                          count: layoffs.filter(l => l.reason === reason).length
                        })).sort((a, b) => b.count - a.count)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="reason" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              return (
                                <div className="bg-background border rounded p-2 shadow-md">
                                  <p className="font-medium">{payload[0].payload.fullReason}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Count: {payload[0].value}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--chart-3))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Severance Analysis */}
              <Card className="bg-gradient-subtle border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Severance Package Analysis
                  </CardTitle>
                  <CardDescription>
                    Companies offering vs not offering severance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      severance: {
                        label: "Severance Offered",
                        color: "hsl(var(--chart-4))",
                      },
                      no_severance: {
                        label: "No Severance",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Severance Offered",
                              value: layoffs.filter(l => l.severance_offered).length,
                              fill: "hsl(var(--chart-4))"
                            },
                            {
                              name: "No Severance",
                              value: layoffs.filter(l => !l.severance_offered).length,
                              fill: "hsl(var(--chart-5))"
                            }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Company Impact Analysis */}
            <Card className="bg-gradient-subtle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Top Companies by Layoff Impact
                </CardTitle>
                <CardDescription>
                  Companies with the highest number of employees affected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    employees: {
                      label: "Employees Laid Off",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={layoffCompanies.map(company => {
                        const companyLayoffs = layoffs.filter(l => (l.company_name || l.Company) === company);
                        const totalEmployees = companyLayoffs.reduce((sum, l) => sum + (l.employees_laid_off || 0), 0);
                        return {
                          company: company.length > 20 ? company.substring(0, 20) + '...' : company,
                          fullName: company,
                          employees: totalEmployees,
                          events: companyLayoffs.length
                        };
                      }).filter(c => c.employees > 0).sort((a, b) => b.employees - a.employees).slice(0, 15)}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="company" type="category" width={150} />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            return (
                              <div className="bg-background border rounded p-2 shadow-md">
                                <p className="font-medium">{payload[0].payload.fullName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Employees: {payload[0].value}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Events: {payload[0].payload.events}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="employees" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Bottom Row: Verification Status & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-subtle border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Data Verification Status
                  </CardTitle>
                  <CardDescription>
                    Verified vs unverified layoff reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      verified: {
                        label: "Verified",
                        color: "hsl(var(--chart-4))",
                      },
                      unverified: {
                        label: "Unverified",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Verified",
                              value: layoffs.filter(l => l.is_verified).length,
                              fill: "hsl(var(--chart-4))"
                            },
                            {
                              name: "Unverified",
                              value: layoffs.filter(l => !l.is_verified).length,
                              fill: "hsl(var(--chart-5))"
                            }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-gradient-subtle border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Insights
                  </CardTitle>
                  <CardDescription>
                    Notable patterns in layoff data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium text-sm">Most Affected Industry</div>
                      <div className="text-lg font-bold text-primary">
                        {layoffIndustries.reduce((max, industry) => {
                          const count = layoffs.filter(l => cleanIndustryName(l.industry || l.Industry || '') === industry).length;
                          const maxCount = layoffs.filter(l => cleanIndustryName(l.industry || l.Industry || '') === max).length;
                          return count > maxCount ? industry : max;
                        }, layoffIndustries[0] || 'N/A')}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium text-sm">Most Common Reason</div>
                      <div className="text-lg font-bold text-primary">
                        {[...new Set(layoffs.map(l => l.reason).filter(Boolean))].reduce((max, reason) => {
                          const count = layoffs.filter(l => l.reason === reason).length;
                          const maxCount = layoffs.filter(l => l.reason === max).length;
                          return count > maxCount ? reason : max;
                        }, 'N/A')}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium text-sm">Highest Impact State</div>
                      <div className="text-lg font-bold text-primary">
                        {[...new Set(layoffs.map(l => l.State).filter(Boolean))].reduce((max, state) => {
                          const count = layoffs.filter(l => l.State === state).reduce((sum, l) => sum + (l.employees_laid_off || 0), 0);
                          const maxCount = layoffs.filter(l => l.State === max).reduce((sum, l) => sum + (l.employees_laid_off || 0), 0);
                          return count > maxCount ? state : max;
                        }, 'N/A')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <Card className="bg-gradient-subtle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  My Watchlist
                </CardTitle>
                <CardDescription>
                  Companies you're tracking for layoff alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sign In Required</h3>
                    <p className="text-muted-foreground mb-4">
                      Please sign in to create and manage your company watchlist.
                    </p>
                    <Button variant="default" asChild>
                      <a href="/auth">Sign In</a>
                    </Button>
                  </div>
                ) : watchedCompanies.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Companies Watched</h3>
                    <p className="text-muted-foreground mb-4">
                      Add companies to your watchlist to receive layoff alerts.
                    </p>
                    <Button variant="default" onClick={() => {
                      const companiesTab = document.querySelector('[value="companies"]') as HTMLElement;
                      if (companiesTab) companiesTab.click();
                    }}>
                      Browse Companies
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {watchedCompanies.map((watchedCompany) => {
                      const company = companies.find(c => c.id === watchedCompany.company_id);
                      if (!company) return null;
                      
                      return (
                        <Card key={watchedCompany.id} className="bg-background/50 border-border/50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={company.logo_url || '/placeholder.svg'}
                                  alt={company.name}
                                  className="w-10 h-10 rounded-lg object-contain bg-background"
                                />
                                <div>
                                  <h3 className="font-semibold">{company.name}</h3>
                                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Watching
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                              <div className="flex justify-between">
                                <span>Added:</span>
                                <span>{new Date(watchedCompany.added_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Email alerts:</span>
                                <span>{watchedCompany.notification_email ? 'Enabled' : 'Disabled'}</span>
                              </div>
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() => removeFromWatchlist(company.id)}
                            >
                              Remove from Watchlist
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LayoffTracker;