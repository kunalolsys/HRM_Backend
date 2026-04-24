import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

const JWT_SECRET = () => process.env.JWT_SECRET || "pragati-pms-secret-key";
const JWT_REFRESH_SECRET = () =>
  process.env.JWT_REFRESH_SECRET || "pragati-pms-refresh-secret-key";

const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";

// ─── Token Generators ──────────────────────────────────────────

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId, type: "access" }, JWT_SECRET(), {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, type: "refresh" }, JWT_REFRESH_SECRET(), {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
};

// ─── Auth Flows ────────────────────────────────────────────────

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

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  const populatedUser = await User.findById(user._id)
    .populate("roles", "name description")
    .select("-password -refreshToken");

  return {
    user: populatedUser,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email })
    .select("+password")
    .populate("roles");

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

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  const userWithoutPassword = await User.findById(user._id)
    .populate("roles", "name description")
    .select("-password -refreshToken");

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET());

  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  const user = await User.findById(decoded.id)
    .select("+refreshToken")
    .populate("roles", "name description");

  if (!user) {
    throw new Error("User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error("Refresh token revoked");
  }

  const newAccessToken = generateAccessToken(user._id);

  return {
    accessToken: newAccessToken,
  };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return { message: "Logged out successfully" };
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

