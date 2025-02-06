import { TUser } from "./User.model";

export type TStudent = TUser & {
  id: number;
};
