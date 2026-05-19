const db = require("../config/db");

const findUserByUsername = async (username) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  return rows[0];
};

const createUser = async (username, password, role) => {
  const [rows] = await db.execute(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role],
  );
  return rows;
};

module.exports = {
  findUserByUsername,
  createUser,
};
