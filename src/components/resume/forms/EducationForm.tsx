import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '@/types/resume';
import { useSecureForm } from '@/hooks/useSecureForm';
import { sanitizeInput } from '@/utils/security';

const educationSchema = z.object({
  education: z.array(z.object({
    id: z.string(),
    institution: z.string().min(1, 'Institution name is required').transform(sanitizeInput),
    degree: z.string().min(1, 'Degree is required').transform(sanitizeInput),
    field: z.string().min(1, 'Field of study is required').transform(sanitizeInput),
    location: z.string().min(1, 'Location is required').transform(sanitizeInput),
    startDate: z.string().min(1, 'Start date is required').transform(sanitizeInput),
    endDate: z.string().min(1, 'End date is required').transform(sanitizeInput),
    gpa: z.string().optional().transform(val => val ? sanitizeInput(val) : val),
    honors: z.string().optional().transform(val => val ? sanitizeInput(val) : val),
  })).min(1, 'At least one education entry is required'),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  onComplete: (data: Education[]) => void;
  initialData?: Education[];
}

const EducationForm = ({ onComplete, initialData }: EducationFormProps) => {
  const secureForm = useSecureForm({ 
    maxAttempts: 5, 
    windowMs: 60000, 
    identifier: 'education_form' 
  });

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: initialData?.length ? initialData : [{
        id: '1',
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        honors: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  const addEducation = () => {
    append({
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
    });
  };

  const onSubmit = (data: EducationFormData) => {
    if (!secureForm.validateSubmission()) {
      return;
    }
    onComplete(data.education as Education[]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Education</h3>
          <Button type="button" onClick={addEducation} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Education #{index + 1}</CardTitle>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`education.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Stanford University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`education.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Stanford, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree *</FormLabel>
                      <FormControl>
                        <Input placeholder="Bachelor of Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`education.${index}.field`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study *</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`education.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input placeholder="08/2018" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`education.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <FormControl>
                        <Input placeholder="05/2022" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`education.${index}.gpa`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPA (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="3.8/4.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`education.${index}.honors`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Honors/Awards (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Magna Cum Laude, Dean's List" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button 
          type="submit" 
          className="w-full"
          disabled={!secureForm.canSubmit}
        >
          Save & Continue
        </Button>
      </form>
    </Form>
  );
};

export default EducationForm;