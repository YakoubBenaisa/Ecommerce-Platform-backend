import { Router, Request, Response, NextFunction } from "express";
import { container } from "../config/container";
import StoreController from "../controllers/store.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import {
  storeCreateSchema,
  storeUpdateSchema,
} from "../validations/store.validation";
import CategoryController from "../controllers/category.controller";
import { createCategorySchema } from "../validations/product.validation";
import ChargiliAccountController from "../controllers/chargiliAccount.controller";
import { ChargiliAccountCreateSchema } from "../validations/chargiliAccount.validation";

const storeRouter = Router();
const storeController = container.resolve(StoreController);
const categoryController = container.resolve(CategoryController);
const chargiliAccountController = container.resolve(ChargiliAccountController);

storeRouter.post(
  "/",
  authMiddleware,
  validateRequest(storeCreateSchema),

   (req: Request, res: Response, next: NextFunction) =>
     storeController.createStore(req, res, next)
);

storeRouter.put(
  "/:id",
  authMiddleware,
  validateRequest(storeUpdateSchema),

   (req: Request, res: Response, next: NextFunction) =>
     storeController.updateStore(req, res, next)
);

storeRouter.get(
  "/:id",
   (req: Request, res: Response, next: NextFunction) =>
     storeController.getStoreById(req, res, next)
);



// Create Category
storeRouter.post(
  "/categories",
  authMiddleware, 
  validateRequest(createCategorySchema),

    (req: Request, res: Response, next: NextFunction) =>   categoryController.create(req, res, next)
);

// List Categories
storeRouter.get(
  "/:storeId/categories",
   (req: Request, res: Response, next: NextFunction) =>  categoryController.list(req, res, next)
);

// Delete Category
storeRouter.delete(
  "/categories/:id",
  authMiddleware, 
   (req: Request, res: Response, next: NextFunction) =>  categoryController.delete(req, res, next)
);



storeRouter.post(
  '/payments/chargili',
  authMiddleware,
  validateRequest(ChargiliAccountCreateSchema),
  (req: Request, res: Response, next: NextFunction) => chargiliAccountController.setupPayment(req, res, next)
);

storeRouter.delete(
  '/payments/chargili',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => chargiliAccountController.deletePaymentSetup(req, res, next)
);

storeRouter.patch(
  '/payments/chargili',
  authMiddleware,
  validateRequest(ChargiliAccountCreateSchema),
  (req: Request, res: Response, next: NextFunction) => chargiliAccountController.updatePaymentSetup(req, res, next)
);

export default storeRouter;
