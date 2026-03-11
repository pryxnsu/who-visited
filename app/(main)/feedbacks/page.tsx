'use client';

import FeedbackForm from './FeedbackForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Feedback, useFeedback } from '@/hooks/use-feedback';
import Loader from '@/components/Loader';
import ErrorUI from '@/components/Error';

export default function Page() {
  const { feedbacks, addFeedback, isLoading, refresh, error } = useFeedback();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorUI error={error} onRetry={refresh} />;
  }
  return (
    <div className="flex w-full flex-col gap-8">
      <section className="border-b pb-6">
        <p className="text-muted-foreground inline-flex items-center gap-2 text-xs font-medium">
          <span aria-hidden="true" className="bg-primary h-2 w-2 rounded-full" />
          Feedback
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Feedback</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
          Read what others have to say and share your own thoughts about WhoVisited.
        </p>
      </section>

      <div>
        <div>
          <FeedbackForm onSuccess={addFeedback} />
        </div>
        <div className="mt-8 flex flex-col gap-6">
          <h2 className="text-foreground/90 text-xl font-semibold tracking-tight">Feedback</h2>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : feedbacks.length === 0 ? (
            <Card className="border-dashed bg-transparent shadow-none">
              <CardContent className="text-muted-foreground flex flex-col items-center justify-center p-8 text-center">
                <p>No feedback has been submitted yet. Be the first!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {feedbacks.map(f => {
                return <FeedbackCard key={f.id} feedback={f} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const date = new Date(feedback.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const initials = feedback.user?.name?.substring(0, 2).toUpperCase() ?? 'U';
  return (
    <Card className="border-dashed p-0 shadow-none">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={feedback.user?.avatar || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm leading-none font-medium">{feedback.user?.name || 'Anonymous'}</p>
            <p className="text-muted-foreground mt-1 text-xs">{date}</p>
          </div>
        </div>
        <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">{feedback.content}</p>
      </CardContent>
    </Card>
  );
}
