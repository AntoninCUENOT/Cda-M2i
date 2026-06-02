import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z
      .string()
      .min(8, 'Mot de passe : 8 caractères minimum')
      .regex(/[A-Z]/, 'Mot de passe : au moins une majuscule')
      .regex(/[0-9]/, 'Mot de passe : au moins un chiffre'),
    pseudo: z
      .string()
      .min(3, 'Pseudo : 3 caractères minimum')
      .max(50, 'Pseudo : 50 caractères maximum')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Pseudo : lettres, chiffres, _ et - uniquement'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
