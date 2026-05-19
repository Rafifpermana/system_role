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

// Rute Penggajian (Hanya bisa diakses Finance)
router.post(
  "/payroll",
  authorizeRoles("finance"),
  financeController.generatePayroll,
);
router.get(
  "/payroll",
  authorizeRoles("finance"),
  financeController.viewPayrollList,
);
router.put(
  "/payroll/:id/pay",
  authorizeRoles("finance"),
  financeController.processSalaryPayment,
);

// Rute Laporan Arus Kas
router.get(
  "/cash-flow",
  authorizeRoles("finance", "supervisor", "admin head"),
  financeController.viewCashFlow,
);

module.exports = router;
