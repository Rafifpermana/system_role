const db = require("../config/db");

const checkRoleExists = async (roleName) => {
  const [rows] = await db.execute("SELECT * FROM roles WHERE role_name = ?", [
    roleName,
  ]);
  return rows.length > 0;
};

module.exports = {
  checkRoleExists,
};
