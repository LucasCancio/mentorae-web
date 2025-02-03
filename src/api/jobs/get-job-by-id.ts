import { api } from "@/lib/axios";
import { TJob } from "../models/Job";

export interface IGetJobByIdQuery {
  id: number;
}
export async function getJobById({ id }: IGetJobByIdQuery): Promise<TJob> {
  const response = await api.get<TJob>(`/jobs/${id}`);
  return response.data;
}
