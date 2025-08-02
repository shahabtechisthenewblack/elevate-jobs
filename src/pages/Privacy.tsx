import { Shield, Lock, Eye, Database, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Shield className="h-4 w-4 mr-2 text-accent" />
              Privacy Policy
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Your Privacy{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Matters
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We're committed to protecting your personal information and being transparent about how we collect, use, and share your data.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-border/50 bg-card/50 backdrop-blur text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Lock className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Data Security</h3>
                <p className="text-muted-foreground">
                  We use industry-standard encryption and security measures to protect your information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Eye className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Transparency</h3>
                <p className="text-muted-foreground">
                  Clear information about what data we collect and how we use it for your benefit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Database className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Data Control</h3>
                <p className="text-muted-foreground">
                  You have full control over your data with options to view, edit, or delete it anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-12 space-y-8">
                <div className="flex items-center space-x-3 mb-8">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Privacy Policy</h2>
                </div>

                <div className="space-y-8 text-muted-foreground">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Information We Collect</h3>
                    <p className="leading-relaxed">
                      We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes your email address, resume information, and career preferences to personalize your experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">How We Use Your Information</h3>
                    <p className="leading-relaxed">
                      We use your information to provide, maintain, and improve our services, including AI-powered career tools, personalized recommendations, and customer support. We may also use your information to communicate with you about updates and new features.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Data Sharing and Disclosure</h3>
                    <p className="leading-relaxed">
                      We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform and serving our users.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Data Security</h3>
                    <p className="leading-relaxed">
                      We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Your Rights</h3>
                    <p className="leading-relaxed">
                      You have the right to access, update, or delete your personal information. You may also opt out of certain communications or request a copy of your data. Contact us to exercise these rights.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Contact Us</h3>
                    <p className="leading-relaxed">
                      If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@elevatejobs.com.
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-border/50 text-sm text-muted-foreground">
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;