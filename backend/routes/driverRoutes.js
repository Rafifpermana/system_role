const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.get(
  "/status",
  authorizeRoles("admin head", "admin"),
  driverController.viewDriverStatuses,
);

router.get(
    '/', 
    authorizeRoles('admin', 'admin head'), 
    driverController.getAllDriversList
);

module.exports = router;
