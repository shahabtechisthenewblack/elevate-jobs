import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Briefcase, User, Palette, Zap, Target, Award, Globe, Crown } from 'lucide-react';

interface ResumeTemplatesProps {
  onTemplateSelect: (templateId: string) => void;
}

// Template Preview Components - These show actual resume designs
const ProfessionalPreview = () => (
  <div className="w-full h-full bg-white p-4 text-black text-xs overflow-hidden">
    <div className="border-b-2 border-blue-600 pb-2 mb-3">
      <h1 className="text-lg font-bold">JOHN SMITH</h1>
      <div className="text-xs text-gray-600">john.smith@email.com | (555) 123-4567 | New York, NY</div>
    </div>
    <div className="mb-3">
      <h2 className="text-sm font-bold text-blue-600 mb-1">PROFESSIONAL SUMMARY</h2>
      <p className="text-xs leading-tight">Senior software engineer with 8+ years of experience developing scalable web applications...</p>
    </div>
    <div className="mb-3">
      <h2 className="text-sm font-bold text-blue-600 mb-1">EXPERIENCE</h2>
      <div className="mb-2">
        <div className="flex justify-between">
          <span className="font-semibold text-xs">Senior Software Engineer</span>
          <span className="text-xs">2020-Present</span>
        </div>
        <div className="text-xs text-gray-600">Tech Corp | New York, NY</div>
        <ul className="text-xs mt-1 space-y-0.5">
          <li>• Led development of microservices architecture</li>
          <li>• Improved system performance by 40%</li>
        </ul>
      </div>
    </div>
    <div className="mb-3">
      <h2 className="text-sm font-bold text-blue-600 mb-1">EDUCATION</h2>
      <div className="text-xs">
        <div className="font-semibold">Bachelor of Science in Computer Science</div>
        <div className="text-gray-600">Stanford University | 2016</div>
      </div>
    </div>
    <div>
      <h2 className="text-sm font-bold text-blue-600 mb-1">SKILLS</h2>
      <div className="flex flex-wrap gap-1">
        <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">JavaScript</span>
        <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">React</span>
        <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">Node.js</span>
      </div>
    </div>
  </div>
);

const ModernPreview = () => (
  <div className="w-full h-full bg-white text-black text-xs overflow-hidden flex">
    <div className="w-1/3 bg-gray-900 text-white p-2">
      <h1 className="text-sm font-bold mb-2">SARAH JOHNSON</h1>
      <div className="text-xs space-y-1 mb-3">
        <div>sarah@email.com</div>
        <div>(555) 987-6543</div>
        <div>San Francisco, CA</div>
      </div>
      <div>
        <h2 className="text-xs font-bold mb-1">SKILLS</h2>
        <div className="space-y-1">
          <div>
            <div className="text-xs">Python</div>
            <div className="w-full bg-gray-700 rounded h-1">
              <div className="bg-blue-500 h-1 rounded w-4/5"></div>
            </div>
          </div>
          <div>
            <div className="text-xs">React</div>
            <div className="w-full bg-gray-700 rounded h-1">
              <div className="bg-blue-500 h-1 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="w-2/3 p-2">
      <div className="mb-2">
        <h2 className="text-sm font-bold text-blue-600 mb-1">SUMMARY</h2>
        <p className="text-xs">Product manager with 7+ years of experience...</p>
      </div>
      <div className="mb-2">
        <h2 className="text-sm font-bold text-blue-600 mb-1">EXPERIENCE</h2>
        <div>
          <h3 className="text-xs font-bold">Senior Product Manager</h3>
          <div className="text-xs text-blue-600">Innovation Labs</div>
          <div className="text-xs text-gray-600">2021 - Present</div>
        </div>
      </div>
    </div>
  </div>
);

const CreativePreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 p-3 text-black text-xs overflow-hidden">
    <div className="bg-white rounded p-2 h-full">
      <div className="text-center mb-3 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded transform -skew-y-1"></div>
        <div className="relative bg-white rounded p-2">
          <h1 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ALEX CREATIVE
          </h1>
          <div className="text-xs">alex@creative.com | (555) 456-7890</div>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <h2 className="text-xs font-bold text-purple-600 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-1"></div>
            ABOUT
          </h2>
          <p className="text-xs">Creative designer with passion for innovation...</p>
        </div>
        <div className="bg-gray-50 rounded p-1">
          <h3 className="text-xs font-semibold">UI/UX Designer</h3>
          <div className="text-xs text-purple-600">Design Studio</div>
        </div>
      </div>
    </div>
  </div>
);

const MinimalistPreview = () => (
  <div className="w-full h-full bg-white p-4 text-black text-xs overflow-hidden">
    <div className="text-center border-b pb-2 mb-3">
      <h1 className="text-lg font-light tracking-wide">EMILY CHEN</h1>
      <div className="text-xs text-gray-600">emily.chen@email.com • (555) 321-9876 • Seattle, WA</div>
    </div>
    <div className="text-center mb-3">
      <p className="text-xs leading-relaxed">Minimalist designer focused on clean, user-centered solutions...</p>
    </div>
    <div className="space-y-2">
      <div>
        <h2 className="text-sm font-light border-b border-gray-300 pb-1 mb-1">Experience</h2>
        <div className="text-xs">
          <div className="font-medium">Product Designer</div>
          <div className="text-gray-600">Clean Co. • 2020-Present</div>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-light border-b border-gray-300 pb-1 mb-1">Education</h2>
        <div className="text-xs">
          <div className="font-medium">BFA Design</div>
          <div className="text-gray-600">Art Institute • 2018</div>
        </div>
      </div>
    </div>
  </div>
);

