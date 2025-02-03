import { api } from "@/lib/axios";

export interface IUpdateStudentBody {
  id: number;
  name: string;
  email: string;
  password?: string | null;
}

export async function updateStudent({
  id,
  email,
  name,
  password,
}: IUpdateStudentBody) {
  await api.put(`/user/students/${id}`, {
    name,
    email,
    password,
  });
}
