import { api } from "@/lib/axios";
import { IGetMentoringResponse } from "./get-mentoring";
import { IRequestWithPagination } from "../models/Pagination";

export async function getMyMentoring({
  page,
}: IRequestWithPagination): Promise<IGetMentoringResponse> {
  const response = await api.get<IGetMentoringResponse>("/mentoring/my", {
    params: {
      page,
    },
  });

  return response.data;
}
