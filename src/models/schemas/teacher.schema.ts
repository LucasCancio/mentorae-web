import { isValidCPF } from "@/utils/valid-cpf";
import { z } from "zod";
import { commomUserSchema } from "./user.schema";

const commomSchema = commomUserSchema.extend({
  phone: z.coerce
    .number({ message: "O celular deve conter apenas números." })
    .refine((x) => x.toString().length >= 11, {
      message: "O celular deve ter no mínimo 11 caracteres.",
    }),
  personalId: z.coerce
    .number({ message: "O CPF deve conter apenas números." })
    .refine((x) => isValidCPF(x.toString()), {
      message: "CPF inválido.",
    })
    .refine((x) => x.toString().length >= 11, {
      message: "O CPF deve ter no mínimo 11 caracteres.",
    }),
  isMentored: z.boolean(),
  bio: z.string().optional(),
});

export const updateTeacherSchema = commomSchema
  .extend({
    staySamePassword: z.boolean().optional(),
    password: z.string().optional(),
  })
  .refine((data) => !(data.isMentored && !data.bio?.length), {
    message: "Se você é mentorado, precisa preencher a bio.",
    path: ["bio"],
  })
  .refine(
    (data) => {
      if (data.staySamePassword) return true;
      return data.password && data.password?.length >= 6;
    },
    { message: "A senha deve ter no mínimo 6 caracteres.", path: ["password"] }
  );

export type TUpdateTeacherSchema = z.infer<typeof updateTeacherSchema>;

export const createTeacherSchema = commomSchema
  .extend({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  })
  .refine((data) => !(data.isMentored && !data.bio?.length), {
    message: "Se você é mentorado, precisa preencher a bio.",
    path: ["bio"],
  });

export type TCreateTeacherSchema = z.infer<typeof createTeacherSchema>;
