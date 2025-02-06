import { api } from "@/lib/axios";

export interface ISaveJobBody {
  jobId?: number;
  title: string;
  company: string;
  job_type: string;
  modality: string;
  publication_date: string;
  link: string;
  quantity: number;
  url_image: string;
  teacher_id: number;
}

export async function updateOrRegisterJob({
  jobId,
  title,
  company,
  job_type,
  modality,
  publication_date,
  link,
  quantity,
  url_image,
  teacher_id,
}: ISaveJobBody) {
  if (jobId) {
    return await api.put(`/job/${jobId}`, {
      title,
      company,
      job_type,
      modality,
      publication_date,
      link,
      quantity,
      url_image,
      teacher_id,
    });
  }

  return await api.post("/job", {
    title,
    company,
    job_type,
    modality,
    publication_date,
    link,
    quantity,
    url_image,
    teacher_id,
  });
}
