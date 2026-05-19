const Report = require("../models/reportModel");

const getDashboardSummary = async (req, res) => {
  try {
    // Ambil data statistik dari database
    const taskStats = await Report.getTaskStats();
    const expenseStats = await Report.getExpenseStats();

    // Kirimkan sebagai satu kesatuan (Dashboard)
    res.status(200).json({
      message: "Laporan Dashboard Logistik",
      data: {
        ringkasan_tugas: taskStats,
        ringkasan_dana: expenseStats,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

module.exports = { getDashboardSummary };
