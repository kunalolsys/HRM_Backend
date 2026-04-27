import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createGrade,
  deleteGrade,
  getAllGrade,
  getGradeById,
  updateGrade,
} from "../controllers/gradeController.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_grades"), getAllGrade);
router.get("/:id", hasPermission("manage_grades"), getGradeById);
router.post("/", hasPermission("manage_grades"), createGrade);
router.put("/:id", hasPermission("manage_grades"), updateGrade);
router.delete("/:id", hasPermission("manage_grades"), deleteGrade);

export default router;
