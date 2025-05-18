// routes/index.ts
import { Router } from "express";
import clientRoutes from "./clients";
import authRoutes from "./auth";

const router = Router();

router.use("/clients", clientRoutes);
router.use("/auth", authRoutes);

export default router;
