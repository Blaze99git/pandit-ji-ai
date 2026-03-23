const pool = require("../utils/db");
const { getCoordinates } = require("./geoService");
const { generateKundli } = require("./kundliService");
const { getZodiacSign } = require("../utils/zodiacUtils");

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

// ✅ Create User (GEO + KUNDLI + ZODIAC)
const createUser = async (userData) => {
  const { name, dob, birth_time, birth_place } = userData;

  try {
    // 🔥 Step 1: Get coordinates
    const { latitude, longitude } = await getCoordinates(birth_place);

    // 🔥 Step 2: Generate kundli (raw degrees)
    const kundliRaw = await generateKundli(
      dob,
      birth_time,
      latitude,
      longitude
    );

    // 🔥 Step 3: Convert degrees → zodiac signs
    const kundli = {
      sun: {
        degree: kundliRaw.sun_degree,
        sign: getZodiacSign(kundliRaw.sun_degree),
      },
      moon: {
        degree: kundliRaw.moon_degree,
        sign: getZodiacSign(kundliRaw.moon_degree),
      },
    };

    // 🔥 Step 4: Store user in DB
    const query = `
      INSERT INTO users (name, dob, birth_time, birth_place, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      name,
      dob,
      birth_time,
      birth_place,
      latitude,
      longitude,
    ];

    const result = await pool.query(query, values);

    // 🔥 Step 5: Return structured response
    return {
      user: result.rows[0],
      kundli,
    };

  } catch (err) {
    console.error("Error in createUser:", err.message);
    throw err;
  }
};

module.exports = {
  createUsersTable,
  createUser,
};