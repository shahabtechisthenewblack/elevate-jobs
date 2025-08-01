import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkedinUrl, manualData } = await req.json();

    if (!linkedinUrl && !manualData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing LinkedIn profile with OpenAI');

    let prompt = '';
    
    if (linkedinUrl) {
      prompt = `
The details are available on this URL: ${linkedinUrl}

Based on this LinkedIn profile URL, please analyze the profile and provide optimization suggestions.

Please provide a comprehensive analysis and return a JSON response with the following structure:
{
  "optimizedHeadline": "An improved, keyword-rich headline based on the profile",
  "enhancedAbout": "A more compelling about section with specific achievements",
  "experienceBullets": ["Enhanced bullet point 1", "Enhanced bullet point 2", "Enhanced bullet point 3"],
  "strategicKeywords": ["keyword1", "keyword2", "keyword3"],
  "profileScore": 85,
  "improvementSuggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2"
  ]
}

Focus on making the profile more attractive to recruiters and hiring managers. Use industry-specific keywords and quantify achievements where possible.`;
    } else {
      prompt = `
Based on this manual profile information, please provide optimization suggestions:

Current Headline: ${manualData.currentHeadline}
Current About: ${manualData.currentAbout}
Current Experience: ${manualData.currentExperience}
Target Role: ${manualData.targetRole}
Industry: ${manualData.industry}
Experience Level: ${manualData.experienceLevel}
Additional Skills: ${manualData.additionalSkills}

Please provide a comprehensive analysis and return a JSON response with the following structure:
{
  "optimizedHeadline": "An improved, keyword-rich headline targeting the desired role",
  "enhancedAbout": "A more compelling about section with specific achievements",
  "experienceBullets": ["Enhanced bullet point 1", "Enhanced bullet point 2", "Enhanced bullet point 3"],
  "strategicKeywords": ["keyword1", "keyword2", "keyword3"],
  "profileScore": 85,
  "improvementSuggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2"
  ]
}

Focus on making the profile more attractive to recruiters and hiring managers for the target role. Use industry-specific keywords and quantify achievements where possible.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are a LinkedIn optimization expert with deep knowledge of recruitment algorithms and professional networking strategies.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    // Try to parse as JSON, fallback to structured text if needed
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch (e) {
      // If JSON parsing fails, create a structured response from the text
      analysisResult = {
        profileScore: 75,
        optimizedHeadline: "LinkedIn optimization suggestions generated",
        enhancedAbout: analysisText,
        experienceBullets: ["Generated suggestions from AI analysis"],
        strategicKeywords: ["professional", "leadership", "strategy"],
        improvementSuggestions: ["Review generated suggestions"],
      };
    }

    return new Response(JSON.stringify({ 
      success: true,
      analysis: analysisResult 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in linkedin-profile-analyzer function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});