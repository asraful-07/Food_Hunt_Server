import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { OrderStatus, Roles } from "../../../generated/prisma/enums";

const getDashboardStatsData = async (user: IRequestUser) => {
  switch (user.role) {
    case Roles.ADMIN:
      return getAdminStats();

    case Roles.PROVIDER:
      return getProviderStats(user);

    case Roles.CUSTOMER:
      return getCustomerStats(user);

    default:
      throw new AppError(status.BAD_REQUEST, "Invalid user role");
  }
};

const getAdminStats = async () => {
  const mealCount = await prisma.meal.count({
    where: { isDeleted: false },
  });

  const providerCount = await prisma.provider.count();
  const customerCount = await prisma.customer.count();
  const orderCount = await prisma.order.count();
  const categoryCount = await prisma.category.count();

  const deliveredOrders = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      status: OrderStatus.DELIVERED,
    },
  });

  const pieChartData = await getOrderStatusDistribution();
  const barChartData = await getMonthlyOrderData();

  return {
    mealCount,
    providerCount,
    customerCount,
    orderCount,
    categoryCount,
    totalRevenue: deliveredOrders._sum.totalPrice || 0,
    pieChartData,
    barChartData,
  };
};

const getProviderStats = async (user: IRequestUser) => {
  const provider = await prisma.providerProfile.findUniqueOrThrow({
    where: { email: user.email },
  });

  const mealCount = await prisma.meal.count({
    where: {
      providerId: provider.id,
      isDeleted: false,
    },
  });

  const orderCount = await prisma.order.count({
    where: {
      providerId: provider.id,
      isDeleted: false,
    },
  });

  const deliveredRevenue = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      providerId: provider.id,
      status: "DELIVERED",
      isDeleted: false,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      meal: {
        providerId: provider.id,
      },
      isDeleted: false,
    },
  });

  const orderStatusDistribution = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      providerId: provider.id,
      isDeleted: false,
    },
  });

  const formattedOrderStatus = orderStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: _count.id,
    }),
  );

  return {
    mealCount,
    orderCount,
    reviewCount,
    totalRevenue: deliveredRevenue._sum.totalPrice || 0,
    orderStatusDistribution: formattedOrderStatus,
  };
};

const getCustomerStats = async (user: IRequestUser) => {
  const customer = await prisma.customer.findUniqueOrThrow({
    where: { email: user.email },
  });

  const orderCount = await prisma.order.count({
    where: { customerId: customer.id },
  });

  const deliveredOrders = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      customerId: customer.id,
      status: OrderStatus.DELIVERED,
    },
  });

  const reviewCount = await prisma.review.count({
    where: { customerId: customer.id },
  });

  return {
    orderCount,
    reviewCount,
    totalSpent: deliveredOrders._sum.totalPrice || 0,
  };
};

const getOrderStatusDistribution = async () => {
  const data = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  return data.map(({ status, _count }) => ({
    status,
    count: _count.id,
  }));
};

const getMonthlyOrderData = async () => {
  const result = await prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") AS month,
      COUNT(*)::int AS count
      FROM "Order"
      GROUP BY month
      ORDER BY month ASC;
    `;

  return result;
};

export const StatsService = {
  getDashboardStatsData,
};
