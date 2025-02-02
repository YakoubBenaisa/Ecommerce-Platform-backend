import { Router, Request, Response, NextFunction } from "express";
import { container } from "../config/container";
import UserController from "../controllers/user.controller";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validations/user.validation";
import authMiddleware from "../middlewares/auth.middlware";

const userRouter = Router();
const userController = container.resolve(UserController);

userRouter.post(
  "/login",
  validateRequest(userLoginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.login(req, res, next);
  }
);
userRouter.post(
  "/register",
  validateRequest(userRegistrationSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    await userController.register(req, res, next)
);

userRouter.post(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction): Promise<any> =>
    await userController.refreshToken(req, res, next)
);

userRouter.post(
  "/logout",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<any> =>
    await userController.logout(req, res, next)
);

export default userRouter;
