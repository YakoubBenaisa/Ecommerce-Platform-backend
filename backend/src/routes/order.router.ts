import { Router } from "express";
import { container } from "tsyringe";
import OrderController from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validateRequest } from "../middlewares/RequestValidation.middlware";
import { createOrderSchema, placeOrderSchema, updateOrderSchema, updateOrderStatusSchema } from "../validations/order.validation";
import parseQueryParams from "../middlewares/parseQueryParams.middlware";

const router = Router();
const orderController = container.resolve(OrderController);

// Route to create a new order
router.post("/",  validateRequest(placeOrderSchema), (req, res, next) =>
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
router.get("/", authMiddleware,parseQueryParams, (req, res, next) =>
  orderController.getStoreOrders(req, res, next)
);

// Route to get a specific order by ID
router.get("/:id", authMiddleware, (req, res, next) =>
  orderController.getOrderById(req, res, next)
);

// Route to update order status
router.patch("/:id/status", authMiddleware, validateRequest(updateOrderStatusSchema), (req, res, next) =>
  orderController.updateOrderStatus(req, res, next)
);

export default router;
