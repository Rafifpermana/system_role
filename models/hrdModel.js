const db = require("../config/db");

const getAllEmployees = async () => {
  const [rows] = await db.execute(
    "SELECT id, username, role, is_active, created_at FROM users",
  );
  return rows;
};

const toggleEmployeeStatus = async (userId, isActive) => {
  const [result] = await db.execute(
    "UPDATE users SET is_active = ? WHERE id = ?",
    [isActive, userId],
  );
  return result;
};

module.exports = { getAllEmployees, toggleEmployeeStatus };
