import { api } from "@/lib/axios";
import { TMentoring } from "@/models/Mentoring.model";
import { MentoringResponse, transformToMentoring } from "./get-mentoring-list";
export interface IGetJobByIdQuery {
  id: number;
}

export async function getMentoringById({
  id,
}: IGetJobByIdQuery): Promise<TMentoring> {
  const response = await api.get<MentoringResponse[]>(`/mentoring/${id}`);
  return transformToMentoring(response.data[0]);
}
