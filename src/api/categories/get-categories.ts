import { api } from "@/lib/axios";

export type TCategory = {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export function getCategories(): Promise<TCategory[]> {
  return api.get("/categories").then((response) => response.data);
}
