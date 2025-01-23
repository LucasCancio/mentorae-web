import { api } from "@/lib/axios";

export interface IRegisterTeacherBody {
  name: string;
  email: string;
  password: string;
}

export async function registerTeacher({
  name,
  email,
  password,
}: IRegisterTeacherBody) {
  await api.post("/teachers", { name, email, password });
}
