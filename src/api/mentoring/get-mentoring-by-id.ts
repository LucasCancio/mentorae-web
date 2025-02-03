import { api } from "@/lib/axios";
import { TJob } from "../models/Job";

export interface IGetJobByIdQuery {
  id: number;
}
export async function getMentoringById({
  id,
}: IGetJobByIdQuery): Promise<TJob> {
  const response = await api.get<TJob>(`/mentoring/${id}`);
  return response.data;
}
