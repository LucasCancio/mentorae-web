import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TTeacher } from "@/api/auth/get-profile";
import { updateTeacher } from "@/api/teacher/update-teacher";
import { Checkbox } from "./ui/checkbox";
import { twMerge } from "tailwind-merge";

const storeProfileSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    email: z.string().email("E-mail inválido."),
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

type TStoreProfileForm = z.infer<typeof storeProfileSchema>;

type Props = {
  profile: TTeacher;
  onClose: () => void;
};

export function StoreProfileDialog({ profile, onClose }: Props) {
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateTeacher,
    onMutate({ name, email }) {
      const { cached } = updateProfileCache({ name, email });

      return {
        previousProfile: cached,
      };
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateProfileCache(context.previousProfile);
      }
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TStoreProfileForm>({
    resolver: zodResolver(storeProfileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      staySamePassword: true,
    },
  });

  const staySamePassword = watch("staySamePassword");

  function updateProfileCache({ email, name }: TStoreProfileForm) {
    const cached = queryClient.getQueryData<TTeacher>(["profile"]);

    if (cached) {
      queryClient.setQueryData<TTeacher>(["profile"], {
        ...cached,
        name,
        email,
      });
    }

    return { cached };
  }

  async function handleUpdateProfile(data: TStoreProfileForm) {
    try {
      await updateProfileFn({
        id: profile.id,
        name: data.name,
        email: data.email,
        password: data.password?.length == 0 ? undefined : data.password,
      });

      toast.success("Perfil atualizado com sucesso");
      handleClose();
    } catch (error) {
      console.error(error);

      toast.error("Falha ao atualizar o perfil, tente novamente!");
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu perfil de professor(a).
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
              autoComplete="name"
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
