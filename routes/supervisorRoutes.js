const express = require("express");
const router = express.Router();
const supervisorController = require("../controllers/supervisorController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Semua rute ini hanya bisa dilewati oleh token Supervisor
router.use(verifyToken);
router.use(authorizeRoles("supervisor"));

// Override Tugas
router.put("/tasks/:id/override", supervisorController.forceTaskStatus);

// Override Dana / Expense
router.put("/expenses/:id/override", supervisorController.forceExpenseStatus);

module.exports = router;
