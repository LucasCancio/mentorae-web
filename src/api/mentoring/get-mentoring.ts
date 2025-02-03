import { api } from "@/lib/axios";
import { IRequestWithPagination, TMetaPagination } from "../models/Pagination";
import { TMentoring } from "../models/Mentoring";

export interface IGetMentoringResponse {
  mentoring: TMentoring[];
  meta: TMetaPagination;
}

export async function getMentoring({
  page,
}: IRequestWithPagination): Promise<IGetMentoringResponse> {
  const response = await api.get<IGetMentoringResponse>("/mentoring", {
    params: {
      page,
    },
  });

  return response.data;
}
