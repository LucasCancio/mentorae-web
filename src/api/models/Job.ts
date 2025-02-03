import { TTeacher } from "./Teacher";

export type TJob = {
  id: number;
  authorId: number;
  content: string;
  title: string;
  slug: string | null;
  imageUrl: string | null;
  teacher: TTeacher;
  createdAt: string;
  updatedAt: string;
};
