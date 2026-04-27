import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { deleteUser, getUserProfile } from "../controllers/userController.js";

const router = Router();
router.use(authenticate);
router.get("/profile", getUserProfile);
router.delete("/:id", deleteUser);

export default router;
