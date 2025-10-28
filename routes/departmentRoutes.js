const express = require("express");
const router = express.Router();
const { getDepartments, createDepartment, deleteDepartment,updateDepartment} = require("../controllers/departmentController");

// GET all departments
router.get("/", getDepartments);

// POST create department
router.post("/", createDepartment);

// DELETE department
router.delete("/:id", deleteDepartment);
router.put("/:id", updateDepartment);


module.exports = router;
