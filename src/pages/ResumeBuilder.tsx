import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Linkedin, Sparkles, FileText } from 'lucide-react';
import ResumeStartOptions from '@/components/resume/ResumeStartOptions';
import UploadResumeForm from '@/components/resume/UploadResumeForm';
import LinkedInImportForm from '@/components/resume/LinkedInImportForm';
import AIPromptForm from '@/components/resume/AIPromptForm';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumeTemplates from '@/components/resume/ResumeTemplates';
import ResumePreview from '@/components/resume/ResumePreview';
import { ResumeData } from '@/types/resume';

export type ResumeBuilderStep = 'start' | 'upload' | 'linkedin' | 'ai' | 'form' | 'templates' | 'preview';

const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState<ResumeBuilderStep>('start');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    switch (option) {
      case 'upload':
        setCurrentStep('upload');
        break;
      case 'linkedin':
        setCurrentStep('linkedin');
        break;
      case 'ai':
        setCurrentStep('ai');
        break;
      case 'blank':
        setCurrentStep('form');
        break;
      default:
        setCurrentStep('form');
    }
  };

  const handleBackToStart = () => {
    setCurrentStep('start');
    setSelectedOption('');
    setResumeData(null);
  };

  const handleDataExtracted = (data: any) => {
    setResumeData(data);
    // Skip form and go directly to templates for upload, linkedin, and AI options
    setCurrentStep('templates');
  };

  const handleFormComplete = (data: ResumeData) => {
    setResumeData(data);
    setCurrentStep('templates');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep('preview');
  };

  const handleResumeDataUpdate = (updatedData: ResumeData) => {
    setResumeData(updatedData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'start':
        return <ResumeStartOptions onOptionSelect={handleOptionSelect} />;
      case 'upload':
        return <UploadResumeForm onComplete={handleDataExtracted} onBack={handleBackToStart} />;
      case 'linkedin':
        return <LinkedInImportForm onComplete={handleDataExtracted} onBack={handleBackToStart} />;
      case 'ai':
        return <AIPromptForm onComplete={handleDataExtracted} onBack={handleBackToStart} />;
      case 'form':
        return <ResumeForm onComplete={handleFormComplete} initialData={resumeData} />;
      case 'templates':
        return <ResumeTemplates onTemplateSelect={handleTemplateSelect} />;
      case 'preview':
        return <ResumePreview resumeData={resumeData!} template={selectedTemplate} onDataUpdate={handleResumeDataUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            AI-Powered Resume Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create an ATS-friendly, professional resume that stands out to recruiters and hiring managers
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {(() => {
              // Different steps based on selected option
              const steps = selectedOption === 'blank' 
                ? ['start', 'form', 'templates', 'preview']
                : ['start', 'templates', 'preview'];
              
              const stepLabels = selectedOption === 'blank'
                ? ['Choose Option', 'Fill Details', 'Select Template', 'Preview & Download']
                : ['Choose Option', 'Select Template', 'Preview & Download'];
              
              return steps.map((step, index) => {
                const isActive = currentStep === step || 
                               (step === 'form' && ['upload', 'linkedin', 'ai', 'form'].includes(currentStep)) ||
                               (step === 'templates' && selectedOption !== 'blank' && ['upload', 'linkedin', 'ai'].includes(currentStep));
                const isCompleted = steps.indexOf(currentStep) > index;
                
                return (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="hidden sm:block ml-2 text-xs text-muted-foreground">
                      {stepLabels[index]}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-2 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default ResumeBuilder;