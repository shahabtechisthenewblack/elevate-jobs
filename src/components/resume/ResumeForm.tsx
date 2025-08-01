import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PersonalInfoForm from './forms/PersonalInfoForm';
import WorkExperienceForm from './forms/WorkExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import { ResumeData } from '@/types/resume';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface ResumeFormProps {
  onComplete: (data: ResumeData) => void;
  initialData?: Partial<ResumeData> | null;
}

const ResumeForm = ({ onComplete, initialData }: ResumeFormProps) => {
  const [currentTab, setCurrentTab] = useState('personal');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<ResumeData>>(initialData || {});

  const tabs = [
    { id: 'personal', label: 'Personal Info', required: true },
    { id: 'summary', label: 'Summary', required: true },
    { id: 'experience', label: 'Experience', required: true },
    { id: 'education', label: 'Education', required: true },
    { id: 'skills', label: 'Skills', required: true },
    { id: 'projects', label: 'Projects', required: false },
    { id: 'certifications', label: 'Certifications', required: false },
    { id: 'awards', label: 'Awards', required: false },
    { id: 'volunteering', label: 'Volunteering', required: false },
    { id: 'publications', label: 'Publications', required: false },
  ];

  const handleSectionComplete = (sectionId: string, data: any) => {
    setFormData(prev => ({ ...prev, [sectionId]: data }));
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
    }
  };

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
    }
  };

  const goToPrevTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  const handleFinish = () => {
    // Validate required sections are completed
    const requiredSections = tabs.filter(tab => tab.required).map(tab => tab.id);
    const missingRequired = requiredSections.filter(section => !completedSections.includes(section));
    
    if (missingRequired.length > 0) {
      alert(`Please complete required sections: ${missingRequired.join(', ')}`);
      return;
    }

    onComplete(formData as ResumeData);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'personal':
        return <PersonalInfoForm onComplete={(data) => handleSectionComplete('personal', data)} initialData={formData.personalInfo} />;
      case 'experience':
        return <WorkExperienceForm onComplete={(data) => handleSectionComplete('experience', data)} initialData={formData.workExperience} />;
      case 'education':
        return <EducationForm onComplete={(data) => handleSectionComplete('education', data)} initialData={formData.education} />;
      case 'skills':
        return <SkillsForm onComplete={(data) => handleSectionComplete('skills', data)} initialData={formData.skills} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">This section is coming soon!</p>
            <Button 
              onClick={goToNextTab}
              className="mt-4"
            >
              Skip for Now
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-8">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="relative text-xs lg:text-sm"
            >
              {completedSections.includes(tab.id) && (
                <Check className="w-3 h-3 text-green-600 absolute -top-1 -right-1" />
              )}
              {tab.label}
              {tab.required && <span className="text-red-500 ml-1">*</span>}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardContent className="p-6">
            {renderTabContent()}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={goToPrevTab}
            disabled={currentTab === tabs[0].id}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentTab === tabs[tabs.length - 1].id ? (
              <Button onClick={handleFinish} variant="default">
                Complete Resume
              </Button>
            ) : (
              <Button onClick={goToNextTab}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ResumeForm;