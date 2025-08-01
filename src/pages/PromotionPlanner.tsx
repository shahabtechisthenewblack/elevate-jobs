import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Target, Award, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromotionStrategy {
  id: string;
  title: string;
  description: string;
  timeline: string;
  completed: boolean;
}

const PromotionPlanner = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    years: "",
    responsibilities: "",
    goal: "",
    resume: ""
  });
  const [strategies, setStrategies] = useState<PromotionStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePromotionPlan = async () => {
    if (!formData.role || !formData.company || !formData.goal) {
      toast({
        title: "Missing Information",
        description: "Please fill in your current role, company type, and career goal.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate AI processing for now
    setTimeout(() => {
      const mockStrategies: PromotionStrategy[] = [
        {
          id: "1",
          title: "Develop Leadership Skills",
          description: `Based on your role as ${formData.role}, start leading small team initiatives or mentor junior colleagues. This demonstrates your readiness for increased responsibility.`,
          timeline: "2-3 months",
          completed: false
        },
        {
          id: "2", 
          title: "Enhance Technical Expertise",
          description: "Identify 2-3 key skills that are highly valued in your industry and create a learning plan. Consider certifications or courses that align with your promotion goal.",
          timeline: "3-6 months",
          completed: false
        },
        {
          id: "3",
          title: "Increase Visibility & Impact",
          description: "Document and present your achievements to stakeholders. Start sharing insights in team meetings and contribute to strategic discussions.",
          timeline: "1-2 months", 
          completed: false
        }
      ];
      
      setStrategies(mockStrategies);
      setShowResults(true);
      setIsLoading(false);
      
      toast({
        title: "Promotion Plan Generated!",
        description: "Your personalized career advancement strategies are ready."
      });
    }, 2000);
  };

  const toggleStrategy = (id: string) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, completed: !strategy.completed }
          : strategy
      )
    );
  };

  const completedCount = strategies.filter(s => s.completed).length;
  const progressPercentage = strategies.length > 0 ? (completedCount / strategies.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Promotion Planner</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized strategies to advance your career and achieve your promotion goals
          </p>
        </div>

        {!showResults ? (
          /* Input Form */
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tell Us About Your Career Goals
              </CardTitle>
              <CardDescription>
                Share your current situation and aspirations to get tailored advancement strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Current Role/Title *</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Industry Type *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Tech Startup, Healthcare, Finance"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Years in Current Role</Label>
                <Input
                  id="years"
                  placeholder="e.g., 2.5 years"
                  value={formData.years}
                  onChange={(e) => handleInputChange("years", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Current Responsibilities & Achievements</Label>
                <Textarea
                  id="responsibilities"
                  placeholder="Describe your key responsibilities and any notable achievements..."
                  value={formData.responsibilities}
                  onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Promotion/Career Goal *</Label>
                <Input
                  id="goal"
                  placeholder="e.g., Senior Engineer, Team Lead, 25% salary increase"
                  value={formData.goal}
                  onChange={(e) => handleInputChange("goal", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">LinkedIn URL or Resume Link (Optional)</Label>
                <Input
                  id="resume"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.resume}
                  onChange={(e) => handleInputChange("resume", e.target.value)}
                />
              </div>

              <Button 
                onClick={generatePromotionPlan} 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Generating Your Plan..." : "Generate Promotion Plan"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Results Display */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Promotion Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{completedCount}/{strategies.length} completed</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(progressPercentage)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategies */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">Your Personalized Promotion Strategies</h2>
              {strategies.map((strategy, index) => (
                <Card key={strategy.id} className={`transition-all duration-200 ${strategy.completed ? 'bg-muted/50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={strategy.completed}
                        onCheckedChange={() => toggleStrategy(strategy.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <CardTitle className={`text-lg flex items-center gap-2 ${strategy.completed ? 'line-through text-muted-foreground' : ''}`}>
                          Strategy {index + 1}: {strategy.title}
                          {strategy.completed && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Timeline: {strategy.timeline}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground ${strategy.completed ? 'line-through' : ''}`}>
                      {strategy.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowResults(false)}
              >
                Create New Plan
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Progress Saved!",
                    description: "Your promotion plan progress has been saved."
                  });
                }}
              >
                Save Progress
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionPlanner;