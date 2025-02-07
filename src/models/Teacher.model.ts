import { TUser } from "./User.model";

export type TTeacher = TUser & {
  id: number;
  phone: string;
  personalId: string;
  isMentored: boolean;
  bio?: string | null;
};
