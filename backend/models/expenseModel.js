const db = require("../config/db");

// Admin mengajukan dana
const createExpense = async (taskId, amount, description) => {
  const [result] = await db.execute(
    "INSERT INTO task_expenses (task_id, amount, description) VALUES (?, ?, ?)",
    [taskId, amount, description],
  );
  return result;
};

// Finance melihat semua pengajuan dana
const getAllExpenses = async () => {
  const [rows] = await db.execute(`
        SELECT e.*, t.title AS task_title 
        FROM task_expenses e
        JOIN delivery_tasks t ON e.task_id = t.id
    `);
  return rows;
};

// Finance menyetujui/menolak dana
const updateExpenseStatus = async (expenseId, financeId, status) => {
  const [result] = await db.execute(
    "UPDATE task_expenses SET status = ?, approved_by_finance_id = ? WHERE id = ?",
    [status, financeId, expenseId],
  );
  return result;
};

module.exports = { createExpense, getAllExpenses, updateExpenseStatus };
