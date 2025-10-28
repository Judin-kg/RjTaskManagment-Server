const express = require('express');
const router = express.Router();
const { signup,loginUser,getAllStaff,deleteStaff,resetStaffPassword,getHierarchy} = require('../controllers/authController');
const {adminUser} = require('../controllers/adminAuthController');
// const { managerUser } = require('../controllers/managerAuth');
// Public Routes
router.post('/signup', signup);
router.post('/login', loginUser);
router.get("/", getAllStaff);  
router.post('/admin-login',adminUser);
router.delete("/:id", deleteStaff);
router.put("/:id/reset-password", resetStaffPassword);  // ✅ add delete route
router.get("/hierarchy", getHierarchy);
// router.post('/manager-login',managerUser); // <-- Manager login
// router.post('/admin/login', adminLogin); // <-- Admin login
module.exports = router;