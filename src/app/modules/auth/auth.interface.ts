import { Gender, UserStatus } from "../../../generated/prisma/enums";

export interface IRegisterCustomerPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginCustomerPayload {
  email: string;
  password: string;
}

export interface IChangeUserStatusPayload {
  userStatus: UserStatus;
}

export interface IUpdateCustomerPayload {
  name: string;
  email: string;
  profileImage: string;
  contactNumber: string;
  address: string;
}
