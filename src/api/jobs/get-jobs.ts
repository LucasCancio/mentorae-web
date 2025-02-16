import { api } from "@/lib/axios";
import { TJob } from "@/models/Job.model";
import {
  IRequestWithPagination,
  TMetaPagination,
} from "@/models/Pagination.model";
import { IGetTeacherResponse } from "../teacher/get-teacher";
import { UserType } from "@/models/UserType.model";

export type JobResponse = {
  job_id: number;
  title: string;
  company: string;
  job_type: string;
  modality: string;
  publication_date: string;
  link: string;
  quantity: number;
  url_image: string;
  teacher: IGetTeacherResponse;
};
interface IGetJobsResponse {
  data: JobResponse[];
  meta: TMetaPagination;
}

type JobWithPagination = {
  jobs: TJob[];
  meta: TMetaPagination;
};

export async function getJobs({
  page,
  limit,
}: IRequestWithPagination): Promise<JobWithPagination> {
  const response = await api.get<IGetJobsResponse>("/job", {
    params: {
      page,
      limit,
    },
  });

  const { data, meta } = response.data;
  return {
    meta,
    jobs: data.map(transformToJob),
  };
}

export function transformToJob(response: JobResponse): TJob {
  return {
    id: response.job_id,
    title: response.title,
    company: response.company,
    jobType: response.job_type,
    modality: response.modality,
    publicationDate: response.publication_date,
    link: response.link,
    quantity: response.quantity,
    urlImage: response.url_image,
    teacher: {
      id: response.teacher.teacher_id,
      email: response.teacher.user_account.email,
      name: response.teacher.user_account.name,
      password: response.teacher.user_account.password,
      userId: response.teacher.user_account.user_id,
      isMentored: response.teacher.is_mentored,
      userType: response.teacher.user_account.user_type as UserType,
    },
  };
}
