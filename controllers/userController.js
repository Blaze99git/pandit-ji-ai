const { createUser, getUserReport } = require("../services/userService");
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

// ✅ Get User Report (NEW 🔥)
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

module.exports = {
  createUserHandler,
  getUserReportHandler, // 🔥 NEW
};