const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/User');

// Helper: Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'mysecretkey', {
    expiresIn: '7d',
  });
};






// ==========================
// @desc    Register new user
// @route   POST /api/auth/signup
// ==========================








exports.signup = async (req, res) => {
  try {
    const { name, email,assistantManager, contactNumber, password } = req.body;
    console.log(Staff);
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await Staff.findOne({ email });
    console.log(existingUser);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Staff.create({
      name,
      assistantManager,
      contactNumber,
      email,
      password,
      role: "staff",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Signup successful 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        assistantManager: user.assistantManager,
      contactNumber:user.contactNumber,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};



// ==========================
// @desc    Login user/admin
// @route   POST /api/auth/login
// ==========================

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
// console.log('Login Request:', req.body);


//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const user = await Staff.findOne({ email });
//     console.log("user details:",user);
//     if (!user) {
//       console.log('User not found');
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     if (user.status === 'blocked') {
//        console.log('Password mismatch');
//       return res.status(403).json({ message: 'Your account has been blocked by admin.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log(password,"passward");
//     console.log(user.password,"db");
    
//     console.log(isMatch,"ismatch");
    
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const token = generateToken(user._id);

//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         status: user.status,
//       },
//     });
//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Request:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await Staff.findOne({ email });
    console.log("user details:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Allow only staff role
    if (user.role !== "staff") {
      return res.status(403).json({ message: "Access denied. Staff only." });
    }

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account has been blocked by admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password, "entered password");
    console.log(user.password, "db password hash");
    console.log(isMatch, "isMatch");

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};





exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log(password,"admin passwarddddddddd");
     
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await Staff.findOne({ email });
   log("user detailsssssssssss:",user);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Admin account has been blocked.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'mysecretkey', {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};






// Get all staff
// exports.getAllStaff = async (req, res) => {
//   try {
//     const staff = await Staff.find({ role: "staff" })
//       .populate("assistantManager", "name email contactNumber role")
//       .select("name email contactNumber role assistantManager status");

//     console.log("Fetched staff list:", staff);

//     res.status(200).json(staff);
//   } catch (err) {
//     console.error("Error fetching staff:", err);
//     res.status(500).json({ message: "Error fetching staff", error: err.message });
//   }
// };

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ role: "staff" })
      .populate("assistantManager", "name email contactNumber role")
      .select("name email contactNumber role assistantManager status password"); // ✅ Include password

    console.log("Fetched staff list with password:", staff);

    res.status(200).json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ message: "Error fetching staff", error: err.message });
  }
};

// ✅ Delete Staff
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (err) {
    console.error("Error deleting staff:", err);
    res.status(500).json({ message: "Error deleting staff" });
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




// exports.getHierarchy = async (req, res) => {
//   try {
//     const managers = await Staff.find().lean();
//     const assistants = await Staff.find().lean();
//     const staff = await Staff.find().lean();

//     // ✅ Build hierarchy only once
//     const hierarchy = managers.map((manager) => ({
//       id: manager._id,
//       name: manager.name,
//       contactNumber: manager.contactNumber,
//       email: manager.email,
//       role: "manager",
//       children: assistants
//         .filter((am) => am.managerId?.toString() === manager._id.toString())
//         .map((am) => ({
//           id: am._id,
//           name: am.name,
//           contactNumber: am.contactNumber,
//           email: am.email,
//           role: "assistant_manager",
//           children: staff
//             .filter((s) => s.assistantManager?.toString() === am._id.toString())
//             .map((s) => ({
//               id: s._id,
//               name: s.name,
//               contactNumber: s.contactNumber,
//               email: s.email,
//               role: "staff",
//               children: [],
//             })),
//         })),
//     }));

//     // ✅ REMOVE managers who are actually assistants or staff (duplicates)
//     const managerIdsWithChildren = new Set(hierarchy.map((m) => m.id.toString()));
//     const cleanHierarchy = hierarchy.filter((m) => managerIdsWithChildren.has(m.id.toString()));

//     res.json(cleanHierarchy);
//     console.log("✅ Clean Hierarchy Sent:", JSON.stringify(cleanHierarchy, null, 2));
//   } catch (err) {
//     console.error("❌ Error building hierarchy:", err);
//     res.status(500).json({ message: "Failed to build hierarchy" });
//   }
// };








// exports.getHierarchy = async (req, res) => {
//   try {
//     const managers = await Staff.find().lean();
//     const assistants = await Staff.find().lean();
//     const staff = await Staff.find().lean();

//     const hierarchy = managers.map((manager) => ({
//       id: manager._id,
//       name: manager.name,
//       contactNumber: manager.contactNumber,
//       email: manager.email,
//       role: "manager",
//       children: assistants
//         .filter((am) => am.managerId?.toString() === manager._id.toString()) // ✅ match assistants under this manager
//         .map((am) => ({
//           id: am._id,
//           name: am.name,
//           contactNumber: am.contactNumber,
//           email: am.email,
//           role: "assistant_manager",
//           children: staff
//             .filter((s) => s.assistantManager?.toString() === am._id.toString()) // ✅ match staff under this assistant
//             .map((s) => ({
//               id: s._id,
//               name: s.name,
//               contactNumber: s.contactNumber,
//               email: s.email,
//               role: "staff",
//               children: [], // staff are leaf nodes
//             })),
//         })),
//     }));

//     res.json(hierarchy);
//     console.log("✅ Fixed Hierarchy:", JSON.stringify(hierarchy, null, 2));
//   } catch (err) {
//     console.error("❌ Error building hierarchy:", err);
//     res.status(500).json({ message: "Failed to build hierarchy" });
//   }
// };

// controllers/hierarchyController.js


exports.getHierarchy = async (req, res) => {
  try {
    // 1️⃣ Get all staff once
    const allStaff = await Staff.find().lean();

    // 2️⃣ Separate by roles
    const managers = allStaff.filter((user) => user.role === "manager");
    const assistants = allStaff.filter(
      (user) => user.role === "assistant_manager"
    );
    const staffMembers = allStaff.filter((user) => user.role === "staff");

    // 3️⃣ Build hierarchy
    const hierarchy = managers.map((manager) => ({
      id: manager._id,
      name: manager.name,
      contactNumber: manager.contactNumber,
      email: manager.email,
      role: "manager",
      children: assistants
        .filter((am) => am.managerId?.toString() === manager._id.toString())
        .map((am) => ({
          id: am._id,
          name: am.name,
          contactNumber: am.contactNumber,
          email: am.email,
          role: "assistant_manager",
          children: staffMembers
            .filter(
              (s) => s.assistantManager?.toString() === am._id.toString()
            )
            .map((s) => ({
              id: s._id,
              name: s.name,
              contactNumber: s.contactNumber,
              email: s.email,
              role: "staff",
              children: [], // leaf node
            })),
        })),
    }));

    res.json(hierarchy);
    console.log("✅ Hierarchy Generated:", JSON.stringify(hierarchy, null, 2));
  } catch (err) {
    console.error("❌ Error building hierarchy:", err);
    res.status(500).json({ message: "Failed to build hierarchy" });
  }
};

