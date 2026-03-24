const db = require("../config/db");

// admin head dan admin
const getAllTask = async () => {
  const [rows] = await db.execute("SELECT * FROM delivery_tasks");
  return rows;
};

// admin head
const createTask = async (title, description, adminHeadId) => {
  const [result] = await db.execute(
    "INSERT INTO delivery_tasks (title, description, created_by_admin_head_id) VALUES (?, ?, ?)",
    [title, description, adminHeadId],
  );
  return result;
};

// admin
const assignDriver = async (taskId, driverId) => {
  const [result] = await db.execute(
    'UPDATE delivery_tasks SET assigned_to_driver_id = ?, status = "assigned" WHERE id = ?',
    [driverId, taskId],
  );
  return result;
};

// driver
const getTaskByDriver = async (driverId) => {
  const [rows] = await db.execute(
    "SELECT * FROM delivery_tasks WHERE assigned_to_driver_id = ?",
    [driverId],
  );
  return rows;
};

const updateTaskStatus = async (taskId, driverId, status) => {
  const [result] = await db.execute(
    "UPDATE delivery_tasks SET status = ? WHERE id = ? AND assigned_to_driver_id = ?",
    [status, taskId, driverId],
  );
  return result;
};

module.exports = {
  createTask,
  getAllTask,
  assignDriver,
  getTaskByDriver,
  updateTaskStatus,
};
