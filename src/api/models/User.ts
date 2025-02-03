import { UserType } from "../auth/sign-in";

export type TUser = {
  userId: number;
  userType: UserType;
  name: string;
  email: string;
  password: string;
};
