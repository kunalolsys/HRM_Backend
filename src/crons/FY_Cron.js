// jobs/pmsCron.js
import cron from "node-cron";
import Timeline from "../models/Timeline.js";
import { seedPmsCycles } from "../seeder/fyCycle.js";
import { getFinancialYear } from "../utils/helper.js";

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
