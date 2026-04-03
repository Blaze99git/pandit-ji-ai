const express = require("express");
const router = express.Router();

const {
  createUserHandler,
  getUserReportHandler,
  getDailyPredictionHandler,
  askQuestionHandler, // 🔥 NEW
} = require("../controllers/userController");

const validateUser = require("../middleware/validateUser");

// ✅ Create User
router.post("/users", validateUser, createUserHandler);

// ✅ Get Full Report
router.get("/users/:id/report", getUserReportHandler);

// ✅ Daily Prediction (FAST API)
router.get("/users/:id/daily", getDailyPredictionHandler);

// 🔥 NEW: Ask AI Question (REVENUE API)
router.post("/ask", askQuestionHandler);

module.exports = router;