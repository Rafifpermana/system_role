const express = require("express");
const router = express.Router();
const hrdController = require("../controllers/hrdController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);
// Hanya HRD yang bisa akses rute ini
router.use(authorizeRoles("hrd"));

router.get("/employees", hrdController.viewAllEmployees);
router.put("/employees/:id/status", hrdController.updateEmployeeStatus);
router.get("/attendance", hrdController.viewDailyAttendance); // Bisa pakai ?date=YYYY-MM-DD

module.exports = router;
