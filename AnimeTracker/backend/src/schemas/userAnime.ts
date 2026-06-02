import { z } from 'zod';

const animeStatusEnum = z.enum(['A_VOIR', 'EN_COURS', 'TERMINE', 'ABANDONNE']);

export const addToListSchema = z.object({
  body: z.object({
    anime_id: z.number().int().positive(),
    status: animeStatusEnum,
  }),
});

export const updateEntrySchema = z.object({
  body: z.object({
    status: animeStatusEnum.optional(),
    episodes_watched: z.number().int().min(0).optional(),
    started_at: z.string().datetime().optional(),
    completed_at: z.string().datetime().optional(),
  }),
  params: z.object({ animeId: z.string() }),
});

export type AddToListInput = z.infer<typeof addToListSchema>['body'];
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>['body'];
