const Task = require("../models/taskModel");
const Expense = require("../models/expenseModel");

// 1. Force Update Status Tugas
const forceTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status, note } = req.body;

    // Validasi status yang diizinkan
    const validStatuses = [
      "pending",
      "assigned",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const overrideNote =
      note || `Diubah paksa oleh Supervisor (ID: ${req.user.id})`;

    await Task.overrideTaskStatus(taskId, status, overrideNote);
    res.status(200).json({
      message: `Sistem Diambil Alih: Status tugas ID ${taskId} berhasil dipaksa menjadi ${status}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// 2. Force Update Status Dana (Melewati Finance)
const forceExpenseStatus = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const supervisorId = req.user.id;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status dana harus approved atau rejected" });
    }

    // Kita pinjam fungsi updateExpenseStatus dari model expense yang sudah ada
    await Expense.updateExpenseStatus(expenseId, supervisorId, status);
    res.status(200).json({
      message: `Sistem Diambil Alih: Dana ID ${expenseId} dipaksa ${status} oleh Supervisor`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

module.exports = { forceTaskStatus, forceExpenseStatus };
