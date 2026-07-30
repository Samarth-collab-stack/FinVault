const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const PORT = 5000;

app.get("/api/test", (req, res) => {
  res.json({
    "appName": "FinPulse",
    "version": "1.0.0",
    "status" : "running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});