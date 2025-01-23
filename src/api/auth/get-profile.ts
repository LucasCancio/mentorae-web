import { api } from "@/lib/axios";

export type TTeacher = {
  id: number;
  name: string;
  email: string;
};

export function getProfile(): Promise<TTeacher> {
  return api.get("/profile").then((response) => response.data);
}
