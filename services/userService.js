const pool = require("../utils/db");
const { getCoordinates } = require("./geoService");
const { generateKundli } = require("./kundliService");
const { getZodiacSign } = require("../utils/zodiacUtils");
const { findHouse } = require("../utils/houseUtils");

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

// ✅ Create User (FULL ENGINE FLOW)
const createUser = async (userData) => {
  const { name, dob, birth_time, birth_place } = userData;

  try {
    // 🔥 Step 1: Get coordinates
    const { latitude, longitude } = await getCoordinates(birth_place);

    // 🔥 Step 2: Generate kundli
    const kundliRaw = await generateKundli(
      dob,
      birth_time,
      latitude,
      longitude
    );

    const houseDegrees = kundliRaw.house_degrees || [];

    // 🔥 Step 3: Build kundli
    const kundli = {
      sun: {
        degree: kundliRaw.sun_degree,
        sign: getZodiacSign(kundliRaw.sun_degree),
        house: findHouse(kundliRaw.sun_degree, houseDegrees),
      },
      moon: {
        degree: kundliRaw.moon_degree,
        sign: getZodiacSign(kundliRaw.moon_degree),
        house: findHouse(kundliRaw.moon_degree, houseDegrees),
      },
      ascendant: {
        degree: kundliRaw.ascendant_degree,
        sign: getZodiacSign(kundliRaw.ascendant_degree),
        house: 1,
      },
      houses: houseDegrees.map((degree, index) => ({
        house: index + 1,
        degree,
        sign: getZodiacSign(degree),
      })),
    };

    // 🔥 Step 4: Store user
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

    // 🔥 Step 5: Return response
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