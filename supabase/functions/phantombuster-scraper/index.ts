import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessToken } = await req.json();
    
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn access token is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn API credentials not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get user's basic profile information
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,headline,summary,positions,educations,skills)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('LinkedIn API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch LinkedIn profile' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const profileData = await profileResponse.json();
    console.log('LinkedIn API response:', profileData);
    
    // Extract and format the LinkedIn profile data
    const formattedProfile = {
      name: `${profileData.firstName?.localized?.en_US || ''} ${profileData.lastName?.localized?.en_US || ''}`.trim(),
      headline: profileData.headline?.localized?.en_US || '',
      about: profileData.summary?.localized?.en_US || '',
      location: '', // Location requires additional API call
      company: profileData.positions?.elements?.[0]?.companyName?.localized?.en_US || '',
      experience: profileData.positions?.elements?.map((pos: any) => ({
        title: pos.title?.localized?.en_US || '',
        company: pos.companyName?.localized?.en_US || '',
        description: pos.description?.localized?.en_US || '',
        startDate: pos.timePeriod?.startDate,
        endDate: pos.timePeriod?.endDate
      })) || [],
      education: profileData.educations?.elements?.map((edu: any) => ({
        school: edu.schoolName?.localized?.en_US || '',
        degree: edu.degreeName?.localized?.en_US || '',
        field: edu.fieldOfStudy?.localized?.en_US || '',
        startDate: edu.timePeriod?.startDate,
        endDate: edu.timePeriod?.endDate
      })) || [],
      skills: profileData.skills?.elements?.map((skill: any) => skill.name?.localized?.en_US).filter(Boolean) || [],
      contactInfo: {
        email: '', // Email requires additional API call with different scope
        phone: '',
        website: ''
      }
    };

    return new Response(
      JSON.stringify({ success: true, profile: formattedProfile }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in phantombuster-scraper:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});