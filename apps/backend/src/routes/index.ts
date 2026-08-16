import { Router } from "express";
import authRoutes from "./auth.route.ts";
import orgRoutes from "./org.route.ts";
const router = Router();

router.use("/auth", authRoutes);
router.use("/org",orgRoutes)
export default router;