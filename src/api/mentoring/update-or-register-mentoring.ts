import { api } from "@/lib/axios";

export interface ISaveMentoringBody {
  postId?: number;
  title: string;
  content: string;
  slug: string;
  categoriesIds: number[];
  imageUrl?: string | undefined | null;
}

export async function updateOrRegisterMentoring({
  postId,
  title,
  content,
  slug,
  categoriesIds,
  imageUrl,
}: ISaveMentoringBody) {
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
