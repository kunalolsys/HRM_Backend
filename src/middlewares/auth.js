import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

// ─── Token Extraction ──────────────────────────────────────────

const extractToken = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    return parts[1];
  }

  return null;
};

// ─── Authentication Middleware ─────────────────────────────────

export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "pragati-pms-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type && decoded.type !== "access") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid token type. Use access token.",
        });
    }

    const user = await User.findById(decoded.id)
      .populate("roles", "name description")
      .select("-password -refreshToken");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    if (user.status !== "Active") {
      return res
        .status(403)
        .json({ success: false, message: "Account is inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ─── Permission Check ──────────────────────────────────────────

export const hasPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Authentication required." });
      }

      const userRoles = await Role.find({
        _id: { $in: req.user.roles.map((r) => r._id || r) },
      }).populate("permissions", "name");
      const userPermissions = new Set();
      userRoles.forEach((role) => {
        role.permissions.forEach((perm) => userPermissions.add(perm.name));
      });

      if (
        userPermissions.has("all_access") ||
        userPermissions.has(requiredPermission)
      ) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Permission check failed.",
      });
    }
  };
};

// ─── Role Check ────────────────────────────────────────────────

export const hasAnyRole = (...allowedRoles) => {
  console.log(allowedRoles);
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    const userRoleNames = req.user.roles.map((r) => r.name || r);
    const hasRole = userRoleNames.some((name) => allowedRoles.includes(name));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Required role not found.",
      });
    }

    next();
  };
};
