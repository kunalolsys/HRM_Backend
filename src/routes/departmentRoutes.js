import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {deleteDep, 
  createDep,
  getAllDep,
  getDepById,
  updateDep,
} from "../controllers/departmentController.js";

const router = Router();

router.use(authenticate);

router.get("/", getAllDep);
router.get("/:id", getDepById);
router.post("/", createDep);
router.put("/:id", updateDep);
router.delete("/:id", deleteDep);

export default router;
