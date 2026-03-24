const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.post("/register-viewer", authController.registerViewer);
router.post(
  "/register",
  verifyToken,
  authorizeRoles("hrd", "supervisor", "viewer"),
  authController.register,
);

module.exports = router;
