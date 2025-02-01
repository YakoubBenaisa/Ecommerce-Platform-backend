import { Router } from "express";
import userRoutes from "./user.router";
import storeRoutes from "./store.router";
import productRoutes from "./product.router";

const router = Router();

router.use("/auth", userRoutes);
router.use("/stores", storeRoutes);
router.use("/products", productRoutes);

export default router;
