import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

export const CreateCategoryService = async (
  payload: ICreateCategoryPayload,
) => {
  const existCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (existCategory) {
    throw new AppError(status.BAD_REQUEST, "Category already exists");
  }

  const result = await prisma.category.create({
    data: {
      ...payload,
    },
  });

  return result;
};

export const GetsCategoryService = async () => {
  const result = await prisma.category.findMany();
  return result;
};

export const GetCategoryService = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  return result;
};

export const UpdateCategoryService = async (
  id: string,
  payload: IUpdateCategoryPayload,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!category) {
    throw new AppError(status.BAD_REQUEST, "This category not here");
  }

  const result = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

export const SoftDeleteCategoryService = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!category) {
    throw new AppError(status.BAD_REQUEST, "This category not here");
  }

  const result = await prisma.category.update({
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
