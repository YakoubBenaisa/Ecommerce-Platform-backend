import { Router, Request, Response } from "express";
import { container } from "../config/container";
import StoreController from "../controllers/store.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import {
  storeCreateSchema,
  storeUpdateSchema,
} from "../validation/store.validation";

const storeRouter = Router();
const storeController = container.resolve(StoreController);

storeRouter.post(
  "/",
  authMiddleware,
  validateRequest(storeCreateSchema),

  async (req: Request, res: Response): Promise<any> =>
    await storeController.createStore(req, res)
);

storeRouter.put(
  "/:id",
  authMiddleware,
  validateRequest(storeUpdateSchema),

  async (req: Request, res: Response): Promise<any> =>
    await storeController.updateStore(req, res)
);

storeRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<any> =>
    await storeController.getStoreById(req, res)
);

export default storeRouter;
