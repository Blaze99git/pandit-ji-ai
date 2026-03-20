const { createUser } = require("../services/userService");
const AppError = require("../utils/AppError");

const createUserHandler = async (req, res, next) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });

  } catch (error) {
    next(new AppError("Failed to create user", 500));
  }
};

module.exports = { createUserHandler };