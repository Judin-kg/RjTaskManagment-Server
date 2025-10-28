const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    description: { type: String },
    scheduledTime: { type: Date, required: true },
    role: { type: String, enum: ["myself", "manager", "assistantmanager", "staff"], required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Staff"}, // can point to manager, assistant manager, or staff
     assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff"}, // ✅ new field to track who assigned the task
     status: { type: String, default: "pending", enum: ["pending", "in-progress", "completed"] },
    //  company: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Company", // ✅ reference to company
    //   required: true,
    // },
    // company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }, // ✅ NEW FIELD

     // ✅ Add company object with id + name
    company: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
      name: { type: String, required: true },
    },
    
    repeat: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly", "yearly"],
      default: "once",
    },

    

  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
