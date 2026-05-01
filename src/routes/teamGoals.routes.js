import express from "express";
import * as teamGoalsController from "../controllers/teamGoals.controller.js";
import { authenticate, hasPermission } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/list",
  hasPermission("approve_team_goals"),
  teamGoalsController.getTeamGoals,
);
router.post(
  "/add-remark",
  hasPermission("approve_team_goals"),
  teamGoalsController.managerAddRemark,
);
// router.post(
//   "/under-edit",
//   hasPermission("approve_team_goals"),
//   teamGoalsController.sendBackForEdit,
// );
router.post(
  "/under-edit",
  hasPermission("approve_team_goals"),
  teamGoalsController.reviewGoals,
);
router.post(
  "/approved",
  hasPermission("approve_team_goals"),
  teamGoalsController.approveGoals,
);
router.post(
  "/reply",
  hasPermission("approve_team_goals"),
  teamGoalsController.reviewAndSendBack,
);

export default router;
