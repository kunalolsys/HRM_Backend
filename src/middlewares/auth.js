import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "pragati-pms-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id)
      .populate("roles")
      .select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    if (user.status !== "Active") {
      return res.status(403).json({ message: "Account is inactive." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const hasPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required." });
      }

      const userRoles = await Role.find({
        _id: { $in: req.user.roles.map((r) => r._id || r) },
      }).populate("permissions");

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

      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    } catch (error) {
      return res.status(500).json({ message: "Permission check failed." });
    }
  };
};

export const hasAnyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const userRoleNames = req.user.roles.map((r) => r.name || r);
    const hasRole = userRoleNames.some((name) => allowedRoles.includes(name));

    if (!hasRole) {
      return res
        .status(403)
        .json({ message: "Access denied. Required role not found." });
    }

    next();
  };
};
