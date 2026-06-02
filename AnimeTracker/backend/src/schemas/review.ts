import { z } from 'zod';

export const upsertReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .min(0)
      .max(10)
      .refine((v) => (v * 2) % 1 === 0, 'La note doit être un multiple de 0.5'),
    comment: z.string().max(2000).optional(),
    visibility: z.enum(['PUBLIC', 'PRIVE']).optional(),
  }),
  params: z.object({ animeId: z.string() }),
});

export type UpsertReviewInput = z.infer<typeof upsertReviewSchema>['body'];
