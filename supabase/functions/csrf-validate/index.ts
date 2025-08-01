import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CSRFValidationRequest {
  token: string;
  action: string;
  timestamp: number;
}

interface CSRFValidationResponse {
  valid: boolean;
  error?: string;
  newToken?: string;
}

// Server-side CSRF token validation
function validateCSRFToken(token: string, timestamp: number): boolean {
  try {
    // Extract timestamp from token (assuming format: base64(timestamp:randomString))
    const decoded = atob(token);
    const [tokenTimestamp, randomPart] = decoded.split(':');
    
    if (!tokenTimestamp || !randomPart || randomPart.length < 32) {
      return false;
    }
    
    const tokenTime = parseInt(tokenTimestamp);
    const currentTime = Date.now();
    
    // Token expires after 1 hour (3600000 ms)
    const maxAge = 3600000;
    
    if (currentTime - tokenTime > maxAge || tokenTime > currentTime) {
      return false;
    }
    
    // Verify timestamp matches request
    if (Math.abs(tokenTime - timestamp) > 30000) { // 30 second tolerance
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('CSRF token validation error:', error);
    return false;
  }
}

// Generate cryptographically secure CSRF token
function generateCSRFToken(): string {
  try {
    const timestamp = Date.now();
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const randomString = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    
    const tokenData = `${timestamp}:${randomString}`;
    return btoa(tokenData);
  } catch (error) {
    console.error('CSRF token generation error:', error);
    throw new Error('Failed to generate CSRF token');
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ valid: false, error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    )

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const body: CSRFValidationRequest = await req.json()
    const { token, action, timestamp } = body

    if (!token || !action || !timestamp) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate CSRF token
    const isValid = validateCSRFToken(token, timestamp)
    
    if (!isValid) {
      // Generate new token for client to use
      const newToken = generateCSRFToken()
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid or expired CSRF token',
          newToken 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log successful validation for security monitoring
    console.log(`CSRF validation successful for user ${user.id}, action: ${action}`)

    const response: CSRFValidationResponse = {
      valid: true,
      newToken: generateCSRFToken() // Provide new token for next request
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('CSRF validation error:', error)
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})