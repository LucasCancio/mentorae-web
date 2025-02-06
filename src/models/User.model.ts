import { UserType } from "./UserType.model";

export type TUser = {
  userId: number;
  userType: UserType;
  name: string;
  email: string;
  password: string;
};
