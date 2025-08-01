import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PersonalInfo, SocialLinks } from '@/types/resume';
import { useSecureForm } from '@/hooks/useSecureForm';
import { sanitizeInput, sanitizeUrl, validateEmail, validatePhone } from '@/utils/security';

const personalInfoSchema = z.object({
  personalInfo: z.object({
    firstName: z.string()
      .min(1, 'First name is required')
      .max(50, 'First name too long')
      .transform(sanitizeInput),
    lastName: z.string()
      .min(1, 'Last name is required')
      .max(50, 'Last name too long')
      .transform(sanitizeInput),
    email: z.string()
      .email('Invalid email address')
      .max(254, 'Email too long')
      .refine(validateEmail, 'Invalid email format'),
    phone: z.string()
      .min(1, 'Phone number is required')
      .max(20, 'Phone number too long')
      .refine(validatePhone, 'Invalid phone number format'),
    address: z.string()
      .min(1, 'Address is required')
      .max(200, 'Address too long')
      .transform(sanitizeInput),
    city: z.string()
      .min(1, 'City is required')
      .max(100, 'City name too long')
      .transform(sanitizeInput),
    state: z.string()
      .min(1, 'State is required')
      .max(50, 'State name too long')
      .transform(sanitizeInput),
    zipCode: z.string()
      .min(1, 'ZIP code is required')
      .max(10, 'ZIP code too long')
      .transform(sanitizeInput),
    country: z.string()
      .min(1, 'Country is required')
      .max(100, 'Country name too long')
      .transform(sanitizeInput),
  }),
  socialLinks: z.object({
    website: z.string().optional().transform(val => val ? sanitizeUrl(val) : ''),
    linkedin: z.string().optional().transform(val => val ? sanitizeUrl(val) : ''),
    github: z.string().optional().transform(val => val ? sanitizeUrl(val) : ''),
    portfolio: z.string().optional().transform(val => val ? sanitizeUrl(val) : ''),
    twitter: z.string().optional().transform(val => val ? sanitizeUrl(val) : ''),
  }),
  summary: z.string()
    .min(50, 'Professional summary should be at least 50 characters')
    .max(2000, 'Professional summary too long')
    .transform(sanitizeInput),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  onComplete: (data: PersonalInfoFormData) => void;
  initialData?: any;
}

const PersonalInfoForm = ({ onComplete, initialData }: PersonalInfoFormProps) => {
  const { validateSubmission, canSubmit } = useSecureForm({
    identifier: 'personal_info_form',
    maxAttempts: 3,
  });

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      personalInfo: {
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        zipCode: initialData?.zipCode || '',
        country: initialData?.country || 'United States',
      },
      socialLinks: {
        website: initialData?.website || '',
        linkedin: initialData?.linkedin || '',
        github: initialData?.github || '',
        portfolio: initialData?.portfolio || '',
        twitter: initialData?.twitter || '',
      },
      summary: initialData?.summary || '',
    },
  });

  const onSubmit = (data: PersonalInfoFormData) => {
    if (!validateSubmission()) {
      return;
    }
    
    onComplete(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="personalInfo.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalInfo.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalInfo.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalInfo.address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Street Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalInfo.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalInfo.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <FormControl>
                    <Input placeholder="NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalInfo.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="10001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="personalInfo.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Professional Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="socialLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialLinks.github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialLinks.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://johndoe.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialLinks.portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio</FormLabel>
                  <FormControl>
                    <Input placeholder="https://portfolio.johndoe.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Professional Summary *</h3>
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Write a compelling summary of your professional background</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Experienced software engineer with 5+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-quality solutions that drive business growth..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          Save & Continue
        </Button>
      </form>
    </Form>
  );
};

export default PersonalInfoForm;