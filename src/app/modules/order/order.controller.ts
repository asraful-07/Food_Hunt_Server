import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { OrderService } from "./order.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const result = await OrderService.createOrder(user, payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Meal created successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await OrderService.getMyOrders(user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Meal fetch successfully",
    data: result,
  });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await OrderService.getProviderOrders(user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Meal fetch successfully",
    data: result,
  });
});

const getsAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getsAllOrders();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Meal fetch successfully",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getSingleOrder(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Meal fetch successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await OrderService.updateOrderStatus(
    req.params.id as string,
    user,
    payload,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Meal updated successfully",
    data: result,
  });
});

const updateCustomerOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await OrderService.updateCustomerOrderStatus(
      req.params.id as string,
      user,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Meal updated successfully",
      data: result,
    });
  },
);

export const OrderController = {
  createOrder,
  getMyOrders,
  getProviderOrders,
  getsAllOrders,
  getSingleOrder,
  updateOrderStatus,
  updateCustomerOrderStatus,
};
