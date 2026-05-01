# Quarterly Goal Propagation Implementation

## Task: Implement quarterly goal soft-copy flow

### Steps to Complete:

1. [x] **Update MyGoals Model** - Add quarter tracking fields to goalItemSchema
   - Add quarter field (enum: YEARLY, Q1, Q2, Q3, Q4)
   - Add isCopiedForQuarter field
   - Add copiedFromGoalId field
   - Add adminModified, modifiedInQuarter, modifiedAt, modifiedBy fields

2. [x] **Create New Service Functions** (myGoals.service.js)
   - propagateGoalsToQuarter(userId, financialYear, quarter) - Copy goals when quarter starts
   - getQuarterlyGoals(userId, financialYear, quarter) - Get goals for specific quarter
   - checkAdminModifications(userId, financialYear, quarter) - Check if admin made changes

3. [x] **Create Admin Update Controller** (myGoals.controller.js)
   - adminUpdateGoalForQuarter - Allow admin to modify goals for specific quarter

4. [x] **Add Admin Update Route** (myGoals.routes.js)
   - POST /admin-update-goal/:goalId - Admin update endpoint

5. [x] **Create Cron Job** (FY_Cron.js or new quarterly cron)
   - Trigger when quarter timeline starts
   - Automatically propagate goals to quarters
