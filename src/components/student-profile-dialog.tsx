import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { twMerge } from "tailwind-merge";
import { updateStudent } from "@/api/student/update-student";
import { TStudent } from "@/models/Student.model";
import {
  TUpdateStudentSchema,
  updateStudentSchema,
} from "@/models/schemas/student.schema";

type Props = {
  profile: TStudent;
  onClose: () => Promise<void>;
};

export function StudentProfileDialog({ profile, onClose }: Props) {
  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateStudent,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TUpdateStudentSchema>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      email: profile?.email ?? "",
      name: profile?.name ?? "",
      staySamePassword: true,
    },
  });

  const staySamePassword = watch("staySamePassword");

  async function handleUpdateProfile(data: TUpdateStudentSchema) {
    try {
      await updateProfileFn({
        id: profile.id,
        email: data.email,
        password: data.password?.length == 0 ? undefined : data.password,
        name: data.name,
      });

      toast.success("Perfil atualizado com sucesso");
      await handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao atualizar o perfil, tente novamente!");
    }
  }

  async function handleClose() {
    await onClose();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu perfil.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input
              className="col-span-3"
              id="name"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-700 col-start-2 col-span-3 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
            <Label className="text-right" htmlFor="email">
              E-mail
            </Label>
            <Input
              className="col-span-3"
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-700 col-start-2 col-span-3 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
            <Label
              className={twMerge(
                "text-right",
                staySamePassword && "line-through opacity-50 cursor-not-allowed"
              )}
              htmlFor="password"
            >
              Senha
            </Label>
            <Input
              className="col-span-3"
              id="password"
              type="password"
              autoComplete="off"
              disabled={staySamePassword}
              {...register("password")}
            />

            <Controller
              control={control}
              name="staySamePassword"
              render={({ field }) => {
                return (
                  <label className="text-sm leading-none col-span-3 col-start-2 flex gap-2 items-center cursor-pointer">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                    Permanecer a mesma senha
                  </label>
                );
              }}
            />
            {errors.password && (
              <span className="text-red-700 col-start-2 col-span-3 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            Fechar
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
