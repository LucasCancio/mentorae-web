import { api } from "@/lib/axios";

export interface ISignInBody {
  email: string;
  password: string;
}

export type UserType = "Teacher" | "Student";

export interface ISignInResponse {
  token: string;
  user_type: UserType;
  user_id: number;
}

export async function signIn({ email, password }: ISignInBody) {
  var response = await api.post("/user/login", {
    email,
    password,
  });
  return response.data as ISignInResponse;
}
