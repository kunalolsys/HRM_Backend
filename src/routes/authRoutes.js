import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getProfile);

export default router;

