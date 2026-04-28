import { asyncHandler } from "../utils/asyncHandler.js";
import * as timelineService from "../services/timelineService.js";

export const getTimeline = asyncHandler(async (req, res) => {
  try {
    const data = await timelineService.getAllTimeline();
    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
export const updateTimeline = asyncHandler(async (req, res) => {
  try {
    const data = await timelineService.updatePmsTimeline(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Timeline updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});