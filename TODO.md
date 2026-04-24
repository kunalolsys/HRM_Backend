# Role, Permission & Authentication Implementation Plan

## Context
- BRD specifies 5 roles: Employee, Manager, Management, HR, Admin
- JWT-based auth required
- Simple RBAC with permissions matrix
- User model with hierarchy fields (company, unit, dept, cadre, grade, designation, reportingManager)

## Files Created

### 1. Models ✅
- `src/models/Permission.js` - name, description, module
- `src/models/Role.js` - name, description, permissions[], isDefault
- `src/models/User.js` - full user with hierarchy + password + roles

### 2. Services ✅
- `src/services/authService.js` - register, login, token generation, getMe
- `src/services/roleService.js` - CRUD for roles + assign permissions
- `src/services/permissionService.js` - CRUD for permissions

### 3. Controllers ✅
- `src/controllers/authController.js` - register, login, getProfile
- `src/controllers/roleController.js` - HTTP handlers
- `src/controllers/permissionController.js` - HTTP handlers

### 4. Routes ✅
- `src/routes/authRoutes.js` - /api/auth (register, login, me)
- `src/routes/roleRoutes.js` - /api/roles (Admin/HR only)
- `src/routes/permissionRoutes.js` - /api/permissions (Admin/HR only)

### 5. Middlewares ✅
- `src/middlewares/auth.js` - JWT verify, hasPermission(), hasAnyRole()

### 6. Seeder ✅
- `src/scripts/seedRolesAndPermissions.js` - Seeds 26 permissions + 5 roles with mappings

### 7. App Updates ✅
- `src/app.js` - Mounted all routes

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/me | Yes | Get current user profile |
| GET | /api/roles | Admin/HR | List all roles |
| POST | /api/roles | Admin/HR | Create role |
| GET | /api/roles/:id | Admin/HR | Get single role |
| PUT | /api/roles/:id | Admin/HR | Update role |
| DELETE | /api/roles/:id | Admin/HR | Delete role |
| PUT | /api/roles/:id/permissions | Admin/HR | Assign permissions |
| GET | /api/permissions | Admin/HR | List permissions |
| POST | /api/permissions | Admin/HR | Create permission |
| GET | /api/permissions/:id | Admin/HR | Get permission |
| PUT | /api/permissions/:id | Admin/HR | Update permission |
| DELETE | /api/permissions/:id | Admin/HR | Delete permission |

## Next Steps
1. Set JWT_SECRET in .env file
2. Run seeder: `node src/scripts/seedRolesAndPermissions.js`
3. Register first admin user via /api/auth/register
