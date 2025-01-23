import { api } from "@/lib/axios";

export interface IRegisterPostBody {
  postId?: number;
  title: string;
  content: string;
  slug: string;
  categoriesIds: number[];
  imageUrl?: string | undefined | null;
}

export async function updateOrRegisterPost({
  postId,
  title,
  content,
  slug,
  categoriesIds,
  imageUrl,
}: IRegisterPostBody) {
  if (postId) {
    return await api.patch(`/posts/${postId}`, {
      title,
      content,
      slug,
      categoriesIds,
      imageUrl,
    });
  }

  return await api.post("/posts", {
    title,
    content,
    slug,
    categoriesIds,
    imageUrl,
  });
}
