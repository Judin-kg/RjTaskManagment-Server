const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
