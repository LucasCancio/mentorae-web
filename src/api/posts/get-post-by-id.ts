import { api } from "@/lib/axios";
import { TPost } from "./get-posts";

export interface IGetPostByIdQuery {
  id: number;
}
export async function getPostById({ id }: IGetPostByIdQuery): Promise<TPost> {
  const response = await api.get<TPost>(`/posts/${id}`);
  return response.data;
}
