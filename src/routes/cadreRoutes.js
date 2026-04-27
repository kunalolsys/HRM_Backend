import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createCadre,
  deleteCadre,
  getAllCadre,
  getCadreById,
  updateCadre,
} from "../controllers/cadreController.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_cadres"), getAllCadre);
router.get("/:id", hasPermission("manage_cadres"), getCadreById);
router.post("/", hasPermission("manage_cadres"), createCadre);
router.put("/:id", hasPermission("manage_cadres"), updateCadre);
router.delete("/:id", hasPermission("manage_cadres"), deleteCadre);

export default router;
