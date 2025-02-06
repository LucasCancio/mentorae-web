import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { useAuthentication } from "@/contexts/authentication-context";
import { useQueryParams } from "@/hooks/use-query-params";
import { TCreateJobSchema, createJobSchema } from "@/models/schemas/job.schema";
import { parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJobById } from "@/api/jobs/get-job-by-id";
import { updateOrRegisterJob } from "@/api/jobs/update-or-register-job";

const modalities = ["Home Office", "Presencial", "Híbrido"];
const jobTypes = ["Estágio", "Júnior", "Pleno", "Sênior", "Especialista"];

export function JobForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { userId } = useAuthentication();

  const query = useQueryParams();
  const id = query.get("id");

  const jobId = z.coerce.number().optional().parse(id);
  const isEdditing = Boolean(jobId);

  const pageTitle = isEdditing ? "Editando Vaga" : "Criando uma Vaga";

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    staleTime: 1000 * 60 * 5,
    retry: 1,
    queryFn: () =>
      getJobById({
        id: jobId ?? 0,
      }),
    enabled: isEdditing,
  });

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TCreateJobSchema>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: job?.title ?? undefined,
      modality: job?.modality ?? modalities[0],
      company: job?.company ?? undefined,
      jobType: job?.jobType ?? jobTypes[0],
      link: job?.link ?? undefined,
      quantity: job?.quantity ?? 1,
      urlImage: job?.urlImage ?? undefined,
      publicationDate:
        job?.publicationDate == null
          ? new Date()
          : parseISO(job.publicationDate),
    },
  });

  const urlImage = watch("urlImage");

  const { mutateAsync: updateOrRegisterJobFn } = useMutation({
    mutationFn: updateOrRegisterJob,
  });

  async function handleSaveMentoring(data: TCreateJobSchema) {
    try {
      const result = await updateOrRegisterJobFn({
        jobId,
        company: data.company,
        job_type: data.jobType,
        link: data.link,
        publication_date: data.publicationDate.toISOString(),
        quantity: data.quantity,
        title: data.title,
        url_image: data.urlImage,
        modality: data.modality,
        teacher_id: userId,
      });

      if (result.status !== 201 && result.status !== 200) {
        throw new Error("Erro ao salvar vaga");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["job", jobId] }),
      ]);

      toast.success(
        isEdditing ? "Vaga salva com sucesso!" : "Vaga cadastrada com sucesso!"
      );
      navigate("/jobs");
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
              <Label htmlFor="title">Título</Label>
              <Input id="title" type="text" {...register("title")} />
              {errors.title && (
                <span className="text-red-700">{errors.title.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" type="text" {...register("company")} />
              {errors.company && (
                <span className="text-red-700">{errors.company.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Tipo de vaga</Label>
              <Controller
                control={control}
                name="jobType"
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
                      {jobTypes?.map((jobType) => (
                        <SelectItem key={jobType} value={jobType}>
                          {jobType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.jobType && (
                <span className="text-red-700">{errors.jobType.message}</span>
              )}
            </div>

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
              <Label htmlFor="link">Link</Label>
              <Input id="link" type="url" {...register("link")} />
              {errors.link && (
                <span className="text-red-700">{errors.link.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urlImage">Imagem da vaga (url)</Label>
              <Input id="urlImage" type="url" {...register("urlImage")} />
              {errors.urlImage && (
                <span className="text-red-700">{errors.urlImage.message}</span>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={urlImage?.length === 0 || !!errors?.urlImage}
                  >
                    <Image className="size-4 mr-2" /> Prévia da imagem
                  </Button>
                </DialogTrigger>
                <ImagePreviewDialog imageUrl={urlImage} />
              </Dialog>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade de vagas</Label>
              <Input
                id="quantity"
                min={1}
                type="number"
                {...register("quantity")}
              />
              {errors.quantity && (
                <span className="text-red-700">{errors.quantity.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicationDate">Data de publicação</Label>
              <Controller
                control={control}
                name="publicationDate"
                render={({ field }) => (
                  <DatePicker
                    defaultValue={field.value}
                    onSelect={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.publicationDate && (
                <span className="text-red-700">
                  {errors.publicationDate.message}
                </span>
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
                onClick={() => navigate("/jobs")}
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

type ImagePreviewDialogProps = {
  imageUrl: string | undefined;
};

function ImagePreviewDialog({ imageUrl }: ImagePreviewDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Prévia da imagem</DialogTitle>
        <DialogDescription hidden>
          Essa é uma prévia da imagem
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <img className="size-full" src={imageUrl} alt="Imagem" />
    </DialogContent>
  );
}
