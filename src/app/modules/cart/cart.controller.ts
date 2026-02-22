import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { cartService } from "./cart.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await cartService.addToCart(user, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Add to Cart successfully",
    data: result,
  });
});
const myCart = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await cartService.myCart(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Cart data fetch successfully",
    data: result,
  });
});

const deleteCart = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  await cartService.deleteCart(user, payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Cart Delete successfully",
  });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  await cartService.clearCart(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Cart clear successfully",
  });
});

export const cartController = {
  addToCart,
  myCart,
  deleteCart,
  clearCart,
};
