import { Scale, FileText, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Scale className="h-4 w-4 mr-2 text-accent" />
              Terms of Service
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Terms of{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Please read these terms carefully before using our AI-powered career platform and services.
            </p>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-border/50 bg-card/50 backdrop-blur text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Service Agreement</h3>
                <p className="text-muted-foreground">
                  By using ElevateJobs, you agree to follow our terms and use our services responsibly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">User Responsibilities</h3>
                <p className="text-muted-foreground">
                  Users must provide accurate information and use our tools for legitimate career purposes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">Limitations</h3>
                <p className="text-muted-foreground">
                  Our services are provided "as is" with certain limitations and disclaimers outlined below.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="p-12 space-y-8">
                <div className="flex items-center space-x-3 mb-8">
                  <Scale className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Terms of Service</h2>
                </div>

                <div className="space-y-8 text-muted-foreground">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h3>
                    <p className="leading-relaxed">
                      By accessing and using ElevateJobs, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">2. Use License</h3>
                    <p className="leading-relaxed">
                      Permission is granted to temporarily use ElevateJobs for personal, non-commercial career development purposes. This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">3. User Account</h3>
                    <p className="leading-relaxed">
                      You are responsible for safeguarding the password and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">4. Prohibited Uses</h3>
                    <p className="leading-relaxed">
                      You may not use our service to violate any applicable laws, infringe on intellectual property rights, transmit harmful content, or attempt to gain unauthorized access to our systems or other users' accounts.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">5. Content Ownership</h3>
                    <p className="leading-relaxed">
                      You retain ownership of content you create using our tools. We may use aggregated, anonymized data to improve our services. Our AI-generated suggestions are provided for your use and customization.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">6. Service Availability</h3>
                    <p className="leading-relaxed">
                      We strive to maintain service availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any part of our service at any time with or without notice.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">7. Disclaimer</h3>
                    <p className="leading-relaxed">
                      The information on this platform is provided on an "as is" basis. To the fullest extent permitted by law, this company excludes all representations, warranties, and conditions relating to our service and the use of this platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">8. Limitation of Liability</h3>
                    <p className="leading-relaxed">
                      In no event shall ElevateJobs or its suppliers be liable for any damages arising out of the use or inability to use our service, even if we have been notified orally or in writing of the possibility of such damage.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">9. Modifications</h3>
                    <p className="leading-relaxed">
                      We reserve the right to revise these terms at any time without notice. By using this platform, you agree to be bound by the current version of these terms of service.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">10. Contact Information</h3>
                    <p className="leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us at legal@elevatejobs.com.
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

export default Terms;