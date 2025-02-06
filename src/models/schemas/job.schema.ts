import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "Informe o título da vaga"),
  company: z.string().min(1, "Informe a empresa"),
  jobType: z.string().min(1, "Informe o tipo de vaga"),
  modality: z.string().min(1, "Informe a modalidade"),
  publicationDate: z.date(),
  link: z.string().url("Informe um link válido"),
  quantity: z.coerce.number().int().min(1, "Informe a quantidade de vagas"),
  urlImage: z.string().url("Informe um link de imagem válido"),
});

export type TCreateJobSchema = z.infer<typeof createJobSchema>;
