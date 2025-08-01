import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Try multiple worker sources as fallbacks
const workerSources = [
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
  'https://unpkg.com/pdfjs-dist@5.4.54/build/pdf.worker.min.js'
];

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];

interface UploadedResume {
  fileName: string;
  fileSize: number;
  fileType: string;
  extractedText: string;
  uploadedAt: string;
}

export const useResumeUploadCoverLetter = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<UploadedResume | null>(null);
  const { toast } = useToast();

  const uploadResume = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Extract text from file if it's a PDF
      let extractedText = '';
      if (file.type === 'application/pdf') {
        try {
          console.log('Starting PDF text extraction for:', file.name);
          const arrayBuffer = await file.arrayBuffer();
          
          // Configure PDF.js to disable worker for better compatibility
          const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            verbosity: 0, // Reduce console noise
            standardFontDataUrl: undefined,
            useSystemFonts: true
          });
          
          // Try to load PDF with error handling and worker fallback
          let pdf;
          try {
            pdf = await loadingTask.promise;
          } catch (workerError) {
            console.log('First worker failed, trying fallback worker...');
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[1];
            try {
              const fallbackTask = pdfjsLib.getDocument({
                data: arrayBuffer,
                verbosity: 0,
                standardFontDataUrl: undefined,
                useSystemFonts: true
              });
              pdf = await fallbackTask.promise;
            } catch (secondWorkerError) {
              console.log('Second worker failed, trying final fallback...');
              pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[2];
              const finalTask = pdfjsLib.getDocument({
                data: arrayBuffer,
                verbosity: 0,
                standardFontDataUrl: undefined,
                useSystemFonts: true
              });
              pdf = await finalTask.promise;
            }
          }
          
          console.log('PDF loaded successfully, pages:', pdf.numPages);
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            extractedText += pageText + '\n';
            console.log(`Extracted text from page ${i}:`, pageText.substring(0, 100) + '...');
          }
          
          extractedText = extractedText
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
            
          console.log('Final extracted text length:', extractedText.length);
          console.log('Extracted text preview:', extractedText.substring(0, 200) + '...');
          
          if (!extractedText || extractedText.length < 10) {
            throw new Error('No meaningful text could be extracted from the PDF');
          }
        } catch (error) {
          console.error('Error extracting PDF text:', error);
          
          // Fallback: Let user know we'll use the file name and they can manually enter details
          extractedText = `PDF file uploaded: ${file.name}. 
          
Note: Text extraction failed, but you can still generate a cover letter by filling in the job details manually. The AI will create a generic professional cover letter based on your job information.

To get better results, please ensure your PDF is text-based (not a scanned image) or try uploading a different format.`;
          
          toast({
            title: "PDF text extraction failed",
            description: "File uploaded but text extraction failed. You can still generate a cover letter using job details.",
            variant: "default"
          });
        }
      } else {
        // For other file types, we can't extract text in the browser
        console.log('Non-PDF file uploaded:', file.type);
        extractedText = `File uploaded: ${file.name} (${file.type})

Note: Text extraction is only supported for PDF files. You can still generate a cover letter by filling in the job details manually. The AI will create a professional cover letter based on your job information.

For best results, please upload a PDF version of your resume.`;
      }

      const resumeData: UploadedResume = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        extractedText,
        uploadedAt: new Date().toISOString()
      };

      setUploadedResume(resumeData);
      
      toast({
        title: "Resume uploaded successfully!",
        description: "Your resume has been processed and is ready to use."
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

  const clearResume = () => {
    setUploadedResume(null);
    toast({
      title: "Resume cleared",
      description: "Resume data has been removed."
    });
  };

  return {
    uploadResume,
    clearResume,
    isUploading,
    uploadedResume,
    setUploadedResume
  };
};