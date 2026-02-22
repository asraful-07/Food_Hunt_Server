import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IAddToCartPayload } from "./cart.interface";

const addToCart = async (user: IRequestUser, payload: IAddToCartPayload) => {
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

    const cartExist = await tx.cart.findUnique({
      where: {
        customerId: customer.id,
      },
      include: {
        items: true,
      },
    });

    if (!cartExist) {
      const cart = await tx.cart.create({
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
      return cart;
    }

    const existingItem = cartExist.items.find((item) => item.mealId === mealId);

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

    const newItem = await tx.cartItem.create({
      data: {
        cartId: cartExist.id,
        mealId,
        quantity,
      },
    });
    return newItem;
  });
};

const myCart = async (user: IRequestUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      userId: user.userId,
    },
  });

  if (!customer) {
    throw new AppError(status.NOT_FOUND, "Customer not found");
  }

  const cart = await prisma.cart.findUnique({
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
  return cart;
};

const deleteCart = async (user: IRequestUser, mealId: string) => {
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!customer) {
      throw new AppError(status.NOT_FOUND, "Customer not found");
    }

    const cartExist = await tx.cart.findUnique({
      where: {
        customerId: customer.id,
      },
      include: {
        items: true,
      },
    });

    if (!cartExist) {
      throw new AppError(status.NOT_FOUND, "Cart not found");
    }

    const itemExist = cartExist.items.find((item) => item.mealId === mealId);

    if (!itemExist) {
      throw new AppError(status.NOT_FOUND, "Item not found in cart");
    }

    await tx.cartItem.delete({
      where: {
        id: itemExist.id,
      },
    });

    return { message: "Item deleted from cart successfully" };
  });
};

const clearCart = async (user: IRequestUser) => {
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!customer) {
      throw new AppError(status.NOT_FOUND, "Customer not found");
    }

    const cartExist = await tx.cart.findUnique({
      where: {
        customerId: customer.id,
      },
      include: {
        items: true,
      },
    });

    if (!cartExist) {
      throw new AppError(status.NOT_FOUND, "Cart already empty");
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cartExist.id,
      },
    });
    return { message: "Cart cleared successfully" };
  });
};

export const cartService = {
  addToCart,
  myCart,
  deleteCart,
  clearCart,
};
