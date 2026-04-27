import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  createComp,
  deleteComp,
  getAllComp,
  getCompById,
  updateComp,
} from "../controllers/companyController.js";

const router = Router();

router.use(authenticate);

router.get("/", getAllComp);
router.get("/:id", getCompById);
router.post("/", createComp);
router.put("/:id", updateComp);
router.delete("/:id", deleteComp);

export default router;
