-- Create storage bucket for resume files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false);

-- Create table to track uploaded resumes
CREATE TABLE public.uploaded_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on uploaded_resumes table
ALTER TABLE public.uploaded_resumes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for uploaded_resumes
CREATE POLICY "Users can view their own uploaded resumes" 
ON public.uploaded_resumes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own resumes" 
ON public.uploaded_resumes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploaded resumes" 
ON public.uploaded_resumes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploaded resumes" 
ON public.uploaded_resumes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage policies for resume uploads
CREATE POLICY "Users can view their own resume files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own resume files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resume files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resume files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_uploaded_resumes_updated_at
BEFORE UPDATE ON public.uploaded_resumes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();