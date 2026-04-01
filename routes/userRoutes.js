const express = require("express");
const router = express.Router();

const {
  createUserHandler,
  getUserReportHandler,
  getDailyPredictionHandler,
} = require("../controllers/userController");

const validateUser = require("../middleware/validateUser");

// ✅ Create User
router.post("/users", validateUser, createUserHandler);

// ✅ Get Full Report
router.get("/users/:id/report", getUserReportHandler);

// 🔥 NEW: Daily Prediction (FAST API)
router.get("/users/:id/daily", getDailyPredictionHandler);

module.exports = router;