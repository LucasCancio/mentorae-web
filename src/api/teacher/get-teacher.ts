import { api } from "@/lib/axios";
import { TTeacher } from "../models/Teacher";
import { UserType } from "../auth/sign-in";

interface IGetTeacherResponse {
  teacher_id: number;
  personal_id: string;
  phone: string;
  is_mentored: boolean;
  bio: string;
  user_account: {
    user_id: number;
    user_type: string;
    name: string;
    email: string;
    password: string;
  };
  //TODO: Ajustar
  mentoring: any[];
}

export async function getTeacher(id: number): Promise<TTeacher> {
  const result = (await api
    .get(`/user/teachers/${id}`)
    .then((response) => response.data)) as IGetTeacherResponse;

  return {
    id: result.teacher_id,
    email: result.user_account.email,
    name: result.user_account.name,
    phone: result.phone,
    personalId: result.personal_id,
    isMentored: result.is_mentored,
    bio: result.bio,

    password: result.user_account.password,
    userId: result.user_account.user_id,
    userType: result.user_account.user_type as UserType,
  };
}
