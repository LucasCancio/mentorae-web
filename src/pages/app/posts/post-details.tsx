import { updateOrRegisterPost } from "@/api/posts/update-or-register-post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { useProfile } from "@/hooks/use-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { getPostById } from "@/api/posts/get-post-by-id";
import { Badge } from "@/components/ui/badge";
import { Image, Plus, Save, Trash, Type, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ContentMarkdown } from "@/components/content-markdown";
import { TCategory } from "@/api/categories/get-categories";

const postForm = z.object({
  title: z.string().min(5, "O titulo deve conter no mínimo 5 caracteres."),
  content: z
    .string()
    .min(20, "O conteúdo deve conter no mínimo 20 caracteres."),
  imageUrl: z.string().url("A url da imagem deve ser válida.").optional(),
  categories: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        color: z.string(),
      }),
      {
        required_error: "É preciso informar pelo menos 1 categoria.",
      }
    )
    .min(1, "É preciso informar pelo menos 1 categoria.")
    .max(3, "Só é permitido até no máximo 3 categorias."),
});

type TPostForm = z.infer<typeof postForm>;

export function PostDetails() {
  const { id: idParam } = useParams();
  const postId = z.coerce.number().optional().parse(idParam);
  const isEdditing = Boolean(postId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const pageTitle = isEdditing ? "Editando Post" : "Criando um Post";

  const { data: profile, isLoading: isLoadingProfile } = useProfile();

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", postId],
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      getPostById({
        id: postId ?? 0,
      }),
    enabled: isEdditing,
  });

  useEffect(() => {
    if (!isLoadingProfile && !profile) {
      toast.error("Você precisa estar logado para acessar essa página.");
      navigate("/");
    }
  }, [profile, isLoadingProfile]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TPostForm>({
    resolver: zodResolver(postForm),
    values: {
      content: post?.content ?? "",
      imageUrl: post?.imageUrl ?? "",
      categories: post?.categories ?? [],
      title: post?.title ?? "",
    },
  });

  const {
    fields: categoriesField,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "categories",
  });

  const content = watch("content");
  const imageUrl = watch("imageUrl");

  const { mutateAsync: updateOrRegisterPostFn } = useMutation({
    mutationFn: updateOrRegisterPost,
  });

  async function handleSavePost(data: TPostForm) {
    try {
      const result = await updateOrRegisterPostFn({
        postId,
        categoriesIds: data.categories.map((category) => category.id),
        content: data.content,
        slug: data.title.replace(/\s+/g, "-").toLowerCase(),
        title: data.title,
        imageUrl: data.imageUrl,
      });

      if (result.status !== 201 && result.status !== 200) {
        throw new Error("Erro ao salvar post");
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });

      toast.success(
        isEdditing ? "Post salvo com sucesso!" : "Post cadastrado com sucesso!"
      );
      navigate("/");
    } catch (error) {
      toast.error(
        "Erro ao realizar essa operação, tente novamente mais tarde!"
      );
    }
  }

  function handleAddCategory() {
    if (selectedCategory) appendCategory(selectedCategory);
  }

  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    null
  );
  const categoryAlreadyAdded =
    categoriesField.find(
      (category) => category.name === selectedCategory?.name
    ) != null;

  useEffect(() => {
    if (categories) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  return (
    <>
      <Helmet title={pageTitle} />

      <div className="flex flex-col gap-4 max-w-[800px] w-full mx-auto flex-1">
        <h1 className="text-3xl font-bold tracking-tighter">{pageTitle}</h1>

        {isLoadingProfile || isLoadingPost ? (
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
            onSubmit={handleSubmit(handleSavePost)}
            className="flex flex-col gap-4 w-full flex-1"
          >
            <div className="space-y-2">
              <Label className="text-base" htmlFor="title">
                Título
              </Label>
              <Input
                id="title"
                {...register("title")}
                maxLength={60}
                placeholder="Título do seu post"
              />
              {errors.title && (
                <span className="text-destructive">{errors.title.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-base" htmlFor="imageUrl">
                  Imagem (url)
                </Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={imageUrl?.length === 0 && !!errors?.imageUrl}
                    >
                      <Image className="size-4 mr-2" /> Prévia da imagem
                    </Button>
                  </DialogTrigger>
                  <PostImagePreviewDialog imageUrl={imageUrl} />
                </Dialog>
              </div>
              <Input
                id="imageUrl"
                type="url"
                {...register("imageUrl")}
                placeholder="Url da imagem principal do seu post"
              />
              {errors.imageUrl && (
                <span className="text-destructive">
                  {errors.imageUrl.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-base font-medium">Categorias</span>
              <div className="flex gap-2">
                {isLoadingCategories || !categories?.length ? (
                  <Skeleton className="w-full" />
                ) : (
                  <Select
                    defaultValue={categories[0]?.id.toString()}
                    name="category"
                    onValueChange={(value) => {
                      const category = categories?.find(
                        (category) => category.id === Number(value)
                      );
                      if (category) setSelectedCategory(category);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  type="button"
                  variant="success"
                  disabled={categoryAlreadyAdded || !categories?.length}
                  onClick={handleAddCategory}
                >
                  <Plus className="mr-1 size-5" /> Adicionar
                </Button>
              </div>
              <div className="flex flex-row gap-4 flex-wrap">
                {categoriesField.map((field, index) => {
                  return (
                    <div key={field.id} className="flex flex-row">
                      <Badge
                        variant="outline"
                        className="text-foreground py-2 px-4"
                        key={field.id}
                        style={{ color: field.color }}
                      >
                        {field.name}
                        <button
                          type="button"
                          title="Remover categoria"
                          className="text-destructive ml-2 hover:text-destructive-foreground transition-colors"
                          onClick={() => removeCategory(index)}
                        >
                          <Trash className="size-4" />
                        </button>
                      </Badge>
                    </div>
                  );
                })}
              </div>

              {errors.categories && (
                <span className="text-destructive">
                  {errors.categories.message}
                </span>
              )}
            </div>

            <div className="flex flex-col space-y-2 flex-1">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-base" htmlFor="content">
                  Conteúdo
                </Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={content?.length === 0}>
                      <Type className="size-4 mr-2" /> Prévia do conteúdo
                    </Button>
                  </DialogTrigger>
                  <PostContentPreviewDialog content={content} />
                </Dialog>
              </div>
              <Textarea
                id="content"
                {...register("content")}
                className="flex-1"
                placeholder="Conteúdo do seu post (em MarkDown)"
              />
              {errors.content && (
                <span className="text-destructive">
                  {errors.content.message}
                </span>
              )}
            </div>

            <div className="mx-auto flex flex-col w-full md:w-3/4 items-center gap-2 md:flex-row">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Save className="size-5 mr-2" />
                {isEdditing ? "Salvar" : "Cadastrar"}
              </Button>
              <Button
                variant="secondary"
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

type PostContentPreviewDialogProps = {
  content: string;
};

function PostContentPreviewDialog({ content }: PostContentPreviewDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Prévia do conteúdo</DialogTitle>
        <DialogDescription hidden>
          Essa é uma prévia do conteúdo
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <ContentMarkdown content={content} />
    </DialogContent>
  );
}

type PostImagePreviewDialogProps = {
  imageUrl: string | undefined;
};

function PostImagePreviewDialog({ imageUrl }: PostImagePreviewDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Prévia da imagem</DialogTitle>
        <DialogDescription hidden>
          Essa é uma prévia da imagem
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <img className="size-full" src={imageUrl} alt="Imagem do post" />
    </DialogContent>
  );
}
