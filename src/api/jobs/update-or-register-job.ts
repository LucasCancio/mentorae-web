import { api } from "@/lib/axios";

export interface ISaveJobBody {
  postId?: number;
  title: string;
  content: string;
  slug: string;
  categoriesIds: number[];
  imageUrl?: string | undefined | null;
}

export async function updateOrRegisterJob({
  postId,
  title,
  content,
  slug,
  categoriesIds,
  imageUrl,
}: ISaveJobBody) {
  if (postId) {
    return await api.patch(`/jobs/${postId}`, {
      title,
      content,
      slug,
      categoriesIds,
      imageUrl,
    });
  }

  return await api.post("/jobs", {
    title,
    content,
    slug,
    categoriesIds,
    imageUrl,
  });
}
