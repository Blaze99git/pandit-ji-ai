const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateAIInsights = async (kundli, predictions) => {
  try {
    const prompt = `
You are an expert Vedic astrologer.

User Kundli:
${JSON.stringify(kundli, null, 2)}

Basic Predictions:
${predictions.join("\n")}

Now generate a personalized, natural, human-like astrology explanation.
Keep it simple, insightful, and useful.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional astrologer." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.error("AI Error:", err.message);
    return "AI insights not available at the moment.";
  }
};

module.exports = { generateAIInsights };