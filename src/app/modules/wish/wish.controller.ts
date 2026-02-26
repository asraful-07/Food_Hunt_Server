import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { wishService } from "./wish.service";

const addToWish = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await wishService.addToWish(user, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Add to Wish successfully",
    data: result,
  });
});

const myWish = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await wishService.myWish(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Wish data fetch successfully",
    data: result,
  });
});

const deleteWish = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  await wishService.deleteWish(user, payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Wish Delete successfully",
  });
});

const clearWish = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  await wishService.clearWish(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Wish clear successfully",
  });
});

export const wishController = {
  addToWish,
  myWish,
  deleteWish,
  clearWish,
};
