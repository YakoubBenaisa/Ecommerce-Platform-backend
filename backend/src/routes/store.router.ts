import { Router, Request, Response, NextFunction } from "express";
import { container } from "../config/container";
import StoreController from "../controllers/store.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import {
  storeCreateSchema,
  storeUpdateSchema,
} from "../validations/store.validation";

const storeRouter = Router();
const storeController = container.resolve(StoreController);

storeRouter.post(
  "/",
  authMiddleware,
  validateRequest(storeCreateSchema),

  async (req: Request, res: Response, next: NextFunction): Promise<any> =>
    await storeController.createStore(req, res, next)
);

storeRouter.put(
  "/:id",
  authMiddleware,
  validateRequest(storeUpdateSchema),

  async (req: Request, res: Response, next: NextFunction): Promise<any> =>
    await storeController.updateStore(req, res, next)
);

storeRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<any> =>
    await storeController.getStoreById(req, res, next)
);

export default storeRouter;
