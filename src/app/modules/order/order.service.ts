import { OrderStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  ICreateOrderPayload,
  IOrderStatusUpdatePayload,
} from "./order.interface";
import status from "http-status";

const createOrder = async (
  user: IRequestUser,
  payload: ICreateOrderPayload,
) => {
  const { deliveryAddress } = payload;

  return await prisma.$transaction(
    async (tx) => {
      // 1️⃣ Find Customer
      const customer = await tx.customer.findFirstOrThrow({
        where: { email: user.email },
      });

      // 2️⃣ Get Cart
      const cart = await tx.cart.findUnique({
        where: { customerId: customer.id },
        include: {
          items: {
            include: { meal: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new AppError(status.BAD_REQUEST, "Cart is empty");
      }

      // 3️⃣ Validate Stock First (NO DB WRITE YET)
      for (const item of cart.items) {
        if (item.meal.stock < item.quantity) {
          throw new AppError(
            status.BAD_REQUEST,
            `${item.meal.name} is out of stock`,
          );
        }
      }

      // 4️⃣ Group Items By Provider
      const groupedByProvider = cart.items.reduce(
        (acc, item) => {
          const providerId = item.meal.providerId;
          if (!acc[providerId]) acc[providerId] = [];
          acc[providerId].push(item);
          return acc;
        },
        {} as Record<string, typeof cart.items>,
      );

      const createdOrders: any = [];

      // 5️⃣ Deduct All Stocks in Parallel (Fast)
      await Promise.all(
        cart.items.map((item) =>
          tx.meal.update({
            where: { id: item.mealId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        ),
      );

      // 6️⃣ Create Orders Provider-wise
      for (const providerId in groupedByProvider) {
        const providerItems = groupedByProvider[providerId];

        const totalPrice = providerItems.reduce(
          (sum, item) => sum + item.quantity * item.meal.price,
          0,
        );

        const orderItemsData = providerItems.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
          price: item.meal.price,
        }));

        const order = await tx.order.create({
          data: {
            customerId: customer.id,
            providerId,
            totalPrice,
            deliveryAddress,
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: {
              include: { meal: true },
            },
          },
        });

        createdOrders.push(order);
      }

      // 7️⃣ Clear Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return createdOrders;
    },
    {
      timeout: 20000,
    },
  );
};

const getMyOrders = async (user: IRequestUser) => {
  const customer = await prisma.customer.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const result = await prisma.order.findMany({
    where: {
      customerId: customer.id,
      isDeleted: false,
    },
    include: {
      provider: true,
      items: {
        include: {
          meal: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getProviderOrders = async (user: IRequestUser) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!providerProfile) {
    throw new AppError(status.FORBIDDEN, "You are not a valid provider");
  }

  const result = await prisma.order.findMany({
    where: {
      providerId: providerProfile.id,
      isDeleted: false,
    },
    include: {
      customer: true,
      items: {
        include: {
          meal: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getsAllOrders = async () => {
  const result = await prisma.order.findMany({
    include: {
      customer: true,
      items: {
        include: {
          meal: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getSingleOrder = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: {
      id: id,
    },
    include: {
      provider: true,
      items: {
        include: {
          meal: true,
        },
      },
    },
  });
  return result;
};

const updateOrderStatus = async (
  orderId: string,
  user: IRequestUser,
  payload: IOrderStatusUpdatePayload,
) => {
  const { status: newStatus } = payload;
  const providerExist = await prisma.providerProfile.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!providerExist) {
    throw new AppError(status.FORBIDDEN, "You are not a valid provider");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError(status.NOT_FOUND, "Order not found");
  }

  const validTransitions: Record<string, string> = {
    PLACED: "PREPARING",
    PREPARING: "READY",
    READY: "DELIVERED",
  };

  if (validTransitions[order.status] !== newStatus) {
    throw new AppError(
      status.BAD_REQUEST,
      `Invalid status transition from ${order.status} to ${newStatus}`,
    );
  }

  const result = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: newStatus,
    },
  });

  return result;
};

const updateCustomerOrderStatus = async (
  orderId: string,
  user: IRequestUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!customer) {
    throw new AppError(status.NOT_FOUND, "Order not found");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new AppError(status.NOT_FOUND, "Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CANCELLED",
    },
  });

  return updatedOrder;
};

export const OrderService = {
  createOrder,
  getMyOrders,
  getProviderOrders,
  getsAllOrders,
  getSingleOrder,
  updateOrderStatus,
  updateCustomerOrderStatus,
};
