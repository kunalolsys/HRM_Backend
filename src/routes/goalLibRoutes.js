import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createGoalLib,
  getAllGoalLib,
  getGoalLibById,
  removeGoalLib,
  updateGoalLib,
} from "../controllers/goalLibraryController.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_goal_library"), getAllGoalLib);
router.get("/:id", hasPermission("manage_goal_library"), getGoalLibById);
router.post("/", hasPermission("manage_goal_library"), createGoalLib);
router.put("/:id", hasPermission("manage_goal_library"), updateGoalLib);
router.delete("/:id", hasPermission("manage_goal_library"), removeGoalLib);

export default router;
 