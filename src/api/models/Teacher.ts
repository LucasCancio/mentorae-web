import { TUser } from "./User";

export type TTeacher = TUser & {
  id: number;
  phone: string;
  personalId: string;
  isMentored: boolean;
  bio?: string;
};
