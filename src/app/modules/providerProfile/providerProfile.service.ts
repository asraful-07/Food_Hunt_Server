import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IUpdateRestaurantProfilePayload } from "./providerProfile.interface";

const getAllProviderProfile = async () => {
  const result = await prisma.providerProfile.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

const getSingleProviderProfile = async (id: string) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: {
      id,
    },
    include: {
      meals: true,
    },
  });

  if (!providerProfile) {
    throw new AppError(status.NOT_FOUND, "Provider profile not found");
  }

  return providerProfile;
};

const updateProviderProfile = async (
  id: string,
  user: IRequestUser,
  payload: IUpdateRestaurantProfilePayload,
) => {
  const provider = await prisma.provider.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const providerProfile = await prisma.providerProfile.findUniqueOrThrow({
    where: {
      providerId: provider.id,
    },
  });

  if (provider.email !== providerProfile.email) {
    throw new AppError(status.BAD_REQUEST, "Your not real provider");
  }

  const result = await prisma.providerProfile.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

const deleteProviderProfile = async (id: string) => {
  const result = await prisma.providerProfile.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return result;
};

export const providerProfileService = {
  getAllProviderProfile,
  getSingleProviderProfile,
  updateProviderProfile,
  deleteProviderProfile,
};
