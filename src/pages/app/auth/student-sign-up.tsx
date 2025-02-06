import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerStudent } from "@/api/student/register-student";
import { ArrowLeft } from "lucide-react";
import {
  createStudentSchema,
  TCreateStudentSchema,
} from "@/models/schemas/student.schema";

export function StudentSignUp() {
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TCreateStudentSchema>({
    resolver: zodResolver(createStudentSchema),
  });

  const { mutateAsync: registerStudentFn } = useMutation({
    mutationFn: registerStudent,
  });

  async function handleSignUp(data: TCreateStudentSchema) {
    try {
      await registerStudentFn({
        email: data.email,
        password: data.password,
        name: data.name,
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
              Seja um(a) estudante!
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
