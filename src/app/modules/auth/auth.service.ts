import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { getAccessToken, getRefreshToken } from "../../utils/token";
import {
  IChangeUserStatusPayload,
  ILoginCustomerPayload,
  IRegisterCustomerPayload,
  IUpdateCustomerPayload,
} from "./auth.interface";

export const CreateCustomerService = async (
  payload: IRegisterCustomerPayload,
) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new Error("Failed to create customer");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const createdCustomer = await tx.customer.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return createdCustomer;
    });

    const accessToken = getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return { ...data, result, accessToken, refreshToken };
  } catch (err) {
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw err;
  }
};

export const LoginCustomerService = async (payload: ILoginCustomerPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.SUSPEND) {
    throw new Error("User is suspend");
  }

  const accessToken = getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return { ...data, accessToken, refreshToken };
};

export const GetAllUsersService = async () => {
  const result = await prisma.user.findMany({
    include: {
      customer: true,
      provider: true,
    },
  });
  return result;
};

export const GetMeService = async (user: IRequestUser) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const result = await prisma.user.findUnique({
    where: {
      id: userData.id,
    },
    include: {
      customer: true,
      provider: true,
    },
  });

  return result;
};

export const ChangeActivateService = async (
  admin: IRequestUser,
  userId: string,
  payload: IChangeUserStatusPayload,
) => {
  const adminExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: admin.email,
    },
  });

  if (adminExist.role !== "ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to change user status",
    );
  }

  const targetUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (targetUser.id === adminExist.id) {
    throw new AppError(status.BAD_REQUEST, "You cannot change your own status");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: payload.userStatus,
    },
  });

  return updatedUser;
};

export const UpdateProfileService = async (
  id: string,
  user: IRequestUser,
  payload: IUpdateCustomerPayload,
) => {
  // 1️⃣ Check logged in user is same as updating user
  if (id !== user.userId) {
    throw new AppError(status.FORBIDDEN, "You cannot update other profile");
  }

  // 2️⃣ Find user with role
  const existingUser = await prisma.user.findUnique({
    where: { id },
    include: { customer: true },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (existingUser.role !== "CUSTOMER") {
    throw new AppError(status.BAD_REQUEST, "This is not a customer");
  }

  // 3️⃣ Transaction update (Best Practice)
  const result = await prisma.$transaction(async (tx) => {
    // Update User table
    await tx.user.update({
      where: { id },
      data: {
        name: payload.name,
      },
    });

    // Update Customer table
    const updatedCustomer = await tx.customer.update({
      where: { userId: id },
      data: {
        contactNumber: payload.contactNumber,
        address: payload.address,
        profileImage: payload.profileImage,
      },
    });

    return updatedCustomer;
  });

  return result;
};
