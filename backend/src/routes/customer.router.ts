import { Router, Request, Response, NextFunction } from "express";
import { container } from "../config/container";

import authMiddleware from "../middlewares/auth.middlware";
import { validateRequest } from "../middlewares/RequestValidation.middlware";

import { CustomerController } from "../controllers/customer.controller";
import {
  customerCreateSchema,
  customerUpdateSchema,
} from "../validations/custemer.validation";

const customerRouter = Router();

const customerController = container.resolve(CustomerController);


customerRouter.post(
          '/',
          authMiddleware,
          validateRequest(customerCreateSchema),
          (req, res, next) => customerController.createCustomer(req, res, next)
        );
        
        customerRouter.put(
          '/:customerId',
          authMiddleware,
          validateRequest(customerUpdateSchema),
          (req, res, next) => customerController.updateCustomer(req, res, next)
        );
        
        customerRouter.get(
          '/:customerId',
          authMiddleware,
          (req, res, next) => customerController.getCustomerWithOrders(req, res, next)
        );
        
        customerRouter.get(
          '/',
          authMiddleware,
          (req, res, next) => customerController.getStoreCustomers(req, res, next)
        );

        export default customerRouter;