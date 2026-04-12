const Task = require("../models/taskModel");

// admin head
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const creatorId = req.user.id;

    if (!title)
      return res.status(400).json({ message: "Judul tugas wajib diisi" });

    const result = await Task.createTask(title, description, creatorId);
    res
      .status(201)
      .json({ message: "Tugas berhasil dibuat", taskId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// admin head dan admin
const viewAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.status(200).json({ data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// admin
const assignTaskToDriver = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { driverId } = req.body;

    if (!driverId)
      return res.status(400).json({ message: "ID Driver wajib diisi" });

    await Task.assignDriver(taskId, driverId);
    res.status(200).json({
      message: `Tugas ${taskId} berhasil ditugaskan ke Driver ${driverId}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// driver
const viewMyTasks = async (req, res) => {
  try {
    const driverId = req.user.id;
    const tasks = await Task.getTasksByDriver(driverId);
    res.status(200).json({ data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

const assignBulkTasksToDriver = async (req, res) => {
  try {
    const { driverId, taskIds } = req.body;

    if (!driverId || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res
        .status(400)
        .json({ message: "driverId dan array taskIds wajib diisi" });
    }

    await Task.assignMultipleTasks(taskIds, driverId);
    res.status(200).json({
      message: `Berhasil menugaskan ${taskIds.length} tugas ke Driver ${driverId}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

const updateMyTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const driverId = req.user.id;
    const { status, note } = req.body;

    const allowedStatus = ["in_progress", "completed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    if (status === "completed" && !note) {
      return res.status(400).json({
        message: "Catatan (note) wajib diisi saat menyelesaikan tugas",
      });
    }

    const result = await Task.updateTaskStatusWithNote(
      taskId,
      driverId,
      status,
      note || null,
    );

    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "Tugas tidak ditemukan atau bukan milik Anda" });
    }

    res.status(200).json({ message: "Status tugas berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

module.exports = {
  createTask,
  viewAllTasks,
  assignTaskToDriver,
  viewMyTasks,
  updateMyTaskStatus,
  assignBulkTasksToDriver,
};
