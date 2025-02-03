import { api } from "@/lib/axios";

export interface IRegisterStudentBody {
  email: string;
  password: string;
  name: string;
}

export async function registerStudent({
  name,
  email,
  password,
}: IRegisterStudentBody) {
  await api.post("/user/students", {
    name,
    email,
    password,
  });
}
