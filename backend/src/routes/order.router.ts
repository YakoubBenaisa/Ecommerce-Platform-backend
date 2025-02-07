import { Router } from "express";
import { container } from "tsyringe";
import OrderController from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import { createOrderSchema, placeOrderSchema, updateOrderSchema } from "../validations/order.validation";

const router = Router();
const orderController = container.resolve(OrderController);

// Route to create a new order
router.post("/", authMiddleware, validateRequest(placeOrderSchema), (req, res, next) =>
  orderController.createOrder(req, res, next)
);

// Route to update an existing order
router.put("/:id", authMiddleware, validateRequest(updateOrderSchema), (req, res, next) =>
  orderController.updateOrder(req, res, next)
);

// Route to delete an order
router.delete("/:id", authMiddleware, (req, res, next) =>
  orderController.deleteOrder(req, res, next)
);

// Route to get all orders for a store
router.get("/", authMiddleware, (req, res, next) =>
  orderController.getStoreOrders(req, res, next)
);

// Route to get a specific order by ID
router.get("/:id", authMiddleware, (req, res, next) =>
  orderController.getOrderById(req, res, next)
);

export default router;
