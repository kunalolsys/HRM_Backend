import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createCompetency,
  deleteCompetency,
  getAllCompetency,
  getCompetencyById,
  updateCompetency,
} from "../controllers/competencyBank.controller.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_competency_bank"), getAllCompetency);
router.get("/:id", hasPermission("manage_competency_bank"), getCompetencyById);
router.post("/", hasPermission("manage_competency_bank"), createCompetency);
router.put("/:id", hasPermission("manage_competency_bank"), updateCompetency);
router.delete(
  "/:id",
  hasPermission("manage_competency_bank"),
  deleteCompetency,
);

export default router;
