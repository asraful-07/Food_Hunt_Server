import { Roles } from "../../generated/prisma/enums";

export interface IRequestUser {
  userId: string;
  role: Roles;
  email: string;
}
