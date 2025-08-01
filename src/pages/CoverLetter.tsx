import { useState, useEffect } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PDFViewer from "@/components/PDFViewer";
import { useResumeUploadCoverLetter } from "@/hooks/useResumeUploadCoverLetter";

import { FileText, Download, Copy, Sparkles, Clock, Target, Users, Plus, Edit3, User, Mail, Briefcase } from "lucide-react";

// Try multiple worker sources as fallbacks
const workerSources = [
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
  'https://unpkg.com/pdfjs-dist@5.4.54/build/pdf.worker.min.js'
];

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];

export default function CoverLetter() {
  const { toast } = useToast();
  const { uploadResume, isUploading, uploadedResume, setUploadedResume } = useResumeUploadCoverLetter();
  
  
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    location: "",
    // Job Details
    jobTitle: "",
    companyName: "",
    currentPosition: "",
    yearsExperience: "",
    education: "",
    skills: "",
    responsibilities: "",
    // Additional Information
    industry: "",
    tone: "",
    length: "",
    keySkills: [] as string[],
    emphasizeAchievements: false,
    includePersonalPassion: false,
    customInstructions: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showResumeView, setShowResumeView] = useState(false);
  const [uploadedResumeText, setUploadedResumeText] = useState("");
  const [showResumeUploaded, setShowResumeUploaded] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Marketing",
    "Education",
    "Retail",
    "Manufacturing",
    "Consulting",
    "Other"
  ];

  const tones = [
    { value: "professional", label: "Professional", desc: "Formal and business-appropriate" },
    { value: "bold", label: "Bold", desc: "Confident and assertive" },
    { value: "humble", label: "Humble", desc: "Modest and respectful" },
    { value: "friendly", label: "Friendly", desc: "Warm and approachable" }
  ];

  const lengths = [
    { value: "short", label: "Short", desc: "Under 150 words" },
    { value: "standard", label: "Standard", desc: "250-350 words" },
    { value: "long", label: "Long", desc: "500+ words" }
  ];

  const exampleLetters = [
    {
      title: "Software Engineer at Tech Startup",
      jobType: "Technical",
      tone: "Professional",
      content: `ALEX JOHNSON
COVER LETTER
December 15, 2024

To Whom It May Concern:

My name is Alex Johnson. I obtained a Bachelor's degree in Computer Science from Stanford University. I have been in software engineering for 5 years. I plan to diversify and expand my knowledge in full-stack development by continuing my experience in Software Engineer to aid innovative startups in scaling their technology infrastructure. I am qualified for this position because I have experience in React, Node.js, AWS, and microservices architecture and most important certification in AWS Solutions Architect. Additionally, I am certified in Agile/Scrum methodologies. It is with great enthusiasm that I apply for the Software Engineer role at InnovateTech.

I currently work HYBRID at TechCorp in San Francisco, operating from San Francisco Bay Area. In my position, I lead the development of scalable microservices architecture and its purpose is to improve system performance and reduce deployment time. By managing multiple responsibilities such as code reviews, mentoring junior developers, and client communications, I ensure my work is well-organized and tailored to the needs of both my tasks and the company's stakeholders. Among my core responsibilities is architecting cloud-native solutions that handle high-traffic applications. Relationship-building and staying organized are essential in software engineering. I ensure trust through efficient development processes and maintain version control best practices and automated testing.

Based on my experience, I believe I am a strong candidate for the Software Engineer at InnovateTech. I bring both expertise and dedication to the role. I can be contacted at (555) 123-4567 or alex.johnson@email.com. Thank you for your time and consideration. I look forward to hearing from you.

Respectfully Submitted,
Alex Johnson`
    },
    {
      title: "Marketing Manager at Creative Agency",
      jobType: "Creative",
      tone: "Bold",
      content: `SARAH MARTINEZ
COVER LETTER
December 15, 2024

To Whom It May Concern:

My name is Sarah Martinez. I obtained a Bachelor's degree in Marketing from UCLA. I have been in digital marketing for 6 years. I plan to diversify and expand my knowledge in creative marketing by continuing my experience in Marketing Manager to aid agencies in developing breakthrough campaigns. I am qualified for this position because I have experience in campaign strategy, brand development, and data analytics and most important certification in Google Analytics and Facebook Blueprint. Additionally, I am certified in Adobe Creative Suite. It is with great enthusiasm that I apply for the Marketing Manager role at BrandForward Agency.

I currently work REMOTE at CreativeMinds Agency in Los Angeles, operating from Los Angeles, CA. In my position, I develop and execute comprehensive marketing campaigns and its purpose is to drive brand awareness and generate measurable ROI. By managing multiple responsibilities such as client presentations, team coordination, and budget management, I ensure my work is well-organized and tailored to the needs of both my tasks and the company's stakeholders. Among my core responsibilities is creating data-driven marketing strategies that exceed performance targets. Relationship-building and staying organized are essential in marketing. I ensure trust through transparent reporting and maintain collaborative project management systems.

Based on my experience, I believe I am a strong candidate for the Marketing Manager at BrandForward Agency. I bring both expertise and dedication to the role. I can be contacted at (555) 987-6543 or sarah.martinez@email.com. Thank you for your time and consideration. I look forward to hearing from you.

Respectfully Submitted,
Sarah Martinez`
    },
    {
      title: "Data Analyst at Financial Services",
      jobType: "Analytical",
      tone: "Professional",
      content: `MICHAEL CHEN
COVER LETTER
December 15, 2024

To Whom It May Concern:

My name is Michael Chen. I obtained a Master's degree in Statistics from NYU. I have been in data analysis for 3 years. I plan to diversify and expand my knowledge in financial analytics by continuing my experience in Data Analyst to aid financial institutions in making data-driven decisions. I am qualified for this position because I have experience in Python, SQL, R, and statistical modeling and most important certification in SAS Advanced Analytics. Additionally, I am certified in Tableau and Power BI. It is with great enthusiasm that I apply for the Data Analyst role at FinanceFirst.

I currently work ONSITE at DataCorp in New York, operating from New York, NY. In my position, I analyze complex financial datasets and its purpose is to identify trends and provide actionable business insights. By managing multiple responsibilities such as data visualization, model validation, and stakeholder presentations, I ensure my work is well-organized and tailored to the needs of both my tasks and the company's stakeholders. Among my core responsibilities is developing predictive models that optimize investment strategies. Relationship-building and staying organized are essential in data analysis. I ensure trust through rigorous validation processes and maintain comprehensive documentation systems.

Based on my experience, I believe I am a strong candidate for the Data Analyst at FinanceFirst. I bring both expertise and dedication to the role. I can be contacted at (555) 456-7890 or michael.chen@email.com. Thank you for your time and consideration. I look forward to hearing from you.

Respectfully Submitted,
Michael Chen`
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Advanced AI creates personalized cover letters tailored to each job"
    },
    {
      icon: Target,
      title: "Job-Specific Matching",
      description: "Automatically aligns your skills with job requirements"
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Generate professional cover letters in under 30 seconds"
    },
    {
      icon: Users,
      title: "Multiple Variations",
      description: "Choose from different tones and lengths to match your style"
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.keySkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keySkills: [...prev.keySkills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keySkills: prev.keySkills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Update resume text when uploadedResume changes
  useEffect(() => {
    if (uploadedResume?.extractedText) {
      setUploadedResumeText(uploadedResume.extractedText);
      setShowResumeUploaded(true);
    }
  }, [uploadedResume]);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resumeData = await uploadResume(file);
        setUploadedFile(file);
      } catch (error) {
        // Error is already handled in the hook
        console.error('Upload failed:', error);
      }
    }
  };

  const generateAICoverLetter = async () => {
    if (!uploadedResumeText && !uploadedResume?.extractedText) {
      toast({
        title: "Resume not found",
        description: "Please upload a resume first.",
        variant: "destructive"
      });
      return;
    }

    const resumeText = uploadedResumeText || uploadedResume?.extractedText || '';

    setIsGeneratingAI(true);
    
    console.log('Generating cover letter with resume text length:', resumeText.length);
    console.log('Resume text preview:', resumeText.substring(0, 200) + '...');
    console.log('Job details:', { jobTitle: formData.jobTitle, companyName: formData.companyName });
    
    if (resumeText.length < 10) {
      toast({
        title: "Resume text too short",
        description: "The extracted text from your PDF is too short. Please check if your PDF contains readable text.",
        variant: "destructive"
      });
      setIsGeneratingAI(false);
      return;
    }

    // Check if we're working with fallback text (indicates PDF extraction failed)
    if (resumeText.includes('Text extraction failed') || resumeText.includes('PDF file uploaded:')) {
      toast({
        title: "PDF extraction failed",
        description: "Please try uploading your PDF again, or make sure it contains readable text (not scanned images).",
        variant: "destructive"
      });
      setIsGeneratingAI(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('cover-letter-generator', {
        body: {
          resumeText: resumeText,
          jobTitle: formData.jobTitle || '',
          companyName: formData.companyName || '',
          additionalInfo: formData.customInstructions || ''
        }
      });

      if (error) {
        throw error;
      }

      setGeneratedLetter(data.coverLetter);
      setIsGeneratingAI(false);
      
      toast({
        title: "Cover Letter Generated!",
        description: "AI has created your personalized cover letter"
      });
    } catch (error) {
      console.error('Error generating AI cover letter:', error);
      setIsGeneratingAI(false);
      toast({
        title: "Error",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateCoverLetterFromTemplate = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.jobTitle || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const templateLetter = `${formData.name.toUpperCase()}
COVER LETTER
${currentDate}

To Whom It May Concern:

My name is ${formData.name}. I obtained a ${formData.education || 'Bachelor\'s degree in my field'}. I have been in ${formData.currentPosition || 'my profession'} for ${formData.yearsExperience || '3'} years. I plan to diversify and expand my knowledge in ${formData.jobTitle.toLowerCase()} by continuing my experience in ${formData.jobTitle} to aid ${formData.companyName} in achieving their organizational goals. I am qualified for this position because I have experience in ${formData.skills || 'relevant technologies'} and most important certification in ${formData.keySkills[0] || 'industry certifications'}. Additionally, I am certified in ${formData.keySkills[1] || 'professional standards'}. It is with great enthusiasm that I apply for the ${formData.jobTitle} role at ${formData.companyName}.

I currently work HYBRID at ${formData.currentPosition || 'my current company'} in ${formData.location.split(',')[0] || 'my location'}, operating from ${formData.location}. In my position, I ${formData.responsibilities || 'manage key responsibilities'} and its purpose is to deliver exceptional results for the organization. By managing multiple responsibilities such as ${formData.responsibilities || 'project management, team collaboration, and client communications'}, I ensure my work is well-organized and tailored to the needs of both my tasks and the company's stakeholders. Among my core responsibilities is ${formData.responsibilities?.split(',')[0] || 'leading important initiatives'}. Relationship-building and staying organized are essential in ${formData.industry || 'my industry'}. I ensure trust through efficient work processes and maintain professional standards.

${formData.emphasizeAchievements ? `In my previous role, I achieved significant milestones including improving team productivity by 25% and successfully delivering 15+ projects on time and within budget. These accomplishments demonstrate my ability to drive results and contribute meaningfully to organizational success.` : ''}

Based on my experience, I believe I am a strong candidate for the ${formData.jobTitle} at ${formData.companyName}. I bring both expertise and dedication to the role. I can be contacted at ${formData.phone} or ${formData.email}. Thank you for your time and consideration. I look forward to hearing from you.

Respectfully Submitted,
${formData.name}`;

      setGeneratedLetter(templateLetter);
      setIsGenerating(false);
      toast({
        title: "Cover Letter Generated!",
        description: "Your personalized cover letter is ready"
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard"
    });
  };

  const downloadAsText = (content: string, filename: string = "cover-letter.txt") => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Downloaded!",
      description: "Cover letter saved as text file"
    });
  };

  const handleLetterEdit = (newContent: string) => {
    setGeneratedLetter(newContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Cover Letter Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get inspired by these AI-powered cover letters tailored for different industries and roles
          </p>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="examples">See Examples</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-8">
            {/* Generator Options */}
            {!showManualForm && !showResumeView && !showResumeUploaded && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Choose Your Method</h2>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-20 px-8"
                    onClick={() => document.getElementById('resume-upload')?.click()}
                    disabled={isGenerating}
                  >
                    <FileText className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">
                        {isGenerating ? "Uploading..." : "Upload Resume"}
                      </div>
                      <div className="text-sm text-muted-foreground">Upload and analyze resume</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-20 px-8"
                    onClick={() => setShowManualForm(true)}
                  >
                    <Edit3 className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-semibold">Fill Manually</div>
                      <div className="text-sm text-muted-foreground">Enter details manually</div>
                    </div>
                  </Button>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleResumeUpload}
                />
              </div>
            )}

            {/* Resume Uploaded Display */}
            {showResumeUploaded && !showResumeView && !showManualForm && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form */}
                <div>
                  {/* Resume Upload Status Card */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Resume Uploaded</h3>
                          {uploadedResume && (
                            <p className="text-sm text-muted-foreground">{uploadedResume.fileName}</p>
                          )}
                        </div>
                      </div>
                      {uploadedResume && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {new Date(uploadedResume.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Job details form */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Job Details</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Add job details to create a tailored cover letter
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Job Title</label>
                          <Input
                            placeholder="Software Engineer"
                            value={formData.jobTitle}
                            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Company Name</label>
                          <Input
                            placeholder="ABC Company"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Additional Instructions</label>
                          <Textarea
                            value={formData.customInstructions}
                            onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                            placeholder="Any specific requirements for this role..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* PDF Viewer */}
                  {showPDFViewer && uploadedFile && (
                    <div className="mb-6">
                      <PDFViewer 
                        file={uploadedFile} 
                        onClose={() => setShowPDFViewer(false)}
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button 
                      onClick={generateAICoverLetter}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2 flex-1"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isGeneratingAI ? "Generating..." : "Generate Cover Letter"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowResumeUploaded(false);
                        setUploadedResumeText("");
                        setUploadedFile(null);
                        setShowPDFViewer(false);
                        setGeneratedLetter("");
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          location: "",
                          jobTitle: "",
                          companyName: "",
                          currentPosition: "",
                          yearsExperience: "",
                          education: "",
                          skills: "",
                          responsibilities: "",
                          industry: "",
                          tone: "",
                          length: "",
                          keySkills: [] as string[],
                          emphasizeAchievements: false,
                          includePersonalPassion: false,
                          customInstructions: ""
                        });
                      }}
                    >
                      Start Over
                    </Button>
                  </div>
                </div>

                {/* Right Column - Generated Cover Letter */}
                <div>
                  {generatedLetter ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Generated Cover Letter
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedLetter)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadAsText(generatedLetter)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            {isEditing ? "Save" : "Edit"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <Textarea
                            value={generatedLetter}
                            onChange={(e) => setGeneratedLetter(e.target.value)}
                            className="min-h-[500px] font-mono text-sm"
                          />
                        ) : (
                          <div className="bg-background border rounded-lg p-4">
                            <pre className="whitespace-pre-wrap text-sm">
                              {generatedLetter}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-full flex items-center justify-center min-h-[400px]">
                      <CardContent className="text-center">
                        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Generated Cover Letter</h3>
                        <p className="text-muted-foreground">
                          Upload your resume and add job details, then click "Generate Cover Letter" to create your personalized cover letter.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}


            {showResumeView && (
              <div className="space-y-8">
                {/* Parsed Resume Data Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div><strong>Name:</strong> {formData.name || 'Not found'}</div>
                      <div><strong>Email:</strong> {formData.email || 'Not found'}</div>
                      <div><strong>Phone:</strong> {formData.phone || 'Not found'}</div>
                      <div><strong>Current Position:</strong> {formData.currentPosition || 'Not found'}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Professional Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div><strong>Education:</strong> {formData.education || 'Not found'}</div>
                      <div><strong>Skills:</strong> {formData.skills || 'Not found'}</div>
                      <div>
                        <strong>Key Responsibilities:</strong>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {formData.responsibilities || 'Not found'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Raw Resume Display */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Raw Resume Text
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={() => {
                        setShowResumeView(false);
                        setUploadedResumeText("");
                        setGeneratedLetter("");
                      }}>
                        Back
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-background border rounded-lg p-6 max-h-96 overflow-y-auto">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                          {uploadedResumeText}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Generated Cover Letter Display */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Auto-generated from Resume
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedLetter)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadAsText(generatedLetter)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={generatedLetter}
                          onChange={(e) => handleLetterEdit(e.target.value)}
                          className="min-h-[500px] font-mono text-sm"
                        />
                      ) : (
                        <div className="bg-background border rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-sm">
                            {generatedLetter}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {showManualForm && !showResumeView && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Manual Form */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Fill Manually</h2>
                    <Button variant="outline" size="sm" onClick={() => {
                      setShowManualForm(false);
                      setGeneratedLetter("");
                    }}>
                      Back
                    </Button>
                  </div>

                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name *</label>
                          <Input
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email *</label>
                          <Input
                            placeholder="john@example.com"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Phone *</label>
                          <Input
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Location *</label>
                          <Input
                            placeholder="City, State"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Job Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Job Title *</label>
                          <Input
                            placeholder="Software Engineer"
                            value={formData.jobTitle}
                            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Company Name *</label>
                          <Input
                            placeholder="ABC Company"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Job Description *</label>
                        <Textarea
                          placeholder="Paste the job description here..."
                          value={formData.responsibilities}
                          onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                          className="min-h-[120px]"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Information (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Industry</label>
                          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry.toLowerCase()}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Tone</label>
                          <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                              {tones.map((tone) => (
                                <SelectItem key={tone.value} value={tone.value}>
                                  <div>
                                    <div className="font-medium">{tone.label}</div>
                                    <div className="text-xs text-muted-foreground">{tone.desc}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Length</label>
                          <Select value={formData.length} onValueChange={(value) => handleInputChange('length', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                            <SelectContent>
                              {lengths.map((length) => (
                                <SelectItem key={length.value} value={length.value}>
                                  <div>
                                    <div className="font-medium">{length.label}</div>
                                    <div className="text-xs text-muted-foreground">{length.desc}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Key Skills */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Key Skills (Optional)</label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Add a skill"
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          />
                          <Button type="button" onClick={addSkill} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.keySkills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                              {skill} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Advanced Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="achievements"
                            checked={formData.emphasizeAchievements}
                            onCheckedChange={(checked) => handleInputChange('emphasizeAchievements', checked)}
                          />
                          <label htmlFor="achievements" className="text-sm font-medium">
                            Emphasize specific achievements and metrics
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="passion"
                            checked={formData.includePersonalPassion}
                            onCheckedChange={(checked) => handleInputChange('includePersonalPassion', checked)}
                          />
                          <label htmlFor="passion" className="text-sm font-medium">
                            Include personal passion for the role/company
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Custom Instructions (Optional)</label>
                        <Textarea
                          value={formData.customInstructions}
                          onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                          placeholder="Any additional notes or instructions for the AI..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    onClick={generateCoverLetterFromTemplate} 
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate Cover Letter"}
                  </Button>
                </div>

                {/* Right Side - Generated Result */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Cover Letter</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedLetter)}
                          disabled={!generatedLetter}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadAsText(generatedLetter)}
                          disabled={!generatedLetter}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                          disabled={!generatedLetter}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          {isEditing ? "Save" : "Edit"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {generatedLetter ? (
                        isEditing ? (
                          <Textarea
                            value={generatedLetter}
                            onChange={(e) => setGeneratedLetter(e.target.value)}
                            className="min-h-[600px] font-mono text-sm"
                          />
                        ) : (
                          <div className="whitespace-pre-wrap font-mono text-sm border rounded p-4 bg-muted/50 min-h-[600px]">
                            {generatedLetter}
                          </div>
                        )
                      ) : (
                        <div className="text-center text-muted-foreground py-20">
                          Fill out the form and click "Generate Cover Letter" to see your personalized cover letter here.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

          </TabsContent>

          <TabsContent value="examples">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Cover Letter Examples</h2>
                <p className="text-muted-foreground">Get inspired by these AI-generated cover letters tailored for different industries and roles</p>
              </div>
              
              <div className="space-y-6">
                {exampleLetters.map((example, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{example.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{example.jobType}</Badge>
                            <Badge variant="outline">{example.tone}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(example.content)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => downloadAsText(example.content, `${example.title.replace(/\s+/g, '-').toLowerCase()}-cover-letter.txt`)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-6 rounded-lg">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {example.content}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Ready to Create Your Perfect Cover Letter?</h3>
                    <p className="text-muted-foreground mb-4">Use our AI generator to create a personalized cover letter tailored to your specific job application</p>
                    <Button onClick={() => {
                      const generatorTab = document.querySelector('[value="generator"]') as HTMLElement;
                      generatorTab?.click();
                    }}>
                      Get Started Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Why Choose Our AI Cover Letter Generator?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                    <span><strong>Tailored Content:</strong> Each letter is customized to match the specific job description and requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                    <span><strong>Professional Quality:</strong> Written by AI trained on thousands of successful cover letters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                    <span><strong>Multiple Formats:</strong> Download as text, copy to clipboard, or email directly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                    <span><strong>Time Saving:</strong> Generate professional cover letters in under 30 seconds</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}