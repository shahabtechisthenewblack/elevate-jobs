import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  MessageSquare, 
  UserCheck, 
  Target,
  DollarSign,
  Linkedin,
  TrendingUp,
  TrendingDown,
  Award,
  Briefcase,
  Users,
  Users2,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const tools = [
  // Working tools first (those with "Try Now" enabled)
  {
    title: 'Resume Builder',
    description: 'Create ATS-optimized resumes with AI assistance',
    icon: FileText,
    href: '/resume-builder',
    featured: true
  },
  {
    title: 'Cover Letter Generator',
    description: 'Generate personalized cover letters instantly',
    icon: MessageSquare,
    href: '/cover-letter',
    featured: true
  },
  {
    title: 'Interview Preparation',
    description: 'Practice with AI-powered mock interviews',
    icon: UserCheck,
    href: '/interview-prep',
    featured: true
  },
  {
    title: 'LinkedIn Optimizer',
    description: 'Optimize your LinkedIn profile for maximum visibility',
    icon: Linkedin,
    href: '/linkedin-optimizer',
    featured: true
  },
  {
    title: 'Recruiter Outreach Script Generator',
    description: 'Generate personalized outreach messages for recruiters',
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
    description: 'Real-time layoff tracking and job security insights',
    icon: TrendingDown,
    href: '/layoff-tracker',
    featured: true
  },
  // Other tools
  {
    title: 'Job Search Optimizer',
    description: 'Find and track the perfect job opportunities',
    icon: Target,
    href: '/job-search',
    comingSoon: true
  },
  {
    title: 'Salary Negotiator',
    description: 'Get insights and strategies for salary negotiations',
    icon: DollarSign,
    href: '/salary-negotiator',
    comingSoon: true
  },
  {
    title: 'Career Path Analyzer',
    description: 'Discover your ideal career trajectory',
    icon: TrendingUp,
    href: '/career-path',
    comingSoon: true
  },
  {
    title: 'Skills Assessment',
    description: 'Evaluate and improve your professional skills',
    icon: Award,
    href: '/skills-assessment',
    comingSoon: true
  },
  {
    title: 'Portfolio Builder',
    description: 'Create stunning professional portfolios',
    icon: Briefcase,
    href: '/portfolio-builder',
    comingSoon: true
  },
  {
    title: 'Networking Assistant',
    description: 'Build meaningful professional connections',
    icon: Users,
    href: '/networking',
    comingSoon: true
  }
];

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ElevateJobs
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">
                  AI Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[800px] grid-cols-2">
                    {tools.map((tool) => (
                      <NavigationMenuLink
                        key={tool.title}
                        href={tool.href}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <tool.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium leading-none">
                              {tool.title}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/pricing" className="text-base font-medium text-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-base font-medium text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-base font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {!loading && (
            user ? (
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </>
            )
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] sm:w-[400px]">
            <div className="flex flex-col space-y-6 mt-6">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ElevateJobs
                </span>
              </Link>

              <div className="flex flex-col space-y-4">
                <h3 className="font-semibold text-lg">AI Tools</h3>
                <div className="grid gap-2">
                  {tools.map((tool) => (
                    <a
                      key={tool.title}
                      href={tool.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <tool.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{tool.title}</div>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link to="/pricing" className="text-base font-medium p-2 hover:bg-accent rounded-lg transition-colors">
                  Pricing
                </Link>
                <Link to="/about" className="text-base font-medium p-2 hover:bg-accent rounded-lg transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-base font-medium p-2 hover:bg-accent rounded-lg transition-colors">
                  Contact
                </Link>
              </div>

              <div className="flex flex-col space-y-2 pt-4">
                {!loading && (
                  user ? (
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          navigate('/auth');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                        onClick={() => {
                          navigate('/auth');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;