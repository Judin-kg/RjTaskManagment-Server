const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");



router.get("/reports",taskController.getTaskReports);
// Create task
router.post("/", taskController.createTask);

// Get all tasks
router.get("/tasks", taskController.getTasks);

// Get single task
router.get("/:id", taskController.getTaskById);

// Update task
router.put("/:id", taskController.updateTask);

// Delete task
router.delete("/:id", taskController.deleteTask);
// ✅ Get tasks by userId
router.get("/user/:userId",taskController.getTasksByUser);



module.exports = router;
