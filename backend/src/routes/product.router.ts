import { Router, Request, Response, NextFunction } from "express";
import { container } from "../config/container";
import ProductController from "../controllers/product.controller";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import authMiddleware from "../middlewares/auth.middlware";
import {
  createProductSchema,
  updateProductSchema,
  
  storeIdParamSchema,
} from "../validations/product.validation";
import imagesMiddleware from "../middlewares/images.middlware";

import ImageUtils from "../utils/images.utils";

const router = Router();
const productController = container.resolve(ProductController);
const imageUtils = container.resolve(ImageUtils);

router.post(
  "/", 
  authMiddleware,
  imagesMiddleware,
  validateRequest(createProductSchema),
  
  async (req, res, next: NextFunction) => await productController.create(req, res, next)
);

router.put(
  "/:id",
  authMiddleware,
  imagesMiddleware,
  validateRequest(updateProductSchema),
  async (req, res, next: NextFunction) => await productController.update(req, res, next)
);

router.delete(
  "/:id",
  authMiddleware,
  async (req, res, next: NextFunction) => await productController.delete(req, res, next)
);

router.get(
  "/:id",
  async (req, res, next: NextFunction) => await productController.getById(req, res, next)
);

router.get(
  "/stores/:storeId/products",
  async (req, res, next: NextFunction) =>
    await productController.getByStoreId(req, res, next)
);

router.get("/images/:imageName", imageUtils.getImage);

export default router; 





           src/app.ts
           src/controllers/product.controller.ts
          
           src/middlewares/errors.middlware.ts
           src/routes/product.router.ts
           src/services/product.service.ts
           
           src/utils/images.utils.ts