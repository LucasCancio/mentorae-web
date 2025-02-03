import { api } from "@/lib/axios";

export interface IDeleteMentoringParams {
  mentoringId: number;
}

export async function deleteMentoring({ mentoringId }: IDeleteMentoringParams) {
  return await api.delete(`/mentoring/${mentoringId}`);
}
