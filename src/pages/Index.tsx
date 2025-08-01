import { 
  FileText, 
  MessageSquare, 
  UserCheck, 
  Target,
  DollarSign,
  Linkedin,
  Users2,
  TrendingUp,
  TrendingDown,
  Shield,
  Award,
  Briefcase,
  Users,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ToolCard from '@/components/ToolCard';
import heroImage from '@/assets/hero-image.jpg';

const tools = [
  // Ready tools first
  {
    title: 'Resume Builder',
    description: 'Create ATS-optimized resumes with AI assistance that get you noticed by recruiters and hiring managers.',
    icon: FileText,
    href: '/resume-builder',
    featured: true
  },
  {
    title: 'Cover Letter Generator',
    description: 'Generate personalized, compelling cover letters that perfectly match job descriptions and company culture.',
    icon: MessageSquare,
    href: '/cover-letter',
    featured: true
  },
  {
    title: 'Interview Preparation',
    description: 'Practice with AI-powered mock interviews tailored to your industry and specific job roles.',
    icon: UserCheck,
    href: '/interview-prep',
    featured: true
  },
  {
    title: 'LinkedIn Optimizer',
    description: 'Optimize your LinkedIn profile for maximum visibility and professional networking success.',
    icon: Linkedin,
    href: '/linkedin-optimizer',
    featured: true
  },
  {
    title: 'Recruiter Outreach Script Generator',
    description: 'Generate personalized LinkedIn DMs, cold emails, and referral requests to get noticed by recruiters.',
    icon: Users2,
    href: '/recruiter',
    featured: true
  },
  {
    title: 'Promotion Planner',
    description: 'Strategic planning for career advancement and promotions',
    icon: TrendingUp,
    href: '/promotion-planner',
    featured: true
  },
  {
    title: 'Layoff Tracker',
    description: 'Real-time layoff insights and career resilience platform with AI-powered risk analysis',
    icon: Shield,
    href: '/layoff-tracker',
    featured: true
  },
  // Coming soon tools
  {
    title: 'Job Search Optimizer',
    description: 'Find and track the perfect job opportunities with smart matching algorithms and application tracking.',
    icon: Target,
    href: '/job-search',
    comingSoon: true
  },
  {
    title: 'Salary Negotiator',
    description: 'Get data-driven insights and proven strategies to negotiate better compensation packages.',
    icon: DollarSign,
    href: '/salary-negotiator',
    comingSoon: true
  },
  {
    title: 'Career Path Analyzer',
    description: 'Discover your ideal career trajectory with personalized recommendations based on your skills and goals.',
    icon: TrendingUp,
    href: '/career-path',
    comingSoon: true
  },
  {
    title: 'Skills Assessment',
    description: 'Evaluate and improve your professional skills with comprehensive assessments and learning paths.',
    icon: Award,
    href: '/skills-assessment',
    comingSoon: true
  },
  {
    title: 'Portfolio Builder',
    description: 'Create stunning professional portfolios that showcase your work and achievements effectively.',
    icon: Briefcase,
    href: '/portfolio-builder',
    comingSoon: true
  },
  {
    title: 'Networking Assistant',
    description: 'Build meaningful professional connections with AI-powered networking strategies and outreach templates.',
    icon: Users,
    href: '/networking',
    comingSoon: true
  }
];

const features = [
  'AI-powered career tools',
  'ATS-optimized content',
  'Real-time feedback',
  'Industry-specific insights',
  'Progress tracking',
  'Expert guidance'
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Star className="h-4 w-4 mr-2 text-accent" />
                  AI-Powered Career Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Elevate Your{' '}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Career Journey
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Transform your job search with our comprehensive suite of AI-powered tools designed to help you land your dream job faster.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-lg" asChild>
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-accent fill-current" />
                  <span className="font-medium">4.9/5</span>
                  <span>rating</span>
                </div>
                <div>
                  <span className="font-medium">50,000+</span>
                  <span> successful job placements</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 transform rotate-6" />
              <img 
                src={heroImage} 
                alt="Career Development" 
                className="relative rounded-3xl shadow-elegant w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              Powerful AI Tools for Every{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Career Stage
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From resume building to interview preparation, our comprehensive toolkit has everything you need to succeed in your career journey.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard
                key={tool.title}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
                featured={tool.featured}
                comingSoon={tool.comingSoon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of professionals who have already elevated their careers with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg">
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;