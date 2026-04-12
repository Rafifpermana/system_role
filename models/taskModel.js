const db = require("../config/db");

// admin head dan admin
const getAllTasks = async () => {
  const [rows] = await db.execute("SELECT * FROM delivery_tasks");
  return rows;
};

// admin head
const createTask = async (title, description, creatorId) => {
  const [result] = await db.execute(
    "INSERT INTO delivery_tasks (title, description, created_by_admin_head_id) VALUES (?, ?, ?)",
    [title, description, creatorId],
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
const getTasksByDriver = async (driverId) => {
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

// fitur
const assignMultipleTasks = async (taskIds, driverId) => {
  const placeholders = taskIds.map(() => "?").join(", ");

  const params = [driverId, ...taskIds];

  const [result] = await db.execute(
    `UPDATE delivery_tasks SET assigned_to_driver_id = ?, status = "assigned" WHERE id IN (${placeholders})`,
    params,
  );

  return result;
};

const updateTaskStatusWithNote = async (taskId, driverId, status, note) => {
  const [result] = await db.execute(
    "UPDATE delivery_tasks SET status = ?, completion_note = ? WHERE id = ? AND assigned_to_driver_id = ?",
    [status, note, taskId, driverId],
  );
  return result;
};

const updateGoodsStatus = async (taskId, status) => {
  const [result] = await db.execute(
    "UPDATE delivery_tasks SET goods_status = ? WHERE id = ?",
    [status, taskId],
  );
  return result;
};

module.exports = {
  createTask,
  getAllTasks,
  assignDriver,
  getTasksByDriver,
  updateTaskStatus,
  assignMultipleTasks,
  updateTaskStatusWithNote,
  updateGoodsStatus,
};
