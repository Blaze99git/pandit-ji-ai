const findHouse = (planetDegree, houseDegrees) => {
  for (let i = 0; i < houseDegrees.length; i++) {
    const current = houseDegrees[i];
    const next = houseDegrees[(i + 1) % 12];

    // Handle circular zodiac (360 → 0)
    if (current < next) {
      if (planetDegree >= current && planetDegree < next) {
        return i + 1;
      }
    } else {
      // Wrap case
      if (planetDegree >= current || planetDegree < next) {
        return i + 1;
      }
    }
  }

  return null;
};

module.exports = { findHouse };