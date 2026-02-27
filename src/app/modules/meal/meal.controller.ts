import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { mealService } from "./meal.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createMeal = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;

  const meal = await mealService.createMeal(user, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Create meal successfully",
    data: meal,
  });
});

const getAllMeal = catchAsync(async (req: Request, res: Response) => {
  const meal = await mealService.getAllMeal();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Create meal successfully",
    data: meal,
  });
});

const getMyMeal = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const meal = await mealService.getMyMeal(user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Meal fetch successfully",
    data: meal,
  });
});

const getMeal = catchAsync(async (req: Request, res: Response) => {
  const meal = await mealService.getMeal(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Meal fetch successfully",
    data: meal,
  });
});

const updateMeal = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;

  const meal = await mealService.updateMeal(
    req.params.id as string,
    user,
    payload,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Updated meal successfully",
    data: meal,
  });
});

const softDeleteMeal = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  await mealService.softDeleteMeal(req.params.id as string, user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Meal Deleted successfully",
  });
});

export const mealController = {
  createMeal,
  getAllMeal,
  getMeal,
  getMyMeal,
  updateMeal,
  softDeleteMeal,
};
