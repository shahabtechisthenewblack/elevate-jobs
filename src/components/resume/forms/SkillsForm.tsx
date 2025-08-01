import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { Skill } from '@/types/resume';
import { useSecureForm } from '@/hooks/useSecureForm';
import { sanitizeInput } from '@/utils/security';

const skillsSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required').transform(sanitizeInput),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    category: z.string().min(1, 'Category is required').transform(sanitizeInput),
  })).min(1, 'At least one skill is required'),
  interests: z.array(z.string().transform(sanitizeInput)).optional(),
});

type SkillsFormData = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  onComplete: (data: { skills: Skill[]; interests: string[] }) => void;
  initialData?: Skill[];
}

const SkillsForm = ({ onComplete, initialData }: SkillsFormProps) => {
  const [newInterest, setNewInterest] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  
  const secureForm = useSecureForm({ 
    maxAttempts: 5, 
    windowMs: 60000, 
    identifier: 'skills_form' 
  });

  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: initialData?.length ? initialData : [{
        name: '',
        level: 'Intermediate',
        category: 'Technical',
      }],
      interests: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  const skillCategories = [
    'Technical',
    'Programming Languages',
    'Frameworks',
    'Tools & Technologies',
    'Soft Skills',
    'Languages',
    'Other',
  ];

  const skillLevels = [
    'Beginner',
    'Intermediate', 
    'Advanced',
    'Expert',
  ];

  const addSkill = () => {
    append({
      name: '',
      level: 'Intermediate',
      category: 'Technical',
    });
  };

  const addInterest = () => {
    const sanitizedInterest = sanitizeInput(newInterest.trim());
    if (sanitizedInterest && !interests.includes(sanitizedInterest)) {
      setInterests([...interests, sanitizedInterest]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const onSubmit = (data: SkillsFormData) => {
    if (!secureForm.validateSubmission()) {
      return;
    }
    onComplete({
      skills: data.skills as Skill[],
      interests: interests,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Skills Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Technical & Professional Skills</CardTitle>
            <Button type="button" onClick={addSkill} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="React.js" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`skills.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`skills.${index}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Interests Section */}
        <Card>
          <CardHeader>
            <CardTitle>Interests & Hobbies (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add an interest (e.g., Photography, Hiking, Open Source)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button type="button" onClick={addInterest} variant="outline">
                Add
              </Button>
            </div>
            
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-2 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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

export default SkillsForm;