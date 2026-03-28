const express = require("express");
const router = express.Router();

const {
  createUserHandler,
  getUserReportHandler
} = require("../controllers/userController");

const validateUser = require("../middleware/validateUser");

// ✅ Create User
router.post("/users", validateUser, createUserHandler);

// 🔥 Get User Report
router.get("/users/:id/report", getUserReportHandler);

module.exports = router;