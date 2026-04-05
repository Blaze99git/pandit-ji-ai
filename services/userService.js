const pool = require("../utils/db");
const { getCoordinates } = require("./geoService");
const { generateKundli } = require("./kundliService");
const { getZodiacSign } = require("../utils/zodiacUtils");
const { findHouse } = require("../utils/houseUtils");
const { generatePredictions } = require("./predictionService");
const { generateAIInsights } = require("./aiService");
const { generateDailyPrediction } = require("./dailyPredictionService");
const { askAstrologyQuestion } = require("./askService");

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

// 🔥 Helper to build planet object (CLEAN + REUSABLE)
const buildPlanet = (degree, houseDegrees) => ({
  degree,
  sign: getZodiacSign(degree),
  house: findHouse(degree, houseDegrees),
});

// ✅ Create User (FULL PIPELINE)
const createUser = async (userData) => {
  const { name, dob, birth_time, birth_place } = userData;

  try {
    // 🔥 Step 1: Coordinates
    const { latitude, longitude } = await getCoordinates(birth_place);

    // 🔥 Step 2: Kundli Raw
    const kundliRaw = await generateKundli(
      dob,
      birth_time,
      latitude,
      longitude
    );

    const houseDegrees = kundliRaw.house_degrees || [];

    // 🔥 Step 3: FULL PLANETARY KUNDLI 🚀
    const kundli = {
      sun: buildPlanet(kundliRaw.sun_degree, houseDegrees),
      moon: buildPlanet(kundliRaw.moon_degree, houseDegrees),
      mars: buildPlanet(kundliRaw.mars_degree, houseDegrees),
      mercury: buildPlanet(kundliRaw.mercury_degree, houseDegrees),
      jupiter: buildPlanet(kundliRaw.jupiter_degree, houseDegrees),
      venus: buildPlanet(kundliRaw.venus_degree, houseDegrees),
      saturn: buildPlanet(kundliRaw.saturn_degree, houseDegrees),

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

    // 🔥 Step 4: Predictions
    const predictions = generatePredictions(kundli);

    // 🔥 Step 5: AI Insights
    const aiInsights = await generateAIInsights(kundli, predictions);

    // 🔥 Step 6: Daily Prediction
    const dailyPrediction = generateDailyPrediction(kundli);

    // 🔥 Step 7: Store in DB (JSONB DIRECT ✅)
    const result = await pool.query(
      `
      INSERT INTO users 
      (name, dob, birth_time, birth_place, latitude, longitude, kundli, predictions, ai_insights)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
      `,
      [
        name,
        dob,
        birth_time,
        birth_place,
        latitude,
        longitude,
        kundli,
        predictions,
        aiInsights,
      ]
    );

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
      dailyPrediction: generateDailyPrediction(user.kundli),
    };

  } catch (err) {
    console.error("Error fetching report:", err.message);
    throw err;
  }
};

// ✅ Daily Prediction (FAST API)
const getDailyPrediction = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT kundli FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    return {
      dailyPrediction: generateDailyPrediction(result.rows[0].kundli),
    };

  } catch (err) {
    console.error("Error in daily prediction:", err.message);
    throw err;
  }
};

// 🔥 ASK QUESTION (REVENUE FEATURE)
const askQuestion = async (userId, question) => {
  try {
    const result = await pool.query(
      `SELECT kundli FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const answer = await askAstrologyQuestion(
      result.rows[0].kundli,
      question
    );

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
  askQuestion,
};