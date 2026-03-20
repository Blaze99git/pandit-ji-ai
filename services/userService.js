const pool = require("../utils/db");

// ✅ Create Users Table
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      dob DATE NOT NULL,
      birth_time TIME NOT NULL,
      birth_place VARCHAR(255) NOT NULL,
      latitude DECIMAL(9,6),
      longitude DECIMAL(9,6),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Users table created ✅");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

// ✅ Create User (INSERT)
const createUser = async (userData) => {
  const { name, dob, birth_time, birth_place } = userData;

  const query = `
    INSERT INTO users (name, dob, birth_time, birth_place)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [name, dob, birth_time, birth_place];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error inserting user:", err);
    throw err;
  }
};

module.exports = {
  createUsersTable,
  createUser,
};