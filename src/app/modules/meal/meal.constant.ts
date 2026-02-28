import { Prisma } from "../../../generated/prisma/client";

export const mealSearchableFields = ["name", "provider.restaurantName"];

export const mealFilterableFields = [
  "categoryId",
  "isDeleted",
  "dietaryPreferences",
  "price",
  "isAvailable",
  "averageRating",
  "provider.restaurantName",
];

export const mealIncludeConfig: Partial<
  Record<keyof Prisma.MealInclude, Prisma.MealInclude[keyof Prisma.MealInclude]>
> = {
  provider: true,
  category: true,
  reviews: true,
};
