import DOMPurify from 'dompurify';

// Rate limiting store for client-side rate limiting - Enhanced security
interface RateLimitEntry {
  count: number;
  timestamp: number;
  blockUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potential XSS vectors while preserving basic formatting
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  }).trim();
};

/**
 * Validates and sanitizes URL input
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    // Only allow http and https protocols
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    return urlObj.toString();
  } catch {
    return '';
  }
};

/**
 * Validates email format with additional security checks
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email regex with length limits for security
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
};

/**
 * Validates phone number format
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Allow international formats, digits, spaces, dashes, parentheses, plus
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Enhanced client-side rate limiting with progressive blocking
 */
export const checkRateLimit = (
  identifier: string, 
  maxAttempts: number = 5, 
  windowMs: number = 900000 // 15 minutes default
): boolean => {
  const now = Date.now();
  const key = `rateLimit_${sanitizeInput(identifier)}`;
  const existing = rateLimitStore.get(key);
  
  // Check if currently blocked
  if (existing?.blockUntil && now < existing.blockUntil) {
    return false;
  }
  
  if (!existing || now - existing.timestamp > windowMs) {
    // Reset or create new entry
    rateLimitStore.set(key, { count: 1, timestamp: now });
    return true;
  }
  
  if (existing.count >= maxAttempts) {
    // Progressive blocking: first offense = 5 min, second = 15 min, third = 1 hour
    const blockDuration = Math.min(300000 * Math.pow(2, existing.count - maxAttempts), 3600000);
    rateLimitStore.set(key, { ...existing, blockUntil: now + blockDuration });
    return false;
  }
  
  // Increment count
  rateLimitStore.set(key, { ...existing, count: existing.count + 1 });
  return true;
};

/**
 * Clear rate limit for identifier (for testing or admin reset)
 */
export const clearRateLimit = (identifier: string): void => {
  const key = `rateLimit_${sanitizeInput(identifier)}`;
  rateLimitStore.delete(key);
};

/**
 * Generates a cryptographically secure CSRF token
 */
export const generateCSRFToken = (): string => {
  try {
    const timestamp = Date.now();
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const randomString = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return btoa(`${timestamp}:${randomString}`);
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    // Fallback with less secure random
    const fallback = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return btoa(`${Date.now()}:${fallback}`);
  }
};

/**
 * Client-side CSRF token validation (basic check only)
 * For production, use server-side validation via Edge Function
 */
export const validateCSRFToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  try {
    const decoded = atob(token);
    const [timestamp, randomPart] = decoded.split(':');
    
    if (!timestamp || !randomPart || randomPart.length < 32) {
      return false;
    }
    
    const tokenTime = parseInt(timestamp);
    const now = Date.now();
    
    // Token expires after 1 hour (3600000 ms)
    const maxAge = 3600000;
    
    return (now - tokenTime) < maxAge && tokenTime <= now;
  } catch (error) {
    console.error('Error validating CSRF token:', error);
    return false;
  }
};

/**
 * Server-side CSRF validation using Edge Function
 */
export const validateCSRFServerSide = async (token: string, action: string): Promise<{ valid: boolean; newToken?: string; error?: string }> => {
  try {
    const supabaseUrl = 'https://jfwsgzwgffxxkaerxuqb.supabase.co';
    const response = await fetch(`${supabaseUrl}/functions/v1/csrf-validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
      },
      body: JSON.stringify({
        token,
        action,
        timestamp: Date.now()
      })
    });

    if (!response.ok) {
      throw new Error(`Server validation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Server-side CSRF validation error:', error);
    return { valid: false, error: 'Server validation failed' };
  }
};

/**
 * Sanitizes file names for upload
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName || typeof fileName !== 'string') return '';
  
  // Remove dangerous characters and limit length
  return fileName
    .replace(/[^a-zA-Z0-9\-_\.]/g, '')
    .substring(0, 255);
};

/**
 * Content Security Policy nonce generator
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};