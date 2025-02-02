import { Request, Response, NextFunction } from "express";
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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const token = await this.userService.login(email, password);

      this.responseUtils.sendSuccessResponse(res, token);
    } catch (error: any) {
      next(error);
      
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username } = req.body;

      const tokens = await this.userService.register(email, password, username);

      this.responseUtils.sendSuccessResponse(res, tokens, 201);
    } catch (error: any) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Custom header name
      const refreshToken = req.header("x-refresh-token");

      if (!refreshToken)
        throw new Error("Invalid refresh token ");

      const token = await this.userService.refreshTokens(refreshToken);

      this.responseUtils.sendSuccessResponse(res, { token });
    } catch (error: any) {
      next(error);
    }
  }

  async logout(req: Request, res:   Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) throw new Error("Invalid refresh token ");

      await this.userService.logout(token);

      this.responseUtils.sendSuccessResponse(res, "Logged out successfully");
    } catch (error: any) {
      next(error);
    }
  }
}
