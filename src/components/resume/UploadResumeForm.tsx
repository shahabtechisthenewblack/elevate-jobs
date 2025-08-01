import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadResumeFormProps {
  onComplete: (extractedData: any) => void;
  onBack: () => void;
}

const UploadResumeForm = ({ onComplete, onBack }: UploadResumeFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // Simulate AI processing of resume
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Processing uploaded file:', file.name, file.type, file.size);
      
      // Comprehensive AI extraction simulation - maps to all resume fields
      // In a real implementation, this would use OCR/AI to extract from the uploaded file
      const extractedData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe', 
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        socialLinks: {
          website: 'johndoe.com',
          linkedin: 'linkedin.com/in/johndoe',
          github: 'github.com/johndoe',
          portfolio: 'portfolio.johndoe.com',
          twitter: '@johndoe'
        },
        summary: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering scalable solutions that increased user engagement by 40% and reduced load times by 25%.',
        workExperience: [
          {
            id: '1',
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            location: 'New York, NY',
            startDate: '2020-01',
            endDate: '',
            current: true,
            description: [
              'Led development of microservices architecture serving 100K+ daily active users',
              'Implemented CI/CD pipelines reducing deployment time by 60%',
              'Mentored 3 junior developers and conducted code reviews',
              'Collaborated with product team to define technical requirements'
            ]
          },
          {
            id: '2', 
            company: 'StartupXYZ',
            position: 'Full Stack Developer',
            location: 'New York, NY',
            startDate: '2018-06',
            endDate: '2019-12',
            current: false,
            description: [
              'Built responsive web applications using React and Node.js',
              'Optimized database queries improving performance by 35%',
              'Integrated third-party APIs and payment processing systems'
            ]
          }
        ],
        education: [
          {
            id: '1',
            institution: 'New York University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'New York, NY',
            startDate: '2014-09',
            endDate: '2018-05',
            gpa: '3.8',
            honors: 'Magna Cum Laude, Dean\'s List'
          }
        ],
        skills: [
          { name: 'JavaScript', level: 'Expert', category: 'Programming Languages' },
          { name: 'React', level: 'Expert', category: 'Frameworks' },
          { name: 'Node.js', level: 'Advanced', category: 'Backend' },
          { name: 'Python', level: 'Advanced', category: 'Programming Languages' },
          { name: 'AWS', level: 'Intermediate', category: 'Cloud' },
          { name: 'Docker', level: 'Intermediate', category: 'DevOps' },
          { name: 'MongoDB', level: 'Advanced', category: 'Databases' },
          { name: 'Git', level: 'Expert', category: 'Tools' }
        ],
        // Additional extracted sections
        certifications: [
          {
            id: '1',
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: '2023-03',
            url: 'https://aws.amazon.com/certification/'
          }
        ],
        projects: [
          {
            id: '1',
            name: 'E-commerce Platform',
            description: 'Built full-stack e-commerce solution with React, Node.js, and Stripe integration',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            url: 'https://github.com/johndoe/ecommerce',
            startDate: '2023-01',
            endDate: '2023-06'
          }
        ],
        interests: ['Web Development', 'Machine Learning', 'Open Source', 'Photography'],
        awards: [
          {
            id: '1',
            title: 'Employee of the Year',
            issuer: 'Tech Corp',
            date: '2023-12',
            description: 'Recognized for outstanding contribution to team productivity and innovation'
          }
        ],
        volunteering: [
          {
            id: '1',
            organization: 'Local Coding Bootcamp',
            role: 'Volunteer Instructor',
            location: 'New York, NY',
            startDate: '2022-01',
            endDate: '2023-12',
            current: false,
            description: 'Taught web development fundamentals to aspiring developers'
          }
        ],
        publications: [
          {
            id: '1',
            title: 'Building Scalable Web Applications with React',
            publisher: 'Tech Blog',
            date: '2023-08',
            url: 'https://techblog.com/react-scalability',
            description: 'Article about best practices for building large-scale React applications'
          }
        ]
      };

      toast({
        title: "Resume processed successfully!",
        description: "We've extracted your information and you can now select a template.",
      });

      onComplete(extractedData);
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your resume. Please try again.",
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
            <Upload className="h-5 w-5" />
            Upload Your Existing Resume
          </CardTitle>
          <CardDescription>
            Upload your current resume and our AI will extract all the information to build upon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume-upload">Choose your resume file</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {file ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-600" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">Click to change file</p>
                  </>
                ) : (
                  <>
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload your resume</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX files only</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back to Options
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Extract Information'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadResumeForm;