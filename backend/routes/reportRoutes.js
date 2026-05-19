const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Satpam Middleware
router.use(verifyToken);

// Endpoint GET untuk melihat dashboard laporan
router.get(
  "/dashboard",
  authorizeRoles("admin head", "supervisor"),
  reportController.getDashboardSummary,
);

module.exports = router;
