import { Users, Target, Award, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Globe className="h-4 w-4 mr-2 text-accent" />
              About ElevateJobs
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Empowering Careers with{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI Innovation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We're on a mission to democratize career success by providing cutting-edge AI tools that help professionals at every stage of their journey.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground">
                  To make career success accessible to everyone through innovative AI-powered tools that streamline job searching, networking, and professional development.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Our Values</h3>
                <p className="text-muted-foreground">
                  We believe in innovation, accessibility, and empowerment. Every tool we create is designed to level the playing field in the competitive job market.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Our Impact</h3>
                <p className="text-muted-foreground">
                  Over 50,000 professionals have successfully elevated their careers using our platform, with an average 40% increase in interview callbacks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Our{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Story
              </span>
            </h2>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-6">
              <p>
                Founded in 2024, ElevateJobs was born from the realization that talented professionals were struggling to navigate an increasingly competitive job market. Traditional career advice wasn't keeping up with the digital transformation of hiring processes.
              </p>
              <p>
                Our team of career experts, AI engineers, and former recruiters came together to create a platform that combines human insight with artificial intelligence. We've built tools that not only help you create better resumes and cover letters but also provide strategic guidance for every aspect of your career journey.
              </p>
              <p>
                Today, we're proud to be the leading AI-powered career platform, helping thousands of professionals land their dream jobs every month.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;