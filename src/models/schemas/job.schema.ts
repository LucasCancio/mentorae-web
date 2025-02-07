import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string({ required_error: "Informe o título da vaga" })
    .min(1, "Informe o título da vaga"),
  company: z
    .string({ required_error: "Informe a empresa" })
    .min(1, "Informe a empresa"),
  jobType: z
    .string({ required_error: "Informe o tipo da vaga" })
    .min(1, "Informe o tipo da vaga"),
  modality: z
    .string({
      required_error: "Informe a modalidade",
    })
    .min(1, "Informe a modalidade"),
  publicationDate: z.date({
    required_error: "Informe a data de publicação",
  }),
  link: z
    .string({
      required_error: "Informe um link",
    })
    .url("Informe um link válido"),
  quantity: z.coerce.number().int().min(1, "Informe a quantidade de vagas"),
  urlImage: z
    .string({ required_error: "Informe um link de imagem" })
    .url("Informe um link de imagem válido"),
});

export type TCreateJobSchema = z.infer<typeof createJobSchema>;
