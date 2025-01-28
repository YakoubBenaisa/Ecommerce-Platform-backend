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
  (req: Request, res: Response) => {
    userController.login(req, res);
  }
);
userRouter.post(
  "/register",
  validateRequest(userRegistrationSchema),
  (req: Request, res: Response) => userController.register(req, res)
);

userRouter.post(
  "/refresh-token",
  (req: Request, res: Response): Promise<any> =>
    userController.refreshToken(req, res)
);

userRouter.post(
  "/logout",
  authMiddleware,
  (req: Request, res: Response): Promise<any> => userController.logout(req, res)
);

export default userRouter;
