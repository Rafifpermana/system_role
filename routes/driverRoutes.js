const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);

// Admin & Admin Head bisa melihat status semua driver
router.get(
  "/status",
  authorizeRoles("admin head", "admin"),
  driverController.viewDriverStatuses,
);

module.exports = router;
