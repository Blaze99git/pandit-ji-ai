const generateDailyPrediction = (kundli) => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday

  const predictions = [];

  // 🔥 Simple logic (v1)
  if (kundli.moon.sign === "Gemini") {
    predictions.push("🗣️ Today is great for communication and networking.");
  }

  if (kundli.sun.house === 10) {
    predictions.push("💼 Focus on career-related tasks today.");
  }

  if (day === 1) {
    predictions.push("🌱 A fresh start — good day to begin new work.");
  }

  if (day === 5) {
    predictions.push("💰 Financial opportunities may arise today.");
  }

  if (predictions.length === 0) {
    predictions.push("✨ A balanced day — stay consistent and focused.");
  }

  // Pick 1 random for simplicity
  const randomIndex = Math.floor(Math.random() * predictions.length);

  return predictions[randomIndex];
};

module.exports = { generateDailyPrediction };