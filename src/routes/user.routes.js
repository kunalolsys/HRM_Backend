import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { deleteUser, getUserProfile, updateUser } from "../controllers/user.controller.js";

const router = Router();
router.use(authenticate);
router.get("/profile", getUserProfile);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;
