import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Linkedin, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkedInImportFormProps {
  onComplete: (extractedData: any) => void;
  onBack: () => void;
}

const LinkedInImportForm = ({ onComplete, onBack }: LinkedInImportFormProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const validateLinkedInUrl = (url: string) => {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinRegex.test(url);
  };

  const handleImport = async () => {
    if (!linkedinUrl.trim()) {
      toast({
        title: "LinkedIn URL required",
        description: "Please enter your LinkedIn profile URL.",
        variant: "destructive",
      });
      return;
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile).",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate LinkedIn data extraction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock extracted data - in real implementation, this would be fetched from LinkedIn
      const extractedData = {
        personal: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@email.com',
          phone: '+1 (555) 987-6543',
          location: 'San Francisco, CA',
          website: 'janesmith.dev',
          linkedin: linkedinUrl
        },
        summary: 'Product Manager with 7+ years of experience in tech startups and enterprise software...',
        experience: [
          {
            id: '1',
            company: 'Innovation Labs',
            position: 'Senior Product Manager',
            location: 'San Francisco, CA',
            startDate: '2021-03',
            endDate: '',
            current: true,
            description: 'Leading product strategy for B2B SaaS platform with 50K+ users...'
          },
          {
            id: '2',
            company: 'StartupXYZ',
            position: 'Product Manager',
            location: 'San Francisco, CA',
            startDate: '2019-01',
            endDate: '2021-02',
            current: false,
            description: 'Managed product roadmap and cross-functional teams...'
          }
        ],
        education: [
          {
            id: '1',
            institution: 'Stanford University',
            degree: 'Master of Business Administration',
            field: 'Business Administration',
            startDate: '2017-09',
            endDate: '2019-06',
            gpa: '3.9'
          }
        ],
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'A/B Testing']
      };

      toast({
        title: "LinkedIn data imported successfully!",
        description: "Your professional information has been imported. You can now select a template.",
      });

      onComplete(extractedData);
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your LinkedIn data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            Import from LinkedIn
          </CardTitle>
          <CardDescription>
            Enter your LinkedIn profile URL to automatically import your professional information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
            <div className="relative">
              <Input
                id="linkedin-url"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="pr-10"
              />
              <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Make sure your LinkedIn profile is public or set to allow data access
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              What we'll import:
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Professional headline and summary</li>
              <li>• Work experience and job descriptions</li>
              <li>• Education and certifications</li>
              <li>• Skills and endorsements</li>
              <li>• Contact information (if available)</li>
            </ul>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back to Options
            </Button>
            <Button
              onClick={handleImport}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? 'Importing...' : 'Import from LinkedIn'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInImportForm;