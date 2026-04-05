import { useEffect, useState } from "react";
import API from "../api/axios";

const Home = () => {
  const [daily, setDaily] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = 13;

  useEffect(() => {
    fetchDaily();
  }, []);

  const fetchDaily = async () => {
    try {
      console.log("🚀 Fetching daily prediction...");

      const res = await API.get(`/users/${userId}/daily`);

      console.log("✅ API Response:", res.data);

      setDaily(res.data?.data?.dailyPrediction || "No prediction found");
      setLoading(false);
    } catch (err) {
      console.error("❌ API Error:", err.message);
      setError("Failed to load daily prediction");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-[#FAFFCB] to-white flex justify-center">

      {/* 🔥 Responsive Container */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl p-4 text-black">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Hello Utkarsh 👋
          </h1>

          <p className="text-xs md:text-sm text-gray-500">
            Here's your cosmic insight today
          </p>
        </div>

        {/* 🔮 DAILY CARD */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 mb-6 border border-gray-100">

          <h3 className="text-[10px] md:text-xs uppercase text-gray-400 mb-2 tracking-wide">
            Today's Insight
          </h3>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-sm md:text-lg font-semibold text-gray-800 leading-relaxed">
              {daily}
            </p>
          )}

          <div className="mt-4 flex justify-between items-center">
            <span className="text-[10px] md:text-xs text-gray-400">
              Confidence
            </span>

            <span className="text-[10px] md:text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              High
            </span>
          </div>

        </div>

        {/* ⚡ ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <button className="bg-[#F13E93] text-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-lg hover:scale-105 transition text-sm md:text-base">
            🔮 Generate Kundli
          </button>

          <button className="bg-[#F891BB] text-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-lg hover:scale-105 transition text-sm md:text-base">
            🤖 Ask AI
          </button>

        </div>

      </div>
    </div>
  );
};

export default Home;