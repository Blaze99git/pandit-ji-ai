const pool = require("../utils/db");
const { getCoordinates } = require("./geoService");
const { generateKundli } = require("./kundliService");
const { getZodiacSign } = require("../utils/zodiacUtils");
const { findHouse } = require("../utils/houseUtils");
const { generatePredictions } = require("./predictionService");
const { generateAIInsights } = require("./aiService");
const { generateDailyPrediction } = require("./dailyPredictionService");
const { askAstrologyQuestion } = require("./askService"); // 🔥 NEW

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
    // 🔥 Step 1: Coordinates
    const { latitude, longitude } = await getCoordinates(birth_place);

    // 🔥 Step 2: Kundli
    const kundliRaw = await generateKundli(
      dob,
      birth_time,
      latitude,
      longitude
    );

    const houseDegrees = kundliRaw.house_degrees || [];

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

    // 🔥 Step 3: Predictions
    const predictions = generatePredictions(kundli);

    // 🔥 Step 4: AI Insights
    const aiInsights = await generateAIInsights(kundli, predictions);

    // 🔥 Step 5: Daily
    const dailyPrediction = generateDailyPrediction(kundli);

    // 🔥 Step 6: Convert JSON
    const kundliJSON = JSON.stringify(kundli);
    const predictionsJSON = JSON.stringify(predictions);

    // 🔥 Step 7: Store
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

// ✅ Get Full Report
const getUserReport = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];

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
    console.error("Error fetching report:", err.message);
    throw err;
  }
};

// ✅ Daily Prediction (FAST)
const getDailyPrediction = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT kundli FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const kundli = result.rows[0].kundli;

    return {
      dailyPrediction: generateDailyPrediction(kundli),
    };

  } catch (err) {
    console.error("Error in daily prediction:", err.message);
    throw err;
  }
};

// 🔥 NEW: ASK QUESTION (REVENUE FEATURE)
const askQuestion = async (userId, question) => {
  try {
    const result = await pool.query(
      `SELECT kundli FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const kundli = result.rows[0].kundli;

    const answer = await askAstrologyQuestion(kundli, question);

    return {
      question,
      answer,
    };

  } catch (err) {
    console.error("Error in askQuestion:", err.message);
    throw err;
  }
};

module.exports = {
  createUsersTable,
  createUser,
  getUserReport,
  getDailyPrediction,
  askQuestion, // 🔥 NEW
};