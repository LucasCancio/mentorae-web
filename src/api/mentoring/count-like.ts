import { api } from "@/lib/axios";

export interface ICountLikeMentoringParams {
  mentoringId: number;
}

export async function countLikeMentoring({
  mentoringId,
}: ICountLikeMentoringParams): Promise<number> {
  var result = await api.get<{ likes: string }>(
    `/mentoring/${mentoringId}/count`
  );
  return Number(result.data.likes) || 0;
}
