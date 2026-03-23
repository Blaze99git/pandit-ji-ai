const axios = require("axios");

const getCoordinates = async (place) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${place}&format=json&limit=1`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "pandit-ji-ai"
      }
    });

    if (response.data.length === 0) {
      throw new Error("Location not found");
    }

    const { lat, lon } = response.data[0];

    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    };

  } catch (error) {
    console.error("GeoService Error:", error.message);
    throw error;
  }
};

module.exports = { getCoordinates };