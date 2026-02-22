import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { CreateCategoryService, GetsCategoryService } from "./category.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

export const CreateCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await CreateCategoryService(payload);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Create category",
      data: result,
    });
  },
);

export const GetsCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await GetsCategoryService();
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Create category",
      data: result,
    });
  },
);
