import { Router } from "express";
import { container } from "../config/container";
import ProductController from "../controllers/product.controller";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import authMiddleware from "../middlewares/auth.middlware";
import {
  createProductSchema,
  updateProductSchema,
  
  storeIdParamSchema,
} from "../validations/product.validation";

const router = Router();
const productController = container.resolve(ProductController);

router.post(
  "/",
  authMiddleware,
  validateRequest(createProductSchema),
  async (req, res): Promise<any> => await productController.create(req, res)
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest(updateProductSchema),
  async (req, res): Promise<any> => await productController.update(req, res)
);

router.delete(
  "/:id",
  authMiddleware,
  async (req, res): Promise<any> => await productController.delete(req, res)
);

router.get(
  "/:id",
  async (req, res): Promise<any> => await productController.getById(req, res)
);

router.get(
  "/stores/:storeId/products",
  async (req, res): Promise<any> => await productController.getByStoreId(req, res)
);

export default router; 