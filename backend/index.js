
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", transactionRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/test", (req, res) => {
  res.json({
    appName: "FinVault",
    version: "1.0.0",
    status: "running"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`FinVault server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
