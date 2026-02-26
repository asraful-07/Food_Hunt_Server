import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { providerProfileService } from "./providerProfile.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const profile = await providerProfileService.getAllProviderProfile();

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "ProviderProfile fetch successfully",
      data: profile,
    });
  },
);

const getSingleProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const profile = await providerProfileService.getSingleProviderProfile(
      req.params.id as string,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "ProviderProfile fetch successfully",
      data: profile,
    });
  },
);

const updateProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const profile = await providerProfileService.updateProviderProfile(
      req.params.id as string,
      user,
      payload,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "ProviderProfile updated successfully",
      data: profile,
    });
  },
);

const deleteProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    await providerProfileService.deleteProviderProfile(req.params.id as string);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "providerProfile deleted successfully",
    });
  },
);

export const providerProfileController = {
  getAllProviderProfile,
  getSingleProviderProfile,
  updateProviderProfile,
  deleteProviderProfile,
};
