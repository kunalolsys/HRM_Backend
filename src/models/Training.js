import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true },
);

const trainingSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    subcategories: [subcategorySchema], // ✅ multiple subs

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// ✅ correct unique index
trainingSchema.index(
  { categoryName: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

const Training = mongoose.model("Training", trainingSchema);

export default Training;
