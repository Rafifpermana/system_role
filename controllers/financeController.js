const Expense = require("../models/expenseModel");

// Admin mengajukan dana
const requestTaskFunds = async (req, res) => {
  try {
    const { taskId, amount, description } = req.body;
    if (!taskId || !amount || !description) {
      return res.status(400).json({ message: "Data pengajuan tidak lengkap" });
    }
    await Expense.createExpense(taskId, amount, description);
    res
      .status(201)
      .json({ message: "Pengajuan dana berhasil dikirim ke Finance" });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// Finance melihat daftar pengajuan
const viewAllRequests = async (req, res) => {
  try {
    const expenses = await Expense.getAllExpenses();
    res.status(200).json({ data: expenses });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// Finance menyetujui/menolak
const approveOrRejectFunds = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const financeId = req.user.id;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    await Expense.updateExpenseStatus(expenseId, financeId, status);
    res.status(200).json({ message: `Pengajuan dana berhasil di-${status}` });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

module.exports = { requestTaskFunds, viewAllRequests, approveOrRejectFunds };
