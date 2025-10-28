const Department = require("../models/Department");

// @desc Get all departments
// @route GET /api/departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching departments", error: err.message });
  }
};

// @desc Create a new department
// @route POST /api/departments
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = new Department({ name, description });
    await department.save();

    res.status(201).json({ message: "Department created successfully", department });
  } catch (err) {
    res.status(500).json({ message: "Error creating department", error: err.message });
  }
};

// @desc Delete department
// @route DELETE /api/departments/:id
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting department", error: err.message });
  }
};

// PUT /api/departments/:id
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(updatedDepartment);
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Server error" });
  }
};

