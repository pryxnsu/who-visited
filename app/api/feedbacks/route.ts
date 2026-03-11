import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createFeedback, getFeedbacks } from '@/lib/db/queries';
import { z } from 'zod';
import ApiResponse from '@/lib/ApiResponse';
import { HTTP_STATUS } from '@/lib/constant';

const feedbackSchema = z.object({
  content: z
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(1000, 'Feedback must be less than 1000 characters'),
});

// GET - /api/feedbacks
export async function GET() {
  try {
    const feedbacks = await getFeedbacks();
    return NextResponse.json(new ApiResponse(HTTP_STATUS.OK, true, feedbacks, 'Feedbacks fetched successfully'));
  } catch (error) {
    console.error('Failed to fetch feedbacks', error);
    return NextResponse.json(
      new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, false, null, 'Failed to fetch feedbacks')
    );
  }
}

// POST - /api/feedbacks
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const feedback = await createFeedback({
      userId: user.id,
      content: parsed.data.content,
    });

    return NextResponse.json(new ApiResponse(HTTP_STATUS.CREATED, true, feedback, 'Feedback added successfully'));
  } catch (error) {
    console.error('Failed to create feedback', error);
    return NextResponse.json(
      new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, false, null, 'Failed to create feedback')
    );
  }
}
