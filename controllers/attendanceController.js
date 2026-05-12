const Attendance = require("../models/attendanceModel");

// Fungsi bantuan untuk mendapatkan YYYY-MM-DD dan HH:MM:SS
const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];
  return { date, time };
};

const doClockIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, time } = getCurrentDateTime();

    await Attendance.clockIn(userId, date, time);
    res
      .status(201)
      .json({ message: `Berhasil Clock In pada ${date} jam ${time}` });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan absen masuk hari ini" });
    }
    res.status(500).json({ message: "Error server", error });
  }
};

const doClockOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, time } = getCurrentDateTime();

    await Attendance.clockOut(userId, date, time);
    res
      .status(200)
      .json({ message: `Berhasil Clock Out pada ${date} jam ${time}` });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

module.exports = { doClockIn, doClockOut };
