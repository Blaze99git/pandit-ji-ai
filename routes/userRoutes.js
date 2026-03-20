const express = require("express");
const router = express.Router();

const { createUserHandler } = require("../controllers/userController");

// ✅ POST /api/users
router.post("/users", createUserHandler);

module.exports = router;