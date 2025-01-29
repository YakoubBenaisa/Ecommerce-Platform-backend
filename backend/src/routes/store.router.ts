import { Router, Request, Response } from "express";
import { container } from "../config/container";
import StoreController from "../controllers/store.controller";

const storeRouter = Router();
const storeController = container.resolve(StoreController);

storeRouter.post(
          "/",

          (req: Request, res: Response):Promise<any> => storeController.createStore(req, res)
);

storeRouter.put(
          "/:id",

          (req: Request, res: Response):Promise<any> => storeController.updateStore(req, res)
);

storeRouter.get(
          "/:id",
          (req: Request, res: Response):Promise<any> => storeController.getStoreById(req, res)
);

export default storeRouter; 


