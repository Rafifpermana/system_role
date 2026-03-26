const Driver = require("../models/driverModel");

const viewDriverStatuses = async (req, res) => {
  try {
    const drivers = await Driver.getDriverStatuses();
    res.status(200).json({ data: drivers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error server", error });
  }
};

module.exports = { viewDriverStatuses };
