import Timeline from "../models/Timeline.js";

export const seedPmsCycles = async (financialYear) => {
  const existing = await Timeline.countDocuments({ financialYear });

  if (existing > 0) {
    console.log("✅ Cycles already exist for", financialYear);
    return;
  }

  const y = parseInt(financialYear.split("-")[0]);

  const cycles = [
    {
      cycleName: "GOAL_SETTING",
      financialYear,
      assessmentStart: new Date(`${y}-04-01`),
      assessmentEnd: new Date(`${y + 1}-03-31`),
    },
    {
      cycleName: "Q1",
      financialYear,
      assessmentStart: new Date(`${y}-04-01`),
      assessmentEnd: new Date(`${y}-06-30`),
    },
    {
      cycleName: "Q2",
      financialYear,
      assessmentStart: new Date(`${y}-07-01`),
      assessmentEnd: new Date(`${y}-09-30`),
    },
    {
      cycleName: "Q3",
      financialYear,
      assessmentStart: new Date(`${y}-10-01`),
      assessmentEnd: new Date(`${y}-12-31`),
    },
    {
      cycleName: "ANNUAL_APPRAISAL",
      financialYear,
      assessmentStart: new Date(`${y + 1}-01-01`),
      assessmentEnd: new Date(`${y + 1}-03-31`),
    },
  ];

  await Timeline.insertMany(cycles);
  console.log("🚀 Seeded cycles for", financialYear);
};
