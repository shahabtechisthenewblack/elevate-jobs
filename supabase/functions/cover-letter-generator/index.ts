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
    const { resumeText, jobTitle, companyName, additionalInfo } = await req.json();

    console.log('Generating cover letter for:', { jobTitle, companyName });
    console.log('Resume text length:', resumeText?.length || 0);
    console.log('Resume text preview:', resumeText?.substring(0, 200) || 'No resume text provided');
    console.log('OpenAI API Key available:', !!openAIApiKey);
    console.log('OpenAI API Key length:', openAIApiKey?.length || 0);
    
    if (!resumeText || resumeText.length < 10) {
      console.error('Invalid or missing resume text');
      return new Response(JSON.stringify({ 
        error: 'Resume text is missing or too short. Please ensure your PDF was properly processed.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are a professional cover letter writing expert. I am providing you with EXTRACTED TEXT from a candidate's resume (already processed from PDF) and job details. Your task is to create a personalized cover letter.

EXTRACTED RESUME TEXT (this is text content, not a PDF file):
${resumeText}

JOB DETAILS:
- Job Title: ${jobTitle || 'Position being applied for'}  
- Company Name: ${companyName || 'The company'}
- Additional Info: ${additionalInfo || 'No additional information provided'}

TASK:
Create a professional cover letter by extracting and using the actual information from the resume text above. 

CRITICAL REQUIREMENTS:
1. Extract the candidate's REAL NAME from the resume text
2. Extract REAL CONTACT INFORMATION (email, phone) if available
3. Extract ACTUAL WORK EXPERIENCE and achievements
4. Extract ACTUAL SKILLS and qualifications
5. Use REAL EDUCATION details if mentioned

FORMATTING:
- Use the real name as the header (not [Your Name])
- Include real contact info if available (not placeholders)
- Write 3-4 professional paragraphs
- Make it specific to the ${jobTitle} role at ${companyName}
- DO NOT use any placeholder text like [Your Name], [Your Address], etc.

Generate a complete cover letter using only the real information from the extracted resume text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional cover letter writer with expertise in matching candidates to job opportunities. Generate compelling, personalized cover letters that highlight relevant skills and experience.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedCoverLetter = data.choices[0].message.content;

    console.log('Successfully generated cover letter');

    return new Response(JSON.stringify({ coverLetter: generatedCoverLetter }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in cover-letter-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});