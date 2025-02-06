import { TTeacher } from "./Teacher.model";

export type TMentoring = {
  id: number;
  hasLiked: boolean;
  likes: number;
  modality: string;
  matter: string;
  mentoringDate: string;
  teacher: Partial<TTeacher>;
};
