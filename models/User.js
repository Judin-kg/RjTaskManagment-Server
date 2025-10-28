// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Username is required'],
//       trim: true,
//     },
//      assistantManager: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "AssistantManager",
//           required: true,
//         },
//         contactNumber: { type: String, required: true },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: 6,
//     },


     
//     departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // NEW
//     managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" },
//     // role: {
//     //   type: String,
//     //   enum: ['user', 'admin'],
//     //   default: 'user',
//     // },
//     // role: { type: String, default: "staff" },
//     role: { type: String, enum: ["admin", "manager", "staff","assistant_manager"], required: true },
//     status: {
//       type: String,
//       enum: ['active', 'blocked'],
//       default: 'active',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Hash password before saving (only if changed or new)
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// const Staff = mongoose.model('Staff', userSchema);
// module.exports = Staff;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    assistantManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: function () {
        return this.role === "staff"; // ✅ Only required if the user is staff
      },
    },
    contactNumber: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    // 
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff", // ✅ Fix: change from "Manager" → "Staff"
    },
    role: {
      type: String,
      enum: ["admin", "manager", "staff", "assistant_manager"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (only if changed or new)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const Staff = mongoose.model("Staff", userSchema);
module.exports = Staff;
