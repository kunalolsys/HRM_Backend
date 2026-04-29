import User from "../models/User.js";
export const getUserById = async (userId) => {
  const user = await User.findById({ _id: userId, isDeleted: false })
    .populate("roles", "name description")
    .populate("company", "name acronym")
    .populate("unit", "name locationCode")
    .populate("department", "name code")
    .populate("cadre", "cadreName description")
    .populate("grade", "gradeCode")
    .populate("designation", "name")
    .populate("reportingManager", "fullName employeeCode")
    .lean();

  if (!user) throw new Error("User not found");
  return user;
};

export const updateUser = async (id, updateData) => {
  const user = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { returnDocument: "after", runValidators: true },
  );

  if (!user) throw new Error("Cadre not found");

  return user;
};

//**Soft Delete User */
export const deleteUser = async (id, userId) => {
  const user = await User.findByIdAndDelete(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );
  if (!user) throw new Error("User not found");
  return user;
};
