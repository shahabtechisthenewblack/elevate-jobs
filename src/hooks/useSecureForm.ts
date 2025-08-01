import { useState, useEffect } from 'react';
import { checkRateLimit, generateCSRFToken, validateCSRFToken } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';

interface UseSecureFormOptions {
  maxAttempts?: number;
  windowMs?: number;
  identifier?: string;
}

interface SecureFormState {
  csrfToken: string;
  isRateLimited: boolean;
  canSubmit: boolean;
  submitCount: number;
}

export const useSecureForm = (options: UseSecureFormOptions = {}) => {
  const { 
    maxAttempts = 5, 
    windowMs = 60000, 
    identifier = 'form_submission' 
  } = options;
  
  const { toast } = useToast();
  
  const [formState, setFormState] = useState<SecureFormState>({
    csrfToken: '',
    isRateLimited: false,
    canSubmit: true,
    submitCount: 0,
  });

  // Generate CSRF token on mount
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      csrfToken: generateCSRFToken(),
    }));
  }, []);

  const validateSubmission = (): boolean => {
    // Check CSRF token
    if (!validateCSRFToken(formState.csrfToken)) {
      toast({
        title: "Security Error",
        description: "Invalid session token. Please refresh the page.",
        variant: "destructive",
      });
      return false;
    }

    // Check rate limiting
    const canProceed = checkRateLimit(`${identifier}_${formState.csrfToken}`, maxAttempts, windowMs);
    
    if (!canProceed) {
      setFormState(prev => ({
        ...prev,
        isRateLimited: true,
        canSubmit: false,
      }));
      
      toast({
        title: "Too Many Attempts",
        description: "Please wait before submitting again.",
        variant: "destructive",
      });
      return false;
    }

    // Update submit count
    setFormState(prev => ({
      ...prev,
      submitCount: prev.submitCount + 1,
    }));

    return true;
  };

  const resetForm = () => {
    setFormState({
      csrfToken: generateCSRFToken(),
      isRateLimited: false,
      canSubmit: true,
      submitCount: 0,
    });
  };

  return {
    validateSubmission,
    resetForm,
    csrfToken: formState.csrfToken,
    isRateLimited: formState.isRateLimited,
    canSubmit: formState.canSubmit,
    submitCount: formState.submitCount,
  };
};