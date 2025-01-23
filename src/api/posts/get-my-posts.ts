import { api } from "@/lib/axios";
import { IGetPostsQuery, IGetPostsResponse } from "./get-posts";

export async function getMyPosts({
  page,
  title,
  content,
}: IGetPostsQuery): Promise<IGetPostsResponse> {
  const response = await api.get<IGetPostsResponse>("/posts/my-posts", {
    params: {
      page,
      title,
      content,
    },
  });

  return response.data;
}
