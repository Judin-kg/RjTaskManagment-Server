// const Manager = require("../models/Manager");

// // @desc Get all managers
// // @route GET /api/managers
// exports.getManagers = async (req, res) => {
//   try {
//     const managers = await Manager.find();
//     res.json(managers);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching managers", error: err.message });
//   }
// };

// // @desc Create new manager
// // @route POST /api/managers
// exports.createManager = async (req, res) => {
//   try {
//     const { name, email, password, contactNumber } = req.body;

//     const existingManager = await Manager.findOne({ email });
//     if (existingManager) {
//       return res.status(400).json({ message: "Manager already exists" });
//     }

//     const manager = new Manager({
//       name,
//       email,
//       password: password || "123456",
//       contactNumber,
//       role: "manager",
//     });

//     await manager.save();
//     res.status(201).json({ message: "Manager created successfully", manager });
//   } catch (err) {
//     res.status(500).json({ message: "Error creating manager", error: err.message });
//   }
// };

// const Staff = require("../models/User");

// // Create Manager
// exports.createManager = async (req, res) => {
//   try {
//     const { name, email, password, contactNumber, departmentId } = req.body;

//     // create manager
//     const manager = new Staff({
//       name,
//       email,
//       password,
//       contactNumber,
//       role: "manager",
//       departmentId, // save dept reference
//     });

//     await manager.save();
//     res.status(201).json(manager);
//   } catch (err) {
//     console.error("Error creating manager:", err);
//     res.status(500).json({ error: "Failed to create manager" });
//   }
// };

// // Get all Managers (with department populated)
// exports.getManagers = async (req, res) => {
//   try {
//     const managers = await Staff.find().populate("departmentId", "name");
//     res.json(managers);
//   } catch (err) {
//     console.error("Error fetching managers:", err);
//     res.status(500).json({ error: "Failed to fetch managers" });
//   }
// };

// // Get Managers by Department (optional for filtering)
// exports.getManagersByDepartment = async (req, res) => {
//   try {
//     const { departmentId } = req.params;
//     const managers = await Staff.find({ departmentId }).populate(
//       "departmentId",
//       "name"
//     );
//     res.json(managers);
//   } catch (err) {
//     console.error("Error fetching managers by department:", err);
//     res.status(500).json({ error: "Failed to fetch managers by department" });
//   }
// };







const Staff = require("../models/User");
// const Manager = require("../models/Manager");
const jwt = require("jsonwebtoken");

// Generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id, role: "manager" }, process.env.JWT_SECRET || "mysecretkey", {
//     expiresIn: "7d",
//   });
// };



// exports.loginManager = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const manager = await Staff.findOne({ email });
//     if (!manager) {
//       return res.status(404).json({ error: "Manager not found" });
//     }

//     const isMatch = await manager.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     res.json({
//       token: generateToken(manager._id),
//       manager: {
//         id: manager._id,
//         name: manager.managerName,
//         email: manager.email,
//         phone: manager.phoneNumber,
        
//       },
//     });
//   } catch (err) {
//     console.error("Manager login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// ✅ Create Manager


const bcrypt = require("bcryptjs");


exports.loginManager = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const manager = await Staff.findOne({ email });

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Managers only." });
    }

    if (manager.status === "blocked") {
      return res.status(403).json({ message: "Manager account has been blocked." });
    }

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: manager._id, role: manager.role },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      manager: {
        id: manager._id,
        name: manager.managerName,
        email: manager.email,
        phone: manager.phoneNumber,
        role: manager.role,
        status: manager.status,
      },
    });
  } catch (err) {
    console.error("Manager Login Error:", err);
    res.status(500).json({ message: "Server error during manager login" });
  }
};


exports.createManager = async (req, res) => {

  try {
    const { name, email, password, contactNumber, departmentId } = req.body;
  
      if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    console.log(req.body,"manageeeeeeeeer");

    // check existing
    const existing = await Staff.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });
    
    // Ensure role is always "manager"
    const manager = new Staff({
      name,
      email,
      password,
      contactNumber,
      departmentId,
      role: "manager",
    });

    await manager.save();

     const managerObj = manager.toObject();
    delete managerObj.password; // don't return password
    res.status(201).json(managerObj);
    // res.status(201).json(manager);
  } catch (err) {
    console.error("Error creating manager:", err);
    res.status(500).json({ error: "Failed to create manager" });
  }
};

// ✅ Get all Managers (with Department populated)
// exports.getManagers = async (req, res) => {
//   try {
//     const managers = await Staff.find({ role: "manager" })
//       .populate("departmentId", "name")
//       .select("name email contactNumber departmentId role status");

//     res.json(managers);
//   } catch (err) {
//     console.error("Error fetching managers:", err);
//     res.status(500).json({ error: "Failed to fetch managers" });
//   }
// };
exports.getManagers = async (req, res) => {
  try {
    const managers = await Staff.find({ role: "manager" })
      .populate("departmentId", "name")
      .select("name email contactNumber departmentId role status password"); // ✅ Include password too

    res.json(managers);
  } catch (err) {
    console.error("Error fetching managers:", err);
    res.status(500).json({ error: "Failed to fetch managers" });
  }
};


// ✅ Get Managers by Department
exports.getManagersByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const managers = await Staff.find({ role: "manager", departmentId })
      .populate("departmentId", "name")
      .select("name email contactNumber departmentId role status");

    res.json(managers);
  } catch (err) {
    console.error("Error fetching managers by department:", err);
    res.status(500).json({ error: "Failed to fetch managers by department" });
  }
};

// ✅ Delete Manager
exports.deleteManager = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedManager = await Staff.findByIdAndDelete(id);
    if (!deletedManager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    res.json({ message: "Manager deleted successfully" });
  } catch (err) {
    console.error("Error deleting manager:", err);
    res.status(500).json({ error: "Failed to delete manager" });
  }
};

// ✅ Update Manager
exports.updateManager = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedManager = await Staff.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("departmentId", "name");

    if (!updatedManager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    res.json(updatedManager);
  } catch (err) {
    console.error("Error updating manager:", err);
    res.status(500).json({ error: "Failed to update manager" });
  }
};

// controllers/managerController.js
exports.resetManagerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    // 🔑 Hash the password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedManager = await Staff.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedManager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting manager password:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};