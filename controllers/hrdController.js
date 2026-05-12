const HRD = require("../models/hrdModel");
const Attendance = require("../models/attendanceModel");

const viewAllEmployees = async (req, res) => {
  try {
    const employees = await HRD.getAllEmployees();
    res.status(200).json({ data: employees });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

const updateEmployeeStatus = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { is_active } = req.body; // boolean: true atau false

    await HRD.toggleEmployeeStatus(targetUserId, is_active);
    const statusText = is_active
      ? "diaktifkan"
      : "dinonaktifkan (resign/suspend)";
    res
      .status(200)
      .json({
        message: `Status karyawan ID ${targetUserId} berhasil ${statusText}`,
      });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

const viewDailyAttendance = async (req, res) => {
  try {
    // Jika tidak ada parameter tanggal, gunakan tanggal hari ini
    const queryDate = req.query.date || new Date().toISOString().split("T")[0];

    const attendanceList = await Attendance.getDailyAttendance(queryDate);
    res.status(200).json({ tanggal: queryDate, data: attendanceList });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

module.exports = {
  viewAllEmployees,
  updateEmployeeStatus,
  viewDailyAttendance,
};
