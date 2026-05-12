const db = require("../config/db");

// Mencatat waktu masuk (Clock In)
const clockIn = async (userId, date, time) => {
  const [result] = await db.execute(
    "INSERT INTO attendance (user_id, work_date, clock_in) VALUES (?, ?, ?)",
    [userId, date, time],
  );
  return result;
};

// Mencatat waktu pulang (Clock Out)
const clockOut = async (userId, date, time) => {
  const [result] = await db.execute(
    "UPDATE attendance SET clock_out = ? WHERE user_id = ? AND work_date = ?",
    [time, userId, date],
  );
  return result;
};

// HRD melihat rekap absensi pada tanggal tertentu
const getDailyAttendance = async (date) => {
  const [rows] = await db.execute(
    `
        SELECT a.work_date, a.clock_in, a.clock_out, u.username, u.role 
        FROM attendance a 
        JOIN users u ON a.user_id = u.id 
        WHERE a.work_date = ?
    `,
    [date],
  );
  return rows;
};

module.exports = { clockIn, clockOut, getDailyAttendance };
