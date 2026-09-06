import { z } from "zod";

export const feedbackSchema = z.object({
  branchSlug: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  feedbackText: z.string().max(2000).optional().nullable(),
  customerName: z.string().max(120).optional().nullable(),
  customerPhone: z.string().max(30).optional().nullable(),
  foodQualityRating: z.number().int().min(1).max(5).optional().nullable(),
  deliveryRating: z.number().int().min(1).max(5).optional().nullable(),
  staffRating: z.number().int().min(1).max(5).optional().nullable(),
  cleanlinessRating: z.number().int().min(1).max(5).optional().nullable(),
  packagingRating: z.number().int().min(1).max(5).optional().nullable(),
  waitingTimeRating: z.number().int().min(1).max(5).optional().nullable(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
