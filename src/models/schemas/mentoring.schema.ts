import { z } from "zod";

export const createMentoringSchema = z.object({
  modality: z
    .string({
      required_error: "Selecione uma modalidade",
    })
    .min(1, "Selecione uma modalidade"),
  matter: z
    .string({
      required_error: "Informe a matéria ou área",
    })
    .min(1, "Informe a matéria ou área"),
  date: z.date({
    required_error: "Informe a data da mentoria",
  }),
});

export type TCreateMentoringSchema = z.infer<typeof createMentoringSchema>;
