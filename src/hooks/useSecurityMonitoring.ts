import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'auth_attempt' | 'rate_limit' | 'csrf_violation' | 'suspicious_activity';
  details: string;
  timestamp: number;
  userAgent?: string;
  ipHash?: string;
}

interface SecurityMetrics {
  failedLoginAttempts: number;
  rateLimitViolations: number;
  csrfViolations: number;
  lastSecurityEvent?: SecurityEvent;
}

export const useSecurityMonitoring = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failedLoginAttempts: 0,
    rateLimitViolations: 0,
    csrfViolations: 0,
  });

  // Hash IP for privacy-compliant logging
  const hashIP = async (ip: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(ip + 'security_salt');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    } catch (error) {
      console.error('IP hashing error:', error);
      return 'unknown';
    }
  };

  // Log security events
  const logSecurityEvent = async (event: Omit<SecurityEvent, 'timestamp' | 'userAgent' | 'ipHash'>) => {
    try {
      const timestamp = Date.now();
      const userAgent = navigator.userAgent;
      
      // Get IP hash (in production, you'd get this from server-side)
      const ipHash = await hashIP('unknown'); // Placeholder since client can't access real IP
      
      const securityEvent: SecurityEvent = {
        ...event,
        timestamp,
        userAgent,
        ipHash,
      };

      // Store in localStorage for client-side monitoring
      const existingEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
      const updatedEvents = [...existingEvents, securityEvent].slice(-100); // Keep last 100 events
      localStorage.setItem('security_events', JSON.stringify(updatedEvents));

      // Update metrics
      setMetrics(prev => {
        const updated = { ...prev, lastSecurityEvent: securityEvent };
        
        switch (event.type) {
          case 'auth_attempt':
            updated.failedLoginAttempts += 1;
            break;
          case 'rate_limit':
            updated.rateLimitViolations += 1;
            break;
          case 'csrf_violation':
            updated.csrfViolations += 1;
            break;
        }
        
        return updated;
      });

      // In production, you'd send this to your security logging service
      console.warn('Security Event:', securityEvent);
      
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  // Monitor authentication events
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          // Reset failed login counter on successful login
          setMetrics(prev => ({ ...prev, failedLoginAttempts: 0 }));
        } else if (event === 'TOKEN_REFRESHED') {
          // Log token refresh for monitoring
          logSecurityEvent({
            type: 'auth_attempt',
            details: 'Token refreshed successfully'
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Get security events from localStorage
  const getSecurityEvents = (): SecurityEvent[] => {
    try {
      return JSON.parse(localStorage.getItem('security_events') || '[]');
    } catch (error) {
      console.error('Error reading security events:', error);
      return [];
    }
  };

  // Clear security events (admin function)
  const clearSecurityEvents = () => {
    try {
      localStorage.removeItem('security_events');
      setMetrics({
        failedLoginAttempts: 0,
        rateLimitViolations: 0,
        csrfViolations: 0,
      });
    } catch (error) {
      console.error('Error clearing security events:', error);
    }
  };

  // Check for suspicious activity patterns
  const detectSuspiciousActivity = (): boolean => {
    const events = getSecurityEvents();
    const recentEvents = events.filter(e => Date.now() - e.timestamp < 300000); // Last 5 minutes
    
    // Flag as suspicious if:
    // - More than 10 failed login attempts in 5 minutes
    // - More than 5 rate limit violations in 5 minutes
    // - More than 3 CSRF violations in 5 minutes
    const failedLogins = recentEvents.filter(e => e.type === 'auth_attempt' && e.details.includes('failed')).length;
    const rateLimits = recentEvents.filter(e => e.type === 'rate_limit').length;
    const csrfViolations = recentEvents.filter(e => e.type === 'csrf_violation').length;
    
    return failedLogins > 10 || rateLimits > 5 || csrfViolations > 3;
  };

  return {
    metrics,
    logSecurityEvent,
    getSecurityEvents,
    clearSecurityEvents,
    detectSuspiciousActivity,
    isSuspiciousActivity: detectSuspiciousActivity(),
  };
};