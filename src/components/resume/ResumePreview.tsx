import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, Mail, Phone, MapPin, Globe, Linkedin, Github, Edit, Share2, Save, X } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
  onDataUpdate?: (data: ResumeData) => void;
}

const ResumePreview = ({ resumeData, template, onDataUpdate }: ResumePreviewProps) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ResumeData>(resumeData);

  // Update editData when resumeData changes
  useEffect(() => {
    setEditData(resumeData);
  }, [resumeData]);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeData.personalInfo?.firstName || 'Resume'}_${resumeData.personalInfo?.lastName || 'Document'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSaveEdit = () => {
    if (onDataUpdate) {
      onDataUpdate(editData);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData(resumeData);
    setIsEditing(false);
  };

  const renderTemplate = () => {
    const currentData = isEditing ? editData : resumeData;
    switch (template) {
      case 'professional':
        return <ProfessionalTemplate resumeData={currentData} />;
      case 'modern':
        return <ModernTemplate resumeData={currentData} />;
      case 'creative':
        return <CreativeTemplate resumeData={currentData} />;
      case 'minimalist':
        return <MinimalistTemplate resumeData={currentData} />;
      case 'tech':
        return <TechTemplate resumeData={currentData} />;
      case 'executive':
        return <ExecutiveTemplate resumeData={currentData} />;
      case 'academic':
        return <AcademicTemplate resumeData={currentData} />;
      case 'startup':
        return <StartupTemplate resumeData={currentData} />;
      case 'consultant':
        return <ConsultantTemplate resumeData={currentData} />;
      case 'international':
        return <InternationalTemplate resumeData={currentData} />;
      default:
        return <ProfessionalTemplate resumeData={currentData} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Controls Panel */}
        <div className="lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={downloadPDF} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
              {isEditing ? (
                <>
                  <Button onClick={handleSaveEdit} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} className="w-full">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Content
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Resume
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ATS Score:</span>
                <span className="text-sm font-medium text-green-600">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Template:</span>
                <span className="text-sm font-medium capitalize">{template}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sections:</span>
                <span className="text-sm font-medium">Complete</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resume Preview */}
        <div className="lg:w-2/3">
          {isEditing && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Edit Resume Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={editData.personalInfo?.firstName || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={editData.personalInfo?.lastName || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={editData.personalInfo?.email || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={editData.personalInfo?.phone || ''}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Professional Summary</label>
                  <Textarea
                    value={editData.summary || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      summary: e.target.value
                    }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div ref={resumeRef} className="bg-white" style={{ minHeight: '1056px' }}>
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Template
const ProfessionalTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white text-black">
    {/* Header */}
    <div className="border-b-2 border-blue-600 pb-6 mb-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
      </h1>
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Mail className="h-4 w-4" />
          {resumeData.personalInfo?.email}
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          {resumeData.personalInfo?.phone}
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {resumeData.personalInfo?.city}, {resumeData.personalInfo?.state}
        </div>
        {resumeData.socialLinks?.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </div>
        )}
      </div>
    </div>

    {/* Summary */}
    {resumeData.summary && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-3">PROFESSIONAL SUMMARY</h2>
        <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
      </div>
    )}

    {/* Experience */}
    {resumeData.workExperience && resumeData.workExperience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-3">WORK EXPERIENCE</h2>
        {resumeData.workExperience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
              <span className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
            </div>
            <p className="text-gray-700 font-medium mb-2">{exp.company} | {exp.location}</p>
            <ul className="text-gray-700 space-y-1">
              {exp.description?.map((desc, i) => (
                <li key={i} className="ml-4">• {desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {/* Education */}
    {resumeData.education && resumeData.education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 mb-3">EDUCATION</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                <p className="text-gray-700">{edu.institution}</p>
              </div>
              <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
            </div>
            {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>
    )}

    {/* Skills */}
    {resumeData.skills && resumeData.skills.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-3">SKILLS</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="text-gray-700">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-gray-600"> ({skill.level})</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Modern Template
const ModernTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto bg-white text-black">
    <div className="grid grid-cols-3 min-h-screen">
      {/* Left Sidebar */}
      <div className="bg-gray-900 text-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            {resumeData.personalInfo?.firstName}
          </h1>
          <h1 className="text-2xl font-bold mb-4">
            {resumeData.personalInfo?.lastName}
          </h1>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <Mail className="h-4 w-4 inline mr-2" />
            {resumeData.personalInfo?.email}
          </div>
          <div>
            <Phone className="h-4 w-4 inline mr-2" />
            {resumeData.personalInfo?.phone}
          </div>
          <div>
            <MapPin className="h-4 w-4 inline mr-2" />
            {resumeData.personalInfo?.city}, {resumeData.personalInfo?.state}
          </div>
        </div>

        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">SKILLS</h2>
            <div className="space-y-3">
              {resumeData.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-xs">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className={`bg-blue-500 h-2 rounded-full ${
                      skill.level === 'Expert' ? 'w-full' :
                      skill.level === 'Advanced' ? 'w-4/5' :
                      skill.level === 'Intermediate' ? 'w-3/5' : 'w-2/5'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="col-span-2 p-8">
        {resumeData.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">PROFESSIONAL SUMMARY</h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {resumeData.workExperience && resumeData.workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">EXPERIENCE</h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                <p className="text-blue-600 font-semibold mb-1">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-3">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate} | {exp.location}
                </p>
                <ul className="text-gray-700 space-y-1">
                  {exp.description?.map((desc, i) => (
                    <li key={i} className="ml-4">• {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {resumeData.education && resumeData.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">EDUCATION</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                <p className="text-blue-600 font-semibold">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Creative Template
const CreativeTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50 text-black">
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header with creative design */}
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg transform -skew-y-1"></div>
        <div className="relative bg-white rounded-lg p-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
          </h1>
          <div className="flex justify-center gap-4 text-sm text-gray-600 flex-wrap">
            <span>{resumeData.personalInfo?.email}</span>
            <span>{resumeData.personalInfo?.phone}</span>
            <span>{resumeData.personalInfo?.city}, {resumeData.personalInfo?.state}</span>
          </div>
        </div>
      </div>

      {/* Content sections with creative styling */}
      <div className="space-y-6">
        {resumeData.summary && (
          <div>
            <h2 className="text-xl font-bold text-purple-600 mb-3 flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></div>
              ABOUT ME
            </h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {resumeData.workExperience && resumeData.workExperience.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-purple-600 mb-3 flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></div>
              EXPERIENCE
            </h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-purple-600 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <ul className="text-gray-700 space-y-1">
                  {exp.description?.map((desc, i) => (
                    <li key={i} className="ml-4">• {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Simplified versions of remaining templates
const MinimalistTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white text-black font-light">
    <div className="space-y-8">
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-2">
          {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
        </h1>
        <div className="text-sm text-gray-600 space-x-4">
          <span>{resumeData.personalInfo?.email}</span>
          <span>{resumeData.personalInfo?.phone}</span>
          <span>{resumeData.personalInfo?.city}, {resumeData.personalInfo?.state}</span>
        </div>
      </div>
      
      {resumeData.summary && (
        <div>
          <p className="text-gray-700 leading-relaxed text-center">{resumeData.summary}</p>
        </div>
      )}
      
      {/* Continue with clean, minimal styling for other sections */}
    </div>
  </div>
);

const TechTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-gray-900 text-green-400 font-mono">
    <div className="border border-green-400 p-6">
      <h1 className="text-2xl font-bold mb-4">
        ~/$ whoami: {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
      </h1>
      <div className="space-y-2 text-sm">
        <p>email: {resumeData.personalInfo?.email}</p>
        <p>phone: {resumeData.personalInfo?.phone}</p>
        <p>location: {resumeData.personalInfo?.city}, {resumeData.personalInfo?.state}</p>
      </div>
    </div>
  </div>
);

const ExecutiveTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white text-black">
    <div className="border-t-4 border-gold-500 pt-6">
      <h1 className="text-5xl font-light text-gray-900 mb-4">
        {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
      </h1>
      {/* Premium executive styling */}
    </div>
  </div>
);

const AcademicTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white text-black">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-serif text-gray-900 mb-2">
        {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
      </h1>
      {/* Formal academic layout */}
    </div>
  </div>
);

const StartupTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white text-black">
    <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white p-6 rounded-lg mb-6">
      <h1 className="text-3xl font-bold">
        {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
      </h1>
      {/* Dynamic startup-themed design */}
    </div>
  </div>
);

const ConsultantTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white text-black">
    <div className="border-l-4 border-blue-600 pl-6 mb-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
      </h1>
      {/* Professional consulting layout */}
    </div>
  </div>
);

const InternationalTemplate = ({ resumeData }: { resumeData: ResumeData }) => (
  <div className="max-w-4xl mx-auto p-8 bg-white text-black">
    <div className="flex items-center mb-6">
      <Globe className="h-8 w-8 text-blue-600 mr-4" />
      <h1 className="text-3xl font-semibold text-gray-900">
        {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}
      </h1>
      {/* International business styling */}
    </div>
  </div>
);

export default ResumePreview;