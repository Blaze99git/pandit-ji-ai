const pool = require("../utils/db");
const { getCoordinates } = require("./geoService");
const { generateKundli } = require("./kundliService");
const { getZodiacSign } = require("../utils/zodiacUtils");
const { findHouse } = require("../utils/houseUtils");
const { generatePredictions } = require("./predictionService");
const { generateAIInsights } = require("./aiService");
const { generateDailyPrediction } = require("./dailyPredictionService");

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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      kundli JSONB,
      predictions JSONB,
      ai_insights TEXT
    );
  `;

  try {
    await pool.query(query);
    console.log("Users table created ✅");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

// ✅ Create User (FULL PIPELINE)
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

    // 🔥 Step 4: Rule-based predictions
    const predictions = generatePredictions(kundli);

    // 🔥 Step 5: AI insights
    const aiInsights = await generateAIInsights(kundli, predictions);

    // 🔥 Step 6: Daily prediction
    const dailyPrediction = generateDailyPrediction(kundli);

    // 🔥 Step 7: Convert to JSON safely
    const kundliJSON = JSON.stringify(kundli);
    const predictionsJSON = JSON.stringify(predictions);

    // 🔥 Step 8: Insert into DB
    const query = `
      INSERT INTO users 
      (name, dob, birth_time, birth_place, latitude, longitude, kundli, predictions, ai_insights)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9)
      RETURNING *;
    `;

    const values = [
      name,
      dob,
      birth_time,
      birth_place,
      latitude,
      longitude,
      kundliJSON,
      predictionsJSON,
      aiInsights,
    ];

    const result = await pool.query(query, values);

    return {
      user: result.rows[0],
      kundli,
      predictions,
      aiInsights,
      dailyPrediction,
    };

  } catch (err) {
    console.error("🔥 Error in createUser:", err);
    throw err;
  }
};

// ✅ Get Full User Report
const getUserReport = async (userId) => {
  try {
    const query = `
      SELECT *
      FROM users
      WHERE id = $1;
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];

    // 🔥 Generate fresh daily prediction
    const dailyPrediction = generateDailyPrediction(user.kundli);

    return {
      user: {
        id: user.id,
        name: user.name,
        dob: user.dob,
        birth_time: user.birth_time,
        birth_place: user.birth_place,
        latitude: user.latitude,
        longitude: user.longitude,
      },
      kundli: user.kundli,
      predictions: user.predictions,
      aiInsights: user.ai_insights,
      dailyPrediction,
    };

  } catch (err) {
    console.error("Error fetching user report:", err.message);
    throw err;
  }
};

// ✅ Get ONLY Daily Prediction (FAST API)
const getDailyPrediction = async (userId) => {
  try {
    const query = `
      SELECT kundli
      FROM users
      WHERE id = $1;
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const kundli = result.rows[0].kundli;

    const dailyPrediction = generateDailyPrediction(kundli);

    return {
      dailyPrediction,
    };

  } catch (err) {
    console.error("Error in daily prediction:", err.message);
    throw err;
  }
};

module.exports = {
  createUsersTable,
  createUser,
  getUserReport,
  getDailyPrediction,
};