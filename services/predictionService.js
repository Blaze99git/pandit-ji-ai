const generatePredictions = (kundli) => {
  const predictions = [];

  // 🔥 Sun rules (Career)
  if (kundli.sun.house === 10) {
    predictions.push("🌟 Strong career potential and leadership qualities.");
  }

  if (kundli.sun.house === 2) {
    predictions.push("💰 Financial growth and wealth accumulation likely.");
  }

  // 🔥 Moon rules (Mind & emotions)
  if (kundli.moon.house === 1) {
    predictions.push("🧠 Emotionally expressive and mentally active personality.");
  }

  if (kundli.moon.house === 7) {
    predictions.push("❤️ Strong emotional focus on relationships.");
  }

  // 🔥 Ascendant rules (Personality)
  if (kundli.ascendant.sign === "Gemini") {
    predictions.push("🗣️ Excellent communication skills and adaptability.");
  }

  if (kundli.ascendant.sign === "Leo") {
    predictions.push("👑 Natural leadership and strong presence.");
  }

  // Default fallback
  if (predictions.length === 0) {
    predictions.push("✨ Your chart shows balanced traits with steady growth.");
  }

  return predictions;
};

module.exports = { generatePredictions };