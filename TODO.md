# Quarterly Goals Implementation TODO

## Files to Create:
1. [x] src/models/QuarterlyGoal.js - NEW MODEL
2. [x] src/services/quarterlyGoals.service.js - NEW SERVICE
3. [x] src/controllers/quarterlyGoals.controller.js - NEW CONTROLLER
4. [x] src/routes/quarterlyGoals.routes.js - NEW ROUTES

## Files to Modify:
5. [x] src/services/teamGoals.service.js - Call createQuarterlyGoals on approve
6. [x] src/crons/FY_Cron.js - Check APPROVED status only
7. [x] src/app.js or server.js - Add quarterlyGoals routes

## Implementation Steps:
- [x] Step 1: Create QuarterlyGoal model (separate collection)
- [x] Step 2: Create quarterlyGoals service (CRUD operations)
- [x] Step 3: Create quarterlyGoals controller (API handlers)
- [x] Step 4: Create quarterlyGoals routes (endpoints)
- [x] Step 5: Modify teamGoals.service to trigger quarterly creation
- [x] Step 6: Modify FY_Cron to check APPROVED status
- [x] Step 7: Register routes in app.js

## ✅ COMPLETED - IMPLEMENTATION DONE
