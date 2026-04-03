const {
  createUser,
  getUserReport,
  getDailyPrediction,
  askQuestion, // 🔥 NEW
} = require("../services/userService");

const AppError = require("../utils/AppError");

// ✅ Create User
const createUserHandler = async (req, res, next) => {
  try {
    const data = await createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data,
    });

  } catch (error) {
    next(new AppError("Failed to create user", 500));
  }
};

// ✅ Get User Report
const getUserReportHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const report = await getUserReport(userId);

    res.status(200).json({
      success: true,
      data: report,
    });

  } catch (error) {
    next(new AppError(error.message || "Failed to fetch report", 500));
  }
};

// ✅ Get Daily Prediction
const getDailyPredictionHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const data = await getDailyPrediction(userId);

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    next(new AppError(error.message || "Failed to fetch daily prediction", 500));
  }
};

// 🔥 NEW: Ask AI Question (REVENUE FEATURE)
const askQuestionHandler = async (req, res, next) => {
  try {
    const { userId, question } = req.body;

    // ✅ Basic validation
    if (!userId || !question) {
      return next(new AppError("userId and question are required", 400));
    }

    const data = await askQuestion(userId, question);

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    next(new AppError(error.message || "Failed to process question", 500));
  }
};

module.exports = {
  createUserHandler,
  getUserReportHandler,
  getDailyPredictionHandler,
  askQuestionHandler, // 🔥 NEW
};