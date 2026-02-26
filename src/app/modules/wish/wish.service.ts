import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IAddToWishPayload } from "./wish.interface";

const addToWish = async (user: IRequestUser, payload: IAddToWishPayload) => {
  const { mealId, quantity = 1 } = payload;
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!customer) {
      throw new AppError(status.NOT_FOUND, "Customer not found");
    }

    const wishExist = await tx.wish.findUnique({
      where: {
        customerId: customer.id,
      },
      include: {
        items: true,
      },
    });

    if (!wishExist) {
      const wish = await tx.wish.create({
        data: {
          customerId: customer.id,
          items: {
            create: {
              mealId,
              quantity,
            },
          },
        },
        include: {
          items: true,
        },
      });
      return wish;
    }

    const existingItem = wishExist.items.find((item) => item.mealId === mealId);

    if (existingItem) {
      const updateItem = await tx.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
      return updateItem;
    }

    const newItem = await tx.wishItem.create({
      data: {
        cartId: wishExist.id,
        mealId,
        quantity,
      },
    });
    return newItem;
  });
};

const myWish = async (user: IRequestUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      userId: user.userId,
    },
  });

  if (!customer) {
    throw new AppError(status.NOT_FOUND, "Customer not found");
  }

  const wish = await prisma.wish.findUnique({
    where: {
      customerId: customer.id,
    },
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
  });
  return wish;
};

const deleteWish = async (user: IRequestUser, mealId: string) => {
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!customer) {
      throw new AppError(status.NOT_FOUND, "Customer not found");
    }

    const wishExist = await tx.wish.findUnique({
      where: {
        customerId: customer.id,
      },
      include: {
        items: true,
      },
    });

    if (!wishExist) {
      throw new AppError(status.NOT_FOUND, "Wish not found");
    }

    const itemExist = wishExist.items.find((item) => item.mealId === mealId);

    if (!itemExist) {
      throw new AppError(status.NOT_FOUND, "Item not found in wish");
    }

    await tx.wishItem.delete({
      where: {
        id: itemExist.id,
      },
    });

    return { message: "Item deleted from wish successfully" };
  });
};

const clearWish = async (user: IRequestUser) => {
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!customer) {
      throw new AppError(status.NOT_FOUND, "Customer not found");
    }

    const wishExist = await tx.wish.findUnique({
      where: {
        customerId: customer.id,
      },
      include: {
        items: true,
      },
    });

    if (!wishExist) {
      throw new AppError(status.NOT_FOUND, "Wish already empty");
    }

    await tx.wishItem.deleteMany({
      where: {
        cartId: wishExist.id,
      },
    });
    return { message: "Wish cleared successfully" };
  });
};

export const wishService = {
  addToWish,
  myWish,
  deleteWish,
  clearWish,
};
