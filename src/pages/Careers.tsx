import { Rocket, Users, Heart, Globe, ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Careers = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs"
    },
    {
      icon: Globe,
      title: "Remote-First",
      description: "Work from anywhere with flexible hours and collaboration tools"
    },
    {
      icon: Star,
      title: "Growth & Learning",
      description: "Professional development budget, conference attendance, and mentorship programs"
    },
    {
      icon: Users,
      title: "Team Culture",
      description: "Collaborative environment with regular team events and open communication"
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
              <Rocket className="h-4 w-4 mr-2 text-accent" />
              Join Our Team
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Build the Future of{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Career Success
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Join a passionate team that's revolutionizing how professionals navigate their careers. Help us democratize career success through innovative AI technology.
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">
              Why{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                ElevateJobs?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're building something meaningful - a platform that genuinely helps people achieve their career goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-border/50 bg-card/50 backdrop-blur text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                    <benefit.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Current Opportunities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for helping others succeed.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50 bg-card/50 backdrop-blur text-center p-12 space-y-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Rocket className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">We're Growing!</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                While we don't have any specific openings right now, we're always interested in connecting with exceptional talent. Send us your resume and let us know how you'd like to contribute to our mission.
              </p>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Areas we're particularly interested in:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">AI/ML Engineering</Badge>
                  <Badge variant="secondary">Full-Stack Development</Badge>
                  <Badge variant="secondary">Product Design</Badge>
                  <Badge variant="secondary">Career Coaching</Badge>
                  <Badge variant="secondary">Content Marketing</Badge>
                  <Badge variant="secondary">Customer Success</Badge>
                </div>
              </div>
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                Get In Touch
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold">
              Our{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Culture
              </span>
            </h2>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-6">
              <p>
                At ElevateJobs, we believe that great products come from great teams. We foster an environment of innovation, collaboration, and continuous learning where every team member can thrive.
              </p>
              <p>
                We're remote-first but connection-focused, bringing together diverse perspectives from around the world to solve meaningful problems in the career space.
              </p>
              <p>
                Our values guide everything we do: putting users first, embracing innovation, building with empathy, and maintaining the highest standards of integrity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;