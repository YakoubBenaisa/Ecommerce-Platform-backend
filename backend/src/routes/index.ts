import { Router } from "express";
import userRoutes from "./user.router";
import storeRoutes from "./store.router";


const router = Router();

router.use("/auth", userRoutes);
router.use("/stores", storeRoutes);

export default router;
