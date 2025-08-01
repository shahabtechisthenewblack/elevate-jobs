import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

interface UploadedResume {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  extracted_text: string | null;
  created_at: string;
}

export const useResumeUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(null);
  const { toast } = useToast();

  const uploadResume = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Please sign in to upload a resume');
      }

      // Extract text from file if it's a PDF
      let extractedText = '';
      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            extractedText += pageText + '\n';
          }
          
          extractedText = extractedText
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
        } catch (error) {
          console.error('Error extracting PDF text:', error);
          // Continue with upload even if text extraction fails
        }
      }

      // Create file path with user ID folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Save file metadata to database
      const { data: resumeData, error: dbError } = await supabase
        .from('uploaded_resumes')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          extracted_text: extractedText || null
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setUploadedResume(resumeData);
      
      toast({
        title: "Resume uploaded successfully!",
        description: "Your resume has been saved and is ready to use."
      });

      return resumeData;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const downloadResume = async (resume: UploadedResume) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resume.file_path);

      if (error) {
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your resume is being downloaded."
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteResume = async (resume: UploadedResume) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([resume.file_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_resumes')
        .delete()
        .eq('id', resume.id);

      if (dbError) {
        throw dbError;
      }

      setUploadedResume(null);
      
      toast({
        title: "Resume deleted",
        description: "Your resume has been removed."
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    uploadResume,
    downloadResume,
    deleteResume,
    isUploading,
    uploadedResume,
    setUploadedResume
  };
};