import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, MoreHorizontal, MapPin, Building2, GraduationCap, Globe, Mail, Phone } from "lucide-react";

interface LinkedInProfile {
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

interface LinkedInProfileSkeletonProps {
  profile: LinkedInProfile;
  showOptimizations?: boolean;
  optimizations?: {
    mistakes: string[];
    suggestions: string[];
    improvementScore: number;
  };
}

export function LinkedInProfileSkeleton({ profile, showOptimizations, optimizations }: LinkedInProfileSkeletonProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Banner */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          {profile.bannerImageUrl && (
            <img src={profile.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
          )}
        </div>
        
        {/* Profile Header */}
        <CardContent className="relative pt-0 pb-6">
          <div className="flex items-start gap-4 -mt-16">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={profile.profileImageUrl} alt={profile.name} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                  <p className="text-lg text-muted-foreground mb-2">{profile.headline}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {profile.company}
                    </div>
                    {profile.university && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {profile.university}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-primary">
                    <span>{profile.connections} connections</span>
                    <span>{profile.followers} followers</span>
                  </div>

                  {/* Contact Info */}
                  {(profile.contactInfo.website || profile.contactInfo.email || profile.contactInfo.phone) && (
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      {profile.contactInfo.website && (
                        <div className="flex items-center gap-1 text-primary">
                          <Globe className="w-4 h-4" />
                          <span>{profile.contactInfo.website}</span>
                        </div>
                      )}
                      {profile.contactInfo.email && (
                        <div className="flex items-center gap-1 text-primary">
                          <Mail className="w-4 h-4" />
                          <span>{profile.contactInfo.email}</span>
                        </div>
                      )}
                      {profile.contactInfo.phone && (
                        <div className="flex items-center gap-1 text-primary">
                          <Phone className="w-4 h-4" />
                          <span>{profile.contactInfo.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-16">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    More
                    <MoreHorizontal className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights Section */}
      {profile.highlights.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Highlights</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  {highlight.action && (
                    <p className="text-sm text-primary font-medium mt-1">{highlight.action}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">About</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-line">{profile.about}</p>
        </CardContent>
      </Card>

      {/* Experience Section */}
      {profile.experience.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Experience</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.experience.map((exp, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mb-2">{exp.duration}</p>
                  <p className="text-sm leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills Section */}
      {profile.topSkills.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Top skills</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile.topSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <span className="text-sm font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Section */}
      {profile.services.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Services</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {profile.services.join(' • ')}
            </p>
            <Button variant="outline" size="sm">
              Request services
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Optimization Suggestions */}
      {showOptimizations && optimizations && (
        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10">
          <CardHeader>
            <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300">
              Profile Optimization Report (Score: {optimizations.improvementScore}/100)
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mistakes */}
            <div>
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3">Issues Found:</h3>
              <ul className="space-y-2">
                {optimizations.mistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3">Optimization Suggestions:</h3>
              <ul className="space-y-2">
                {optimizations.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}