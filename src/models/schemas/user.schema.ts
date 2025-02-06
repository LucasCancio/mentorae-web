import { z } from "zod";

export const commomUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("E-mail inválido."),
});
