import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const giveReview = async (
  user: IRequestUser,
  payload: ICreateReviewPayload,
) => {
  const customer = await prisma.customer.findUniqueOrThrow({
    where: { email: user.email },
  });

  const order = await prisma.order.findUniqueOrThrow({
    where: { id: payload.orderId },
    include: {
      items: true,
    },
  });

  if (order.customerId !== customer.id) {
    throw new AppError(
      status.BAD_REQUEST,
      "You can only review your own order",
    );
  }

  if (order.status !== "DELIVERED") {
    throw new AppError(
      status.BAD_REQUEST,
      "You can only review after delivery",
    );
  }

  const orderedMeal = order.items.find(
    (item) => item.mealId === payload.mealId,
  );

  if (!orderedMeal) {
    throw new AppError(
      status.BAD_REQUEST,
      "This meal does not belong to this order",
    );
  }

  const alreadyReviewed = await prisma.review.findFirst({
    where: {
      mealId: payload.mealId,
      orderId: payload.orderId,
      customerId: customer.id,
    },
  });

  if (alreadyReviewed) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already reviewed this meal",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        customerId: customer.id,
        mealId: payload.mealId,
        orderId: payload.orderId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });

    const averageRating = await tx.review.aggregate({
      where: {
        mealId: payload.mealId,
        isDeleted: false,
      },
      _avg: {
        rating: true,
      },
    });

    await tx.meal.update({
      where: {
        id: payload.mealId,
      },
      data: {
        averageRating: averageRating._avg.rating ?? 0,
      },
    });

    return { message: "Review added successfully" };
  });

  return result;
};

const getAllReview = async () => {
  const result = await prisma.review.findMany({
    include: {
      meal: true,
      customer: true,
      order: true,
    },
  });
  return result;
};

export const reviewService = {
  giveReview,
  getAllReview,
};
