import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, X } from "lucide-react";
import {
  createMentoringSchema,
  TCreateMentoringSchema,
} from "@/models/schemas/mentoring.schema";
import { getMentoringById } from "@/api/mentoring/get-mentoring-by-id";
import { updateOrRegisterMentoring } from "@/api/mentoring/update-or-register-mentoring";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useAuthentication } from "@/contexts/authentication-context";
import { useQueryParams } from "@/hooks/use-query-params";
import { parseISO } from "date-fns";

const modalities = ["Online", "Presencial"];

export function MentoringForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { userId } = useAuthentication();

  const query = useQueryParams();
  const id = query.get("id");

  const mentoringId = z.coerce.number().optional().parse(id);
  const isEdditing = Boolean(mentoringId);

  const pageTitle = isEdditing ? "Editando Mentoria" : "Criando uma Mentoria";

  const { data: mentoring, isLoading } = useQuery({
    queryKey: ["mentoring", mentoringId],
    staleTime: 1000 * 60 * 5,
    retry: 1,
    queryFn: () =>
      getMentoringById({
        id: mentoringId ?? 0,
      }),
    enabled: isEdditing,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TCreateMentoringSchema>({
    resolver: zodResolver(createMentoringSchema),
    defaultValues: {
      modality: mentoring?.modality ?? modalities[0],
      matter: mentoring?.matter ?? undefined,
      date:
        mentoring?.mentoringDate == null
          ? new Date()
          : parseISO(mentoring.mentoringDate),
    },
  });

  const { mutateAsync: updateOrRegisterMentoringFn } = useMutation({
    mutationFn: updateOrRegisterMentoring,
  });

  async function handleSaveMentoring(data: TCreateMentoringSchema) {
    try {
      const result = await updateOrRegisterMentoringFn({
        mentoringId: mentoringId,
        mentoring_date: data.date.toISOString(),
        matter: data.matter,
        modality: data.modality,
        teacher_id: userId,
      });

      if (result.status !== 201 && result.status !== 200) {
        throw new Error("Erro ao salvar mentoria");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mentoring-list"] }),
        queryClient.invalidateQueries({ queryKey: ["mentoring", mentoringId] }),
      ]);

      toast.success(
        isEdditing
          ? "Mentoria salva com sucesso!"
          : "Mentoria cadastrada com sucesso!"
      );
      navigate("/");
    } catch (error) {
      toast.error(
        "Erro ao realizar essa operação, tente novamente mais tarde!"
      );
    }
  }

  return (
    <>
      <Helmet title={pageTitle} />

      <div className="flex flex-col gap-4 max-w-[800px] w-full mx-auto flex-1">
        <h1 className="text-3xl font-bold tracking-tighter">{pageTitle}</h1>

        {isLoading ? (
          <div className="flex flex-col gap-4 w-full flex-1">
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-24" />
            <div className="mx-auto flex flex-col w-full md:w-3/4 items-center gap-2 md:flex-row">
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleSaveMentoring)}
            className="flex flex-col gap-4 w-full flex-1"
          >
            <div className="space-y-2">
              <Label htmlFor="modality">Modalidade</Label>
              <Controller
                control={control}
                name="modality"
                render={({ field }) => (
                  <Select
                    defaultValue={field.value}
                    value={field.value}
                    disabled={field.disabled}
                    name={field.name}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modalities?.map((modality) => (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.modality && (
                <span className="text-red-700">{errors.modality.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matter">Matéria / Área</Label>
              <Input
                id="matter"
                type="text"
                placeholder="Matemática, Química, Tecnologia, etc..."
                maxLength={100}
                {...register("matter")}
              />
              {errors.matter && (
                <span className="text-red-700">{errors.matter.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    defaultValue={field.value}
                    onSelect={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.date && (
                <span className="text-red-700">{errors.date.message}</span>
              )}
            </div>

            <div className="mx-auto flex flex-col w-full md:w-3/4 items-center gap-2 md:flex-row">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Save className="size-5 mr-2" />
                {isEdditing ? "Salvar" : "Cadastrar"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => navigate("/")}
              >
                <X className="size-5 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
