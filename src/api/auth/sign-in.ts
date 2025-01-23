import { api } from "@/lib/axios";

export interface ISignInBody {
  email: string;
  password: string;
}

export async function signIn({ email, password }: ISignInBody) {
  await api.post("/login", { email, password });
}
