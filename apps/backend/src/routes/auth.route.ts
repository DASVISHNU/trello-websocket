import { Router } from "express";
import authcontrollers from "../controllers/auth.controllers"

const router = Router();

router.post("/signup", authcontrollers.signup);
router.post("/signin", authcontrollers.signin);

export default router;