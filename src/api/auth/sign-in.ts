import { api } from "@/lib/axios";
import { UserType } from "@/models/UserType.model";

export interface ISignInBody {
  email: string;
  password: string;
}

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
  const data = response.data as ISignInResponse;
  api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

  return data;
}
