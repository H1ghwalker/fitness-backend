// routes/index.ts
import { Router } from "express";
import clientRoutes from "./clients";
import authRoutes from "./auth";
import sessionRoutes from "./sessions";



const router = Router();

router.use("/clients", clientRoutes);
router.use("/auth", authRoutes);
router.use("/sessions", sessionRoutes);

export default router;
