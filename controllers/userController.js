const { createUser } = require("../services/userService");

// ✅ Create User Controller
const createUserHandler = async (req, res) => {
  try {
    const { name, dob, birth_time, birth_place } = req.body;

    // 🔍 Basic validation
    if (!name || !dob || !birth_time || !birth_place) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // 🧠 Call service
    const user = await createUser({
      name,
      dob,
      birth_time,
      birth_place,
    });

    // ✅ Success response
    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.error("Controller Error:", error);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  createUserHandler,
};