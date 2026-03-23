const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

const getZodiacSign = (degree) => {
  const index = Math.floor(degree / 30) % 12;
  return zodiacSigns[index];
};

module.exports = { getZodiacSign };