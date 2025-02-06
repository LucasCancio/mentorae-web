import { z } from "zod";
import { commomUserSchema } from "./user.schema";

export const updateStudentSchema = commomUserSchema
  .extend({
    password: z.string().optional(),
    staySamePassword: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.staySamePassword) return true;
      return data.password && data.password?.length >= 6;
    },
    { message: "A senha deve ter no mínimo 6 caracteres.", path: ["password"] }
  );

export type TUpdateStudentSchema = z.infer<typeof updateStudentSchema>;

export const createStudentSchema = commomUserSchema.extend({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export type TCreateStudentSchema = z.infer<typeof createStudentSchema>;
