import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateMealPayload, IUpdateMealPayload } from "./meal.interface";
import { IRequestUser } from "../../interface/requestUser.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interface/query.interface";
import { Meal, Prisma } from "../../../generated/prisma/client";
import {
  mealFilterableFields,
  mealIncludeConfig,
  mealSearchableFields,
} from "./meal.constant";

const createMeal = async (user: IRequestUser, payload: ICreateMealPayload) => {
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

  const categoryExist = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!categoryExist) {
    throw new AppError(status.BAD_REQUEST, "Category is missing");
  }

  if (payload.price <= 0) {
    throw new AppError(status.BAD_REQUEST, "Price must be greater than 0");
  }

  const result = await prisma.meal.create({
    data: {
      providerId: providerProfile.id,
      ...payload,
    },
  });

  return result;
};

const getAllMeal = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Meal,
    Prisma.MealWhereInput,
    Prisma.MealInclude
  >(prisma.meal, query, {
    searchableFields: mealSearchableFields,
    filterableFields: mealFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ isDeleted: false })
    .include({
      provider: true,
      category: true,
    })
    .dynamicInclude(mealIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getMyMeal = async (user: IRequestUser) => {
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

  const result = await prisma.meal.findMany({
    where: {
      providerId: providerProfile.id,
      isDeleted: false,
    },
    include: {
      category: true,
      provider: true,
    },
  });

  return result;
};

const getMeal = async (mealId: string) => {
  const mealExist = await prisma.meal.findUniqueOrThrow({
    where: {
      id: mealId,
    },
  });

  const result = await prisma.meal.findUnique({
    where: {
      id: mealExist.id,
    },
    include: {
      category: true,
      provider: true,
      reviews: true,
    },
  });
  return result;
};

const updateMeal = async (
  mealId: string,
  user: IRequestUser,
  payload: IUpdateMealPayload,
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
    throw new AppError(status.BAD_REQUEST, "Do not match email");
  }

  const result = await prisma.meal.update({
    where: {
      id: mealId,
    },
    data: {
      providerId: providerProfile.id,
      ...payload,
    },
  });

  return result;
};

const softDeleteMeal = async (id: string, user: IRequestUser) => {
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
    throw new AppError(status.BAD_REQUEST, "Do not match email");
  }

  const result = await prisma.meal.update({
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

export const mealService = {
  createMeal,
  getAllMeal,
  getMeal,
  getMyMeal,
  updateMeal,
  softDeleteMeal,
};
