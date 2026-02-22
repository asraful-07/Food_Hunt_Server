import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { CreateCustomerService, LoginCustomerService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import {
  setAccessTokenCookie,
  setBetterAuthSessionCookie,
  setRefreshTokenCookie,
} from "../../utils/token";
import status from "http-status";

export const CreateCustomerController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CreateCustomerService(req.body);
    const { accessToken, refreshToken, token, ...rest } = result;

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
    setBetterAuthSessionCookie(res, token as string);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Create user Successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest,
      },
    });
  },
);

export const LoginCustomerController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await LoginCustomerService(req.body);

    const { accessToken, refreshToken, token, ...rest } = result;

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
    setBetterAuthSessionCookie(res, token as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Create user Successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest,
      },
    });
  },
);
