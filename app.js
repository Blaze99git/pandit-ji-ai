const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./utils/db");
const userRoutes = require("./routes/userRoutes");
const { createUsersTable } = require("./services/userService");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api", userRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Pandit Ji AI Backend Running 🚀");
});

// ❌ Handle unknown routes (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Global Error Handler (MUST BE LAST)
app.use(errorHandler);

// ✅ Initialize DB + Server
const startServer = async () => {
  try {
    // Connect DB
    await pool.connect();
    console.log("PostgreSQL Connected ✅");

    // Create tables
    await createUsersTable();

    // Start server
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup Error:", err);
  }
};

startServer();