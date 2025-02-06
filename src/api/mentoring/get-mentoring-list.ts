import { api } from "@/lib/axios";
import { TMentoring } from "@/models/Mentoring.model";
import {
  TMetaPagination,
  IRequestWithPagination,
} from "@/models/Pagination.model";
import { IGetTeacherResponse } from "../teacher/get-teacher";
import { UserType } from "@/models/UserType.model";

export type MentoringResponse = {
  matter: string;
  mentoring_date: string;
  mentoring_id: number;
  modality: string;
  likes: string;
  has_liked: boolean;
  teacher: IGetTeacherResponse;
};

interface IGetMentoringResponse {
  data: MentoringResponse[];
  meta: TMetaPagination;
}

type MentoringWithPagination = {
  mentoring: TMentoring[];
  meta: TMetaPagination;
};

export async function getMentoringList({
  page,
  limit,
}: IRequestWithPagination): Promise<MentoringWithPagination> {
  const response = await api.get<IGetMentoringResponse>("/mentoring", {
    params: {
      page,
      limit,
    },
  });

  const { data, meta } = response.data;
  return {
    meta,
    mentoring: data.map(transformToMentoring),
  };
}

export function transformToMentoring(response: MentoringResponse): TMentoring {
  return {
    id: response.mentoring_id,
    hasLiked: response.has_liked,
    likes: Number(response.likes) || 0,
    matter: response.matter,
    mentoringDate: response.mentoring_date,
    modality: response.modality,
    teacher: {
      id: response.teacher.teacher_id,
      email: response.teacher.user_account.email,
      name: response.teacher.user_account.name,
      password: response.teacher.user_account.password,
      userId: response.teacher.user_account.user_id,
      isMentored: response.teacher.is_mentored,
      userType: response.teacher.user_account.user_type as UserType,
    },
  };
}
