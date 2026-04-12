const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const driverRoutes = require("./routes/driverRoutes");
const financeRoutes = require("./routes/financeRoutes");
const procurementRoutes = require("./routes/procurementRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/procurement", procurementRoutes);

app.get("/", (req, res) => {
  res.send("API berjalan dengan baik!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
