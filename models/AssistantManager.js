const mongoose = require("mongoose");

const assistantManagerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true , select: true },
    contactNumber: { type: String },
    role: { type: String, default: "assistant_manager" },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" }, // reference to Manager
  },
  { timestamps: true }
);
const AssistantManager = mongoose.model("AssistantManager", assistantManagerSchema);
module.exports = AssistantManager
