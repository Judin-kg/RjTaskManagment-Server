const Staff = require("../models/Staff");
const jwt = require("jsonwebtoken");
 const bcrypt = require("bcryptjs");
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mysecretkey',{ expiresIn: "7d" });
};

// Register staff
exports.registerStaff = async (req, res) => {
  try {
    const { name, assistantManager, contactNumber, email, password } = req.body;

    const staffExists = await Staff.findOne({ email });
    if (staffExists) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const staff = await Staff.create({
      name,
      assistantManager,
      contactNumber,
      email,
      password,
      role: "staff",
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      token: generateToken(staff._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering staff", error: err.message });
  }
};

// Login staff
exports.loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const isMatch = await staff.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      token: generateToken(staff._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().populate("assistantManager", "name");
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Error fetching staff", error: err.message });
  }
};

exports.resetStaffPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting staff password:", err);
    res.status(500).json({ message: "Failed to reset password", error: err.message });
  }
};

// Update staff
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedStaff = await Staff.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("assistantManager", "name");

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json(updatedStaff);
  } catch (err) {
    console.error("Error updating staff:", err);
    res.status(500).json({ message: "Failed to update staff", error: err.message });
  }
};

