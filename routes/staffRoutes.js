const express = require("express");
const { registerStaff, loginStaff, getAllStaff,resetStaffPassword,updateStaff } = require("../controllers/staffController");

const router = express.Router();

// Routes
router.post("/register", registerStaff); // staff registration
router.post("/login", loginStaff);       // staff login
router.get("/", getAllStaff);  
router.put("/:id/update", updateStaff);

// 🔑 Reset password route
router.put("/:id/reset-password", resetStaffPassword);       // list staff

module.exports = router;
