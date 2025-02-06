import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { updateTeacher } from "@/api/teacher/update-teacher";
import { Checkbox } from "./ui/checkbox";
import { twMerge } from "tailwind-merge";
import { Textarea } from "./ui/textarea";
import { TTeacher } from "@/models/Teacher.model";
import {
  TUpdateTeacherSchema,
  updateTeacherSchema,
} from "@/models/schemas/teacher.schema";

type Props = {
  profile: TTeacher;
  onClose: () => void;
};

export function TeacherProfileDialog({ profile, onClose }: Props) {
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateTeacher,
    onMutate({ name, email, is_mentored, personal_id, phone, bio }) {
      const { cached } = updateProfileCache({
        name,
        email,
        isMentored: is_mentored,
        personalId: Number(personal_id) || 0,
        phone: Number(phone) || 0,
        bio,
      });

      return {
        previousProfile: cached,
      };
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        const { name, email, isMentored, personalId, phone, bio } =
          context.previousProfile;

        updateProfileCache({
          name,
          email,
          isMentored,
          personalId: Number(personalId) || 0,
          phone: Number(phone) || 0,
          bio,
        });
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
  } = useForm<TUpdateTeacherSchema>({
    resolver: zodResolver(updateTeacherSchema),
    defaultValues: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      bio: profile?.bio ?? "",
      isMentored: profile?.isMentored ?? false,
      personalId: Number(profile?.personalId) || undefined,
      phone: Number(profile?.phone) || undefined,
      staySamePassword: true,
    },
  });

  const staySamePassword = watch("staySamePassword");
  const isMentored = watch("isMentored");

  function updateProfileCache({
    email,
    name,
    isMentored,
    personalId,
    phone,
    bio,
  }: TUpdateTeacherSchema) {
    const cached = queryClient.getQueryData<TTeacher>(["profile"]);

    if (cached) {
      queryClient.setQueryData<TTeacher>(["profile"], {
        ...cached,
        name,
        email,
        isMentored,
        personalId: personalId.toString(),
        phone: phone.toString(),
        bio,
      });
    }

    return { cached };
  }

  async function handleUpdateProfile(data: TUpdateTeacherSchema) {
    try {
      await updateProfileFn({
        id: profile.id,
        name: data.name,
        email: data.email,
        password: data.password?.length == 0 ? undefined : data.password,
        personal_id: data.personalId.toString(),
        is_mentored: data.isMentored,
        phone: data.phone.toString(),
        bio: data.isMentored ? data.bio : undefined,
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
            <Label className="text-right" htmlFor="personalId">
              CPF
            </Label>
            <Input
              className="col-span-3"
              maxLength={11}
              minLength={11}
              id="personalId"
              type="text"
              {...register("personalId")}
            />
            {errors.personalId && (
              <span className="text-red-700">{errors.personalId.message}</span>
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
            <Label className="text-right" htmlFor="phone">
              Celular
            </Label>
            <Input
              className="col-span-3"
              id="phone"
              type="tel"
              minLength={11}
              maxLength={20}
              autoComplete="tel"
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-red-700">{errors.phone.message}</span>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
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
                    Sou mentor(a)
                  </label>
                );
              }}
            />
          </div>
          {isMentored && (
            <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
              <Label className="text-right" htmlFor="bio">
                Bio
              </Label>
              <Textarea
                id="bio"
                {...register("bio")}
                className="flex-1 col-span-3"
                placeholder="Fale um pouco sobre você..."
              />
              {errors.bio && (
                <span className="text-red-700">{errors.bio.message}</span>
              )}
            </div>
          )}

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
