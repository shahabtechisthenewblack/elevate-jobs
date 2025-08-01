import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Target, Brain, FileText, Download, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  modelAnswer: string;
  lookingFor: string;
}

interface UserAnswer {
  questionId: number;
  answer: string;
  score?: number;
  feedback?: string;
}

type Step = 'input' | 'questions' | 'results';

const InterviewPrep = () => {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [formData, setFormData] = useState({
    jobDescription: '',
    jobRole: '',
    interviewType: '',
    experienceLevel: ''
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const { toast } = useToast();

  // Sample questions for demonstration
  const generateQuestions = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleQuestions: Question[] = [
      {
        id: 1,
        question: "Tell me about yourself and why you're interested in this position.",
        modelAnswer: "I'm a passionate software engineer with 3 years of experience in full-stack development. I specialize in React and Node.js, and I'm particularly drawn to this role because it combines my technical skills with my interest in solving complex user problems. In my previous role, I led a team that increased user engagement by 40% through innovative feature development.",
        lookingFor: "Professional summary, relevant experience, enthusiasm for the role, and alignment with company goals."
      },
      {
        id: 2,
        question: "Describe a challenging project you worked on and how you overcame obstacles.",
        modelAnswer: "I worked on a real-time collaboration platform that had severe performance issues. The challenge was handling thousands of concurrent users without lag. I implemented WebSocket optimization, database indexing, and caching strategies. The result was a 70% improvement in response time and ability to handle 10x more users.",
        lookingFor: "Problem-solving skills, technical depth, ability to work under pressure, and measurable results."
      },
      {
        id: 3,
        question: "How do you handle working in a team environment?",
        modelAnswer: "I believe in open communication and collaborative problem-solving. I actively participate in code reviews, share knowledge through documentation, and ensure everyone is aligned on project goals. When conflicts arise, I focus on finding solutions that benefit the project while respecting different perspectives.",
        lookingFor: "Teamwork skills, communication abilities, conflict resolution, and leadership potential."
      },
      {
        id: 4,
        question: "Where do you see yourself in 5 years?",
        modelAnswer: "In 5 years, I see myself as a senior engineer or tech lead, contributing to architectural decisions and mentoring junior developers. I want to expand my expertise in emerging technologies while continuing to deliver impactful solutions. I'm also interested in contributing to open-source projects and building products that make a difference.",
        lookingFor: "Career ambition, alignment with company growth, realistic goals, and long-term thinking."
      },
      {
        id: 5,
        question: "Why are you leaving your current job?",
        modelAnswer: "I'm looking for new challenges and opportunities to grow my skills. While I've learned a lot in my current role, I feel ready to take on more responsibility and work with new technologies. This position offers exactly the kind of growth and impact I'm seeking in my career.",
        lookingFor: "Positive attitude, growth mindset, alignment with new role, and professional reasons for change."
      }
    ];
    
    setQuestions(sampleQuestions);
    setUserAnswers(sampleQuestions.map(q => ({ questionId: q.id, answer: '' })));
    setCurrentStep('questions');
    setIsGenerating(false);
    
    toast({
      title: "Questions Generated!",
      description: `${sampleQuestions.length} interview questions are ready for you.`,
    });
  };

  const handleAnswerSubmit = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Score all answers
      setIsScoring(true);
      
      // Simulate AI scoring
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const scoredAnswers = userAnswers.map(answer => ({
        ...answer,
        score: Math.floor(Math.random() * 3) + 7, // Random score between 7-10
        feedback: generateFeedback(answer.answer)
      }));
      
      setUserAnswers(scoredAnswers);
      setCurrentStep('results');
      setIsScoring(false);
      
      toast({
        title: "Scoring Complete!",
        description: "Your interview answers have been analyzed and scored.",
      });
    }
  };

  const generateFeedback = (answer: string) => {
    const feedbacks = [
      "Great structure and specific examples! Consider adding more quantifiable results to strengthen your response.",
      "Good technical depth. Try to connect your experience more directly to the role requirements.",
      "Excellent communication style. You could enhance this by mentioning specific technologies or methodologies.",
      "Strong problem-solving approach shown. Consider highlighting your collaboration skills more explicitly.",
      "Well-articulated response. Adding metrics or specific outcomes would make this even more compelling."
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const averageScore = userAnswers.length > 0 
    ? userAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0) / userAnswers.length 
    : 0;

  const copyResults = () => {
    const results = userAnswers.map((answer, index) => {
      const question = questions[index];
      return `Q${index + 1}: ${question.question}\n\nYour Answer: ${answer.answer}\n\nScore: ${answer.score}/10\nFeedback: ${answer.feedback}\n\n---\n\n`;
    }).join('');
    
    navigator.clipboard.writeText(results);
    toast({
      title: "Results Copied!",
      description: "Interview results have been copied to clipboard.",
    });
  };

  const downloadResults = () => {
    const results = userAnswers.map((answer, index) => {
      const question = questions[index];
      return `Q${index + 1}: ${question.question}\n\nYour Answer: ${answer.answer}\n\nScore: ${answer.score}/10\nFeedback: ${answer.feedback}\n\n---\n\n`;
    }).join('');
    
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-results.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Results Downloaded!",
      description: "Interview results have been saved to your device.",
    });
  };

  if (currentStep === 'input') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">AI Interview Prep</h1>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                Generate realistic interview questions and get AI-powered feedback on your answers
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Interview Setup
                </CardTitle>
                <CardDescription>
                  Provide job details to generate tailored interview questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description *</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description or key requirements here..."
                    className="min-h-[120px]"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-role">Job Role</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, jobRole: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="software-engineer">Software Engineer</SelectItem>
                        <SelectItem value="product-manager">Product Manager</SelectItem>
                        <SelectItem value="data-scientist">Data Scientist</SelectItem>
                        <SelectItem value="designer">UX/UI Designer</SelectItem>
                        <SelectItem value="marketing">Digital Marketer</SelectItem>
                        <SelectItem value="sales">Sales Representative</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interview-type">Interview Type</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, interviewType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="managerial">Managerial</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience-level">Experience Level</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={generateQuestions}
                  disabled={!formData.jobDescription.trim() || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? "Generating Questions..." : "Generate Interview Questions"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'questions') {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('input')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Setup
              </Button>
              
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">Interview Questions</h1>
                <Badge variant="secondary">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
              </div>
              
              <Progress value={progress} className="w-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-4">{currentQuestion.question}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">What they're looking for:</h4>
                      <p className="text-sm">{currentQuestion.lookingFor}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Sample Answer:</h4>
                      <p className="text-sm">{currentQuestion.modelAnswer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Answer Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Answer</CardTitle>
                  <CardDescription>
                    Take your time to craft a thoughtful response
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Type your answer here..."
                    className="min-h-[200px]"
                    value={currentAnswer.answer}
                    onChange={(e) => {
                      const newAnswers = [...userAnswers];
                      newAnswers[currentQuestionIndex].answer = e.target.value;
                      setUserAnswers(newAnswers);
                    }}
                  />
                  
                  <div className="flex gap-2">
                    {currentQuestionIndex > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={!currentAnswer.answer.trim() || isScoring}
                      className="flex-1"
                    >
                      {isScoring ? "Scoring Answers..." : 
                       currentQuestionIndex === questions.length - 1 ? "Submit & Get Results" : "Next Question"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentStep('input');
                  setCurrentQuestionIndex(0);
                  setUserAnswers([]);
                  setQuestions([]);
                }}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Start New Interview
              </Button>
              
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Interview Results</h1>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={copyResults}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Results
                  </Button>
                  <Button variant="outline" onClick={downloadResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Overall Score */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Overall Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">
                      {averageScore.toFixed(1)}/10
                    </div>
                    <div>
                      <Progress value={averageScore * 10} className="w-32 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {averageScore >= 8.5 ? "Excellent" : 
                         averageScore >= 7.5 ? "Good" : 
                         averageScore >= 6.5 ? "Fair" : "Needs Improvement"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6">
              {questions.map((question, index) => {
                const answer = userAnswers[index];
                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <Badge variant={answer.score >= 8 ? "default" : answer.score >= 7 ? "secondary" : "destructive"}>
                          {answer.score}/10
                        </Badge>
                      </div>
                      <p className="text-base">{question.question}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Your Answer:</h4>
                        <p className="text-sm bg-muted p-3 rounded">{answer.answer}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Feedback:</h4>
                        <p className="text-sm">{answer.feedback}</p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          setCurrentStep('questions');
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry Answer
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InterviewPrep;