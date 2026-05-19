const Driver = require("../models/driverModel");

const viewDriverStatuses = async (req, res) => {
  try {
    const drivers = await Driver.getDriverStatus();
    res.status(200).json({ data: drivers });
  } catch (error) {
    console.error("Gagal memuat status driver:", error);
    res.status(500).json({ message: "Error server" });
  }
};

const getAllDriversList = async (req, res) => {
  try {
    const drivers = await Driver.getAllDrivers();
    res.status(200).json({ data: drivers });
  } catch (error) {
    console.error("Gagal memuat daftar driver:", error);
    res.status(500).json({ message: "Error server" });
  }
};

module.exports = { viewDriverStatuses, getAllDriversList };
