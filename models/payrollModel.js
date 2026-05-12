const db = require("../config/db");

// 1. Buat slip gaji baru
const createPayroll = async (userId, baseSalary, bonus, period) => {
  const total = parseFloat(baseSalary) + parseFloat(bonus);
  const [result] = await db.execute(
    "INSERT INTO payroll (user_id, base_salary, bonus, total_salary, payment_period) VALUES (?, ?, ?, ?, ?)",
    [userId, baseSalary, bonus, total, period],
  );
  return result;
};

// 2. Lihat semua data gaji
const getAllPayroll = async () => {
  const [rows] = await db.execute(`
        SELECT p.*, u.username, u.role 
        FROM payroll p
        JOIN users u ON p.user_id = u.id
    `);
  return rows;
};

// 3. Finance mencairkan gaji (Ubah status jadi paid)
const paySalary = async (payrollId, financeId) => {
  const [result] = await db.execute(
    "UPDATE payroll SET status = ?, processed_by_finance_id = ? WHERE id = ?",
    ["paid", financeId, payrollId],
  );
  return result;
};

// 4. Laporan Arus Kas Keluar (Total Uang Jalan + Total Gaji)
const getCashFlow = async () => {
  const [expenses] = await db.execute(
    'SELECT SUM(amount) as total_expense FROM task_expenses WHERE status = "approved"',
  );
  const [payrolls] = await db.execute(
    'SELECT SUM(total_salary) as total_payroll FROM payroll WHERE status = "paid"',
  );

  return {
    total_uang_jalan: expenses[0].total_expense || 0,
    total_gaji_dibayar: payrolls[0].total_payroll || 0,
    total_arus_kas_keluar:
      parseFloat(expenses[0].total_expense || 0) +
      parseFloat(payrolls[0].total_payroll || 0),
  };
};

module.exports = { createPayroll, getAllPayroll, paySalary, getCashFlow };
