import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Linkedin, Sparkles, FileText } from 'lucide-react';

interface ResumeStartOptionsProps {
  onOptionSelect: (option: string) => void;
}

const ResumeStartOptions = ({ onOptionSelect }: ResumeStartOptionsProps) => {
  const options = [
    {
      id: 'upload',
      title: 'Select An Existing Resume',
      description: 'Upload your current resume and we\'ll extract all the information to build upon',
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      id: 'linkedin',
      title: 'Build Using LinkedIn',
      description: 'Import your professional information directly from your LinkedIn profile',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      id: 'ai',
      title: 'Start With AI Prompt',
      description: 'Describe your career and let AI create a professional resume for you',
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      id: 'blank',
      title: 'Choose A Blank Template',
      description: 'Start from scratch with a clean template and fill in your details manually',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Card 
              key={option.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 bg-gradient-subtle border-border/50"
            >
              <CardHeader className="pb-4">
                <div className={`p-4 rounded-xl w-fit transition-all duration-300 group-hover:scale-110 ${option.bgColor}`}>
                  <Icon className={`h-8 w-8 ${option.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {option.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-base text-muted-foreground mb-6 leading-relaxed">
                  {option.description}
                </CardDescription>
                
                <Button 
                  variant="outline"
                  className="w-full transition-all duration-300 group-hover:shadow-lg hover:bg-primary hover:text-primary-foreground"
                  onClick={() => onOptionSelect(option.id)}
                >
                  {option.id === 'upload' && 'Upload Resume'}
                  {option.id === 'linkedin' && 'Connect LinkedIn'}
                  {option.id === 'ai' && 'Start with AI'}
                  {option.id === 'blank' && 'Start Building'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          All resume templates are ATS-friendly and designed to pass applicant tracking systems
        </p>
      </div>
    </div>
  );
};

export default ResumeStartOptions;