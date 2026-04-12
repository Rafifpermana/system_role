const express = require("express");
const router = express.Router();
const procurementController = require("../controllers/procurementController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.put(
  "/tasks/:id/ready",
  authorizeRoles("procurement"),
  procurementController.setGoodsReady,
);

module.exports = router;
