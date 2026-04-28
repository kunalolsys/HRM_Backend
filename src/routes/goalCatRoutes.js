import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createGoalCat,
  deleteGoalCat,
  getAllGoalCat,
  getGoalCatById,
  updateGoalCat,
} from "../controllers/goalCatController.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_goal_category"), getAllGoalCat);
router.get("/:id", hasPermission("manage_goal_category"), getGoalCatById);
router.post("/", hasPermission("manage_goal_category"), createGoalCat);
router.put("/:id", hasPermission("manage_goal_category"), updateGoalCat);
router.delete("/:id", hasPermission("manage_goal_category"), deleteGoalCat);

export default router;
