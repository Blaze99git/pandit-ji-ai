const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const askAstrologyQuestion = async (kundli, question) => {
  try {
    const prompt = `
You are an expert Vedic astrologer.

User Kundli:
${JSON.stringify(kundli, null, 2)}

User Question:
${question}

Answer clearly, practically, and in simple language.
Avoid vague statements. Be specific and helpful.
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
    console.error("Ask AI Error:", err.message);
    throw err;
  }
};

module.exports = { askAstrologyQuestion };