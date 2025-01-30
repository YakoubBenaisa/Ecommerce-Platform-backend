import { Request, Response } from "express";
import IUserService from "../services/Interfaces/IUserService";
import { injectable, inject, autoInjectable } from "tsyringe";
import ResponseUtils from "../utils/response.utils";
import "reflect-metadata";

@injectable()
export default class UserController {
  constructor(
    @inject("IUserService") private userService: IUserService,
    @inject("responseUtils") private responseUtils: ResponseUtils
  ) { }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const token = await this.userService.login(email, password);

      this.responseUtils.sendSuccessResponse(res, token);
    } catch (error: any) {
      console.log(error);
      this.responseUtils.sendErrorResponse(res, error.message);
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body;

      const tokens = await this.userService.register(email, password, username);

      this.responseUtils.sendSuccessResponse(res, tokens, 201);
    } catch (error: any) {
      console.log(error);
      this.responseUtils.sendErrorResponse(res, error.message);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      // Custom header name
      const refreshToken = req.header("x-refresh-token");

      if (!refreshToken)
        return this.responseUtils.sendBadRequestResponse(
          res,
          "Invalid refresh token "
        );

      const token = await this.userService.refreshTokens(refreshToken);

      this.responseUtils.sendSuccessResponse(res, { token });
    } catch (error: any) {
      this.responseUtils.sendErrorResponse(res, error.message);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return this.responseUtils.sendBadRequestResponse(res, "Invalid token");
      }

      await this.userService.logout(token);

      this.responseUtils.sendSuccessResponse(res, "Logged out successfully");
    } catch (error: any) {
      this.responseUtils.sendErrorResponse(res, error.message);
    }
  }
}
