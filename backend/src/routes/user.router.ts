import { Router, Request, Response } from "express";
import { container } from "../config/container";
import UserController from "../controllers/user.controller";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validation/user.validation";
import authMiddleware from "../middlewares/auth.middlware";

const userRouter = Router();
const userController = container.resolve(UserController);

userRouter.post(
  "/login",
  validateRequest(userLoginSchema),
  async (req: Request, res: Response) => {
    await userController.login(req, res);
  }
);
userRouter.post(
  "/register",
  validateRequest(userRegistrationSchema),
  async (req: Request, res: Response) => await userController.register(req, res)
);

userRouter.post(
  "/refresh-token",
  async (req: Request, res: Response): Promise<any> =>
    await userController.refreshToken(req, res)
);

userRouter.post(
  "/logout",
  authMiddleware,
  async (req: Request, res: Response): Promise<any> =>
    await userController.logout(req, res)
);

export default userRouter;
