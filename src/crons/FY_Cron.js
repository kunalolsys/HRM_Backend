// jobs/pmsCron.js
import cron from "node-cron";
import Timeline from "../models/Timeline.js";
import { seedPmsCycles } from "../seeder/fyCycle.js";
import { getFinancialYear } from "../utils/helper.js";
import { bulkPropagateGoalsToQuarter } from "../services/myGoals.service.js";

export const startPmsCron = () => {
  cron.schedule("0 0 1 4 *", async () => {
    try {
      console.log("⏰ Running PMS yearly job...");

      const newFY = getFinancialYear();

      // 1. Archive old
      await Timeline.updateMany(
        { financialYear: { $ne: newFY } },
        { isArchived: true },
      );

      // 2. Seed new
      await seedPmsCycles(newFY);

      console.log("✅ PMS updated for FY:", newFY);
    } catch (err) {
      console.error("❌ Cron failed:", err.message);
    }
  });
};

// ─────────────────────────────────────────────
// 🔹 Quarterly Goal Propagation Cron
// ─────────────────────────────────────────────
// Runs every hour to check if any quarter has started
export const startQuarterlyGoalCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();

      // Find active quarter timelines that have started
      const activeTimelines = await Timeline.find({
        cycleName: { $in: ["Q1", "Q2", "Q3", "Q4"] },
        isArchived: false,
        assessmentStart: { $lte: now },
      });

      for (const timeline of activeTimelines) {
        const { cycleName, financialYear } = timeline;

        console.log(`⏰ Propagating goals for ${financialYear} ${cycleName}...`);

        // Bulk propagate goals for all users to this quarter
        const results = await bulkPropagateGoalsToQuarter(
          financialYear,
          cycleName,
        );

        const successCount = results.filter((r) => r.status === "COPIED").length;
        const alreadyCount = results.filter(
          (r) => r.status === "ALREADY_COPIED",
        ).length;

        console.log(
          `✅ ${cycleName} propagation complete: ${successCount} copied, ${alreadyCount} already exists`,
        );
      }
    } catch (err) {
      console.error("❌ Quarterly cron failed:", err.message);
    }
  });
};
