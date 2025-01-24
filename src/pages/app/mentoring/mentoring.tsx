import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { getPostById } from "@/api/posts/get-post-by-id";
import { ArrowLeft } from "lucide-react";
import { CategoryList } from "@/components/category-list";
import AuthorDetails from "@/components/author-details";

export function Mentoring() {
  const { id } = useParams();

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      getPostById({
        id: Number(id),
      }),
  });

  if (isLoadingPost || !post) {
    return (
      <>
        <Helmet title="Post" />

        {isLoadingPost ? (
          <Skeleton className="h-[500px]" />
        ) : (
          <div>Não encontrado</div>
        )}
      </>
    );
  }

  return (
    <>
      <Helmet title={post.title} />

      <div className="mt-2 max-w-[800px] w-full mx-auto space-y-4">
        <div className="flex flex-row items-end gap-4">
          <Link to="/" title="Voltar">
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tighter">{post.title}</h1>
        </div>
        <CategoryList categories={post.categories} />
        <AuthorDetails teacher={post.teacher} updatedAt={post.updatedAt} />
        <img
          src={post.imageUrl ?? ""}
          alt={post.title}
          className="w-full h-96 object-cover"
        />
      </div>
    </>
  );
}
