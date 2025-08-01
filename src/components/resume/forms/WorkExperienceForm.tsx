import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { WorkExperience } from '@/types/resume';
import { useSecureForm } from '@/hooks/useSecureForm';
import { sanitizeInput } from '@/utils/security';

const workExperienceSchema = z.object({
  workExperience: z.array(z.object({
    id: z.string(),
    company: z.string()
      .min(1, 'Company name is required')
      .max(100, 'Company name too long')
      .transform(sanitizeInput),
    position: z.string()
      .min(1, 'Position title is required')
      .max(100, 'Position title too long')
      .transform(sanitizeInput),
    location: z.string()
      .min(1, 'Location is required')
      .max(100, 'Location too long')
      .transform(sanitizeInput),
    startDate: z.string()
      .min(1, 'Start date is required')
      .max(20, 'Start date too long')
      .transform(sanitizeInput),
    endDate: z.string().optional().transform(val => val ? sanitizeInput(val) : ''),
    current: z.boolean().default(false),
    description: z.array(
      z.string()
        .min(1, 'Responsibility cannot be empty')
        .max(500, 'Responsibility too long')
        .transform(sanitizeInput)
    ).min(1, 'At least one responsibility is required'),
  })).min(1, 'At least one work experience is required'),
});

type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

interface WorkExperienceFormProps {
  onComplete: (data: WorkExperience[]) => void;
  initialData?: WorkExperience[];
}

const WorkExperienceForm = ({ onComplete, initialData }: WorkExperienceFormProps) => {
  const { validateSubmission, canSubmit } = useSecureForm({
    identifier: 'work_experience_form',
    maxAttempts: 3,
  });

  const form = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperience: initialData?.length ? initialData : [{
        id: '1',
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: [''],
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'workExperience',
  });

  const addWorkExperience = () => {
    append({
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    });
  };

  const addResponsibility = (experienceIndex: number) => {
    const currentExperience = form.getValues(`workExperience.${experienceIndex}`);
    form.setValue(`workExperience.${experienceIndex}.description`, [...currentExperience.description, '']);
  };

  const removeResponsibility = (experienceIndex: number, responsibilityIndex: number) => {
    const currentExperience = form.getValues(`workExperience.${experienceIndex}`);
    const newDescription = currentExperience.description.filter((_, index) => index !== responsibilityIndex);
    form.setValue(`workExperience.${experienceIndex}.description`, newDescription);
  };

  const onSubmit = (data: WorkExperienceFormData) => {
    if (!validateSubmission()) {
      return;
    }
    
    onComplete(data.workExperience as WorkExperience[]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <Button type="button" onClick={addWorkExperience} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {fields.map((field, experienceIndex) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Experience #{experienceIndex + 1}</CardTitle>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(experienceIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`workExperience.${experienceIndex}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Google Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`workExperience.${experienceIndex}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`workExperience.${experienceIndex}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`workExperience.${experienceIndex}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input placeholder="01/2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name={`workExperience.${experienceIndex}.current`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>I currently work here</FormLabel>
                    </FormItem>
                  )}
                />
                
                {!form.watch(`workExperience.${experienceIndex}.current`) && (
                  <FormField
                    control={form.control}
                    name={`workExperience.${experienceIndex}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input placeholder="12/2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Key Responsibilities & Achievements *</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addResponsibility(experienceIndex)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {form.watch(`workExperience.${experienceIndex}.description`).map((_, responsibilityIndex) => (
                  <div key={responsibilityIndex} className="flex gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`workExperience.${experienceIndex}.description.${responsibilityIndex}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Textarea
                              placeholder="• Led development of a scalable microservices architecture that improved system performance by 40%"
                              className="min-h-[60px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch(`workExperience.${experienceIndex}.description`).length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeResponsibility(experienceIndex, responsibilityIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          Save & Continue
        </Button>
      </form>
    </Form>
  );
};

export default WorkExperienceForm;