import { api } from "@/lib/axios";

export interface ILikeMentoringParams {
  mentoringId: number;
}

export async function likeMentoring({ mentoringId }: ILikeMentoringParams) {
  return await api.get(`/mentoring/${mentoringId}/like`);
}
