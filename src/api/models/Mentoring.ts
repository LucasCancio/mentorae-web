import { TTeacher } from "./Teacher";

export type TMentoring = {
  id: number;
  modality: string;
  mentoringDate: string;
  teacher: TTeacher;
};
