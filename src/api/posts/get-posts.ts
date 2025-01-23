import { api } from "@/lib/axios";
import { TCategory } from "../categories/get-categories";
import { TTeacher } from "../auth/get-profile";

export type IPostSortBy = "title" | "content" | "createdAt" | "updatedAt";

export interface IGetPostsQuery {
  page?: number | null;
  perPage?: number | null;
  title?: string | null;
  content?: string | null;
}

export type TMetaPost = {
  page: number;
  pageIndex: number;
  perPage: number;
  totalCount: number;
};

export type TPost = {
  id: number;
  authorId: number;
  content: string;
  title: string;
  slug: string | null;
  imageUrl: string | null;
  categories: TCategory[];
  teacher: TTeacher;
  createdAt: string;
  updatedAt: string;
};

export interface IGetPostsResponse {
  posts: TPost[];
  meta: TMetaPost;
}

export async function getPosts({
  page,
  title,
  content,
}: IGetPostsQuery): Promise<IGetPostsResponse> {
  const response = await api.get<IGetPostsResponse>("/posts/search", {
    params: {
      page,
      title,
      content,
    },
  });

  return response.data;
}
