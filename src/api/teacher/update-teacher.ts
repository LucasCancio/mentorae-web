import { api } from "@/lib/axios";

export interface IUpdateTeacherBody {
  id: number;
  name: string;
  email: string;
  password?: string | null;
}

export async function updateTeacher({
  id,
  name,
  email,
  password,
}: IUpdateTeacherBody) {
  await api.patch(`/teachers/${id}`, {
    name,
    email,
    password,
  });
}