const TechPreview = () => (
  <div className="w-full h-full bg-gray-900 text-green-400 p-3 font-mono text-xs overflow-hidden">
    <div className="border border-green-400 p-2 h-full">
      <div className="mb-2">
        <div className="text-green-300">$ whoami</div>
        <div className="text-sm font-bold">mike_developer</div>
      </div>
      <div className="space-y-1">
        <div><span className="text-green-300">email:</span> mike@dev.com</div>
        <div><span className="text-green-300">phone:</span> (555) 555-0123</div>
        <div><span className="text-green-300">location:</span> Austin, TX</div>
      </div>
      <div className="mt-2">
        <div className="text-green-300">$ cat experience.txt</div>
        <div className="text-xs">
          Senior Developer @ TechCorp<br/>
          Full Stack Engineer @ StartupXYZ
        </div>
      </div>
      <div className="mt-2">
        <div className="text-green-300">$ ls skills/</div>
        <div className="text-xs">JavaScript React Node.js Python Docker AWS</div>
      </div>
    </div>
  </div>
);

const ResumeTemplates = ({ onTemplateSelect }: ResumeTemplatesProps) => {
  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, traditional layout perfect for corporate roles',
      category: 'Traditional',
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      popular: true,
      preview: ProfessionalPreview,
    },
    {
      id: 'modern',
      name: 'Modern Executive',
      description: 'Contemporary design with bold typography for senior positions',
      category: 'Modern',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      popular: true,
      preview: ModernPreview,
    },
    {
      id: 'creative',
      name: 'Creative Designer',
      description: 'Vibrant and artistic layout for creative professionals',
      category: 'Creative',
      icon: Palette,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      popular: false,
      preview: CreativePreview,
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple, elegant design that focuses on content',
      category: 'Simple',
      icon: User,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      popular: true,
      preview: MinimalistPreview,
    },
    {
      id: 'tech',
      name: 'Tech Pro',
      description: 'Perfect for software developers and tech professionals',
      category: 'Technical',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      popular: true,
      preview: TechPreview,
    },
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'Premium layout for C-level and senior executive roles',
      category: 'Executive',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
      popular: false,
      preview: ProfessionalPreview, // Reusing for now
    },
    {
      id: 'academic',
      name: 'Academic Scholar',
      description: 'Formal layout ideal for academic and research positions',
      category: 'Academic',
      icon: Target,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
      popular: false,
      preview: MinimalistPreview, // Reusing for now
    },
    {
      id: 'startup',
      name: 'Startup Enthusiast',
      description: 'Dynamic design for startup and entrepreneurial roles',
      category: 'Startup',
      icon: Globe,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-950',
      popular: false,
      preview: CreativePreview, // Reusing for now
    },
    {
      id: 'consultant',
      name: 'Management Consultant',
      description: 'Professional layout for consulting and strategy roles',
      category: 'Consulting',
      icon: Briefcase,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50 dark:bg-slate-950',
      popular: false,
      preview: ProfessionalPreview, // Reusing for now
    },
    {
      id: 'international',
      name: 'Global Professional',
      description: 'Internationally focused design for global companies',
      category: 'International',
      icon: Globe,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      popular: false,
      preview: ModernPreview, // Reusing for now
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Resume Template</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select from our professionally designed templates. Each template is ATS-friendly and optimized for modern hiring systems.
        </p>
      </div>

      {/* Popular Templates */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Most Popular Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.filter(template => template.popular).map((template) => {
            const Icon = template.icon;
            const PreviewComponent = template.preview;
            return (
              <Card 
                key={template.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 bg-gradient-subtle border-border/50 relative overflow-hidden"
                onClick={() => onTemplateSelect(template.id)}
              >
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Popular
                  </Badge>
                </div>
                
                <div className="aspect-[3/4] bg-white dark:bg-gray-900 border-b">
                  <PreviewComponent />
                </div>
                
                <CardHeader className="pb-2">
                  <div className={`p-2 rounded-lg w-fit transition-all duration-300 group-hover:scale-110 ${template.bgColor}`}>
                    <Icon className={`h-4 w-4 ${template.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {template.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-4">
                    {template.description}
                  </CardDescription>
                  
                  <Badge variant="outline" className="mb-4">
                    {template.category}
                  </Badge>
                  
                  <Button 
                    variant="outline"
                    className="w-full transition-all duration-300 group-hover:shadow-lg hover:bg-primary hover:text-primary-foreground"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Templates */}
      <div>
        <h3 className="text-xl font-semibold mb-6">All Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {templates.map((template) => {
            const Icon = template.icon;
            const PreviewComponent = template.preview;
            return (
              <Card 
                key={template.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 bg-gradient-subtle border-border/50 relative overflow-hidden"
                onClick={() => onTemplateSelect(template.id)}
              >
                {template.popular && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  </div>
                )}
                
                <div className="aspect-[3/4] bg-white dark:bg-gray-900 border-b">
                  <PreviewComponent />
                </div>
                
                <CardHeader className="pb-2">
                  <div className={`p-2 rounded-lg w-fit transition-all duration-300 group-hover:scale-110 ${template.bgColor}`}>
                    <Icon className={`h-4 w-4 ${template.color}`} />
                  </div>
                  <CardTitle className="text-sm group-hover:text-primary transition-colors">
                    {template.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-xs mb-3 line-clamp-2">
                    {template.description}
                  </CardDescription>
                  
                  <Badge variant="outline" className="text-xs mb-3">
                    {template.category}
                  </Badge>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full transition-all duration-300 group-hover:shadow-lg hover:bg-primary hover:text-primary-foreground"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Select
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          All templates are ATS-friendly and optimized for applicant tracking systems
        </p>
      </div>
    </div>
  );
};

export default ResumeTemplates;