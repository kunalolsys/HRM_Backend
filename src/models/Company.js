import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    entityName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    acronym: {
      type: String,
      required: true,
      trim: true,
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

const Company = mongoose.model("Company", companySchema);

export default Company;
