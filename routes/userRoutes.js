const express = require("express");
const router = express.Router();


const { createUserHandler } = require("../controllers/userController");
const validateUser = require("../middleware/validateUser");

// ✅ Apply validation BEFORE controller
router.post("/users", validateUser, createUserHandler);

module.exports = router;