const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    assistantManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssistantManager",
      required: true,
    },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true , select: true },
    role: { type: String, default: "staff" },
  },
  { timestamps: true }
);

// Hash password before saving
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
staffSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Staff= mongoose.model("Staff", staffSchema);
module.exports = Staff;