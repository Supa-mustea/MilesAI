import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserProfileSchema, UserProfile } from "@shared/schema";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useUpdateProfile } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = insertUserProfileSchema.extend({
  careerGoals: z.string().optional().default(""),
  painPoints: z.string().optional().default(""),
  strengths: z.string().optional().default(""),
  skills: z.string().optional().default(""),
  interests: z.string().optional().default(""),
  successTriggers: z.string().optional().default(""),
  stressLevels: z.string().optional().default(""),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  profile?: UserProfile;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function UserProfileForm({ profile, onSubmit, isLoading }: UserProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      age: profile?.age || 25,
      location: profile?.location || "",
      currentIncome: profile?.currentIncome || 0,
      financialGoals: profile?.financialGoals || 0,
      preferredWorkStyle: profile?.preferredWorkStyle || "",
      emotionalState: profile?.emotionalState || "Getting Started",
      careerGoals: profile?.careerGoals?.join(", ") || "",
      painPoints: profile?.painPoints?.join(", ") || "",
      strengths: profile?.strengths?.join(", ") || "",
      skills: profile?.skills?.join(", ") || "",
      interests: profile?.interests?.join(", ") || "",
      successTriggers: profile?.successTriggers?.join(", ") || "",
      stressLevels: JSON.stringify(profile?.stressLevels || {}),
    },
  });

  const handleSubmit = (data: ProfileFormValues) => {
    const processedData = {
      ...data,
      careerGoals: data.careerGoals?.split(",").map(s => s.trim()).filter(Boolean) || [],
      painPoints: data.painPoints?.split(",").map(s => s.trim()).filter(Boolean) || [],
      strengths: data.strengths?.split(",").map(s => s.trim()).filter(Boolean) || [],
      skills: data.skills?.split(",").map(s => s.trim()).filter(Boolean) || [],
      interests: data.interests?.split(",").map(s => s.trim()).filter(Boolean) || [],
      successTriggers: data.successTriggers?.split(",").map(s => s.trim()).filter(Boolean) || [],
      stressLevels: data.stressLevels ? JSON.parse(data.stressLevels) : {},
    };
    onSubmit(processedData);
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Your Profile</CardTitle>
            <CardDescription>
              Help MilesAI understand you better to provide personalized support
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-age"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} data-testid="input-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredWorkStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Work Style</FormLabel>
                    <FormControl>
                      <Input placeholder="Remote, Hybrid, Office" {...field} data-testid="input-work-style" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Monthly Income</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-current-income"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="financialGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Goals (Monthly)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-financial-goals"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Goals (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Remote tech job, Start online business, Financial freedom"
                      {...field}
                      className="resize-none"
                      rows={2}
                      data-testid="input-career-goals"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Programming, Digital Marketing, Content Creation"
                      {...field}
                      className="resize-none"
                      rows={2}
                      data-testid="input-skills"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strengths (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tech-savvy, Creative, Determined, Fast learner"
                      {...field}
                      className="resize-none"
                      rows={2}
                      data-testid="input-strengths"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="painPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Challenges (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Financial stress, Career stagnation, Time management"
                      {...field}
                      className="resize-none"
                      rows={2}
                      data-testid="input-pain-points"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Technology, Business, Cryptocurrency, Personal Development"
                      {...field}
                      className="resize-none"
                      rows={2}
                      data-testid="input-interests"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="submit" disabled={isLoading} data-testid="button-save-profile">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}