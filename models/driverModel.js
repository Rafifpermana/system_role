const db = require("../config/db");

const getDriverStatus = async () => {
  const query = `
        SELECT 
            u.id AS driver_id, 
            u.username,
            COUNT(CASE WHEN t.status IN ('assigned', 'in_progress') THEN 1 END) AS active_tasks
        FROM users u
        LEFT JOIN delivery_tasks t ON u.id = t.assigned_to_driver_id
        WHERE u.role = 'driver'
        GROUP BY u.id, u.username
    `;

  const [rows] = await db.execute(query);

  return rows.map((driver) => ({
    driver_id: driver.driver_id,
    usename: driver.username,
    active_tasks: driver.active_tasks,
    status: driver.active_tasks > 0 ? "Sedang mengantar" : "Tersedia",
  }));
};

module.exports = {
  getDriverStatus,
};
