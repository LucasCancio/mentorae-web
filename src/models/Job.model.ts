import { TTeacher } from "./Teacher.model";

export type TJob = {
  id: number;
  title: string;
  company: string;
  jobType: string;
  modality: string;
  publicationDate: string;
  link: string;
  quantity: number;
  urlImage: string;
  teacher: Partial<TTeacher>;
};
