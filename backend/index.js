const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const app = express();
const transactionRoutes = require("./routes/transactionRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", transactionRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

app.get("/api/test", (req, res) => {
  res.json({
    "appName": "FinPulse",
    "version": "1.0.0",
    "status" : "running"
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();