const db = require("../config/db");

// Mengambil jumlah tugas berdasarkan statusnya
const getTaskStats = async () => {
  const [rows] = await db.execute(`
        SELECT status, COUNT(*) as total_tugas 
        FROM delivery_tasks 
        GROUP BY status
    `);
  return rows;
};

// Mengambil total pengeluaran dana berdasarkan status persetujuannya
const getExpenseStats = async () => {
  const [rows] = await db.execute(`
        SELECT status, SUM(amount) as total_dana 
        FROM task_expenses 
        GROUP BY status
    `);
  return rows;
};

module.exports = { getTaskStats, getExpenseStats };
