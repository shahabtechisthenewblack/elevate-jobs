import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Users, MessageSquare, Mail, Share, Loader2, Wand2 } from 'lucide-react';

interface FormData {
  jobRole: string;
  companyName: string;
  userName: string;
  linkedinUrl: string;
  portfolioUrl: string;
  tone: string;
}

interface GeneratedScripts {
  linkedinDM: string;
  coldEmail: string;
  referralAsk: string;
  emailSubject: string;
}

const RecruiterOutreach = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    jobRole: '',
    companyName: '',
    userName: '',
    linkedinUrl: '',
    portfolioUrl: '',
    tone: 'professional'
  });
  const [generatedScripts, setGeneratedScripts] = useState<GeneratedScripts | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const generateScripts = async () => {
    if (!formData.jobRole || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in the job role and company name",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation (replace with actual AI API call)
    setTimeout(() => {
      const linkedinDM = `Good morning! I hope all is well. My name is ${formData.userName || '[Your Name Here]'} and it is wonderful to connect with you. I applied to a few positions within ${formData.companyName}. I am reaching out to you because while I understand you may not be the hiring manager or connected to the position, I was wondering if there was a way my credentials can be seen by someone connected to the position. Confidentiality is understood so if you are not at liberty to give me the information to the person connected to the role, is there some way that you can share my LinkedIn profile with some of your colleagues? Your time is valuable and I understand if you don't have the bandwidth. I've been consistently applying to the company and I'm hoping to be noticed soon. Thank you for taking the time to consider my request. Have an amazing rest of the day.

Best wishes,
${formData.userName || '[Your Name Here]'}`;

      const coldEmail = `Hi [Recruiter's Name],

I hope you're doing well! I'm reaching out about the ${formData.jobRole} position at ${formData.companyName}. With my background and experience, I believe I could bring valuable skills to your team.

${formData.portfolioUrl ? `You can view my portfolio here: ${formData.portfolioUrl}` : 'I would be happy to share my portfolio and additional work samples upon request.'}

${formData.linkedinUrl ? `My LinkedIn profile: ${formData.linkedinUrl}` : ''}

I'd love to discuss whether there's a potential fit and learn more about the role. Thank you for your time and consideration!

Best regards,
${formData.userName || '[Your Name Here]'}`;

      const referralAsk = `Hi [Connection's Name],

I hope you're doing well! I noticed you're connected to someone at ${formData.companyName}. I'm really interested in a ${formData.jobRole} position there and would truly appreciate it if you could refer me or introduce me to the hiring manager.

${formData.portfolioUrl || formData.linkedinUrl ? 'I\'ve attached my resume and portfolio if helpful — no pressure at all!' : 'I\'d be happy to share my resume and portfolio if that would be helpful — no pressure at all!'}

Thank you so much for considering this, and I completely understand if you\'re not able to help.

Best regards,
${formData.userName || '[Your Name Here]'}`;

      setGeneratedScripts({
        linkedinDM,
        coldEmail,
        referralAsk,
        emailSubject: `Interest in ${formData.jobRole} Role at ${formData.companyName}`
      });
      setIsGenerating(false);
    }, 2000);
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'confident', label: 'Confident' },
    { value: 'humble', label: 'Humble' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                Recruiter Outreach Script Generator
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Generate personalized outreach messages for LinkedIn DMs, cold emails, and referral requests. 
              Get noticed by recruiters and land your dream job faster.
            </p>
            <div className="flex justify-center space-x-2">
              <Badge variant="secondary">AI-Powered</Badge>
              <Badge variant="secondary">Personalized</Badge>
              <Badge variant="secondary">Professional</Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="h-5 w-5" />
                  <span>Generate Your Scripts</span>
                </CardTitle>
                <CardDescription>
                  Fill in the details below to generate personalized outreach messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobRole">Job Role *</Label>
                    <Input
                      id="jobRole"
                      placeholder="e.g., Frontend Developer, Product Manager"
                      value={formData.jobRole}
                      onChange={(e) => handleInputChange('jobRole', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Target Company *</Label>
                    <Input
                      id="companyName"
                      placeholder="e.g., Google, Microsoft, Spotify"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userName">Your Name</Label>
                    <Input
                      id="userName"
                      placeholder="e.g., John Doe"
                      value={formData.userName}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                    <Input
                      id="linkedinUrl"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio/Resume URL (Optional)</Label>
                    <Input
                      id="portfolioUrl"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={generateScripts} 
                  disabled={isGenerating || !formData.jobRole || !formData.companyName}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Scripts...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Scripts
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Scripts */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Scripts</CardTitle>
                <CardDescription>
                  Your personalized outreach messages are ready to use
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!generatedScripts ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Fill in the form and click "Generate Scripts" to see your personalized messages</p>
                  </div>
                ) : (
                  <Tabs defaultValue="linkedin" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="linkedin" className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">LinkedIn DM</span>
                      </TabsTrigger>
                      <TabsTrigger value="email" className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Cold Email</span>
                      </TabsTrigger>
                      <TabsTrigger value="referral" className="flex items-center space-x-1">
                        <Share className="h-4 w-4" />
                        <span className="hidden sm:inline">Referral Ask</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="linkedin" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">LinkedIn Direct Message</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedScripts.linkedinDM, 'LinkedIn DM')}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <Textarea
                          value={generatedScripts.linkedinDM}
                          readOnly
                          className="min-h-[300px] resize-none"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="email" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Email Subject</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(generatedScripts.emailSubject, 'Email Subject')}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <Input value={generatedScripts.emailSubject} readOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Email Body</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(generatedScripts.coldEmail, 'Cold Email')}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <Textarea
                            value={generatedScripts.coldEmail}
                            readOnly
                            className="min-h-[250px] resize-none"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="referral" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Referral Request Message</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedScripts.referralAsk, 'Referral Ask')}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <Textarea
                          value={generatedScripts.referralAsk}
                          readOnly
                          className="min-h-[300px] resize-none"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Pro Tips for Recruiter Outreach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">LinkedIn DMs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Keep it under 300 characters when possible</li>
                    <li>• Personalize with company-specific details</li>
                    <li>• Mention mutual connections if applicable</li>
                    <li>• Be respectful of their time</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Cold Emails</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use a clear, specific subject line</li>
                    <li>• Include your portfolio/resume link</li>
                    <li>• Mention specific company projects you admire</li>
                    <li>• Follow up after 1-2 weeks if no response</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Referral Requests</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Only ask connections you have a relationship with</li>
                    <li>• Make it easy for them to help you</li>
                    <li>• Provide all necessary materials upfront</li>
                    <li>• Express gratitude regardless of outcome</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterOutreach;