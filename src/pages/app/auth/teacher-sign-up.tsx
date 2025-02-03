import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { registerTeacher } from "@/api/teacher/register-teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { isValidCPF } from "@/utils/valid-cpf";

export const teacherSignUpForm = z
  .object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    email: z.string().email("E-mail inválido."),
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
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    isMentored: z.boolean(),
    bio: z.string().optional(),
  })
  .refine((data) => !(data.isMentored && !data.bio?.length), {
    message: "Se você é mentorado, precisa preencher a bio.",
    path: ["bio"],
  });

export type TTeacherSignUpForm = z.infer<typeof teacherSignUpForm>;

export function TeacherSignUp() {
  const navigate = useNavigate();

  const {
    reset,
    control,
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TTeacherSignUpForm>({
    resolver: zodResolver(teacherSignUpForm),
    defaultValues: {
      isMentored: false,
    },
  });

  const isMentored = watch("isMentored") || false;

  const { mutateAsync: registerTeacherFn } = useMutation({
    mutationFn: registerTeacher,
  });

  async function handleSignUp(data: TTeacherSignUpForm) {
    try {
      await registerTeacherFn({
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone?.toString(),
        personal_id: data.personalId?.toString(),
        is_mentored: data.isMentored,
        bio: data.isMentored ? data.bio : undefined,
      });

      toast.success("Cadastro realizado com sucesso!", {
        action: {
          label: "Login",
          onClick: () => navigate(`/sign-in?email=${data.email}`),
        },
      });
      reset();
    } catch (error) {
      toast.error("Erro ao cadastrar, tente novamente mais tarde!");
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />

      <div className="p-8">
        <Button asChild variant="ghost" className="absolute right-4 top-8">
          <Link to="/sign-in">Fazer login</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-row items-end gap-4">
            <Link to="/sign-up" title="Voltar">
              <ArrowLeft className="size-6" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tighter">
              Seja um(a) professor(a)!
            </h1>
          </div>

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                type="name"
                autoComplete="name"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-700">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalId">Seu CPF (somente números)</Label>
              <Input
                maxLength={11}
                minLength={11}
                id="personalId"
                type="text"
                {...register("personalId")}
              />
              {errors.personalId && (
                <span className="text-red-700">
                  {errors.personalId.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-700">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Seu celular (somente números com DDD)
              </Label>
              <Input
                id="phone"
                type="tel"
                minLength={11}
                maxLength={14}
                autoComplete="tel"
                {...register("phone")}
              />
              {errors.phone && (
                <span className="text-red-700">{errors.phone.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Sua senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-700">{errors.password.message}</span>
              )}
            </div>

            <Controller
              control={control}
              name="isMentored"
              render={({ field }) => {
                return (
                  <label className="text-sm leading-none col-span-3 col-start-2 flex gap-2 items-center cursor-pointer">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                    Quero ser mentor(a)!
                  </label>
                );
              }}
            />

            {isMentored && (
              <div className="space-y-2">
                <Label htmlFor="bio">Sua Bio</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  className="flex-1"
                  placeholder="Fale um pouco sobre você..."
                />
                {errors.bio && (
                  <span className="text-red-700">{errors.bio.message}</span>
                )}
              </div>
            )}

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              Finalizar cadastro
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <a href="" className="underline underline-offset-4">
                termos de serviço
              </a>{" "}
              e{" "}
              <a href="" className="underline underline-offset-4">
                política de privacidade.
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
