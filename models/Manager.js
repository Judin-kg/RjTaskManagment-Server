const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "staff"], required: true },
     departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // NEW
  },
  { timestamps: true }
);
const Manager = mongoose.model("Manager", managerSchema);
module.exports = Manager;

