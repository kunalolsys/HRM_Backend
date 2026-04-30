import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createGoalCat,
  deleteGoalCat,
  getAllGoalCat,
  getAllGoalCatForDrops,
  getGoalCatById,
  updateGoalCat,
} from "../controllers/goalCat.controller.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_goal_category"), getAllGoalCat);
router.get("/list-drop", hasPermission("manage_goal_category"), getAllGoalCatForDrops);
router.get("/:id", hasPermission("manage_goal_category"), getGoalCatById);
router.post("/", hasPermission("manage_goal_category"), createGoalCat);
router.put("/:id", hasPermission("manage_goal_category"), updateGoalCat);
router.delete("/:id", hasPermission("manage_goal_category"), deleteGoalCat);

export default router;
