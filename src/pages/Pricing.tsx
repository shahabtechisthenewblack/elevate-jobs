import { useState } from 'react';
import { Check, Star, Zap, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Pricing = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string, price: number, interval: string) => {
    setIsLoading(plan);
    try {
      // TODO: Integrate with Whop payment processor
      toast.info(`Redirecting to checkout for ${plan} plan...`);
      
      // Placeholder for Whop integration
      console.log(`Subscribing to ${plan} plan: $${price} ${interval}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${plan} subscription initiated!`);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly Access',
      price: 20,
      interval: 'week',
      description: 'Perfect for short-term insights',
      features: [
        'Full access to layoff tracker',
        'Real-time layoff alerts',
        'Industry analytics',
        'Basic company watchlist',
        'Weekly reports'
      ],
      popular: false,
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 'monthly',
      name: 'Monthly Access',
      price: 60,
      interval: 'month',
      description: 'Most popular choice for professionals',
      features: [
        'Everything in Weekly',
        'Advanced analytics dashboard',
        'Unlimited company watchlist',
        'Priority email alerts',
        'Monthly trend reports',
        'Export data functionality',
        'Email support'
      ],
      popular: true,
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      id: 'yearly',
      name: 'Yearly Access',
      price: 540,
      interval: 'year',
      originalPrice: 720,
      description: 'Best value - 3 months free!',
      features: [
        'Everything in Monthly',
        'Quarterly industry reports',
        'Advanced risk assessment',
        'API access for developers',
        'Custom alert settings',
        'Priority phone support',
        'Dedicated account manager',
        '25% savings vs monthly'
      ],
      popular: false,
      icon: <Shield className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Star className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-text bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get access to comprehensive layoff data, analytics, and insights to stay ahead in your career planning.
            Choose the plan that fits your needs.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500" />
            <span>14-day money-back guarantee</span>
            <span className="mx-2">•</span>
            <Check className="h-4 w-4 text-green-500" />
            <span>Cancel anytime</span>
            <span className="mx-2">•</span>
            <Check className="h-4 w-4 text-green-500" />
            <span>Secure payment</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative bg-gradient-subtle border-border/50 hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-primary-foreground px-6 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-xl ${plan.popular ? 'bg-gradient-primary text-primary-foreground' : 'bg-muted'}`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground line-through">
                        ${plan.originalPrice}/{plan.interval}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Save ${plan.originalPrice - plan.price}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.name, plan.price, plan.interval)}
                  disabled={isLoading === plan.name}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-primary hover:opacity-90' 
                      : 'bg-background border border-border hover:bg-muted'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {isLoading === plan.name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Get ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, PayPal, and other secure payment methods through our payment processor.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 14-day money-back guarantee, so you can try our service risk-free.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How accurate is the layoff data?</h3>
                <p className="text-sm text-muted-foreground">
                  Our data is sourced from verified reports and updated in real-time to ensure maximum accuracy and reliability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer a full refund within 14 days of purchase if you're not completely satisfied.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I cancel my subscription?</h3>
                <p className="text-sm text-muted-foreground">
                  You can cancel your subscription at any time from your account dashboard or by contacting our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;