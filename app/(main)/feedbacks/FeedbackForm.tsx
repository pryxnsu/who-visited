'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { MessageSquarePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Feedback } from '@/hooks/use-feedback';
import { AxiosError } from 'axios';
import { api, ApiResponse } from '@/lib/api';

const feedbackSchema = z.object({
  content: z
    .string()
    .min(10, 'Feedback must be at least 10 characters long')
    .max(1000, 'Feedback must be less than 1000 characters'),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackForm({ onSuccess }: { onSuccess?: (feedback: Feedback) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(data: FeedbackFormValues) {
    setIsSubmitting(true);
    try {
      const response = await api.post<ApiResponse<Feedback>>('/api/feedbacks', {
        content: data.content,
      });
      if (response.data.data) {
        toast.success(response.data.message);
        form.reset();
        onSuccess?.(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      const message =
        error instanceof AxiosError
          ? ((error.response?.data as { error?: string })?.error ?? 'Failed to fetch feedback')
          : 'Failed to fetch feedbacks';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="gap-0 border-none p-0 shadow-none">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="inline-flex items-center gap-2 text-xl tracking-tight">
          <MessageSquarePlus className="h-5 w-5" />
          Share Your Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        <p className="text-muted-foreground text-sm">Have an idea or found a bug? Let us know what you think.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you love, what could be better, or what's missing..."
                      className="bg-background/50 focus-visible:ring-ring h-11 min-h-30 resize-none rounded-xl shadow-sm transition-all focus-visible:ring-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-start">
              <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Submitting
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
