import { api } from "@/lib/axios";

export interface IUnlikeMentoringParams {
  mentoringId: number;
}

export async function unlikeMentoring({ mentoringId }: IUnlikeMentoringParams) {
  return await api.get(`/mentoring/${mentoringId}/dislike`);
}
