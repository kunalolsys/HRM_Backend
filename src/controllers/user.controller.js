import { asyncHandler } from "../utils/asyncHandler.js";
import * as userService from "../services/user.service.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const data = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await userService.deleteUser(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
