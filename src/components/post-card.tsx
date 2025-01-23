import { TPost } from "@/api/posts/get-posts";
import { CategoryList } from "./category-list";
import { Link } from "react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { capitalize } from "lodash";

type PostCardProps = {
  post: TPost;
  showImage?: boolean;
};

export function PostCard({ post, showImage = true }: PostCardProps) {
  return (
    <Link
      to={`/post/${post.id}/${post.slug}`}
      className="rounded-md shadow-md min-h-[380px] w-[400px] border-[1px] bg-background text-foreground flex flex-col hover:transform hover:scale-105 transition-transform"
    >
      {showImage && (
        <div className="w-full h-[220px] bg-white rounded-t-sm">
          <img
            src={post.imageUrl ?? ""}
            alt={post.title}
            className="size-full object-cover rounded-t-sm"
          />
        </div>
      )}
      <div className="p-4 flex flex-1 flex-col">
        <div className="flex-1 flex flex-col gap-2">
          <CategoryList categories={post.categories} />
          <h2 className="text-xl font-semibold flex-1 truncate">
            {post.title}
          </h2>
        </div>
        <time>
          {capitalize(
            format(new Date(post.updatedAt), "eeee, dd LLLL yyyy", {
              locale: ptBR,
            })
          )}
        </time>
      </div>
    </Link>
  );
}
