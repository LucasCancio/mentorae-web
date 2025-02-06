import { api } from "@/lib/axios";
import { TJob } from "@/models/Job.model";
import { JobResponse, transformToJob } from "./get-jobs";

export interface IGetJobByIdQuery {
  id: number;
}
export async function getJobById({ id }: IGetJobByIdQuery): Promise<TJob> {
  const response = await api.get<JobResponse>(`/job/${id}`);
  return transformToJob(response.data);
}
