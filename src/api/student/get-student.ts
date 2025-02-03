import { api } from "@/lib/axios";
import { TStudent } from "../models/Student";
import { UserType } from "../auth/sign-in";

interface IGetStudentResponse {
  student_id: number;
  user_account: {
    user_id: number;
    user_type: string;
    name: string;
    email: string;
    password: string;
  };
}

export async function getStudent(id: number): Promise<TStudent> {
  const result = (await api
    .get(`/user/students/${id}`)
    .then((response) => response.data)) as IGetStudentResponse;

  return {
    id: result.student_id,
    email: result.user_account.email,
    name: result.user_account.name,
    password: result.user_account.password,
    userId: result.user_account.user_id,
    userType: result.user_account.user_type as UserType,
  };
}
