import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

const getJwtSecret = () => process.env.JWT_SECRET || "pragati-pms-secret-key";
const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "7d";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: getJwtExpiresIn() });
};

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({
    $or: [{ email: userData.email }, { employeeCode: userData.employeeCode }],
  });

  if (existingUser) {
    throw new Error("User with this email or employee code already exists");
  }

  const roleIds = userData.roleIds || [];
  if (roleIds.length === 0) {
    const defaultRole = await Role.findOne({ isDefault: true });
    if (defaultRole) roleIds.push(defaultRole._id);
  }

  const user = await User.create({
    ...userData,
    roles: roleIds,
  });

  const populatedUser = await User.findById(user._id)
    .populate("roles", "name description")
    .select("-password");

  return {
    user: populatedUser,
    token: generateToken(user._id),
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password").populate("roles");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "Active") {
    throw new Error("Account is inactive");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const userWithoutPassword = await User.findById(user._id)
    .populate("roles", "name description")
    .select("-password");

  return {
    user: userWithoutPassword,
    token: generateToken(user._id),
  };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId)
    .populate("roles", "name description")
    .populate("company", "name acronym")
    .populate("unit", "name locationCode")
    .populate("department", "name code")
    .populate("cadre", "name")
    .populate("grade", "code")
    .populate("designation", "name")
    .populate("reportingManager", "fullName employeeCode");

  if (!user) throw new Error("User not found");
  return user;
};
