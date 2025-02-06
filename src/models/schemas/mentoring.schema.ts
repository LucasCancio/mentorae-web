import { z } from "zod";

export const createMentoringSchema = z.object({
  modality: z.string().min(1, "Selecione uma modalidade"),
  matter: z.string().min(1, "Informe a matéria ou área"),
  date: z.date(),
});

export type TCreateMentoringSchema = z.infer<typeof createMentoringSchema>;
