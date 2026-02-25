import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import {
  CreateCategoryService,
  GetCategoryService,
  GetsCategoryService,
  SoftDeleteCategoryService,
  UpdateCategoryService,
} from "./category.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

export const CreateCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await CreateCategoryService(payload);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Create category successfully",
      data: result,
    });
  },
);

export const GetsCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await GetsCategoryService();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Create category successfully",
      data: result,
    });
  },
);

export const GetCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await GetCategoryService(id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Category fetch successfully",
      data: result,
    });
  },
);

export const UpdateCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await UpdateCategoryService(
      req.params.id as string,
      payload,
    );
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Updated category successfully",
      data: result,
    });
  },
);

export const SoftDeleteCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SoftDeleteCategoryService(id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Category fetch successfully",
      data: result,
    });
  },
);
