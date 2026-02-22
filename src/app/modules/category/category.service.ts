import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload } from "./category.interface";

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
