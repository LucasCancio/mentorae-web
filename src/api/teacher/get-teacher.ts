import { api } from "@/lib/axios";
import { TTeacher } from "@/models/Teacher.model";
import { UserType } from "@/models/UserType.model";

export interface IGetTeacherResponse {
  teacher_id: number;
  personal_id: string;
  phone: string;
  is_mentored: boolean;
  bio: string | null;
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
    .then((response) => response.data)) as IGetTeacherResponse[];

  return transformToTeacherType(result[0]);
}

export function transformToTeacherType(
  response: IGetTeacherResponse
): TTeacher {
  return {
    id: response.teacher_id,
    email: response.user_account.email,
    name: response.user_account.name,
    phone: response.phone,
    personalId: response.personal_id,
    isMentored: response.is_mentored,
    bio: response.bio || undefined,
    password: response.user_account.password,
    userId: response.user_account.user_id,
    userType: response.user_account.user_type as UserType,
  };
}
