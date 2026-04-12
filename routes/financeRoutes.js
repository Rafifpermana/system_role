const express = require("express");
const router = express.Router();
const financeController = require("../controllers/financeController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);

// Admin mengajukan dana operasional
router.post(
  "/request-funds",
  authorizeRoles("admin", "admin head"),
  financeController.requestTaskFunds,
);

// Finance melihat semua pengajuan
router.get(
  "/requests",
  authorizeRoles("finance"),
  financeController.viewAllRequests,
);

// Finance memproses pengajuan
router.put(
  "/requests/:id/process",
  authorizeRoles("finance"),
  financeController.approveOrRejectFunds,
);

module.exports = router;
