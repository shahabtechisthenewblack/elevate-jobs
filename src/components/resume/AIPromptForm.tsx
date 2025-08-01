import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIPromptFormProps {
  onComplete: (extractedData: any) => void;
  onBack: () => void;
}

const AIPromptForm = ({ onComplete, onBack }: AIPromptFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe your career background and goals.",
        variant: "destructive",
      });
      return;
    }

    if (prompt.trim().length < 50) {
      toast({
        title: "More details needed",
        description: "Please provide a more detailed description (at least 50 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Mock generated data based on prompt
      const generatedData = {
        personal: {
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex.johnson@email.com',
          phone: '+1 (555) 456-7890',
          location: 'Austin, TX',
          website: 'alexjohnson.dev',
          linkedin: 'linkedin.com/in/alexjohnson'
        },
        summary: 'Dynamic software engineer with expertise in full-stack development and a passion for creating innovative solutions. Proven track record of delivering high-quality applications and leading technical initiatives in fast-paced environments.',
        experience: [
          {
            id: '1',
            company: 'TechFlow Solutions',
            position: 'Full Stack Developer',
            location: 'Austin, TX',
            startDate: '2022-01',
            endDate: '',
            current: true,
            description: 'Developed and maintained scalable web applications using React, Node.js, and MongoDB. Collaborated with cross-functional teams to deliver features that improved user engagement by 40%.'
          },
          {
            id: '2',
            company: 'Digital Innovations',
            position: 'Frontend Developer',
            location: 'Austin, TX',
            startDate: '2020-06',
            endDate: '2021-12',
            current: false,
            description: 'Built responsive user interfaces using React and TypeScript. Optimized application performance resulting in 25% faster load times.'
          }
        ],
        education: [
          {
            id: '1',
            institution: 'University of Texas at Austin',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2016-09',
            endDate: '2020-05',
            gpa: '3.7'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Git', 'Agile']
      };

      toast({
        title: "Resume generated successfully!",
        description: "AI has created your resume. You can now select a template and customize it.",
      });

      onComplete(generatedData);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const examplePrompts = [
    "I'm a software engineer with 5 years of experience in React and Node.js, looking to transition to a senior role.",
    "Recent marketing graduate with internship experience at social media companies, seeking entry-level positions.",
    "Experienced project manager transitioning from construction to tech industry, with PMP certification.",
    "Data scientist with PhD in Statistics and 3 years in healthcare analytics, targeting fintech roles."
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Generate Resume with AI
          </CardTitle>
          <CardDescription>
            Describe your career background, skills, and goals. Our AI will create a professional resume for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">Describe your career background</Label>
            <Textarea
              id="ai-prompt"
              placeholder="Tell us about your professional experience, education, skills, and career goals. The more details you provide, the better your resume will be..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {prompt.length}/500 characters (minimum 50 required)
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Example prompts:
            </h4>
            <div className="space-y-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-xs text-purple-800 dark:text-purple-200 text-left hover:text-purple-900 dark:hover:text-purple-100 block w-full p-2 rounded bg-purple-100/50 dark:bg-purple-900/50 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back to Options
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isProcessing || prompt.length < 50}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? 'Generating...' : 'Generate Resume with AI'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPromptForm;