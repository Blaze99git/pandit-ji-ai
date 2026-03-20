const AppError = require("../utils/AppError");

const validateUser = (req, res, next) => {
  const { name, dob, birth_time, birth_place } = req.body;

  if (!name || !dob || !birth_time || !birth_place) {
    return next(new AppError("All fields are required", 400));
  }

  if (isNaN(Date.parse(dob))) {
    return next(new AppError("Invalid date format", 400));
  }

  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(birth_time)) {
    return next(new AppError("Invalid time format", 400));
  }

  next();
};

module.exports = validateUser;