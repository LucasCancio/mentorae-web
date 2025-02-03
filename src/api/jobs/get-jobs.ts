import { api } from "@/lib/axios";
import { TJob } from "../models/Job";
import { IRequestWithPagination, TMetaPagination } from "../models/Pagination";

export interface IGetJobsResponse {
  jobs: TJob[];
  meta: TMetaPagination;
}

export async function getJobs({
  page,
}: IRequestWithPagination): Promise<IGetJobsResponse> {
  const response = await api.get<IGetJobsResponse>("/jobs", {
    params: {
      page,
    },
  });

  return response.data;
}
