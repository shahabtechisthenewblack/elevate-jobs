// Simulated LinkedIn scraper - In production, you'd use a proper scraping service
// Due to LinkedIn's anti-scraping measures, this is a simulation
import { sanitizeInput, sanitizeUrl, checkRateLimit } from './security';

interface ScrapedLinkedInData {
  name: string;
  headline: string;
  company: string;
  location: string;
  university?: string;
  connections: string;
  followers: string;
  about: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  services: string[];
  topSkills: string[];
  profileImageUrl?: string;
  bannerImageUrl?: string;
  contactInfo: {
    website?: string;
    email?: string;
    phone?: string;
  };
  highlights: Array<{
    type: string;
    description: string;
    action?: string;
  }>;
}

interface OptimizationAnalysis {
  mistakes: string[];
  suggestions: string[];
  improvementScore: number;
}

export async function scrapeLinkedInProfile(url: string): Promise<ScrapedLinkedInData> {
  const startTime = Date.now();
  const timeoutMs = 30000; // 30 second timeout
  
  try {
    // Enhanced security validation
    const sanitizedUrl = sanitizeUrl(url);
    if (!sanitizedUrl) {
      throw new Error('Invalid or unsafe URL provided');
    }

    // Rate limiting check
    const userIdentifier = `linkedin_scraper_${sanitizedUrl}`;
    if (!checkRateLimit(userIdentifier, 3, 300000)) { // 3 attempts per 5 minutes
      throw new Error('Rate limit exceeded. Please wait before trying again.');
    }

    // Enhanced LinkedIn URL validation
    if (!isValidLinkedInUrl(sanitizedUrl)) {
      throw new Error('Please provide a valid LinkedIn profile URL');
    }

    // Simulate API delay with timeout handling
    const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    );
    
    await Promise.race([delayPromise, timeoutPromise]);
    
    // Security: Log scraping attempt (sanitized)
    const urlObj = new URL(sanitizedUrl);
    const safeUrl = urlObj.pathname.replace(/[^a-zA-Z0-9\/\-_]/g, '');
    console.log(`Scraping LinkedIn profile: ${safeUrl}`);

    // Simulated scraped data - in production, this would come from actual scraping
    // All data is sanitized for security
    const mockData = {
      name: sanitizeInput("John Doe"),
      headline: sanitizeInput("Software Developer at TechCorp"),
      company: sanitizeInput("TechCorp"),
      location: sanitizeInput("San Francisco, CA"),
      university: sanitizeInput("Stanford University"),
      connections: sanitizeInput("500+"),
      followers: sanitizeInput("1,234"),
      about: sanitizeInput("I am a software developer with 3 years of experience. I work on web applications and mobile apps. I like coding and solving problems."),
      experience: [
        {
          title: sanitizeInput("Software Developer"),
          company: sanitizeInput("TechCorp"),
          duration: sanitizeInput("Jan 2022 - Present · 2 yrs"),
          description: sanitizeInput("Develop web applications using React and Node.js. Work with team members on various projects.")
        },
        {
          title: sanitizeInput("Junior Developer"),
          company: sanitizeInput("StartupXYZ"),
          duration: sanitizeInput("Jun 2021 - Dec 2021 · 7 mos"),
          description: sanitizeInput("Built mobile apps and learned new technologies.")
        }
      ],
      skills: ["JavaScript", "React", "Node.js", "Python", "HTML", "CSS"].map(skill => sanitizeInput(skill)),
      services: ["Web Development", "Mobile App Development", "Consulting"].map(service => sanitizeInput(service)),
      topSkills: ["JavaScript", "React", "Node.js"].map(skill => sanitizeInput(skill)),
      contactInfo: {
        website: sanitizeInput("johndoe.dev"),
        email: sanitizeInput("john@example.com"),
        phone: sanitizeInput("+1 555-0123")
      },
      highlights: [
        {
          type: sanitizeInput("profile_view"),
          description: sanitizeInput("John viewed your profile in the past 90 days"),
          action: sanitizeInput("Unlock more insights about leads")
        }
      ]
    };

    // Log successful scraping for monitoring
    const duration = Date.now() - startTime;
    console.log(`LinkedIn profile scraped successfully in ${duration}ms`);

    return mockData;

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Error scraping LinkedIn profile after ${duration}ms:`, error);
    
    // Enhanced error handling with user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check the URL and try again.');
      }
      if (error.message.includes('Rate limit')) {
        throw error; // Pass through rate limit errors as-is
      }
      if (error.message.includes('Invalid')) {
        throw error; // Pass through validation errors as-is
      }
    }
    
    throw new Error('Failed to scrape LinkedIn profile. Please check the URL and try again.');
  }
}

export function analyzeProfile(profile: ScrapedLinkedInData): OptimizationAnalysis {
  const mistakes: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Analyze headline
  if (profile.headline.length < 30) {
    mistakes.push("Headline is too short and lacks keywords");
    suggestions.push("Expand your headline to include relevant keywords and value proposition (aim for 50-120 characters)");
    score -= 15;
  }

  if (!profile.headline.includes("•") && !profile.headline.includes("|")) {
    mistakes.push("Headline doesn't use separators to highlight multiple skills/roles");
    suggestions.push("Use separators (• or |) to showcase multiple skills: 'Role | Skill | Value Proposition'");
    score -= 10;
  }

  // Analyze about section
  if (profile.about.length < 200) {
    mistakes.push("About section is too brief and lacks detail");
    suggestions.push("Expand your About section to 3-5 paragraphs (300-500 words) including achievements and metrics");
    score -= 20;
  }

  if (!profile.about.includes("•") && !profile.about.includes("✓")) {
    mistakes.push("About section lacks bullet points for easy scanning");
    suggestions.push("Use bullet points (• or ✓) to highlight key achievements and skills");
    score -= 10;
  }

  if (!hasNumbers(profile.about)) {
    mistakes.push("About section lacks quantifiable achievements");
    suggestions.push("Add specific metrics and numbers to demonstrate your impact (e.g., '30% increase', '100K+ users')");
    score -= 15;
  }

  // Analyze experience
  profile.experience.forEach((exp, index) => {
    if (exp.description.length < 100) {
      mistakes.push(`Experience #${index + 1} description is too brief`);
      suggestions.push(`Expand experience descriptions to include specific achievements and metrics`);
      score -= 8;
    }

    if (!hasNumbers(exp.description)) {
      mistakes.push(`Experience #${index + 1} lacks quantifiable results`);
      suggestions.push(`Add measurable achievements to your experience (e.g., 'Reduced load time by 40%')`);
      score -= 10;
    }
  });

  // Analyze skills
  if (profile.topSkills.length < 3) {
    mistakes.push("Not enough top skills listed");
    suggestions.push("Add at least 5-10 top skills relevant to your target role");
    score -= 15;
  }

  // Analyze contact info
  if (!profile.contactInfo.website) {
    mistakes.push("Missing website/portfolio link");
    suggestions.push("Add a link to your portfolio, personal website, or GitHub profile");
    score -= 10;
  }

  // Analyze profile completeness
  if (!profile.profileImageUrl) {
    mistakes.push("Missing professional profile photo");
    suggestions.push("Add a high-quality, professional headshot as your profile photo");
    score -= 20;
  }

  if (profile.connections === "0") {
    mistakes.push("Very few connections");
    suggestions.push("Connect with colleagues, industry professionals, and thought leaders in your field");
    score -= 15;
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    mistakes,
    suggestions,
    improvementScore: score
  };
}

function isValidLinkedInUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Ensure HTTPS only for security
    if (urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Validate LinkedIn hostname
    if (!urlObj.hostname.includes('linkedin.com')) {
      return false;
    }
    
    // Enhanced regex for LinkedIn profile URLs
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w\-_]{3,100}\/?(\?.*)?$/;
    return linkedinRegex.test(url);
  } catch (error) {
    console.error('LinkedIn URL validation error:', error);
    return false;
  }
}

function hasNumbers(text: string): boolean {
  return /\d/.test(text);
}