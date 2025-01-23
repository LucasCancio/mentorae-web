import { api } from "@/lib/axios";

export interface IDeletePostParams {
  postId: number;
}

export async function deletePost({ postId }: IDeletePostParams) {
  return await api.delete(`/posts/${postId}`);
}
