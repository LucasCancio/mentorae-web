import { api } from "@/lib/axios";

export interface IRegisterTeacherBody {
  name: string;
  phone: string;
  email: string;
  password: string;
  personal_id: string;
  is_mentored: boolean;
  bio?: string;
}

export async function registerTeacher({
  name,
  email,
  password,
  is_mentored,
  phone,
  personal_id,
  bio,
}: IRegisterTeacherBody) {
  await api.post("/user/teachers", {
    name,
    email,
    password,
    is_mentored,
    phone,
    personal_id,
    bio,
  });
}
