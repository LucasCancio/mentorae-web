import { api } from "@/lib/axios";

export interface IUpdateTeacherBody {
  id: number;
  name: string;
  phone: string;
  email: string;
  personal_id: string;
  password?: string | null;
  is_mentored: boolean;
  bio?: string;
}

export async function updateTeacher({
  id,
  name,
  email,
  password,
  is_mentored,
  phone,
  personal_id,
  bio,
}: IUpdateTeacherBody) {
  await api.put(`/user/teachers/${id}`, {
    name,
    email,
    password,
    is_mentored,
    personal_id,
    phone,
    bio,
  });
}
