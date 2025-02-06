import { api } from "@/lib/axios";

export interface IDeleteJobParams {
  jobId: number;
}

export async function deleteJob({ jobId }: IDeleteJobParams) {
  return await api.delete(`/job/${jobId}`);
}
