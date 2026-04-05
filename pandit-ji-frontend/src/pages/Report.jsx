import { useEffect, useState } from "react";
import KundliChart from "../components/KundliChart";
import API from "../api/axios";

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = 11;

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      console.log("📊 Fetching report...");
      const res = await API.get(`/users/${userId}/report`);

      setReport(res.data?.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error:", err.message);
      setError("Failed to load report");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading Kundli...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-[#FAFFCB] to-white flex justify-center">

      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl p-4">

        {/* 🔥 HEADER */}
        <h1 className="text-xl md:text-2xl font-bold mb-4">
          Your Kundli 🔮
        </h1>

        {/* 👤 USER CARD */}
        <div className="bg-white rounded-2xl p-4 shadow mb-4">
          <p className="font-semibold text-lg">
            {report?.user?.name}
          </p>
          <p className="text-sm text-gray-500">
            {report?.user?.birth_place}
          </p>
        </div>

        {/* 🔥 KUNDLI CHART */}
        <div className="bg-white rounded-2xl p-4 shadow mb-6">
          <h2 className="text-sm text-gray-500 mb-2">
            Chart Visualization
          </h2>

          <KundliChart
            houses={report?.kundli?.houses || []}
            planets={{
              sun: report?.kundli?.sun,
              moon: report?.kundli?.moon,
              ascendant: report?.kundli?.ascendant,
            }}
          />
        </div>

        {/* 🌞 PLANETS */}
        <div className="grid grid-cols-3 gap-3 mb-6">

          {["sun", "moon", "ascendant"].map((planet) => (
            <div
              key={planet}
              className="bg-white rounded-xl p-3 shadow text-center"
            >
              <p className="text-xs text-gray-400 capitalize">
                {planet}
              </p>

              <p className="font-semibold text-sm md:text-base">
                {report?.kundli?.[planet]?.sign}
              </p>

              <p className="text-xs text-gray-500">
                House {report?.kundli?.[planet]?.house}
              </p>
            </div>
          ))}

        </div>

        {/* 🏠 HOUSES */}
        <div className="bg-white rounded-2xl p-4 shadow mb-6">

          <h2 className="text-sm text-gray-500 mb-2">
            Houses
          </h2>

          <div className="grid grid-cols-4 gap-2 text-xs">

            {report?.kundli?.houses?.map((h) => (
              <div
                key={h.house}
                className="bg-gray-100 rounded p-2 text-center"
              >
                <p>H{h.house}</p>
                <p className="font-semibold">{h.sign}</p>
              </div>
            ))}

          </div>
        </div>

        {/* 🤖 AI INSIGHTS */}
        <div className="bg-white rounded-2xl p-4 shadow mb-6">

          <h2 className="text-sm text-gray-500 mb-2">
            AI Insights
          </h2>

          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {report?.aiInsights}
          </p>

        </div>

        {/* 📅 DAILY */}
        <div className="bg-white rounded-2xl p-4 shadow">

          <h2 className="text-sm text-gray-500 mb-2">
            Today's Prediction
          </h2>

          <p className="text-sm md:text-base">
            {report?.dailyPrediction}
          </p>

        </div>

      </div>
    </div>
  );
};

export default Report;