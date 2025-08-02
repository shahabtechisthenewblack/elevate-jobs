import { Search, Book, MessageCircle, Video, FileQuestion, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Help = () => {
  const helpCategories = [
    {
      icon: FileQuestion,
      title: "Getting Started",
      description: "Learn the basics of using ElevateJobs tools",
      articles: 12
    },
    {
      icon: Book,
      title: "Resume Builder",
      description: "Create ATS-optimized resumes that get noticed",
      articles: 8
    },
    {
      icon: MessageCircle,
      title: "Cover Letters",
      description: "Write compelling cover letters for any job",
      articles: 6
    },
    {
      icon: Video,
      title: "Interview Prep",
      description: "Ace your interviews with our AI-powered practice",
      articles: 10
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Book className="h-4 w-4 mr-2 text-accent" />
              Help Center
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              How can we{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                help you?
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Find answers to your questions and learn how to make the most of our AI-powered career tools.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search for help articles..." 
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              Browse by{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find detailed guides and tutorials for all our features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpCategories.map((category) => (
              <Card key={category.title} className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <category.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">{category.description}</p>
                  <p className="text-sm text-primary font-medium">{category.articles} articles</p>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Articles
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Popular Articles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Most frequently accessed help articles by our users.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              "How to create your first resume with AI assistance",
              "Best practices for ATS-optimized resumes",
              "Writing compelling cover letters that get responses",
              "Preparing for technical interviews",
              "Optimizing your LinkedIn profile for visibility",
              "Using AI prompts effectively for career content"
            ].map((title, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold hover:text-primary transition-colors">{title}</h3>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Still need{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                help?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Our support team is here to assist you with any questions or issues.
            </p>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Contact Support
              <MessageCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;