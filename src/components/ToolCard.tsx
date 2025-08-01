import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  featured?: boolean;
  comingSoon?: boolean;
}

const ToolCard = ({ title, description, icon: Icon, href, featured = false, comingSoon = false }: ToolCardProps) => {
  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 bg-gradient-subtle border-border/50",
        featured && "ring-2 ring-primary/20 bg-gradient-hero"
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
            featured 
              ? "bg-gradient-primary text-primary-foreground shadow-glow" 
              : "bg-primary/10 text-primary group-hover:bg-primary/20"
          )}>
            <Icon className="h-6 w-6" />
          </div>
          {featured && (
            <span className="text-xs font-medium px-2 py-1 bg-accent/20 text-accent-foreground rounded-full">
              Popular
            </span>
          )}
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="text-base text-muted-foreground mb-6 leading-relaxed">
          {description}
        </CardDescription>
        
        <Button 
          variant={comingSoon ? "outline" : featured ? "default" : "outline"}
          className={cn(
            "w-full transition-all duration-300 group-hover:shadow-lg",
            comingSoon 
              ? "opacity-60 cursor-not-allowed" 
              : featured 
                ? "bg-gradient-primary hover:shadow-glow" 
                : "hover:bg-primary hover:text-primary-foreground"
          )}
          disabled={comingSoon}
          asChild={!comingSoon}
        >
          {comingSoon ? (
            <span>Coming Soon</span>
          ) : (
            <a href={href}>
              Try Now
            </a>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToolCard;