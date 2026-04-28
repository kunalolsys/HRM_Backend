import * as goalLibraryService from "../services/goalLibraryService.js";

export const createGoalLib = async (req, res) => {
  try {
    const data = await goalLibraryService.createGoalLibrary(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllGoalLib = async (req, res) => {
  try {
    const data = await goalLibraryService.getAllGoalLibrary(req.body);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getGoalLibById = async (req, res) => {
  try {
    const data = await goalLibraryService.getGoalLibraryById(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateGoalLib = async (req, res) => {
  try {
    const data = await goalLibraryService.updateGoalLibrary(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeGoalLib = async (req, res) => {
  try {
    const data = await goalLibraryService.deleteGoalLibrary(
      req.params.id,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
      data,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};
