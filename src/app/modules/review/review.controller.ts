import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const giveReview = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const review = await reviewService.giveReview(user, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Your review created successfully",
    data: review,
  });
});

const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.getAllReview();

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Your review created successfully",
    data: review,
  });
});

export const reviewController = {
  giveReview,
  getAllReview,
};
