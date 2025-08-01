import { useState, useEffect } from "react";
import { ArrowLeft, Download, Copy, Globe, Edit3, Target, TrendingUp, Users, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { LinkedInProfileSkeleton } from "@/components/LinkedInProfileSkeleton";
import { scrapeLinkedInProfile, analyzeProfile } from "@/utils/linkedinScraper";
type OptimizationMethod = 'url' | 'manual' | null;

interface OptimizedProfile {
  headline: string;
  about: string;
  experience: string[];
  keywords: string[];
  improvementScore: number;
}

export default function LinkedInOptimizer() {
  const [selectedMethod, setSelectedMethod] = useState<OptimizationMethod>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [optimizedProfile, setOptimizedProfile] = useState<OptimizedProfile | null>(null);
  const [scrapedProfile, setScrapedProfile] = useState<any>(null);
  const [optimizationAnalysis, setOptimizationAnalysis] = useState<any>(null);
  const { toast } = useToast();
  

  // URL method state
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Manual method state
  const [manualData, setManualData] = useState({
    currentHeadline: "",
    currentAbout: "",
    currentExperience: "",
    targetRole: "",
    industry: "",
    tone: "",
    experienceLevel: "",
    additionalSkills: ""
  });

  const handleMethodSelect = (method: OptimizationMethod) => {
    setSelectedMethod(method);
    setOptimizedProfile(null);
  };

  const handleUrlGenerate = async () => {
    if (!linkedinUrl) {
      toast({
        title: "URL Required",
        description: "Please enter your LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First scrape the LinkedIn profile using Phantombuster
      const scrapeResponse = await fetch('https://jfwsgzwgffxxkaerxuqb.supabase.co/functions/v1/phantombuster-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedinUrl: linkedinUrl
        }),
      });

      if (!scrapeResponse.ok) {
        throw new Error('Failed to scrape LinkedIn profile');
      }

      const scrapeResult = await scrapeResponse.json();
      if (!scrapeResult.success) {
        throw new Error(scrapeResult.error || 'Failed to scrape profile');
      }

      // Set the scraped profile data
      setScrapedProfile(scrapeResult.profile);

      // Then analyze the scraped data
      const aiAnalysisResponse = await fetch('https://jfwsgzwgffxxkaerxuqb.supabase.co/functions/v1/linkedin-profile-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manualData: scrapeResult.profile
        }),
      });

      if (aiAnalysisResponse.ok) {
        const aiResult = await aiAnalysisResponse.json();
        if (aiResult.success) {
          // Create optimized profile from AI analysis
          const optimizedProfile = {
            headline: aiResult.analysis.optimizedHeadline,
            about: aiResult.analysis.enhancedAbout,
            experience: aiResult.analysis.experienceBullets,
            keywords: aiResult.analysis.strategicKeywords,
            improvementScore: aiResult.analysis.profileScore
          };
          setOptimizationAnalysis(optimizedProfile);
        } else {
          throw new Error(aiResult.error || 'AI analysis failed');
        }
      } else {
        throw new Error('Failed to connect to analysis service');
      }
      
      toast({
        title: "Profile Analyzed!",
        description: "Your LinkedIn profile has been scraped and analyzed by AI",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to extract data from scraped content
  const extractFromContent = (content: string, field: string): string => {
    const lines = content.split('\n');
    switch (field) {
      case 'name':
        // Look for name patterns in the first few lines
        for (let i = 0; i < Math.min(10, lines.length); i++) {
          const line = lines[i].trim();
          if (line && line.length > 2 && line.length < 50 && !line.includes('@') && !line.includes('http')) {
            const words = line.split(' ');
            if (words.length >= 2 && words.length <= 4) {
              return line;
            }
          }
        }
        break;
      case 'headline':
        // Look for headline after name
        for (let i = 0; i < Math.min(15, lines.length); i++) {
          const line = lines[i].trim();
          if (line.includes('|') || line.includes('at ') || line.includes(' at ')) {
            return line;
          }
        }
        break;
      case 'about':
        // Look for about section
        const aboutIndex = content.toLowerCase().indexOf('about');
        if (aboutIndex !== -1) {
          const aboutSection = content.substring(aboutIndex, aboutIndex + 500);
          return aboutSection.split('\n').slice(1, 5).join(' ').trim();
        }
        break;
      case 'location':
        // Look for location patterns
        for (const line of lines) {
          if (line.match(/\b\w+,\s*\w+\b/) && !line.includes('@')) {
            return line.trim();
          }
        }
        break;
    }
    return '';
  };

  const extractExperienceFromContent = (content: string): any[] => {
    const lines = content.split('\n');
    const experience = [];
    let currentExp = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('Experience') || trimmed.includes('Work') || trimmed.includes('Employment')) {
        continue;
      }
      
      // Look for job title patterns
      if (trimmed && trimmed.length > 5 && trimmed.length < 100) {
        if (trimmed.includes(' at ') || trimmed.includes('|') || trimmed.match(/\d{4}.*\d{4}/)) {
          if (currentExp) {
            experience.push(currentExp);
          }
          currentExp = {
            title: trimmed.split(' at ')[0] || trimmed,
            company: trimmed.split(' at ')[1] || 'Company Name',
            duration: '2020 - Present',
            description: 'Professional role with key responsibilities and achievements.'
          };
        }
      }
    }
    
    if (currentExp) {
      experience.push(currentExp);
    }
    
    return experience.length > 0 ? experience : [{
      title: 'Professional Role',
      company: 'Company Name',
      duration: '2020 - Present',
      description: 'Professional role with key responsibilities and achievements.'
    }];
  };

  const extractSkillsFromContent = (content: string): string[] => {
    const commonSkills = ['JavaScript', 'Python', 'React', 'Leadership', 'Management', 'Marketing', 'Sales', 'Strategy', 'Communication', 'Analysis'];
    const foundSkills = [];
    
    for (const skill of commonSkills) {
      if (content.toLowerCase().includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }
    
    return foundSkills.length > 0 ? foundSkills : ['Professional Skills', 'Industry Knowledge', 'Leadership'];
  };

  const handleManualGenerate = async () => {
    if (!manualData.currentHeadline || !manualData.targetRole) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in at least your current headline and target role",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Send manual data to ChatGPT for analysis
      const aiAnalysisResponse = await fetch('https://e822798c-6f4f-475d-a7b5-b516f3ac5793.supabase.co/functions/v1/linkedin-profile-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manualData: manualData
        }),
      });

      if (aiAnalysisResponse.ok) {
        const aiResult = await aiAnalysisResponse.json();
        if (aiResult.success) {
          // Create optimized profile from AI analysis
          const optimizedProfile = {
            headline: aiResult.analysis.optimizedHeadline,
            about: aiResult.analysis.enhancedAbout,
            experience: aiResult.analysis.experienceBullets,
            keywords: aiResult.analysis.strategicKeywords,
            improvementScore: aiResult.analysis.profileScore
          };
          setOptimizationAnalysis(optimizedProfile);
        } else {
          throw new Error(aiResult.error || 'AI analysis failed');
        }
      } else {
        throw new Error('Failed to connect to analysis service');
      }
      
      toast({
        title: "Profile Optimized!",
        description: "Your LinkedIn profile has been successfully optimized by AI",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              LinkedIn Profile Optimizer
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your LinkedIn profile with AI-powered optimization. Stand out to recruiters and land your dream job.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI-Powered Headlines</h3>
                <p className="text-muted-foreground">Craft compelling headlines that grab recruiter attention</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keyword Optimization</h3>
                <p className="text-muted-foreground">Boost visibility with industry-specific keywords</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Professional Tone</h3>
                <p className="text-muted-foreground">Transform content to sound more professional</p>
              </CardContent>
            </Card>
          </div>

          {/* Example Results */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Example Transformation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Before (Generic)</h4>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">"Software Developer"</p>
                    <p>"I am a software developer with experience in programming. I work on various projects and enjoy coding."</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">After (Optimized)</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">"Senior Full-Stack Developer | React & Node.js Expert | Building Scalable SaaS Solutions"</p>
                    <p>"Passionate Full-Stack Developer with 5+ years building scalable applications for 100K+ users. Expert in React, Node.js, and AWS..."</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!selectedMethod ? (
            /* Method Selection */
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Choose Your Optimization Method</CardTitle>
                <p className="text-muted-foreground">Select how you'd like to provide your profile information</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Button
                    variant="outline"
                    className="h-32 flex-col gap-4 hover:bg-primary/5"
                    onClick={() => handleMethodSelect('url')}
                  >
                    <Globe className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">Fill with URL</div>
                      <div className="text-sm text-muted-foreground">Enter your LinkedIn profile URL</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-32 flex-col gap-4 hover:bg-primary/5"
                    onClick={() => handleMethodSelect('manual')}
                  >
                    <Edit3 className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">Fill Manually</div>
                      <div className="text-sm text-muted-foreground">Enter your details in a form</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {selectedMethod === 'url' ? 'LinkedIn URL Method' : 'Manual Input Method'}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMethod(null)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedMethod === 'url' ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="linkedin-url">LinkedIn Profile URL *</Label>
                        <Input
                          id="linkedin-url"
                          type="url"
                          placeholder="https://linkedin.com/in/your-profile"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          AI will analyze the profile at this URL
                        </p>
                      </div>
                      
                      <Button
                        onClick={handleUrlGenerate}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Analyzing..." : "Analyze Profile"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-headline">Current Headline *</Label>
                        <Input
                          id="current-headline"
                          placeholder="e.g., Software Developer"
                          value={manualData.currentHeadline}
                          onChange={(e) => setManualData({...manualData, currentHeadline: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="current-about">Current About Section</Label>
                        <Textarea
                          id="current-about"
                          placeholder="Paste your current LinkedIn about section..."
                          rows={4}
                          value={manualData.currentAbout}
                          onChange={(e) => setManualData({...manualData, currentAbout: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="current-experience">Current Work Experience</Label>
                        <Textarea
                          id="current-experience"
                          placeholder="Paste your work experience descriptions..."
                          rows={4}
                          value={manualData.currentExperience}
                          onChange={(e) => setManualData({...manualData, currentExperience: e.target.value})}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="target-role">Target Role *</Label>
                          <Input
                            id="target-role"
                            placeholder="e.g., Senior Product Manager"
                            value={manualData.targetRole}
                            onChange={(e) => setManualData({...manualData, targetRole: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select
                            value={manualData.industry}
                            onValueChange={(value) => setManualData({...manualData, industry: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tone">Tone</Label>
                          <Select
                            value={manualData.tone}
                            onValueChange={(value) => setManualData({...manualData, tone: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="friendly">Friendly</SelectItem>
                              <SelectItem value="confident">Confident</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience-level">Experience Level</Label>
                          <Select
                            value={manualData.experienceLevel}
                            onValueChange={(value) => setManualData({...manualData, experienceLevel: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="entry">Entry Level</SelectItem>
                              <SelectItem value="mid">Mid Level</SelectItem>
                              <SelectItem value="senior">Senior Level</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="additional-skills">Additional Skills (Optional)</Label>
                        <Input
                          id="additional-skills"
                          placeholder="e.g., Python, Project Management, Public Speaking"
                          value={manualData.additionalSkills}
                          onChange={(e) => setManualData({...manualData, additionalSkills: e.target.value})}
                        />
                      </div>

                      <Button
                        onClick={handleManualGenerate}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Generating Optimization..." : "Generate Optimization"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedMethod === 'url' ? 'LinkedIn Profile Analysis' : 'Optimized Results'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMethod === 'url' && scrapedProfile ? (
                    <div className="space-y-6">
                      <LinkedInProfileSkeleton
                        profile={scrapedProfile}
                        showOptimizations={true}
                        optimizations={optimizationAnalysis}
                      />
                    </div>
                  ) : optimizedProfile ? (
                    <div className="space-y-6">
                      {/* Score */}
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {optimizedProfile.improvementScore}%
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">Profile Improvement Score</p>
                      </div>

                      {/* Keywords */}
                      <div>
                        <h4 className="font-semibold mb-2">Optimized Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {optimizedProfile.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary">{keyword}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Headline */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Optimized Headline</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(optimizedProfile.headline, "Headline")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                          {optimizedProfile.headline}
                        </div>
                      </div>

                      {/* About Section */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Optimized About Section</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(optimizedProfile.about, "About section")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-sm max-h-40 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans">
                            {optimizedProfile.about}
                          </pre>
                        </div>
                      </div>

                      {/* Experience */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Optimized Experience Bullets</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(optimizedProfile.experience.join('\n'), "Experience bullets")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                          {optimizedProfile.experience.map((bullet, index) => (
                            <div key={index} className="mb-1">{bullet}</div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Complete Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {selectedMethod === 'url' 
                          ? 'Your LinkedIn profile analysis will appear here once processed.'
                          : 'Your optimized LinkedIn profile will appear here once generated.'
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}