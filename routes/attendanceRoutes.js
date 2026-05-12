const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.use(verifyToken);
// Semua user yang login (Role apapun) wajib bisa absen masuk & keluar
router.post("/clock-in", attendanceController.doClockIn);
router.put("/clock-out", attendanceController.doClockOut);

module.exports = router;
