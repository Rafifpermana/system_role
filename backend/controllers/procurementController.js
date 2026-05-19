const Task = require("../models/taskModel");

const setGoodsReady = async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.updateGoodsStatus(taskId, "ready");
    res
      .status(200)
      .json({ message: `Barang untuk tugas ID ${taskId} sudah siap dikirim.` });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

module.exports = { setGoodsReady };
